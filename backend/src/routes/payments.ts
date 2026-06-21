import express from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import { sendPaymentConfirmationEmail } from "../lib/email";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { creditDeposit } from "../services/deposit.service";
import { toNumber } from "../utils/money";

const router = express.Router();

const initSchema = z.object({
  amount: z.number().min(50).max(250_000),
  email: z.string().email().optional(),
  currency: z.string().optional().default("KES"),
  type: z.enum(["ACCOUNT_ACTIVATION", "DEPOSIT"]).optional().default("DEPOSIT"),
  userId: z.string().optional(),
});

async function initializePaystackPayment(params: {
  email: string;
  amount: number;
  currency: string;
  userId: string;
  type: "ACCOUNT_ACTIVATION" | "DEPOSIT";
}) {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack not configured");
  }

  const payment = await prisma.payment.create({
    data: {
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      provider: "PAYSTACK",
      type: params.type,
      status: "PENDING",
    },
  });

  const callbackUrl = `${(env.FRONTEND_URL ?? env.CLIENT_URL ?? "http://localhost:3000").replace(/\/$/, "")}/payment/verify`;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100),
      currency: params.currency,
      callback_url: callbackUrl,
      metadata: {
        paymentId: payment.id,
        userId: params.userId,
        type: params.type,
      },
    }),
  });

  const data = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url: string; reference: string };
  };

  if (!data?.status || !data.data?.authorization_url) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", failedReason: data?.message ?? "Paystack init failed" },
    });
    throw new Error(data?.message ?? "Paystack initialization failed");
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { externalRef: data.data.reference },
  });

  return {
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
    paymentId: payment.id,
  };
}

router.post("/initialize", requireAuth, async (req, res) => {
  try {
    const parsed = initSchema.parse(req.body);
    const authUser = (req as AuthRequest).user!;

    const user = await prisma.user.findUniqueOrThrow({ where: { id: authUser.id } });
    const type = parsed.type ?? "DEPOSIT";
    const email = parsed.email ?? user.email;
    const userId = parsed.userId ?? user.id;

    const result = await initializePaystackPayment({
      email,
      amount: parsed.amount,
      currency: parsed.currency ?? "KES",
      userId,
      type,
    });

    return res.json({
      success: true,
      data: {
        authorization_url: result.authorization_url,
        reference: result.reference,
        paymentId: result.paymentId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      error: { message: (err as Error).message ?? String(err) },
    });
  }
});

async function verifyPaystackReference(reference: string) {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack not configured");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    }
  );

  const data = (await response.json()) as {
    status?: boolean;
    data?: { status: string; amount: number; reference: string };
  };

  if (!data?.status || data.data?.status !== "success") {
    throw new Error("Payment verification failed");
  }

  return data.data!;
}

router.get("/verify/:reference", requireAuth, async (req, res) => {
  try {
    const reference = String(req.params.reference);
    const paystackData = await verifyPaystackReference(reference);

    const payment = await prisma.payment.findFirst({ where: { externalRef: reference } });
    if (!payment) {
      return res.status(404).json({ success: false, error: { message: "Payment not found" } });
    }

    const authUser = (req as AuthRequest).user!;
    if (payment.userId !== authUser.id) {
      return res.status(403).json({ success: false, error: { message: "Forbidden" } });
    }

    if (payment.status !== "COMPLETED") {
      await creditDeposit(payment);
      if (payment.type === "ACCOUNT_ACTIVATION") {
        const user = await prisma.user.findUnique({ where: { id: payment.userId } });
        if (user) {
          sendPaymentConfirmationEmail(user.email, user.fullName, toNumber(payment.amount)).catch(console.error);
        }
      }
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: payment.userId } });

    return res.json({
      success: true,
      data: {
        reference: paystackData.reference,
        amount: toNumber(payment.amount),
        type: payment.type,
        balance: wallet ? toNumber(wallet.balance) : 0,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      error: { message: (err as Error).message ?? String(err) },
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { reference } = z.object({ reference: z.string() }).parse(req.body);
    const paystackData = await verifyPaystackReference(reference);

    const payment = await prisma.payment.findFirst({ where: { externalRef: reference } });
    if (payment && payment.status !== "COMPLETED") {
      await creditDeposit(payment);
      if (payment.type === "ACCOUNT_ACTIVATION") {
        const user = await prisma.user.findUnique({ where: { id: payment.userId } });
        if (user) {
          sendPaymentConfirmationEmail(user.email, user.fullName, toNumber(payment.amount)).catch(console.error);
        }
      }
    }

    return res.json({ success: true, data: { verification: paystackData } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      error: { message: (err as Error).message ?? String(err) },
    });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const signature = (req.headers["x-paystack-signature"] as string) ?? "";
    const raw = (req as express.Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
    if (!env.PAYSTACK_SECRET_KEY) return res.status(500).end("Paystack not configured");

    const expected = crypto.createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(raw).digest("hex");
    if (signature !== expected) {
      return res.status(400).end("Invalid signature");
    }

    const body = req.body as { event?: string; data?: { reference?: string; status?: string } };
    const event = body.event;
    const data = body.data;

    if (data?.reference && (event === "charge.success" || data.status === "success")) {
      const payment = await prisma.payment.findFirst({ where: { externalRef: data.reference } });
      if (payment) {
        await creditDeposit(payment);
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).end("error");
  }
});

router.get("/history", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.json({ success: true, data: { payments } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: { message: "Failed to fetch history" } });
  }
});

export default router;

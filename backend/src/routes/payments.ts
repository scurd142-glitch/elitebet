import express from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import { sendPaymentConfirmationEmail } from "../lib/email";

const router = express.Router();

const initSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email(),
  amount: z.number(),
  currency: z.string().optional().default("KES"),
  type: z.string().optional().default("ACCOUNT_ACTIVATION"),
});

router.post("/initialize", async (req, res) => {
  try {
    const parsed = initSchema.parse(req.body);
    if (!env.PAYSTACK_SECRET_KEY) return res.status(500).json({ success: false, error: "Paystack not configured" });

    const payment = await prisma.payment.create({
      data: {
        userId: parsed.userId ?? "unknown",
        amount: parsed.amount as any,
        currency: parsed.currency,
        provider: "PAYSTACK",
        type: parsed.type as any,
        status: "PENDING",
      },
    });

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.email,
        amount: Math.round(parsed.amount * 100),
        currency: parsed.currency,
        metadata: { paymentId: payment.id },
      }),
    });

    const data = await response.json() as any;
    if (!data || !data.status) {
      return res.status(502).json({ success: false, error: "Paystack initialization failed", detail: data });
    }

    // store external reference
    await prisma.payment.update({ where: { id: payment.id }, data: { externalRef: data.data.reference } });

    return res.json({ success: true, authorization_url: data.data.authorization_url, reference: data.data.reference });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

const verifySchema = z.object({ reference: z.string() });
router.post("/verify", async (req, res) => {
  try {
    const { reference } = verifySchema.parse(req.body);
    if (!env.PAYSTACK_SECRET_KEY) return res.status(500).json({ success: false, error: "Paystack not configured" });

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json() as any;
    if (!data || !data.status) return res.status(400).json({ success: false, error: "Verification failed", detail: data });

    const referenceData = data.data;
    // find payment by externalRef or metadata
    const payment = await prisma.payment.findFirst({ where: { externalRef: reference } });
    if (payment) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "COMPLETED", completedAt: new Date() } });
      // activate user account if activation fee
      if (payment.type === "ACCOUNT_ACTIVATION") {
        const user = await prisma.user.findUnique({ where: { id: payment.userId } });
        await prisma.user.updateMany({ where: { id: payment.userId }, data: { accountStatus: "ACTIVE", emailVerifiedAt: new Date() } });
        if (user) {
          sendPaymentConfirmationEmail(user.email, user.fullName, Number(payment.amount)).catch(console.error);
        }
      }
    }

    return res.json({ success: true, verification: referenceData });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const signature = (req.headers["x-paystack-signature"] as string) ?? "";
    const raw = (req as any).rawBody ?? JSON.stringify(req.body);
    if (!env.PAYSTACK_SECRET_KEY) return res.status(500).end("Paystack not configured");

    const expected = crypto.createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(raw).digest("hex");
    if (signature !== expected) {
      return res.status(400).end("Invalid signature");
    }

    const body = req.body as any;
    // handle charge.success / transaction.success events
    const event = body.event ?? body.type;
    const data = body.data;
    if (data && data.reference) {
      const payment = await prisma.payment.findFirst({ where: { externalRef: data.reference } });
      if (payment && (event === "charge.success" || event === "transaction.success" || data.status === "success")) {
        if (payment.status === "COMPLETED") {
          // Already processed, skip
          return res.json({ status: "ok" });
        }

        await prisma.payment.update({ where: { id: payment.id }, data: { status: "COMPLETED", completedAt: new Date() } });

        if (payment.type === "ACCOUNT_ACTIVATION") {
          await prisma.user.updateMany({ where: { id: payment.userId }, data: { accountStatus: "ACTIVE", emailVerifiedAt: new Date() } });
        } else if (payment.type === "DEPOSIT") {
          // Update user's wallet balance (displayBalance)
          const wallet = await prisma.wallet.findUnique({ where: { userId: payment.userId } });
          if (wallet) {
            const newBalance = wallet.balance.plus(payment.amount);
            await prisma.wallet.update({
              where: { userId: payment.userId },
              data: { balance: newBalance },
            });
            // Create wallet transaction record
            await prisma.walletTransaction.create({
              data: {
                walletId: wallet.id,
                type: "CREDIT",
                reason: "DEPOSIT",
                amount: payment.amount as any,
                balanceAfter: newBalance,
                paymentId: payment.id,
                description: "Deposit via M-Pesa",
              },
            });
          } else {
            // Create wallet if it doesn't exist
            const newWallet = await prisma.wallet.create({
              data: {
                userId: payment.userId,
                balance: payment.amount as any,
              },
            });
            await prisma.walletTransaction.create({
              data: {
                walletId: newWallet.id,
                type: "CREDIT",
                reason: "DEPOSIT",
                amount: payment.amount as any,
                balanceAfter: payment.amount as any,
                paymentId: payment.id,
                description: "Deposit via M-Pesa",
              },
            });
          }
        }
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).end("error");
  }
});

router.get("/history", async (req, res) => {
  try {
    const userId = String(req.query.userId ?? "");
    if (!userId) return res.status(400).json({ success: false, error: "userId required" });
    const payments = await prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, payments });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ success: false, error: "failed to fetch history" });
  }
});

export default router;

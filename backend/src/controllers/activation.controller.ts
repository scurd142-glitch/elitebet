import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import { toPublicUser } from "../utils/user";
import { notifyUser } from "../utils/wallet";
import { logActivity } from "../utils/activity";
import { NotificationType } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";

const ACTIVATION_AMOUNT = 200; // KES

export async function getActivationConfig(_req: AuthRequest, res: Response) {
  res.json({
    success: true,
    data: {
      amount: ACTIVATION_AMOUNT,
      currency: "KES",
      paymentMethod: "PAYSTACK",
      instructions: [
        "Pay KES 200 activation fee via Paystack",
        "Supports M-Pesa, Card, and other payment methods",
        "Your account will be activated automatically after successful payment",
      ],
    },
  });
}

export async function getActivationStatus(req: AuthRequest, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      type: "ACCOUNT_ACTIVATION",
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: {
      isActivated: user.accountStatus === "ACTIVE",
      activatedAt: user.emailVerifiedAt?.toISOString() ?? null,
      latestPayment: payment
        ? {
            id: payment.id,
            amount: Number(payment.amount),
            status: payment.status,
            createdAt: payment.createdAt.toISOString(),
          }
        : null,
    },
  });
}

export async function refreshMeAfterActivation(req: AuthRequest, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.json({ success: true, data: { user: toPublicUser(user) } });
}

export async function initiateActivationPayment(req: AuthRequest, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  if (user.accountStatus === "ACTIVE") {
    res.status(400).json({ success: false, message: "Account is already activated" });
    return;
  }

  // Initialize Paystack payment
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: ACTIVATION_AMOUNT * 100, // Paystack expects amount in kobo/cents
      currency: "KES",
      metadata: {
        userId: user.id,
        type: "ACCOUNT_ACTIVATION",
      },
    }),
  });

  const data = await response.json() as any;
  if (!data || !data.status) {
    return res.status(502).json({ success: false, error: "Paystack initialization failed", detail: data });
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      amount: ACTIVATION_AMOUNT,
      currency: "KES",
      provider: "PAYSTACK",
      type: "ACCOUNT_ACTIVATION",
      status: "PENDING",
      externalRef: data.data.reference,
    },
  });

  await logActivity(userId, "activation_payment_initiated", { paymentId: payment.id });

  res.json({
    success: true,
    data: {
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      amount: ACTIVATION_AMOUNT,
    },
  });
}

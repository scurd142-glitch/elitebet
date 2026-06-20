import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { createWithdrawalSchema, processWithdrawalSchema } from "../validators/withdrawals.validator";
import { MIN_WITHDRAWAL_AMOUNT } from "../config/constants";
import { toNumber } from "../utils/money";
import { debitWalletForWithdrawal, notifyUser } from "../utils/wallet";
import { logActivity } from "../utils/activity";
import { NotificationType } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";
import { triggerWithdrawalPayout } from "../services/withdrawal-payout.service";
import { retryWithdrawalPayout } from "../services/withdrawal-payout.service";
import { env } from "../config/env";

export async function listMyWithdrawals(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const withdrawals = await prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: {
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        amount: toNumber(w.amount),
        status: w.status,
        destination: w.destination,
        adminNotes: w.adminNotes,
        createdAt: w.createdAt.toISOString(),
        processedAt: w.processedAt?.toISOString() ?? null,
      })),
    },
  });
}

export async function createWithdrawal(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const data = createWithdrawalSchema.parse(req.body);

  if (data.amount < MIN_WITHDRAWAL_AMOUNT) {
    res.status(400).json({
      success: false,
      message: `Minimum withdrawal is KES ${MIN_WITHDRAWAL_AMOUNT}`,
    });
    return;
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || toNumber(wallet.balance) < data.amount) {
    res.status(400).json({ success: false, message: "Insufficient wallet balance" });
    return;
  }

  const pending = await prisma.withdrawal.count({
    where: { userId, status: "PENDING" },
  });
  if (pending > 0) {
    res.status(400).json({
      success: false,
      message: "You already have a pending withdrawal request",
    });
    return;
  }

  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId,
      amount: data.amount,
      currency: "KES",
      method: "PAYSTACK",
      destination: data.destination || data.phone,
    },
  });

  await logActivity(userId, "withdrawal_requested", { amount: data.amount });
  res.status(201).json({
    success: true,
    data: {
      withdrawal: {
        id: withdrawal.id,
        amount: data.amount,
        status: withdrawal.status,
      },
    },
  });
}

export async function listAllWithdrawals(_req: AuthRequest, res: Response) {
  const withdrawals = await prisma.withdrawal.findMany({
    include: {
      user: { select: { id: true, fullName: true, username: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: {
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        amount: toNumber(w.amount),
        status: w.status,
        destination: w.destination,
        adminNotes: w.adminNotes,
        createdAt: w.createdAt.toISOString(),
        user: w.user,
      })),
    },
  });
}

export async function processWithdrawal(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const { status, adminNote } = processWithdrawalSchema.parse(req.body);

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id },
  });

  if (!withdrawal || withdrawal.status !== "PENDING") {
    res.status(400).json({ success: false, message: "Invalid withdrawal request" });
    return;
  }

  const amount = toNumber(withdrawal.amount);

  if (status === "APPROVED") {
    try {
      await debitWalletForWithdrawal(withdrawal.userId, amount, withdrawal.id);
    } catch {
      res.status(400).json({ success: false, message: "Insufficient balance" });
      return;
    }
  }

  await prisma.withdrawal.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNote,
      processedAt: new Date(),
    },
  });

  if (status === "APPROVED" && env.PAYSTACK_SECRET_KEY) {
    await triggerWithdrawalPayout(id);
    res.json({
      success: true,
      message: "Withdrawal approved — Paystack payout initiated automatically",
    });
    return;
  }

  const messages: Record<string, string> = {
    APPROVED: `Your withdrawal of KES ${amount.toFixed(2)} was approved. Payout will be sent to your account shortly.`,
    REJECTED: `Your withdrawal request was rejected.${adminNote ? ` Note: ${adminNote}` : ""}`,
    PAID: `Your withdrawal of KES ${amount.toFixed(2)} has been marked as paid.`,
  };

  await notifyUser(
    withdrawal.userId,
    "Withdrawal update",
    messages[status],
    NotificationType.WITHDRAWAL
  );

  res.json({ success: true, message: `Withdrawal ${status.toLowerCase()}` });
}

export async function retryPayout(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const withdrawal = await prisma.withdrawal.findUnique({ where: { id } });

  if (!withdrawal || withdrawal.status !== "APPROVED") {
    res.status(400).json({
      success: false,
      message: "Only approved withdrawals can be retried for payout",
    });
    return;
  }

  if (!env.PAYSTACK_SECRET_KEY) {
    res.status(503).json({ success: false, message: "Paystack is not configured" });
    return;
  }

  await retryWithdrawalPayout(id);
  res.json({ success: true, message: "Paystack payout retry initiated" });
}

export async function markWithdrawalPaid(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const withdrawal = await prisma.withdrawal.findUnique({ where: { id } });

  if (!withdrawal || withdrawal.status !== "APPROVED") {
    res.status(400).json({ success: false, message: "Withdrawal must be approved first" });
    return;
  }

  await prisma.withdrawal.update({
    where: { id },
    data: { status: "PAID", processedAt: new Date() },
  });

  await notifyUser(
    withdrawal.userId,
    "Withdrawal paid",
    `Your withdrawal of KES ${toNumber(withdrawal.amount).toFixed(2)} has been paid out.`,
    NotificationType.WITHDRAWAL
  );

  res.json({ success: true, message: "Marked as paid" });
}

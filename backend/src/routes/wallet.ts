import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toNumber } from "../utils/money";

const router = express.Router();

const withdrawSchema = z.object({
  amount: z.number().positive(),
  destination: z.string().min(1),
  method: z.enum(["PAYSTACK", "PAYPAL", "BANK_TRANSFER"]).default("PAYSTACK"),
});

const transferSchema = z.object({
  amount: z.number().positive(),
  direction: z.enum(["main_to_casino", "casino_to_main"]),
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const walletRecord = await prisma.wallet.findUniqueOrThrow({ where: { userId } });
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: walletRecord.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const credits = await prisma.walletTransaction.aggregate({
      where: { walletId: walletRecord.id, type: "CREDIT", reason: { in: ["DEPOSIT", "WIN", "BONUS", "REFERRAL_BONUS"] } },
      _sum: { amount: true },
    });

    return res.json({
      success: true,
      data: {
        balance: toNumber(wallet.balance),
        casinoBalance: toNumber(wallet.casinoBalance),
        bonusBalance: toNumber(wallet.bonusBalance),
        totalEarned: credits._sum.amount ? toNumber(credits._sum.amount) : 0,
        transactions: transactions.map((t) => ({
          id: t.id,
          type: t.reason,
          amount: t.type === "CREDIT" ? toNumber(t.amount) : -toNumber(t.amount),
          description: t.description ?? t.reason,
          createdAt: t.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: { message: "Unable to load wallet" } });
  }
});

router.post("/transfer", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { amount, direction } = transferSchema.parse(req.body);
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.status(404).json({ success: false, error: { message: "Wallet not found" } });

    if (direction === "main_to_casino") {
      if (toNumber(wallet.balance) < amount) {
        return res.status(400).json({ success: false, error: { message: "Insufficient main balance" } });
      }
      await prisma.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
          casinoBalance: { increment: amount },
        },
      });
    } else {
      if (toNumber(wallet.casinoBalance) < amount) {
        return res.status(400).json({ success: false, error: { message: "Insufficient casino balance" } });
      }
      await prisma.wallet.update({
        where: { userId },
        data: {
          casinoBalance: { decrement: amount },
          balance: { increment: amount },
        },
      });
    }

    const updated = await prisma.wallet.findUniqueOrThrow({ where: { userId } });
    return res.json({
      success: true,
      data: {
        balance: toNumber(updated.balance),
        casinoBalance: toNumber(updated.casinoBalance),
        bonusBalance: toNumber(updated.bonusBalance),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: { message: "Transfer failed" } });
  }
});

router.post("/withdraw", requireAuth, async (_req, res) => {
  return res.status(403).json({
    success: false,
    error: { message: "Withdrawals are not available on this platform" },
  });
});

router.get("/transactions", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.json({ success: true, data: { transactions: [] } });

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return res.json({ success: true, data: { transactions } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: { message: "Unable to load transactions" } });
  }
});

export default router;

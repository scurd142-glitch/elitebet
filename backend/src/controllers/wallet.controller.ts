import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import { toNumber } from "../utils/money";
import { ensureWallet } from "../utils/wallet";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function getWallet(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const wallet = await ensureWallet(userId);

  const transactions = await prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json({
    success: true,
    data: {
      balance: toNumber(wallet.balance),
      totalEarned: 0,
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: toNumber(t.amount),
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      })),
    },
  });
}

export async function getReferrals(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const commissions = await prisma.referral.findMany({
    where: { referrerId: userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const totalCommission = commissions.reduce((sum, c) => sum + Number(c.commissionEarned ?? 0), 0);
  const referralLink = `${env.SITE_URL ?? env.FRONTEND_URL ?? ""}/register?ref=${user.referralCode}`;

  res.json({
    success: true,
    data: {
      referralCode: user.referralCode,
      referralLink,
      referralCount: commissions.length,
      totalCommission,
      commissions: commissions.map((c) => ({
        id: c.id,
        commissionEarned: Number(c.commissionEarned),
        createdAt: c.createdAt.toISOString(),
      })),
    },
  });
}

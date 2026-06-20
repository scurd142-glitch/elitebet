import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { decimal, toNumber } from "./money";
import { logActivity } from "./activity";
import {
  REFERRAL_COMMISSION_RATE,
} from "../config/constants";
import { NotificationType, WalletTransactionReason } from "@prisma/client";

export async function ensureWallet(userId: string) {
  return prisma.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

async function creditWallet(
  tx: Prisma.TransactionClient,
  userId: string,
  amount: number,
  description: string,
  referenceId?: string
) {
  const wallet = await tx.wallet.upsert({
    where: { userId },
    create: { userId, balance: decimal(amount) },
    update: {
      balance: { increment: decimal(amount) },
    },
  });

  await tx.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: "CREDIT" as any,
      reason: WalletTransactionReason.JOB_PAYOUT,
      amount: decimal(amount),
      balanceAfter: wallet.balance,
      description,
      referenceId,
    },
  });

  return wallet;
}

export async function payJobCompletion(
  writerId: string,
  jobId: string,
  payout: number,
  jobTitle: string
) {
  await prisma.$transaction(async (tx) => {
    await creditWallet(
      tx,
      writerId,
      payout,
      `Payment for job: ${jobTitle}`,
      jobId
    );

    const writer = await tx.user.findUnique({
      where: { id: writerId },
      select: { referredById: true },
    });

    if (writer?.referredById) {
      const commission = Math.round(payout * REFERRAL_COMMISSION_RATE * 100) / 100;
      if (commission > 0) {
        await creditWallet(
          tx,
          writer.referredById,
          commission,
          `Referral commission from ${jobTitle}`,
          jobId
        );

        await tx.referral.create({
          data: {
            referrerId: writer.referredById,
            referredUserId: writerId,
            commissionEarned: decimal(commission),
          },
        });

        await tx.notification.create({
          data: {
            userId: writer.referredById,
            title: "Referral commission earned",
            body: `You earned KES ${commission.toFixed(2)} from a referral job completion.`,
            type: NotificationType.REFERRAL,
          },
        });
      }
    }
  });

  await logActivity(writerId, "job_payment_received", { jobId, payout });
}

export async function debitWalletForWithdrawal(
  userId: string,
  amount: number,
  withdrawalId: string
) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || toNumber(wallet.balance) < amount) {
    throw new Error("Insufficient balance");
  }

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: decimal(amount) } },
    });

    const w = await tx.wallet.findUniqueOrThrow({ where: { userId } });

    await tx.walletTransaction.create({
      data: {
        walletId: w.id,
        type: "DEBIT" as any,
        reason: WalletTransactionReason.WITHDRAWAL,
        amount: decimal(-amount),
        balanceAfter: w.balance,
        description: "Withdrawal approved",
        referenceId: withdrawalId,
      },
    });
  });
}

export async function notifyUser(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.SYSTEM
) {
  await prisma.notification.create({
    data: { userId, title, body: message, type },
  });
}

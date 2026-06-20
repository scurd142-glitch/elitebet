import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { decimal, toNumber } from "./money";
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
  reason: WalletTransactionReason,
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
      type: "CREDIT",
      reason,
      amount: decimal(amount),
      balanceAfter: wallet.balance,
      description,
      referenceId,
    },
  });

  return wallet;
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
        type: "DEBIT",
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

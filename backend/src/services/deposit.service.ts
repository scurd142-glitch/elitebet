import type { Payment } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { decimal, toNumber } from "../utils/money";
import { NotificationType } from "@prisma/client";
import { notifyUser } from "../utils/wallet";

export async function creditDeposit(payment: Payment) {
  if (payment.status === "COMPLETED") {
    return { alreadyProcessed: true };
  }

  const amount = toNumber(payment.amount);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    const wallet = await tx.wallet.upsert({
      where: { userId: payment.userId },
      create: { userId: payment.userId, balance: decimal(amount) },
      update: { balance: { increment: decimal(amount) } },
    });

    const updated = await tx.wallet.findUniqueOrThrow({ where: { userId: payment.userId } });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        reason: "DEPOSIT",
        amount: decimal(amount),
        balanceAfter: updated.balance,
        paymentId: payment.id,
        actorUserId: payment.userId,
        description: "Deposit via M-Pesa Paystack",
      },
    });
  });

  await notifyUser(
    payment.userId,
    "Deposit successful",
    `Your deposit of KES ${amount.toFixed(2)} was successful.`,
    NotificationType.PAYMENT
  );

  return { alreadyProcessed: false, amount };
}

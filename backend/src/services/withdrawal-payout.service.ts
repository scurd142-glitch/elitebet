import { prisma } from "../lib/prisma";
import { toNumber } from "../utils/money";
import { notifyUser } from "../utils/wallet";
import { NotificationType } from "@prisma/client";
import { env } from "../config/env";

/**
 * Trigger withdrawal payout via Paystack Transfer API
 * Note: Admin must manually approve withdrawal first in dashboard
 */
export async function triggerWithdrawalPayout(withdrawalId: string): Promise<void> {
  if (!env.PAYSTACK_SECRET_KEY) return;

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
    include: { user: true },
  });

  if (!withdrawal || withdrawal.status !== "APPROVED") return;

  const amount = toNumber(withdrawal.amount);

  try {
    // Call Paystack Transfer API
    const response = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: Math.round(amount * 100), // Paystack uses kobo
        recipient: withdrawal.destination, // Recipient code from Paystack
        reason: `WritersNite withdrawal WN-${withdrawalId}`,
        metadata: { withdrawal_id: withdrawalId },
      }),
    });

    const data = await response.json() as any;

    if (!data.status) {
      throw new Error(data.message || "Paystack transfer failed");
    }

    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        metadata: {
          ...withdrawal.metadata as any,
          paystack_transfer_id: data.data.id,
          paystack_reference: data.data.reference,
        },
      },
    });

    await notifyUser(
      withdrawal.userId,
      "Payout processing",
      `${withdrawal.currency} ${amount.toFixed(2)} is being transferred. You will be notified when complete.`,
      NotificationType.WITHDRAWAL
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transfer initiation failed";
    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        metadata: {
          ...withdrawal.metadata as any,
          error: message,
        },
      },
    });
    await notifyUser(
      withdrawal.userId,
      "Payout delayed",
      `Your approved withdrawal could not be sent: ${message}. Support team will investigate.`,
      NotificationType.WITHDRAWAL
    );
  }
}

/** Mark withdrawal paid after successful webhook from Paystack */
export async function completeWithdrawalPayout(
  withdrawalId: string,
  paystackTransferId: string,
  paystackReference: string
): Promise<void> {
  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
  });

  if (!withdrawal || withdrawal.status !== "APPROVED") return;

  const amount = toNumber(withdrawal.amount);

  await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status: "PAID",
      processedAt: new Date(),
      metadata: {
        ...withdrawal.metadata as any,
        paystack_transfer_id: paystackTransferId,
        paystack_reference: paystackReference,
      },
    },
  });

  await notifyUser(
    withdrawal.userId,
    "Withdrawal completed",
    `${withdrawal.currency} ${amount.toFixed(2)} has been transferred successfully (Ref: ${paystackReference}).`,
    NotificationType.WITHDRAWAL
  );
}

/** Admin retry payout for approved withdrawal */
export async function retryWithdrawalPayout(withdrawalId: string): Promise<void> {
  await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      metadata: {
        error: null,
      },
    },
  });
  await triggerWithdrawalPayout(withdrawalId);
}

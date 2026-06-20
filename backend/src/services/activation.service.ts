import { prisma } from "../lib/prisma";
import { notifyUser } from "../utils/wallet";
import { logActivity } from "../utils/activity";
import { NotificationType } from "@prisma/client";

/** Approve activation payment and activate user account */
export async function approveActivationPayment(
  paymentId: string,
  adminNote?: string | null
): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment || payment.status !== "PENDING") return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: { accountStatus: "ACTIVE", emailVerifiedAt: new Date() },
    }),
  ]);

  await logActivity(payment.userId, "activation_approved", { paymentId });
  await notifyUser(
    payment.userId,
    "Account activated",
    "Your payment was confirmed. You now have full access to jobs and wallet.",
    NotificationType.SYSTEM
  );
}

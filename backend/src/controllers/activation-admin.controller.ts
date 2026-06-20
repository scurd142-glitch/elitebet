import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { processActivationSchema } from "../validators/activation.validator";
import { notifyUser } from "../utils/wallet";
import { logActivity } from "../utils/activity";
import { NotificationType } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";

export async function listActivations(_req: AuthRequest, res: Response) {
  // List users awaiting activation (INACTIVE status)
  const users = await prisma.user.findMany({
    where: { accountStatus: "INACTIVE" },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      phone: true,
      accountStatus: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  res.json({
    success: true,
    data: {
      users: users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        phone: u.phone,
        status: u.accountStatus,
        createdAt: u.createdAt.toISOString(),
      })),
    },
  });
}

export async function processActivation(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const { status, adminNote } = processActivationSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  if (user.accountStatus !== "INACTIVE") {
    res.status(400).json({ success: false, message: "User is not pending activation" });
    return;
  }

  if (status === "APPROVED") {
    await prisma.user.update({
      where: { id },
      data: { accountStatus: "ACTIVE" },
    });

    await logActivity(id, "activation_approved", { adminId: req.user?.sub });
    await notifyUser(
      id,
      "Account activated",
      "Your account has been activated. You now have full access to jobs and wallet.",
      NotificationType.SYSTEM
    );

    res.json({ success: true, message: "User activated" });
    return;
  }

  await prisma.user.update({
    where: { id },
    data: { accountStatus: "BANNED" },
  });

  await notifyUser(
    id,
    "Activation rejected",
    adminNote?.trim() || "Your account activation was rejected.",
    NotificationType.SYSTEM
  );

  res.json({ success: true, message: "User activation rejected" });
}

export async function activateUserManually(req: AuthRequest, res: Response) {
  const userId = paramId(req);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ success: false, message: "User account not found" });
    return;
  }

  if (user.accountStatus === "ACTIVE") {
    res.json({ success: true, message: "User is already activated" });
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: "ACTIVE" },
  });

  await logActivity(userId, "activation_manual", { adminId: req.user?.sub });
  await notifyUser(
    userId,
    "Account activated",
    "An administrator activated your account.",
    NotificationType.SYSTEM
  );

  res.json({ success: true, message: "User activated successfully" });
}

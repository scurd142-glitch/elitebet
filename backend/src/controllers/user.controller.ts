import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/user.validator";
import { toPublicUser } from "../utils/user";
import { toNumber } from "../utils/money";
import { logActivity } from "../utils/activity";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";

export async function getDashboard(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;

  const [user, wallet, notifications, referralCount] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.user.count({ where: { referredById: userId } }),
  ]);

  const openJobs = await prisma.job.count({ where: { status: "OPEN" } });
  const recentSubmissions = await prisma.jobSubmission.findMany({ where: { userId }, include: { job: true }, orderBy: { submittedAt: "desc" }, take: 5 });

  res.json({
    success: true,
    data: {
      user: toPublicUser(user),
      stats: {
        balance: wallet ? toNumber(wallet.balance) : 0,
        totalEarned: 0,
        referralCount,
        activeJobs: recentSubmissions.filter((s) => s.status === "PENDING").length,
        openJobs,
        unreadNotifications: notifications.filter((n) => !n.readAt).length,
      },
      recentNotifications: notifications,
      recentAssignments: recentSubmissions,
      announcements: [],
    },
  });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const data = updateProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.fullName && { fullName: data.fullName.trim() }),
      ...(data.phone && { phone: data.phone.trim() }),
      ...(data.country && { country: data.country.trim() }),
    },
  });

  await logActivity(userId, "profile_updated");
  res.json({ success: true, data: { user: toPublicUser(user) } });
}

export async function changePassword(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ success: false, message: "Current password is incorrect" });
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  await logActivity(userId, "password_changed");
  res.json({ success: true, message: "Password updated" });
}

export async function getNotifications(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ success: true, data: { notifications } });
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const id = paramId(req);

  await prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });

  res.json({ success: true });
}

export async function markAllNotificationsRead(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ success: true });
}

export async function getActivity(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  // activity model not present in schema — return admin logs as safe placeholder
  const activities = await prisma.adminLog.findMany({ where: { actorId: userId }, orderBy: { createdAt: "desc" }, take: 30 });
  res.json({ success: true, data: { activities } });
}

export async function getAnnouncements(_req: AuthRequest, res: Response) {
  res.json({ success: true, data: { announcements: [] } });
}

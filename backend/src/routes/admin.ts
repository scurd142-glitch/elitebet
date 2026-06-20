import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = express.Router();

const userUpdateSchema = z.object({
  accountStatus: z.enum(["INACTIVE", "ACTIVE", "SUSPENDED", "BANNED"]).optional(),
  role: z.enum(["ADMIN", "USER", "MODERATOR", "SUPPORT"]).optional(),
});

const withdrawalUpdateSchema = z.object({ status: z.enum(["APPROVED", "REJECTED", "PAID", "FAILED"]), adminNotes: z.string().optional() });

router.use(requireAuth, requireAdmin);

router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { roles: { include: { role: true } } }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, users });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to list users" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const payload = userUpdateSchema.parse(req.body);
    const updates: any = {};
    if (payload.accountStatus) updates.accountStatus = payload.accountStatus;
    const user = await prisma.user.update({ where: { id: req.params.id }, data: updates });
    if (payload.role) {
      const role = await prisma.role.findUnique({ where: { name: payload.role } });
      if (role) {
        await prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, update: {}, create: { userId: user.id, roleId: role.id } });
      }
    }
    return res.json({ success: true, user });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Unable to update user" });
  }
});

router.get("/withdrawals", async (_req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } });
    return res.json({ success: true, withdrawals });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load withdrawals" });
  }
});

router.put("/withdrawals/:id", async (req, res) => {
  try {
    const payload = withdrawalUpdateSchema.parse(req.body);
    const withdrawal = await prisma.withdrawal.update({ where: { id: req.params.id }, data: { status: payload.status, adminNotes: payload.adminNotes } });
    return res.json({ success: true, withdrawal });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Unable to update withdrawal" });
  }
});

router.get("/analytics", async (_req, res) => {
  try {
    const usersCount = await prisma.user.count();
    const depositsCount = await prisma.payment.count({ where: { status: "COMPLETED" } });
    const revenue = await prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } });
    const withdrawalsPending = await prisma.withdrawal.count({ where: { status: "PENDING" } });
    return res.json({ success: true, analytics: { usersCount, depositsCount, revenue: revenue._sum.amount ?? 0, withdrawalsPending } });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load analytics" });
  }
});

router.get("/transactions", async (_req, res) => {
  try {
    const payments = await prisma.payment.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } });
    return res.json({ success: true, payments });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load transactions" });
  }
});

export default router;

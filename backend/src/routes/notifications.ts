import express from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const notifications = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, notifications });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load notifications" });
  }
});

router.put("/:id/read", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const notification = await prisma.notification.updateMany({ where: { id: req.params.id as string, userId }, data: { readAt: new Date() } });
    if (notification.count === 0) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to update notification" });
  }
});

export default router;

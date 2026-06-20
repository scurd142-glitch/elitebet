import express from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { referralsMade: { include: { referredUser: true } } } });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    const referrals = user.referralsMade.map((ref) => ({ id: ref.id, referredEmail: ref.referredUser.email, commissionEarned: ref.commissionEarned, createdAt: ref.createdAt }));
    return res.json({ success: true, referrals, referralCode: user.referralCode });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load referrals" });
  }
});

router.get("/link", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    const url = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/register?ref=${user.referralCode}`;
    return res.json({ success: true, referralLink: url, referralCode: user.referralCode });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to generate referral link" });
  }
});

export default router;

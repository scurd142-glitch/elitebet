import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

const withdrawSchema = z.object({
  amount: z.number().positive(),
  destination: z.string().min(1),
  method: z.enum(["PAYSTACK", "PAYPAL", "BANK_TRANSFER"]).default("PAYSTACK"),
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    const transactions = await prisma.walletTransaction.findMany({ where: { actorUserId: userId }, orderBy: { createdAt: "desc" }, take: 20 });
    return res.json({ success: true, wallet, transactions });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load wallet" });
  }
});

router.post("/withdraw", requireAuth, async (req, res) => {
  try {
    const payload = withdrawSchema.parse(req.body);
    const userId = (req as AuthRequest).user!.id;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.status(404).json({ success: false, error: "Wallet not found" });
    if (Number(wallet.balance) < payload.amount) return res.status(400).json({ success: false, error: "Insufficient balance" });

    await prisma.withdrawal.create({
      data: {
        userId,
        amount: payload.amount as any,
        method: payload.method,
        destination: payload.destination,
        status: "PENDING",
      },
    });

    await prisma.wallet.update({ where: { userId }, data: { pendingBalance: { increment: payload.amount as any } } });
    return res.json({ success: true, message: "Withdrawal request submitted" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Unable to submit withdrawal" });
  }
});

router.get("/transactions", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const payments = await prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, payments });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load transactions" });
  }
});

export default router;

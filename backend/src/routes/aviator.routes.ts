import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware";
import * as aviatorController from "../controllers/aviator.controller";

export const aviatorRouter = Router();

aviatorRouter.use(authMiddleware);

aviatorRouter.post("/bet", asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = (req as AuthRequest).user!.sub;
  const result = await aviatorController.placeBet(userId, Number(amount));
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error });
    return;
  }
  res.json({ success: true, data: result.bet });
}));

aviatorRouter.post("/cashout", asyncHandler(async (req, res) => {
  const { betId, multiplier } = req.body;
  const userId = (req as AuthRequest).user!.sub;
  const result = await aviatorController.cashout(userId, betId, Number(multiplier));
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error });
    return;
  }
  res.json({ success: true, data: { winAmount: result.winAmount } });
}));

aviatorRouter.get("/history", asyncHandler(async (_req, res) => {
  const history = await aviatorController.getRoundHistory();
  res.json({
    success: true,
    data: {
      history: history.map((r) => ({ id: r.id, crashPoint: r.crashPoint, createdAt: r.createdAt })),
    },
  });
}));

aviatorRouter.get("/fake-players", asyncHandler(async (_req, res) => {
  const players = aviatorController.getFakePlayers();
  res.json({ success: true, data: { players } });
}));

aviatorRouter.get("/state", asyncHandler(async (_req, res) => {
  res.json({ success: true, data: aviatorController.getGameState() });
}));

export default aviatorRouter;

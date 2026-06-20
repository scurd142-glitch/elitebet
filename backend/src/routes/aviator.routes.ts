import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireActivated } from "../middleware/activated.middleware";
import * as aviatorController from "../controllers/aviator.controller";

export const aviatorRouter = Router();

aviatorRouter.use(authMiddleware);
aviatorRouter.use(requireActivated);

aviatorRouter.post("/bet", asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const userId = (req as any).user.id;
  
  const result = await aviatorController.placeBet(userId, amount);
  res.json(result);
}));

aviatorRouter.post("/cashout", asyncHandler(async (req, res) => {
  const { betId, multiplier } = req.body;
  const userId = (req as any).user.id;
  
  const result = await aviatorController.cashout(userId, betId, multiplier);
  res.json(result);
}));

aviatorRouter.get("/history", asyncHandler(async (_req, res) => {
  const history = await aviatorController.getRoundHistory();
  res.json({ success: true, history });
}));

aviatorRouter.get("/fake-players", asyncHandler(async (_req, res) => {
  const players = aviatorController.getFakePlayers();
  res.json({ success: true, players });
}));

// Admin route to start game loop
aviatorRouter.post("/start-game", asyncHandler(async (_req, res) => {
  aviatorController.startGameLoop();
  res.json({ success: true, message: "Game loop started" });
}));

aviatorRouter.post("/stop-game", asyncHandler(async (_req, res) => {
  aviatorController.stopGameLoop();
  res.json({ success: true, message: "Game loop stopped" });
}));

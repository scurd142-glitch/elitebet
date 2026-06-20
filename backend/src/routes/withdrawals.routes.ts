import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
// Withdrawals permanently disabled for EliteBet simulation platform
import * as withdrawalsController from "../controllers/withdrawals.controller";

export const withdrawalsRouter = Router();

withdrawalsRouter.use(authMiddleware);

// Withdrawals disabled - return error message
withdrawalsRouter.get("/mine", asyncHandler(async (_req, res) => {
  res.status(403).json({ success: false, error: "Withdrawals are not available on EliteBet" });
}));
withdrawalsRouter.post("/", asyncHandler(async (_req, res) => {
  res.status(403).json({ success: false, error: "Withdrawals are not available on EliteBet" });
}));

// Admin routes also disabled
withdrawalsRouter.get("/admin", asyncHandler(async (_req, res) => {
  res.status(403).json({ success: false, error: "Withdrawals are not available on EliteBet" });
}));
withdrawalsRouter.patch("/admin/:id", asyncHandler(async (_req, res) => {
  res.status(403).json({ success: false, error: "Withdrawals are not available on EliteBet" });
}));
withdrawalsRouter.post("/admin/:id/paid", asyncHandler(async (_req, res) => {
  res.status(403).json({ success: false, error: "Withdrawals are not available on EliteBet" });
}));
withdrawalsRouter.post("/admin/:id/retry-payout", asyncHandler(async (_req, res) => {
  res.status(403).json({ success: false, error: "Withdrawals are not available on EliteBet" });
}));

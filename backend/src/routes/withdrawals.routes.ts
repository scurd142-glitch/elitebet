import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { requireActivated } from "../middleware/activated.middleware";
import * as withdrawalsController from "../controllers/withdrawals.controller";

export const withdrawalsRouter = Router();

withdrawalsRouter.use(authMiddleware);

withdrawalsRouter.get("/mine", requireActivated, asyncHandler(withdrawalsController.listMyWithdrawals));
withdrawalsRouter.post("/", requireActivated, asyncHandler(withdrawalsController.createWithdrawal));

withdrawalsRouter.use(adminMiddleware);
withdrawalsRouter.get("/admin", asyncHandler(withdrawalsController.listAllWithdrawals));
withdrawalsRouter.patch("/admin/:id", asyncHandler(withdrawalsController.processWithdrawal));
withdrawalsRouter.post("/admin/:id/paid", asyncHandler(withdrawalsController.markWithdrawalPaid));
withdrawalsRouter.post("/admin/:id/retry-payout", asyncHandler(withdrawalsController.retryPayout));

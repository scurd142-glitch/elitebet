import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireActivated } from "../middleware/activated.middleware";
import * as walletController from "../controllers/wallet.controller";

export const walletRouter = Router();

walletRouter.use(authMiddleware, requireActivated);

walletRouter.get("/", asyncHandler(walletController.getWallet));
walletRouter.get("/referrals", asyncHandler(walletController.getReferrals));

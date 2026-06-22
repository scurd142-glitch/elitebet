import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import * as walletController from "../controllers/wallet.controller";

export const walletRouter = Router();

walletRouter.use(authMiddleware);

walletRouter.get("/", asyncHandler(walletController.getWallet));
walletRouter.get("/referrals", asyncHandler(walletController.getReferrals));

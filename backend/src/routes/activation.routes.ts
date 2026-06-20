import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import * as activationController from "../controllers/activation.controller";

export const activationRouter = Router();

activationRouter.get("/config", asyncHandler(activationController.getActivationConfig));

activationRouter.use(authMiddleware);

activationRouter.get("/status", asyncHandler(activationController.getActivationStatus));
activationRouter.post("/pay", asyncHandler(activationController.initiateActivationPayment));
activationRouter.get("/me", asyncHandler(activationController.refreshMeAfterActivation));

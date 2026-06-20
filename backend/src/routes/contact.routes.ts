import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import * as contactController from "../controllers/contact.controller";

export const contactRouter = Router();

contactRouter.post("/", asyncHandler(contactController.submitContact));

contactRouter.use(authMiddleware, adminMiddleware);
contactRouter.get("/", asyncHandler(contactController.listContactMessages));
contactRouter.patch("/:id/read", asyncHandler(contactController.markContactRead));

import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireActivated } from "../middleware/activated.middleware";
import * as userController from "../controllers/user.controller";

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/dashboard", requireActivated, asyncHandler(userController.getDashboard));
userRouter.patch("/profile", asyncHandler(userController.updateProfile));
userRouter.post("/change-password", asyncHandler(userController.changePassword));
userRouter.get("/notifications", asyncHandler(userController.getNotifications));
userRouter.patch("/notifications/:id/read", asyncHandler(userController.markNotificationRead));
userRouter.post("/notifications/read-all", asyncHandler(userController.markAllNotificationsRead));
userRouter.get("/activity", requireActivated, asyncHandler(userController.getActivity));

import { Router } from "express";
import {
  register,
  login,
  me,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", authMiddleware, asyncHandler(logout));
authRouter.get("/me", authMiddleware, asyncHandler(me));

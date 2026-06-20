import type { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import type { AuthRequest } from "./auth.middleware";

/** Writers must pay M-Pesa activation before jobs, wallet, withdrawals. Admins skip. */
export async function requireActivated(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.sub;
  if (!userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  if (req.user?.role === "ADMIN") {
    next();
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true },
  });
  if (!user || user.accountStatus === "BANNED") {
    res.status(401).json({ success: false, message: "Account not found or suspended" });
    return;
  }

  if (user.accountStatus !== "ACTIVE") {
    res.status(403).json({
      success: false,
      message: "Activate your account to access this feature",
      code: "ACTIVATION_REQUIRED",
    });
    return;
  }

  next();
}

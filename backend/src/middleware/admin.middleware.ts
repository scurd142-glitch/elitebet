import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const ADMIN_EMAIL = "scurd142@gmail.com";
  if (req.user?.email !== ADMIN_EMAIL) {
    res.status(403).json({ success: false, message: "Admin access required" });
    return;
  }
  next();
}

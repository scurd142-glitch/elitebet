import { type RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization ?? "");
    const [, token] = authHeader.split(" ");
    if (!token) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const payload = jwt.verify(token, env.JWT_SECRET ?? "") as { sub?: string; email?: string };
    const userId = payload?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      include: { roles: { include: { role: true } } },
    });
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    (req as AuthRequest).user = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((userRole) => userRole.role.name),
    };
    return next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;
  if (!user || !user.roles.includes("ADMIN")) {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
  return next();
};

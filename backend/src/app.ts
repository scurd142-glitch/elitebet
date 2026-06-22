import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { pino } from "pino";
import type { Env } from "./config/env";
import paymentsRouter from "./routes/payments";
import { authRouter } from "./routes/auth.routes";
import walletRouter from "./routes/wallet";
import referralsRouter from "./routes/referrals";
import adminRouter from "./routes/admin";
import notificationsRouter from "./routes/notifications";
import { userRouter } from "./routes/user.routes";
import { contactRouter } from "./routes/contact.routes";
import { ticketsRouter } from "./routes/tickets.routes";
import { withdrawalsRouter } from "./routes/withdrawals.routes";
import { aviatorRouter } from "./routes/aviator.routes";
import betsRouter from "./routes/bets.routes";
import { prisma } from "./lib/prisma";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});

export function createApp(env: Env) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? [
        "https://elitebet-frontend.vercel.app",
        "https://elitebet-frontend-6k6q.vercel.app",
        "http://localhost:3000",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  );
  app.use(express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      try {
        (req as any).rawBody = buf.toString();
      } catch (e) {
        (req as any).rawBody = undefined;
      }
    },
  }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "elitebet-api", timestamp: new Date().toISOString() });
  });

  app.get("/health/db", async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  });

  app.use("/api/payments", paymentsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/wallet", walletRouter);
  app.use("/api/referrals", referralsRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/user", userRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/tickets", ticketsRouter);
  app.use("/api/aviator", aviatorRouter);
  app.use("/api/bets", betsRouter);
  app.use("/api/withdrawals", withdrawalsRouter);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  return app;
}

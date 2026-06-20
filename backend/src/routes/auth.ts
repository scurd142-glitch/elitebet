import express from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";

const router = express.Router();

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const verify2FASchema = z.object({ email: z.string().email(), code: z.string().min(3) });

async function sendOtpEmail(to: string, code: string) {
  if (env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: env.EMAIL_USER,
      to,
      subject: "Your EliteBet 2FA code",
      text: `Your verification code is: ${code}`,
    });
    return;
  }
  // Fallback: log code (development)
  // eslint-disable-next-line no-console
  console.log(`2FA code for ${to}: ${code}`);
}

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) return res.status(409).json({ success: false, error: "Email already registered" });

    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const username = parsed.email.split("@")[0] + Math.floor(Math.random() * 9999);
    const referralCode = `REF${randomBytes(3).toString("hex").toUpperCase()}`;

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        username,
        passwordHash,
        fullName: parsed.fullName,
        phone: parsed.phone,
        country: parsed.country,
        accountStatus: "INACTIVE",
        referralCode,
      },
    });

    await prisma.wallet.create({ data: { userId: user.id, balance: 0, currency: "USD" } });

    return res.status(201).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const ok = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, error: "Invalid credentials" });

    if (user.twoFactorEnabled) {
      // generate OTP code (6 digits)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeHash = await bcrypt.hash(code, 10);
      const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

      await prisma.otpVerification.create({
        data: { userId: user.id, email: user.email, purpose: "LOGIN", codeHash, expiresAt: expires },
      });

      await sendOtpEmail(user.email, code);
      return res.json({ success: true, twoFactor: true, message: "2FA code sent to email" });
    }

    // create JWT
    const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET ?? "", { expiresIn: "7d" });
    return res.json({ success: true, token, user: { id: user.id, email: user.email } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ email: z.string().email(), code: z.string().min(3), newPassword: z.string().min(6) });

router.post("/verify-2fa", async (req, res) => {
  try {
    const parsed = verify2FASchema.parse(req.body);
    const otp = await prisma.otpVerification.findFirst({ where: { email: parsed.email }, orderBy: { createdAt: "desc" } });
    if (!otp) return res.status(400).json({ success: false, error: "No OTP found" });
    if (otp.consumedAt || otp.expiresAt < new Date()) return res.status(400).json({ success: false, error: "OTP expired or used" });

    const ok = await bcrypt.compare(parsed.code, otp.codeHash);
    if (!ok) return res.status(400).json({ success: false, error: "Invalid code" });

    await prisma.otpVerification.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
    const user = await prisma.user.findUniqueOrThrow({ where: { email: parsed.email } });
    const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET ?? "", { expiresIn: "7d" });
    return res.json({ success: true, token, user: { id: user.id, email: user.email } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const parsed = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(200).json({ success: true, message: "If that account exists, a reset code has been sent." });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await prisma.otpVerification.create({
      data: { userId: user.id, email: user.email, purpose: "PASSWORD_RESET", codeHash, expiresAt: expires },
    });
    await sendOtpEmail(user.email, code);
    return res.json({ success: true, message: "Password reset code sent." });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const parsed = resetPasswordSchema.parse(req.body);
    const otp = await prisma.otpVerification.findFirst({ where: { email: parsed.email, purpose: "PASSWORD_RESET" }, orderBy: { createdAt: "desc" } });
    if (!otp) return res.status(400).json({ success: false, error: "No reset code found" });
    if (otp.consumedAt || otp.expiresAt < new Date()) return res.status(400).json({ success: false, error: "Reset code expired or used" });

    const ok = await bcrypt.compare(parsed.code, otp.codeHash);
    if (!ok) return res.status(400).json({ success: false, error: "Invalid reset code" });

    const passwordHash = await bcrypt.hash(parsed.newPassword, 12);
    await prisma.user.update({ where: { email: parsed.email }, data: { passwordHash } });
    await prisma.otpVerification.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(400).json({ success: false, error: (err as any).message ?? String(err) });
  }
});

export default router;

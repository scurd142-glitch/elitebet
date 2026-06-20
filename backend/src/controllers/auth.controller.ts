import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { toPublicUser, isAdminEmail } from "../utils/user";
import { uniqueReferralCode } from "../utils/referral";
import { ensureWallet, notifyUser } from "../utils/wallet";
import { logActivity } from "../utils/activity";
import { sendWelcomeEmail } from "../lib/email";
import { NotificationType } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";

export async function register(req: AuthRequest, res: Response) {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email.toLowerCase() },
        ...(data.username ? [{ username: data.username.toLowerCase() }] : []),
      ],
    },
  });

  if (existing) {
    const field = existing.email === data.email.toLowerCase() ? "email" : "username";
    res.status(409).json({
      success: false,
      message: field === "email" ? "Email already registered" : "Username already taken",
    });
    return;
  }

  let referredById: string | undefined;
  if (data.referralCode?.trim()) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: data.referralCode.trim().toUpperCase() },
    });
    if (referrer) referredById = referrer.id;
  }

  const passwordHash = await hashPassword(data.password);
  const username = data.username || data.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  const referralCode = await uniqueReferralCode(username);
  const isAdmin = isAdminEmail(data.email);

  const created = await prisma.user.create({
    data: {
      fullName: data.fullName.trim(),
      username: username.toLowerCase(),
      email: data.email.toLowerCase(),
      phone: data.phone?.trim() || null,
      country: data.country?.trim() || null,
      passwordHash,
      referralCode,
      referredById,
      accountStatus: isAdmin ? "ACTIVE" : "INACTIVE",
      emailVerifiedAt: isAdmin ? new Date() : undefined,
    },
  });

  // ensure roles exist and assign user role
  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER" },
  });
  await prisma.userRole.create({ data: { userId: created.id, roleId: userRole.id } });

  if (isAdmin) {
    const adminRole = await prisma.role.upsert({ where: { name: "ADMIN" }, update: {}, create: { name: "ADMIN" } });
    // create admin mapping if missing
    await prisma.userRole.create({ data: { userId: created.id, roleId: adminRole.id } }).catch(() => {});
  }

  await ensureWallet(created.id);
  await logActivity(created.id, "account_created");

  // Send welcome email
  sendWelcomeEmail(created.email, created.fullName).catch(console.error);

  if (referredById) {
    await notifyUser(
      referredById,
      "New referral signup",
      `${created.fullName} joined using your referral link.`,
      NotificationType.REFERRAL
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: created.id },
    include: { roles: { include: { role: true } } },
  });

  const { token, expiresIn } = signToken({
    sub: user!.id,
    username: user!.username,
    email: user!.email,
    role: user?.roles?.[0]?.role?.name === "ADMIN" ? "ADMIN" : "USER",
  });

  res.status(201).json({
    success: true,
    message: isAdmin ? "Account created successfully" : "Account created. Complete payment to activate account.",
    data: { user: toPublicUser(user as any), token, expiresIn },
  });
}

export async function login(req: AuthRequest, res: Response) {
  const { identifier, password, remember } = loginSchema.parse(req.body);
  const key = identifier.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: key }, { username: key }],
    },
    include: { roles: { include: { role: true } } },
  });

  if (!user || user.accountStatus === "BANNED") {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }
  // ensure admin role for configured admin emails
  if (isAdminEmail(user.email)) {
    const adminRole = await prisma.role.upsert({ where: { name: "ADMIN" }, update: {}, create: { name: "ADMIN" } });
    await prisma.userRole.create({ data: { userId: user.id, roleId: adminRole.id } }).catch(() => {});
    if (user.accountStatus !== "ACTIVE") {
      await prisma.user.update({ where: { id: user.id }, data: { accountStatus: "ACTIVE", emailVerifiedAt: new Date() } });
      user.accountStatus = "ACTIVE";
    }
  }

  await ensureWallet(user.id);

  const roleName = user.roles?.[0]?.role?.name === "ADMIN" ? "ADMIN" : "USER";
  const { token, expiresIn } = signToken(
    {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: roleName as "USER" | "ADMIN",
    },
    remember
  );

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: toPublicUser(user as any),
      token,
      expiresIn,
    },
  });
}

export async function me(req: AuthRequest, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.accountStatus === "BANNED") {
    res.status(401).json({ success: false, message: "Account not found or suspended" });
    return;
  }

  res.json({ success: true, data: { user: toPublicUser(user) } });
}

export async function logout(_req: AuthRequest, res: Response) {
  res.json({ success: true, message: "Logged out successfully" });
}

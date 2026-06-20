import type { User } from "@prisma/client";
import { env } from "../config/env";

export function toPublicUser(user: User & { roles?: Array<{ role: { name: string } }> }) {
  const role = user.roles?.[0]?.role?.name || "USER";
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    country: user.country || "",
    role: role as "USER" | "ADMIN",
    accountStatus: user.accountStatus,
    referralCode: user.referralCode,
    createdAt: user.createdAt.toISOString(),
  };
}

export function isAdminEmail(email: string): boolean {
  return env.ADMIN_EMAILS?.includes(email.toLowerCase()) || false;
}

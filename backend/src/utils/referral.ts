import { prisma } from "../lib/prisma";

export function buildReferralCode(username: string): string {
  const base = username.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base || "WN"}${suffix}`;
}

export async function uniqueReferralCode(username: string): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = buildReferralCode(username);
    const exists = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!exists) return code;
  }
  return `WN${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

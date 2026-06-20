import { prisma } from "../lib/prisma";
import { AdminLogAction } from "@prisma/client";

export async function logActivity(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.adminLog.create({
      data: {
        actorId: userId,
        action: action as AdminLogAction,
        metadata: metadata as any,
      },
    });
  } catch (e) {
    // Silently fail if logging fails
  }
}

import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { contactSchema } from "../validators/contact.validator";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";

export async function submitContact(req: AuthRequest, res: Response) {
  const data = contactSchema.parse(req.body);

  // map contact submissions to SupportTicket model
  const userId = req.user?.sub ?? null;
  const message = await prisma.supportTicket.create({
    data: {
      userId,
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: "OPEN",
      metadata: { name: data.name.trim() },
    },
  });

  res.status(201).json({
    success: true,
    message: "Message received. We will get back to you soon.",
    data: { id: message.id },
  });
}

export async function listContactMessages(_req: AuthRequest, res: Response) {
  const messages = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  res.json({
    success: true,
    data: {
      messages: messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      })),
    },
  });
}

export async function markContactRead(req: AuthRequest, res: Response) {
  const id = paramId(req);
  await prisma.supportTicket.update({ where: { id }, data: { status: "RESOLVED" } });
  res.json({ success: true });
}

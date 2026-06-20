import type { Response } from "express";
import { prisma } from "../lib/prisma";
import {
  createTicketSchema,
  replyTicketSchema,
  updateTicketStatusSchema,
} from "../validators/tickets.validator";
import { notifyUser } from "../utils/wallet";
import { NotificationType } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";

function formatTicket(ticket: any) {
  return {
    id: ticket.id,
    subject: ticket.subject,
    status: ticket.status,
    message: ticket.message,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    email: ticket.email,
  };
}

export async function listMyTickets(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const tickets = await prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  res.json({
    success: true,
    data: {
      tickets: tickets.map((t) => formatTicket(t)),
    },
  });
}

export async function getMyTicket(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const id = paramId(req);

  const ticket = await prisma.supportTicket.findFirst({
    where: { id, userId },
  });

  if (!ticket) {
    res.status(404).json({ success: false, message: "Ticket not found" });
    return;
  }

  res.json({ success: true, data: { ticket: formatTicket(ticket) } });
}

export async function createTicket(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const data = createTicketSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const ticket = await prisma.supportTicket.create({
    data: {
      userId,
      email: user?.email || "",
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: "OPEN",
    },
  });

  res.status(201).json({
    success: true,
    data: { ticket: formatTicket(ticket) },
  });
}

export async function replyToTicket(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const id = paramId(req);
  const { body } = replyTicketSchema.parse(req.body);
  const isAdmin = req.user!.role === "ADMIN";

  const ticket = await prisma.supportTicket.findFirst({
    where: isAdmin ? { id } : { id, userId },
  });

  if (!ticket) {
    res.status(404).json({ success: false, message: "Ticket not found" });
    return;
  }

  if (ticket.status === "CLOSED") {
    res.status(400).json({ success: false, message: "Ticket is closed" });
    return;
  }

  const newStatus = isAdmin && ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status;
  const updatedMessage = ticket.message + "\n\n[Reply " + new Date().toISOString() + "] " + body.trim();

  const updated = await prisma.supportTicket.update({
    where: { id },
    data: { status: newStatus, message: updatedMessage },
  });

  if (isAdmin && ticket.userId) {
    await notifyUser(
      ticket.userId,
      "Support reply",
      `New reply on: ${ticket.subject}`,
      NotificationType.SYSTEM
    );
  }

  res.json({ success: true, data: { ticket: formatTicket(updated) } });
}

export async function listAllTickets(_req: AuthRequest, res: Response) {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { updatedAt: "desc" },
  });

  res.json({
    success: true,
    data: { tickets: tickets.map((t) => formatTicket(t)) },
  });
}

export async function getAdminTicket(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
  });

  if (!ticket) {
    res.status(404).json({ success: false, message: "Ticket not found" });
    return;
  }

  res.json({ success: true, data: { ticket: formatTicket(ticket) } });
}

export async function updateTicketStatus(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const { status } = updateTicketStatusSchema.parse(req.body);

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: { status },
  });

  if (ticket.userId) {
    await notifyUser(
      ticket.userId,
      "Ticket updated",
      `Your support ticket "${ticket.subject}" is now ${status.replace("_", " ").toLowerCase()}.`,
      NotificationType.SYSTEM
    );
  }

  res.json({ success: true, data: { ticket: formatTicket(ticket) } });
}

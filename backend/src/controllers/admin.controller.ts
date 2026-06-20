import type { Response } from "express";
import { prisma } from "../lib/prisma";
import {
  announcementSchema,
  siteContentSchema,
  createCategorySchema,
} from "../validators/admin.validator";
import { toPublicUser } from "../utils/user";
import { notifyUser } from "../utils/wallet";
import { NotificationType } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";

export async function getAnalytics(_req: AuthRequest, res: Response) {
  const [totalUsers, suspendedUsers, newUsersWeek, pendingWithdrawals, activatedUsers, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { accountStatus: "BANNED" } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.withdrawal.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { accountStatus: "ACTIVE" } }),
    prisma.payment.aggregate({
      where: {
        type: "ACCOUNT_ACTIVATION",
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, fullName: true, username: true, email: true, accountStatus: true, createdAt: true },
  });

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        suspendedUsers,
        newUsersWeek,
        pendingWithdrawals,
        activatedUsers,
        totalRevenue: totalRevenue._sum.amount ? Number(totalRevenue._sum.amount) : 0,
      },
      recentUsers: recentUsers.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
    },
  });
}

export async function listUsers(req: AuthRequest, res: Response) {
  const search = (req.query.search as string)?.trim().toLowerCase();

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { roles: { include: { role: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  res.json({
    success: true,
    data: {
      users: users.map((u) => ({
        ...toPublicUser(u as any),
        accountStatus: u.accountStatus,
      })),
    },
  });
}

export async function toggleBanUser(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const user = await prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });

  if (!user || user.roles.some((ur) => ur.role.name === "ADMIN")) {
    res.status(400).json({ success: false, message: "Cannot modify this user" });
    return;
  }

  const newStatus = user.accountStatus === "BANNED" ? "INACTIVE" : "BANNED";
  const updated = await prisma.user.update({ where: { id }, data: { accountStatus: newStatus } });

  res.json({ success: true, data: { accountStatus: updated.accountStatus } });
}

export async function listAnnouncements(_req: AuthRequest, res: Response) {
  // no announcement model present — return empty list
  res.json({ success: true, data: { announcements: [] } });
}

export async function createAnnouncement(req: AuthRequest, res: Response) {
  const data = announcementSchema.parse(req.body);

  // map to Faq model as available placeholder
  const announcement = await prisma.faq.create({
    data: {
      question: data.title,
      answer: data.body,
      published: data.isActive ?? true,
    },
  });

  res.status(201).json({ success: true, data: { announcement } });
}

export async function updateAnnouncement(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const data = announcementSchema.partial().parse(req.body);

  const announcement = await prisma.faq.update({
    where: { id },
    data: { question: data.title, answer: data.body, published: data.isActive },
  });

  res.json({ success: true, data: { announcement } });
}

export async function deleteAnnouncement(req: AuthRequest, res: Response) {
  const id = paramId(req);
  await prisma.faq.delete({ where: { id } });
  res.json({ success: true });
}

export async function getSiteContent(_req: AuthRequest, res: Response) {
  // map to Faq model
  const items = await prisma.faq.findMany();
  const content: Record<string, string> = {};
  for (const item of items) {
    content[item.question] = item.answer;
  }
  res.json({ success: true, data: { content } });
}

export async function upsertSiteContent(req: AuthRequest, res: Response) {
  const data = siteContentSchema.parse(req.body);

  // update or create Faq entry
  const item = await prisma.faq.upsert({
    where: { id: data.key },
    create: { question: data.key, answer: data.value, published: true },
    update: { answer: data.value },
  });

  res.json({ success: true, data: { item } });
}

export async function createCategory(req: AuthRequest, res: Response) {
  // job categories are enums in schema — just validate the request is valid
  const data = createCategorySchema.parse(req.body);
  res.status(201).json({ success: true, data: { category: { name: data.name, description: data.description } } });
}

export async function listCategories(_req: AuthRequest, res: Response) {
  // return job category enum values
  const categories = [
    "ARTICLE_WRITING",
    "ACADEMIC_WRITING",
    "COPYWRITING",
    "TRANSCRIPTION",
    "TRANSLATION",
    "PROOFREADING",
    "BLOGGING",
    "SOCIAL_MEDIA_CAPTIONS",
    "PRODUCT_DESCRIPTIONS",
    "AI_PROMPT_EDITING",
  ];
  res.json({ success: true, data: { categories: categories.map((c) => ({ name: c, slug: c })) } });
}

export async function seedCategories(_req: AuthRequest, res: Response) {
  // categories are enums — just return them
  const categories = [
    "ARTICLE_WRITING",
    "ACADEMIC_WRITING",
    "COPYWRITING",
    "TRANSCRIPTION",
    "TRANSLATION",
    "PROOFREADING",
    "BLOGGING",
    "SOCIAL_MEDIA_CAPTIONS",
    "PRODUCT_DESCRIPTIONS",
    "AI_PROMPT_EDITING",
  ];
  res.json({ success: true, data: { categories: categories.map((c) => ({ name: c, slug: c })) } });
}

export async function getPublicContent(_req: AuthRequest, res: Response) {
  const items = await prisma.faq.findMany();
  const content: Record<string, string> = {};
  for (const item of items) {
    content[item.question] = item.answer;
  }
  res.json({ success: true, data: { content } });
}

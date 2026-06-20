import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

const jobCreateSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string().min(1),
  budget: z.number().positive(),
  currency: z.string().default("USD"),
  deadline: z.string().optional(),
  featured: z.boolean().optional().default(false),
  sponsored: z.boolean().optional().default(false),
});

const jobUpdateSchema = jobCreateSchema.partial();

router.get("/", async (req, res) => {
  try {
    const where: any = { deletedAt: null, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] } };
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.minBudget || req.query.maxBudget) {
      where.budget = {};
      if (req.query.minBudget) where.budget.gte = Number(req.query.minBudget);
      if (req.query.maxBudget) where.budget.lte = Number(req.query.maxBudget);
    }
    if (req.query.q) {
      where.OR = [
        { title: { contains: String(req.query.q), mode: "insensitive" } },
        { description: { contains: String(req.query.q), mode: "insensitive" } },
      ];
    }
    const jobs = await prisma.job.findMany({
      where,
      include: { createdBy: true, assignedUser: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, jobs });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to fetch jobs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { createdBy: true, assignedUser: true, submissions: true },
    });
    if (!job) return res.status(404).json({ success: false, error: "Job not found" });
    return res.json({ success: true, job });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to fetch job" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = jobCreateSchema.parse(req.body);
    const userId = (req as AuthRequest).user!.id;
    const job = await prisma.job.create({
      data: {
        title: payload.title,
        description: payload.description,
        category: payload.category as any,
        budget: payload.budget as any,
        currency: payload.currency,
        deadline: payload.deadline ? new Date(payload.deadline) : null,
        featured: payload.featured,
        sponsored: payload.sponsored,
        createdById: userId,
      },
    });
    return res.status(201).json({ success: true, job });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Job creation failed" });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = jobUpdateSchema.parse(req.body);
    const job = await prisma.job.update({
      where: { id: req.params.id as string },
      data: {
        ...payload,
        category: payload.category as any,
        deadline: payload.deadline ? new Date(payload.deadline) : undefined,
      },
    });
    return res.json({ success: true, job });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Job update failed" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.job.update({ where: { id: req.params.id as string }, data: { deletedAt: new Date(), status: "CANCELLED" } });
    return res.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to delete job" });
  }
});

router.post("/:id/accept", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const job = await prisma.job.findUnique({ where: { id: req.params.id as string } });
    if (!job || job.deletedAt) return res.status(404).json({ success: false, error: "Job not found" });
    if (job.status !== "OPEN") return res.status(400).json({ success: false, error: "Job not available" });

    const updated = await prisma.job.update({
      where: { id: job.id },
      data: { assignedUserId: userId, status: "ASSIGNED" },
    });
    return res.json({ success: true, job: updated });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to accept job" });
  }
});

router.post("/:id/submit", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const job = await prisma.job.findUnique({ where: { id: req.params.id as string } });
    if (!job) return res.status(404).json({ success: false, error: "Job not found" });
    if (job.assignedUserId !== userId) return res.status(403).json({ success: false, error: "Not assigned to this job" });

    const submission = await prisma.jobSubmission.create({
      data: {
        jobId: job.id,
        userId,
        contentUrl: req.body.contentUrl,
        attachmentUrls: Array.isArray(req.body.attachmentUrls) ? req.body.attachmentUrls : [],
        notes: req.body.notes,
      },
    });

    await prisma.job.update({ where: { id: job.id }, data: { status: "SUBMITTED" } });
    return res.status(201).json({ success: true, submission });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to submit job" });
  }
});

export default router;

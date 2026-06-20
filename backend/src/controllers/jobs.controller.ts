import type { Response } from "express";
import { prisma } from "../lib/prisma";
import { createJobSchema, submitJobSchema } from "../validators/jobs.validator";
import { toNumber } from "../utils/money";
import { logActivity } from "../utils/activity";
import { payJobCompletion, notifyUser } from "../utils/wallet";
import { NotificationType, JobCategory } from "@prisma/client";
import type { AuthRequest } from "../middleware/auth.middleware";
import { paramId } from "../utils/params";

const JOB_CATEGORIES = Object.values(JobCategory);

function formatJob(job: any) {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    budget: Number(job.budget),
    currency: job.currency,
    status: job.status,
    deadline: job.deadline?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    category: job.category,
    featured: job.featured,
    sponsored: job.sponsored,
    assignedUserId: job.assignedUserId,
  };
}

export async function listCategories(_req: AuthRequest, res: Response) {
  res.json({
    success: true,
    data: {
      categories: JOB_CATEGORIES.map((cat) => ({ id: cat, name: cat })),
    },
  });
}


export async function listOpenJobs(req: AuthRequest, res: Response) {
  const category = (req.query.category as string | undefined)?.toUpperCase();

  const jobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      ...(category && JOB_CATEGORIES.includes(category as JobCategory) ? { category: category as JobCategory } : {}),
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: { jobs: jobs.map(formatJob) },
  });
}

export async function listMyJobs(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;

  const submissions = await prisma.jobSubmission.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { submittedAt: "desc" },
  });

  res.json({
    success: true,
    data: {
      submissions: submissions.map((s) => ({
        id: s.id,
        status: s.status,
        notes: s.notes,
        submittedAt: s.submittedAt.toISOString(),
        reviewedAt: s.reviewedAt?.toISOString() ?? null,
        job: formatJob(s.job),
      })),
    },
  });
}

export async function getJob(req: AuthRequest, res: Response) {
  const id = paramId(req);
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    res.status(404).json({ success: false, message: "Job not found" });
    return;
  }

  res.json({ success: true, data: { job: formatJob(job) } });
}

export async function acceptJob(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const jobId = paramId(req);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.status !== "OPEN") {
    res.status(400).json({ success: false, message: "Job is not available" });
    return;
  }

  if (job.assignedUserId) {
    res.status(400).json({ success: false, message: "Job already assigned" });
    return;
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { assignedUserId: userId, status: "ASSIGNED" },
  });

  await logActivity(userId, "job_accepted", { jobId });
  await notifyUser(
    userId,
    "Job accepted",
    `You accepted: ${job.title}`,
    NotificationType.JOB
  );

  res.json({ success: true, message: "Job accepted" });
}

export async function submitJob(req: AuthRequest, res: Response) {
  const userId = req.user!.sub;
  const jobId = paramId(req);
  const { submissionText } = submitJobSchema.parse(req.body);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || job.assignedUserId !== userId) {
    res.status(400).json({ success: false, message: "Cannot submit this job" });
    return;
  }

  const existingSubmission = await prisma.jobSubmission.findFirst({
    where: { jobId, userId },
  });

  if (existingSubmission) {
    await prisma.jobSubmission.update({
      where: { id: existingSubmission.id },
      data: {
        notes: submissionText,
        submittedAt: new Date(),
      },
    });
  } else {
    await prisma.jobSubmission.create({
      data: {
        jobId,
        userId,
        notes: submissionText,
        status: "PENDING",
      },
    });
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "SUBMITTED" },
  });

  await logActivity(userId, "job_submitted", { jobId });
  res.json({ success: true, message: "Submission received for review" });
}

// Admin: approve submission
export async function completeJob(req: AuthRequest, res: Response) {
  const jobId = paramId(req);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { submissions: true },
  });

  if (!job) {
    res.status(404).json({ success: false, message: "Job not found" });
    return;
  }

  const submission = job.submissions.find((s) => s.status === "PENDING");
  if (!submission) {
    res.status(400).json({ success: false, message: "No pending submission to approve" });
    return;
  }

  const payout = Number(job.budget);

  await prisma.$transaction(async (tx) => {
    await tx.jobSubmission.update({
      where: { id: submission.id },
      data: { status: "APPROVED", reviewedAt: new Date() },
    });
    await tx.job.update({
      where: { id: jobId },
      data: { status: "COMPLETED" },
    });
  });

  await payJobCompletion(submission.userId, jobId, payout, job.title);
  await notifyUser(
    submission.userId,
    "Job approved",
    `Your work on "${job.title}" was approved. ${job.currency} ${payout.toFixed(2)} added to your wallet.`,
    NotificationType.JOB
  );

  res.json({ success: true, message: "Job completed and writer paid" });
}

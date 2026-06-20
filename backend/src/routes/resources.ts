import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

const resourceSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  isPremium: z.boolean().optional().default(false),
});

router.get("/", async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ success: true, resources });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load resources" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = resourceSchema.parse(req.body);
    const resource = await prisma.resource.create({ data: payload as any });
    return res.status(201).json({ success: true, resource });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Unable to create resource" });
  }
});

export default router;

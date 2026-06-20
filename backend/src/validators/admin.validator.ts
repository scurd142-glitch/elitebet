import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(2).max(200),
  body: z.string().min(5).max(10000),
  isActive: z.boolean().optional(),
});

export const siteContentSchema = z.object({
  key: z.string().min(1).max(80),
  value: z.string().min(1).max(50000),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
});

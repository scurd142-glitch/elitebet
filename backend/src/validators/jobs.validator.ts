import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(10000),
  category: z.string().min(1),
  budget: z.coerce.number().positive(),
  currency: z.string().default("USD").optional(),
  deadline: z.string().datetime().optional().nullable(),
});

export const submitJobSchema = z.object({
  submissionText: z.string().min(20).max(50000),
});

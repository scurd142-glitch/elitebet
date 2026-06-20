import { z } from "zod";

export const createWithdrawalSchema = z.object({
  amount: z.coerce.number().positive(),
  phone: z.string().min(7).max(20).optional(),
  destination: z.string().min(7).max(200).optional(),
});

export const processWithdrawalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().max(500).optional(),
});

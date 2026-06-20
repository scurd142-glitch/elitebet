import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only use letters, numbers, underscore")
    .optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  country: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
  referralCode: z.string().max(20).optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional().default(false),
});

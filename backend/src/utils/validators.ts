import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const workSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000), // Reduced from 10 to 3 chars
  walletAddress: z.string().optional(),
  parentHash: z.string().optional()
});
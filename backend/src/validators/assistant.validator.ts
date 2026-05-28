import { z } from "zod";

export const generatePostSchema = z.object({
  businessType: z.string().trim().min(2).max(120),
  goal: z.string().trim().min(5).max(400),
  tone: z.string().trim().min(2).max(80).optional(),
});

import { z } from "zod";

const optionalNullableText = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value === undefined ? undefined : value || null));

export const createClientSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(120),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(180)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === undefined ? undefined : value ? value.toLowerCase() : null)),
  phone: optionalNullableText,
  company: optionalNullableText,
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => (value === undefined ? undefined : value || null)),
});

export const updateClientSchema = createClientSchema.partial();

export const listClientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(120).optional().default(""),
});

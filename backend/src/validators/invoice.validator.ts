import { InvoiceStatus } from "@prisma/client";
import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Item description is required").max(300),
  quantity: z.coerce.number().positive("Quantity must be greater than zero").max(999999),
  price: z.coerce.number().min(0, "Price cannot be negative").max(999999999),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().trim().min(1, "Invoice number is required").max(60),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
  tax: z.coerce.number().min(0, "Tax cannot be negative").max(999999999).default(0),
  items: z.array(invoiceItemSchema).min(1, "At least one invoice item is required").max(100),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  items: z.array(invoiceItemSchema).min(1).max(100).optional(),
});

export const listInvoicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(InvoiceStatus).optional(),
});

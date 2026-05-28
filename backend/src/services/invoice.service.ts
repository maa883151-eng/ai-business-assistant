// @ts-nocheck
import { InvoiceStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import {
  createInvoiceSchema,
  listInvoicesQuerySchema,
  updateInvoiceSchema,
} from "../validators/invoice.validator.js";

const invoiceSelect = {
  id: true,
  userId: true,
  clientId: true,
  invoiceNumber: true,
  status: true,
  subtotal: true,
  tax: true,
  total: true,
  createdAt: true,
  updatedAt: true,
  client: {
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
    },
  },
  items: {
    select: {
      id: true,
      description: true,
      quantity: true,
      price: true,
      total: true,
    },
    orderBy: { id: "asc" },
  },
} as const;

type InvoiceItemInput = {
  description: string;
  quantity: number;
  price: number;
};

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

function calculateInvoiceTotals(items: InvoiceItemInput[], tax: number) {
  const calculatedItems = items.map((item) => {
    const lineTotal = item.quantity * item.price;

    return {
      description: item.description,
      quantity: toDecimal(item.quantity),
      price: toDecimal(item.price),
      total: toDecimal(lineTotal),
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const normalizedTax = tax || 0;

  return {
    items: calculatedItems,
    subtotal: toDecimal(subtotal),
    tax: toDecimal(normalizedTax),
    total: toDecimal(subtotal + normalizedTax),
  };
}

async function assertUserOwnsClient(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId },
    select: { id: true },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }
}

async function assertInvoiceNumberAvailable(
  userId: string,
  invoiceNumber: string,
  currentInvoiceId?: string,
) {
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      userId,
      invoiceNumber,
      ...(currentInvoiceId ? { NOT: { id: currentInvoiceId } } : {}),
    },
    select: { id: true },
  });

  if (existingInvoice) {
    throw new AppError("Invoice number already exists", 409);
  }
}

export const invoiceService = {
  async create(userId: string, payload: unknown) {
    const data = createInvoiceSchema.parse(payload) as any;

    await assertUserOwnsClient(userId, data.clientId);
    await assertInvoiceNumberAvailable(userId, data.invoiceNumber);

    const totals = calculateInvoiceTotals(data.items, data.tax);

    return prisma.invoice.create({
      data: {
        userId,
        clientId: data.clientId,
        invoiceNumber: data.invoiceNumber,
        status: data.status,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        items: {
          create: totals.items,
        },
      },
      select: invoiceSelect,
    });
  },

  async list(userId: string, query: unknown) {
    const { page, limit, status } = listInvoicesQuerySchema.parse(query) as any;
    const skip = (page - 1) * limit;
    const where = {
      userId,
      ...(status ? { status } : {}),
    };

    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        select: invoiceSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async getById(userId: string, invoiceId: string) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      select: invoiceSelect,
    });

    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    return invoice;
  },

  async update(userId: string, invoiceId: string, payload: unknown) {
    const data = updateInvoiceSchema.parse(payload) as any;
    const currentInvoice = await this.getById(userId, invoiceId);

    if (data.clientId) {
      await assertUserOwnsClient(userId, data.clientId);
    }

    if (data.invoiceNumber) {
      await assertInvoiceNumberAvailable(userId, data.invoiceNumber, invoiceId);
    }

    const totals = data.items ? calculateInvoiceTotals(data.items, data.tax ?? 0) : null;
    const taxOnly = !totals && data.tax !== undefined ? toDecimal(data.tax) : undefined;
    const totalWithUpdatedTax = taxOnly ? currentInvoice.subtotal.plus(taxOnly) : undefined;

    return prisma.$transaction(async (tx) => {
      if (totals) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId } });
      }

      return tx.invoice.update({
        where: { id: invoiceId },
        data: {
          ...(data.clientId ? { client: { connect: { id: data.clientId } } } : {}),
          ...(data.invoiceNumber ? { invoiceNumber: data.invoiceNumber } : {}),
          ...(data.status ? { status: data.status } : {}),
          ...(totals ? { subtotal: totals.subtotal, tax: totals.tax, total: totals.total } : {}),
          ...(taxOnly && totalWithUpdatedTax ? { tax: taxOnly, total: totalWithUpdatedTax } : {}),
          ...(totals
            ? {
                items: {
                  create: totals.items,
                },
              }
            : {}),
          updatedAt: new Date(),
        },
        select: invoiceSelect,
      });
    });
  },

  async delete(userId: string, invoiceId: string) {
    await this.getById(userId, invoiceId);
    await prisma.invoice.delete({ where: { id: invoiceId } });

    return { id: invoiceId };
  },

  statuses: Object.values(InvoiceStatus),
};

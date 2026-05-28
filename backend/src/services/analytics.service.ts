import { InvoiceStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === "object" && "toNumber" in value) {
    const decimalLike = value as { toNumber: () => number };
    return decimalLike.toNumber();
  }

  return 0;
}

export const analyticsService = {
  async getDashboardSummary(userId: string) {
    const [clientCount, invoiceCount, paidAggregate, draftCount, sentCount, paidCount, cancelledCount] =
      await Promise.all([
        prisma.client.count({ where: { userId } }),
        prisma.invoice.count({ where: { userId } }),
        prisma.invoice.aggregate({
          where: { userId, status: InvoiceStatus.PAID },
          _sum: { total: true },
        }),
        prisma.invoice.count({ where: { userId, status: InvoiceStatus.DRAFT } }),
        prisma.invoice.count({ where: { userId, status: InvoiceStatus.SENT } }),
        prisma.invoice.count({ where: { userId, status: InvoiceStatus.PAID } }),
        prisma.invoice.count({ where: { userId, status: InvoiceStatus.CANCELLED } }),
      ]);

    const paidRevenue = toNumber(paidAggregate._sum.total);

    return {
      revenue: paidRevenue,
      clients: clientCount,
      invoices: invoiceCount,
      invoiceStatus: {
        draft: draftCount,
        sent: sentCount,
        paid: paidCount,
        cancelled: cancelledCount,
      },
    };
  },
};

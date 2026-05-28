"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/invoices/status-badge";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types/app";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete: (invoice: Invoice) => void;
}

function money(value: string) {
  return new Intl.NumberFormat("en", {
    currency: "USD",
    style: "currency",
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function InvoiceTable({ invoices, onDelete }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">No invoices found</h2>
        <p className="mt-2 text-sm text-slate-600">Create an invoice or adjust the status filter.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Invoice</th>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-4 font-medium text-slate-950">{invoice.invoiceNumber}</td>
                <td className="px-4 py-4 text-slate-600">
                  <p>{invoice.client.name}</p>
                  <p className="mt-1 text-xs">{invoice.client.email ?? "No email"}</p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-4 py-4 font-medium text-slate-950">{money(invoice.total)}</td>
                <td className="px-4 py-4 text-slate-600">{formatDate(invoice.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="secondary">
                      <Link href={`/dashboard/invoices/new?invoiceId=${invoice.id}`}>Edit</Link>
                    </Button>
                    <Button onClick={() => onDelete(invoice)} type="button" variant="secondary">
                      <Trash2 size={15} />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DeleteInvoiceModal } from "@/components/invoices/delete-invoice-modal";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Button } from "@/components/ui/button";
import { invoicesApi } from "@/lib/api/invoices";
import type { Invoice, InvoiceStatus, Pagination } from "@/types/app";

const statuses: Array<InvoiceStatus | ""> = ["", "DRAFT", "SENT", "PAID", "CANCELLED"];

const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

export function InvoicesManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<InvoiceStatus | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const loadInvoices = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    try {
      const result = await invoicesApi.list({ page, limit: 10, status });
      setInvoices(result.data);
      setPagination(result.pagination);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load invoices.");
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInvoices();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInvoices]);

  async function handleDeleteInvoice() {
    if (!invoiceToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await invoicesApi.delete(invoiceToDelete.id);
      setInvoiceToDelete(null);
      await loadInvoices();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete invoice.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ProtectedRoute>
      {(user) => (
        <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
          <header className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link className="text-sm font-medium text-teal-700 hover:text-teal-800" href="/dashboard">
                Dashboard
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Invoices</h1>
              <p className="mt-2 text-slate-600">
                Create and track invoices for {user.fullName}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/invoices/new">
                  <Plus size={18} />
                  New Invoice
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </header>

          <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Status
              <select
                className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value as InvoiceStatus | "");
                }}
                value={status}
              >
                {statuses.map((option) => (
                  <option key={option || "ALL"} value={option}>
                    {option || "All statuses"}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-slate-500">{pagination.total} total invoices</p>
          </section>

          {error && !invoiceToDelete ? (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <div className="mt-6">
            {isLoading ? (
              <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-600">Loading invoices...</p>
              </section>
            ) : (
              <InvoiceTable invoices={invoices} onDelete={setInvoiceToDelete} />
            )}
          </div>

          <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
                variant="secondary"
              >
                Previous
              </Button>
              <Button
                disabled={page >= pagination.totalPages || isLoading}
                onClick={() => setPage((current) => current + 1)}
                type="button"
                variant="secondary"
              >
                Next
              </Button>
            </div>
          </footer>

          <DeleteInvoiceModal
            error={invoiceToDelete ? error : null}
            invoice={invoiceToDelete}
            isDeleting={isDeleting}
            onCancel={() => setInvoiceToDelete(null)}
            onConfirm={handleDeleteInvoice}
          />
        </main>
      )}
    </ProtectedRoute>
  );
}

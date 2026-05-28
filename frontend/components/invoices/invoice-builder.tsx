"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Button } from "@/components/ui/button";
import { clientsApi } from "@/lib/api/clients";
import { invoicesApi, type InvoiceItemInput } from "@/lib/api/invoices";
import type { Client, Invoice, InvoiceStatus } from "@/types/app";

interface InvoiceItemForm {
  id: string;
  description: string;
  quantity: string;
  price: string;
}

const statusOptions: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "CANCELLED"];

function createEmptyItem(): InvoiceItemForm {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: "1",
    price: "0",
  };
}

function money(value: number) {
  return new Intl.NumberFormat("en", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

function normalizeNumber(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function buildInvoiceNumber() {
  return `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
}

export function InvoiceBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const [clients, setClients] = useState<Client[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clientId, setClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(buildInvoiceNumber);
  const [status, setStatus] = useState<InvoiceStatus>("DRAFT");
  const [tax, setTax] = useState("0");
  const [items, setItems] = useState<InvoiceItemForm[]>([createEmptyItem()]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + normalizeNumber(item.quantity) * normalizeNumber(item.price),
      0,
    );
    const taxValue = normalizeNumber(tax);

    return {
      subtotal,
      tax: taxValue,
      total: subtotal + taxValue,
    };
  }, [items, tax]);

  const loadFormData = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    try {
      const clientResult = await clientsApi.list({ page: 1, limit: 100 });
      setClients(clientResult.data);

      if (!invoiceId) {
        setClientId((current) => current || clientResult.data[0]?.id || "");
        return;
      }

      const invoiceResult = await invoicesApi.get(invoiceId);
      const loadedInvoice = invoiceResult.invoice;
      setInvoice(loadedInvoice);
      setClientId(loadedInvoice.clientId);
      setInvoiceNumber(loadedInvoice.invoiceNumber);
      setStatus(loadedInvoice.status);
      setTax(String(Number(loadedInvoice.tax)));
      setItems(
        loadedInvoice.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: String(Number(item.quantity)),
          price: String(Number(item.price)),
        })),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load invoice form.");
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFormData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadFormData]);

  function updateItem(id: string, field: keyof Omit<InvoiceItemForm, "id">, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id),
    );
  }

  function validateItems() {
    if (!clientId) {
      return "Select a client before saving.";
    }

    if (!invoiceNumber.trim()) {
      return "Invoice number is required.";
    }

    if (items.some((item) => !item.description.trim())) {
      return "Every invoice item needs a description.";
    }

    if (items.some((item) => normalizeNumber(item.quantity) <= 0)) {
      return "Item quantities must be greater than zero.";
    }

    if (items.some((item) => normalizeNumber(item.price) < 0)) {
      return "Item prices cannot be negative.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateItems();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      clientId,
      invoiceNumber: invoiceNumber.trim(),
      status,
      tax: normalizeNumber(tax),
      items: items.map(
        (item): InvoiceItemInput => ({
          description: item.description.trim(),
          quantity: normalizeNumber(item.quantity),
          price: normalizeNumber(item.price),
        }),
      ),
    };

    setIsSubmitting(true);

    try {
      if (invoiceId) {
        await invoicesApi.update(invoiceId, payload);
      } else {
        await invoicesApi.create(payload);
      }

      router.replace("/dashboard/invoices");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save invoice.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      {() => (
        <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
          <header className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                className="text-sm font-medium text-teal-700 hover:text-teal-800"
                href="/dashboard/invoices"
              >
                Invoices
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                {invoice ? "Edit invoice" : "Create invoice"}
              </h1>
              <p className="mt-2 text-slate-600">Build itemized invoices with automatic totals.</p>
            </div>
            <LogoutButton />
          </header>

          {isLoading ? (
            <section className="mt-8 rounded-lg border bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-600">Loading invoice builder...</p>
            </section>
          ) : (
            <form className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
              <section className="grid gap-6">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Client
                      <select
                        className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                        onChange={(event) => setClientId(event.target.value)}
                        value={clientId}
                      >
                        <option value="">Select client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Invoice number
                      <input
                        className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                        onChange={(event) => setInvoiceNumber(event.target.value)}
                        value={invoiceNumber}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Status
                      <select
                        className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                        onChange={(event) => setStatus(event.target.value as InvoiceStatus)}
                        value={status}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <section className="rounded-lg border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-950">Items</h2>
                    <Button
                      onClick={() => setItems((current) => [...current, createEmptyItem()])}
                      type="button"
                      variant="secondary"
                    >
                      <Plus size={16} />
                      Add Item
                    </Button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {items.map((item) => (
                      <div
                        className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_120px_140px_120px_auto]"
                        key={item.id}
                      >
                        <input
                          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-700"
                          onChange={(event) =>
                            updateItem(item.id, "description", event.target.value)
                          }
                          placeholder="Description"
                          value={item.description}
                        />
                        <input
                          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-700"
                          min="0"
                          onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
                          step="0.01"
                          type="number"
                          value={item.quantity}
                        />
                        <input
                          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-700"
                          min="0"
                          onChange={(event) => updateItem(item.id, "price", event.target.value)}
                          step="0.01"
                          type="number"
                          value={item.price}
                        />
                        <p className="flex items-center text-sm font-medium text-slate-950">
                          {money(normalizeNumber(item.quantity) * normalizeNumber(item.price))}
                        </p>
                        <Button
                          disabled={items.length === 1}
                          onClick={() => removeItem(item.id)}
                          type="button"
                          variant="secondary"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              </section>

              <aside className="h-fit rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Summary</h2>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{money(totals.subtotal)}</span>
                  </div>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Tax
                    <input
                      className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                      min="0"
                      onChange={(event) => setTax(event.target.value)}
                      step="0.01"
                      type="number"
                      value={tax}
                    />
                  </label>
                  <div className="flex justify-between border-t pt-3 text-base font-bold text-slate-950">
                    <span>Total</span>
                    <span>{money(totals.total)}</span>
                  </div>
                </div>

                {error ? (
                  <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}

                <div className="mt-6 grid gap-3">
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Saving..." : invoice ? "Save Invoice" : "Create Invoice"}
                  </Button>
                  <Button asChild disabled={isSubmitting} variant="secondary">
                    <Link href="/dashboard/invoices">Cancel</Link>
                  </Button>
                </div>
              </aside>
            </form>
          )}
        </main>
      )}
    </ProtectedRoute>
  );
}

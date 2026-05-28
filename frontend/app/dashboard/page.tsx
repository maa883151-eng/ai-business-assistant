"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Button } from "@/components/ui/button";
import { analyticsApi } from "@/lib/api/analytics";
import type { DashboardSummary } from "@/types/app";
import Link from "next/link";

const defaultSummary: DashboardSummary = {
  revenue: 0,
  clients: 0,
  invoices: 0,
  invoiceStatus: {
    draft: 0,
    sent: 0,
    paid: 0,
    cancelled: 0,
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await analyticsApi.summary();

        if (isMounted) {
          setSummary(result.summary);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error ? requestError.message : "Unable to load dashboard data.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { label: "Revenue (Paid)", value: formatCurrency(summary.revenue) },
    { label: "Invoices", value: String(summary.invoices) },
    { label: "Clients", value: String(summary.clients) },
    { label: "Draft Invoices", value: String(summary.invoiceStatus.draft) },
  ];

  return (
    <ProtectedRoute>
      {(user) => (
        <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
          <header className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Business overview</h1>
              <p className="mt-2 text-slate-600">
                Signed in as {user.fullName} ({user.role.toLowerCase()}).
              </p>
            </div>
            <LogoutButton />
          </header>

          <section className="mt-8 grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </section>

          {error ? (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <section className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Workspace modules</h2>
            <p className="mt-2 text-slate-600">
              Manage clients and invoices, then generate quick AI-ready post drafts for your business.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/clients">Manage Clients</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard/invoices">Manage Invoices</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard/assistant">AI Post Assistant</Link>
              </Button>
            </div>
          </section>
        </main>
      )}
    </ProtectedRoute>
  );
}

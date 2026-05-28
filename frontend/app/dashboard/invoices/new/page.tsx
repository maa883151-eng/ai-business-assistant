import { Suspense } from "react";
import { InvoiceBuilder } from "@/components/invoices/invoice-builder";

export default function NewInvoicePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6">
          <p className="text-sm text-slate-600">Loading invoice builder...</p>
        </main>
      }
    >
      <InvoiceBuilder />
    </Suspense>
  );
}

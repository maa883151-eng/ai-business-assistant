import type { InvoiceStatus } from "@/types/app";

const statusClasses: Record<InvoiceStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-50 text-blue-700",
  PAID: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}>
      {status.toLowerCase()}
    </span>
  );
}

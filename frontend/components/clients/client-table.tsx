"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types/app";

interface ClientTableProps {
  clients: Client[];
  onDelete: (client: Client) => void;
  onEdit: (client: Client) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ClientTable({ clients, onDelete, onEdit }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">No clients found</h2>
        <p className="mt-2 text-sm text-slate-600">Add a client or adjust your search.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {clients.map((client) => (
              <tr key={client.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-950">{client.name}</p>
                  {client.notes ? (
                    <p className="mt-1 line-clamp-2 max-w-xs text-xs leading-5 text-slate-500">
                      {client.notes}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>{client.email ?? "No email"}</p>
                  <p className="mt-1 text-xs">{client.phone ?? "No phone"}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">{client.company ?? "No company"}</td>
                <td className="px-4 py-4 text-slate-600">{formatDate(client.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onEdit(client)} type="button" variant="secondary">
                      <Pencil size={15} />
                      Edit
                    </Button>
                    <Button onClick={() => onDelete(client)} type="button" variant="secondary">
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

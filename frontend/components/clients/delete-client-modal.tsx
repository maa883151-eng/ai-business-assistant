"use client";

import { Button } from "@/components/ui/button";
import type { Client } from "@/types/app";

interface DeleteClientModalProps {
  client: Client | null;
  error: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteClientModal({
  client,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteClientModalProps) {
  if (!client) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <section className="w-full max-w-md rounded-lg border bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-950">Delete client?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This will permanently delete {client.name} from your client list.
        </p>
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button disabled={isDeleting} onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-800"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </section>
    </div>
  );
}

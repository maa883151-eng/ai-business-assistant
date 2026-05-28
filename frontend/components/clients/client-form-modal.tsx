"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types/app";

export interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

interface ClientFormModalProps {
  client?: Client | null;
  error: string | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => Promise<void>;
}

const emptyValues: ClientFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

function getInitialValues(client?: Client | null): ClientFormValues {
  if (!client) {
    return emptyValues;
  }

  return {
    name: client.name,
    email: client.email ?? "",
    phone: client.phone ?? "",
    company: client.company ?? "",
    notes: client.notes ?? "",
  };
}

function validateClient(values: ClientFormValues) {
  if (!values.name.trim()) {
    return "Client name is required.";
  }

  if (values.email && !values.email.includes("@")) {
    return "Enter a valid email address.";
  }

  return null;
}

export function ClientFormModal({
  client,
  error: submitError,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ClientFormModalProps) {
  const [values, setValues] = useState<ClientFormValues>(() => getInitialValues(client));
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateClient(values);

    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit(values);
  }

  function updateField(field: keyof ClientFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8">
      <section className="max-h-full w-full max-w-xl overflow-y-auto rounded-lg border bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              {client ? "Edit client" : "Add client"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Keep client contact details organized and tied to your account.
            </p>
          </div>
          <button
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Name
            <input
              className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Client name"
              value={values.name}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="client@example.com"
                type="email"
                value={values.email}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Phone
              <input
                className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+1 555 0100"
                value={values.phone}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Company
            <input
              className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Company name"
              value={values.company}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Notes
            <textarea
              className="min-h-28 rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Payment terms, preferences, or project context"
              value={values.notes}
            />
          </label>

          {error ?? submitError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error ?? submitError}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : client ? "Save Changes" : "Create Client"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

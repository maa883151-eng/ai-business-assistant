"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ClientFormModal, type ClientFormValues } from "@/components/clients/client-form-modal";
import { ClientTable } from "@/components/clients/client-table";
import { DeleteClientModal } from "@/components/clients/delete-client-modal";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Button } from "@/components/ui/button";
import { clientsApi } from "@/lib/api/clients";
import type { Client, Pagination } from "@/types/app";

const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

function toClientInput(values: ClientFormValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    company: values.company.trim() || undefined,
    notes: values.notes.trim() || undefined,
  };
}

export function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadClients = useCallback(async (nextPage = page, nextSearch = search) => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    try {
      const result = await clientsApi.list({ page: nextPage, limit: 10, search: nextSearch });
      setClients(result.data);
      setPagination(result.pagination);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load clients.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadClients(page, search);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadClients, page, search]);

  async function handleSubmitClient(values: ClientFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      if (clientToEdit) {
        await clientsApi.update(clientToEdit.id, toClientInput(values));
      } else {
        await clientsApi.create(toClientInput(values));
      }

      setIsFormOpen(false);
      setClientToEdit(null);
      await loadClients(page, search);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save client.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteClient() {
    if (!clientToDelete) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await clientsApi.delete(clientToDelete.id);
      setClientToDelete(null);
      await loadClients(page, search);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete client.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
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
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Clients</h1>
              <p className="mt-2 text-slate-600">
                Manage contacts and project context for {user.fullName}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setClientToEdit(null);
                  setIsFormOpen(true);
                }}
                type="button"
              >
                <Plus size={18} />
                Add Client
              </Button>
              <LogoutButton />
            </div>
          </header>

          <section className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <form className="flex w-full max-w-md gap-2" onSubmit={handleSearchSubmit}>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="w-full rounded-md border py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-teal-700"
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by name or email"
                  value={searchInput}
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
            <p className="text-sm text-slate-500">{pagination.total} total clients</p>
          </section>

          {error ? (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <div className="mt-6">
            {isLoading ? (
              <section className="rounded-lg border bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-600">Loading clients...</p>
              </section>
            ) : (
              <ClientTable
                clients={clients}
                onDelete={setClientToDelete}
                onEdit={(client) => {
                  setClientToEdit(client);
                  setIsFormOpen(true);
                }}
              />
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

          {isFormOpen ? (
            <ClientFormModal
              key={clientToEdit?.id ?? "new"}
              client={clientToEdit}
              error={error}
              isOpen={isFormOpen}
              isSubmitting={isSubmitting}
              onClose={() => {
                setIsFormOpen(false);
                setClientToEdit(null);
              }}
              onSubmit={handleSubmitClient}
            />
          ) : null}
          <DeleteClientModal
            client={clientToDelete}
            error={clientToDelete ? error : null}
            isDeleting={isSubmitting}
            onCancel={() => setClientToDelete(null)}
            onConfirm={handleDeleteClient}
          />
        </main>
      )}
    </ProtectedRoute>
  );
}

import { apiRequest } from "@/lib/api/client";
import type { Client, Pagination } from "@/types/app";

export interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface ClientListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ClientListResponse {
  data: Client[];
  pagination: Pagination;
}

function buildClientQuery(params: ClientListParams) {
  const query = new URLSearchParams();

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  if (params.search) {
    query.set("search", params.search);
  }

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

export const clientsApi = {
  list(params: ClientListParams) {
    return apiRequest<ClientListResponse>(`/clients${buildClientQuery(params)}`, {
      method: "GET",
      auth: true,
    });
  },

  get(id: string) {
    return apiRequest<{ client: Client }>(`/clients/${id}`, {
      method: "GET",
      auth: true,
    });
  },

  create(input: ClientInput) {
    return apiRequest<{ client: Client }>("/clients", {
      method: "POST",
      auth: true,
      body: JSON.stringify(input),
    });
  },

  update(id: string, input: ClientInput) {
    return apiRequest<{ client: Client }>(`/clients/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(input),
    });
  },

  delete(id: string) {
    return apiRequest<void>(`/clients/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};

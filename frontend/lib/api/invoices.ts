import { apiRequest } from "@/lib/api/client";
import type { Invoice, InvoiceStatus, Pagination } from "@/types/app";

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceInput {
  clientId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  tax: number;
  items: InvoiceItemInput[];
}

export interface InvoiceListParams {
  page?: number;
  limit?: number;
  status?: InvoiceStatus | "";
}

export interface InvoiceListResponse {
  data: Invoice[];
  pagination: Pagination;
}

function buildInvoiceQuery(params: InvoiceListParams) {
  const query = new URLSearchParams();

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  if (params.status) {
    query.set("status", params.status);
  }

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

export const invoicesApi = {
  list(params: InvoiceListParams) {
    return apiRequest<InvoiceListResponse>(`/invoices${buildInvoiceQuery(params)}`, {
      method: "GET",
      auth: true,
    });
  },

  get(id: string) {
    return apiRequest<{ invoice: Invoice }>(`/invoices/${id}`, {
      method: "GET",
      auth: true,
    });
  },

  create(input: InvoiceInput) {
    return apiRequest<{ invoice: Invoice }>("/invoices", {
      method: "POST",
      auth: true,
      body: JSON.stringify(input),
    });
  },

  update(id: string, input: Partial<InvoiceInput>) {
    return apiRequest<{ invoice: Invoice }>(`/invoices/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(input),
    });
  },

  delete(id: string) {
    return apiRequest<void>(`/invoices/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};

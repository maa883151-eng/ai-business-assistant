export type ModuleStatus = "planned" | "active" | "disabled";

export interface DashboardModule {
  id: string;
  title: string;
  status: ModuleStatus;
}

export type UserRole = "OWNER" | "ADMIN" | "MEMBER";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "CANCELLED";

export interface InvoiceClientSummary {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  price: string;
  total: string;
}

export interface Invoice {
  id: string;
  userId: string;
  clientId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  subtotal: string;
  tax: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  client: InvoiceClientSummary;
  items: InvoiceItem[];
}

export interface DashboardSummary {
  revenue: number;
  clients: number;
  invoices: number;
  invoiceStatus: {
    draft: number;
    sent: number;
    paid: number;
    cancelled: number;
  };
}

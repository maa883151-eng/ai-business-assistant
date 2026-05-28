import { apiRequest } from "@/lib/api/client";
import type { DashboardSummary } from "@/types/app";

export const analyticsApi = {
  summary() {
    return apiRequest<{ summary: DashboardSummary }>("/analytics/summary", {
      method: "GET",
      auth: true,
    });
  },
};

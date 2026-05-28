import type { Request, Response } from "express";
import { analyticsService } from "../services/analytics.service.js";
import { AppError } from "../utils/app-error.js";

function getAuthenticatedUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  return userId;
}

export async function dashboardSummaryController(req: Request, res: Response) {
  const summary = await analyticsService.getDashboardSummary(getAuthenticatedUserId(req));
  res.status(200).json({ summary });
}

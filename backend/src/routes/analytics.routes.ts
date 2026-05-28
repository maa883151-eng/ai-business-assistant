import { Router } from "express";
import { dashboardSummaryController } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);
analyticsRouter.get("/summary", asyncHandler(dashboardSummaryController));

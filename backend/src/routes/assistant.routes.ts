import { Router } from "express";
import { generatePostController } from "../controllers/assistant.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const assistantRouter = Router();

assistantRouter.use(requireAuth);
assistantRouter.post("/generate-post", asyncHandler(generatePostController));

import type { Request, Response } from "express";
import { assistantService } from "../services/assistant.service.js";
import { AppError } from "../utils/app-error.js";
import { generatePostSchema } from "../validators/assistant.validator.js";

function assertAuthenticated(req: Request) {
  if (!req.user?.id) {
    throw new AppError("Authentication required", 401);
  }
}

export async function generatePostController(req: Request, res: Response) {
  assertAuthenticated(req);
  const payload = generatePostSchema.parse(req.body);
  const result = await assistantService.generatePost(payload);

  res.status(200).json(result);
}

import { Router } from "express";
import {
  createClientController,
  deleteClientController,
  getClientController,
  listClientsController,
  updateClientController,
} from "../controllers/client.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const clientRouter = Router();

clientRouter.use(requireAuth);
clientRouter.post("/", asyncHandler(createClientController));
clientRouter.get("/", asyncHandler(listClientsController));
clientRouter.get("/:id", asyncHandler(getClientController));
clientRouter.put("/:id", asyncHandler(updateClientController));
clientRouter.delete("/:id", asyncHandler(deleteClientController));

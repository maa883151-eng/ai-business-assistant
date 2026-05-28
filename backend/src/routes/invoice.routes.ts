import { Router } from "express";
import {
  createInvoiceController,
  deleteInvoiceController,
  getInvoiceController,
  listInvoicesController,
  updateInvoiceController,
} from "../controllers/invoice.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const invoiceRouter = Router();

invoiceRouter.use(requireAuth);
invoiceRouter.post("/", asyncHandler(createInvoiceController));
invoiceRouter.get("/", asyncHandler(listInvoicesController));
invoiceRouter.get("/:id", asyncHandler(getInvoiceController));
invoiceRouter.put("/:id", asyncHandler(updateInvoiceController));
invoiceRouter.delete("/:id", asyncHandler(deleteInvoiceController));

import type { Request, Response } from "express";
import { invoiceService } from "../services/invoice.service.js";
import { AppError } from "../utils/app-error.js";

function getAuthenticatedUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  return userId;
}

function getInvoiceId(req: Request) {
  const invoiceId = req.params.id;

  if (!invoiceId || Array.isArray(invoiceId)) {
    throw new AppError("Invoice id is required", 400);
  }

  return invoiceId;
}

export async function createInvoiceController(req: Request, res: Response) {
  const invoice = await invoiceService.create(getAuthenticatedUserId(req), req.body);

  res.status(201).json({ invoice });
}

export async function listInvoicesController(req: Request, res: Response) {
  const result = await invoiceService.list(getAuthenticatedUserId(req), req.query);

  res.status(200).json(result);
}

export async function getInvoiceController(req: Request, res: Response) {
  const invoice = await invoiceService.getById(getAuthenticatedUserId(req), getInvoiceId(req));

  res.status(200).json({ invoice });
}

export async function updateInvoiceController(req: Request, res: Response) {
  const invoice = await invoiceService.update(
    getAuthenticatedUserId(req),
    getInvoiceId(req),
    req.body,
  );

  res.status(200).json({ invoice });
}

export async function deleteInvoiceController(req: Request, res: Response) {
  await invoiceService.delete(getAuthenticatedUserId(req), getInvoiceId(req));

  res.status(204).send();
}

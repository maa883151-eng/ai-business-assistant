import type { Request, Response } from "express";
import { clientService } from "../services/client.service.js";
import { AppError } from "../utils/app-error.js";

function getAuthenticatedUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  return userId;
}

function getClientId(req: Request) {
  const clientId = req.params.id;

  if (!clientId || Array.isArray(clientId)) {
    throw new AppError("Client id is required", 400);
  }

  return clientId;
}

export async function createClientController(req: Request, res: Response) {
  const client = await clientService.create(getAuthenticatedUserId(req), req.body);

  res.status(201).json({ client });
}

export async function listClientsController(req: Request, res: Response) {
  const result = await clientService.list(getAuthenticatedUserId(req), req.query);

  res.status(200).json(result);
}

export async function getClientController(req: Request, res: Response) {
  const client = await clientService.getById(getAuthenticatedUserId(req), getClientId(req));

  res.status(200).json({ client });
}

export async function updateClientController(req: Request, res: Response) {
  const client = await clientService.update(getAuthenticatedUserId(req), getClientId(req), req.body);

  res.status(200).json({ client });
}

export async function deleteClientController(req: Request, res: Response) {
  await clientService.delete(getAuthenticatedUserId(req), getClientId(req));

  res.status(204).send();
}

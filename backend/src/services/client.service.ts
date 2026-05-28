import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import {
  createClientSchema,
  listClientsQuerySchema,
  updateClientSchema,
} from "../validators/client.validator.js";

type ClientWriteData = {
  name?: string | undefined;
  email?: string | null | undefined;
  phone?: string | null | undefined;
  company?: string | null | undefined;
  notes?: string | null | undefined;
};

const clientSelect = {
  id: true,
  userId: true,
  name: true,
  email: true,
  phone: true,
  company: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

function buildSearchWhere(userId: string, search: string): Prisma.ClientWhereInput {
  const where: Prisma.ClientWhereInput = { userId };

  if (!search) {
    return where;
  }

  return {
    ...where,
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ],
  };
}

function removeUndefinedValues(data: ClientWriteData) {
  return Object.fromEntries(
    Object.entries(data).filter((entry): entry is [string, string | null] => entry[1] !== undefined),
  );
}

export const clientService = {
  async create(userId: string, payload: unknown) {
    const data = createClientSchema.parse(payload);

    return prisma.client.create({
      data: {
        ...removeUndefinedValues(data),
        name: data.name,
        userId,
      },
      select: clientSelect,
    });
  },

  async list(userId: string, query: unknown) {
    const { page, limit, search } = listClientsQuerySchema.parse(query);
    const skip = (page - 1) * limit;
    const where = buildSearchWhere(userId, search);

    const [clients, total] = await prisma.$transaction([
      prisma.client.findMany({
        where,
        select: clientSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async getById(userId: string, clientId: string) {
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId },
      select: clientSelect,
    });

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    return client;
  },

  async update(userId: string, clientId: string, payload: unknown) {
    const data = updateClientSchema.parse(payload);
    await this.getById(userId, clientId);

    return prisma.client.update({
      where: { id: clientId },
      data: removeUndefinedValues(data),
      select: clientSelect,
    });
  },

  async delete(userId: string, clientId: string) {
    await this.getById(userId, clientId);
    await prisma.client.delete({ where: { id: clientId } });

    return { id: clientId };
  },
};

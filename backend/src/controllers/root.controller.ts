import type { Request, Response } from "express";

export function rootController(_req: Request, res: Response) {
  res.status(200).json({
    name: "AI Business Assistant API",
    version: "0.1.0",
    modules: ["auth", "clients", "invoices", "assistant", "analytics"],
  });
}

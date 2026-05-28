import type { Request, Response } from "express";

export function protectedController(req: Request, res: Response) {
  res.status(200).json({
    message: "You have access to this protected route.",
    user: req.user,
  });
}

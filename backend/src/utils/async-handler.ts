import type { NextFunction, Request, RequestHandler, Response } from "express";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export function asyncHandler(handler: RouteHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

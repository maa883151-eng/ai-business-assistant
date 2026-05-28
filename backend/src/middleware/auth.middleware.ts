import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { authService } from "../services/auth.service.js";
import { AppError } from "../utils/app-error.js";
import { getCookie } from "../utils/cookies.js";

function getAccessToken(req: Parameters<RequestHandler>[0]) {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  return bearerToken ?? getCookie(req, env.JWT_COOKIE_NAME);
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = getAccessToken(req);

  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const userId = typeof decoded.sub === "string" ? decoded.sub : undefined;

    if (!userId) {
      next(new AppError("Invalid authentication token", 401));
      return;
    }

    req.user = await authService.getProfile(userId);
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

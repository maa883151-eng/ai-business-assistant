import type { Request, Response } from "express";
import { env } from "../config/env.js";

const accessTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookie(res: Response, accessToken: string) {
  res.cookie(env.JWT_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    maxAge: accessTokenMaxAgeMs,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(env.JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
  });
}

export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

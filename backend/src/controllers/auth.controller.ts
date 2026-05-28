import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";

export async function signupController(req: Request, res: Response) {
  const result = await authService.signup(req.body);

  setAuthCookie(res, result.accessToken);
  res.status(201).json(result);
}

export async function loginController(req: Request, res: Response) {
  const result = await authService.login(req.body);

  setAuthCookie(res, result.accessToken);
  res.status(200).json(result);
}

export function logoutController(_req: Request, res: Response) {
  clearAuthCookie(res);

  res.status(200).json({ message: "Logged out successfully" });
}

export async function meController(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const user = await authService.getProfile(userId);

  res.status(200).json({ user });
}

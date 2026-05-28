import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  signupController,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authRouter = Router();

authRouter.post("/signup", asyncHandler(signupController));
authRouter.post("/register", asyncHandler(signupController));
authRouter.post("/login", asyncHandler(loginController));
authRouter.post("/logout", asyncHandler(logoutController));
authRouter.get("/me", requireAuth, asyncHandler(meController));

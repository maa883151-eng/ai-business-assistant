import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import type { AuthUser } from "../types/auth.js";
import { AppError } from "../utils/app-error.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

function signAccessToken(userId: string) {
  const expiresIn = env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;
  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign({ sub: userId }, env.JWT_SECRET, options);
}

const userSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
} as const;

export const authService = {
  async signup(payload: unknown) {
    const data = signupSchema.parse(payload);
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
      },
      select: userSelect,
    });

    return { user, accessToken: signAccessToken(user.id) };
  },

  async login(payload: unknown) {
    const data = loginSchema.parse(payload);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken: signAccessToken(user.id),
    };
  },

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },
};

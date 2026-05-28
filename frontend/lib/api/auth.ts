import { apiRequest } from "@/lib/api/client";
import type { AuthResponse, AuthUser } from "@/types/app";

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  signup(input: SignupInput) {
    return apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  login(input: LoginInput) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  me() {
    return apiRequest<{ user: AuthUser }>("/auth/me", {
      method: "GET",
      auth: true,
    });
  },

  logout() {
    return apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
      auth: true,
    });
  },
};

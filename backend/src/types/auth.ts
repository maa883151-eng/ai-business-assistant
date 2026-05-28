import type { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

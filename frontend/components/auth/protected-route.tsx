"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/token-storage";
import type { AuthUser } from "@/types/app";

interface ProtectedRouteProps {
  children: (user: AuthUser) => ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadUser() {
      try {
        if (!tokenStorage.get()) {
          router.replace("/login");
          return;
        }

        const result = await authApi.me();

        if (isActive) {
          setUser(result.user);
        }
      } catch {
        tokenStorage.clear();
        router.replace("/login");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      isActive = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children(user)}</>;
}

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/token-storage";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } finally {
      tokenStorage.clear();
      router.replace("/login");
    }
  }

  return (
    <Button disabled={isLoggingOut} onClick={handleLogout} variant="secondary">
      <LogOut size={16} />
      {isLoggingOut ? "Signing out..." : "Logout"}
    </Button>
  );
}

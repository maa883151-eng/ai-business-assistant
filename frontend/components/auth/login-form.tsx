"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/token-storage";

interface LoginFormState {
  email: string;
  password: string;
}

const initialState: LoginFormState = {
  email: "",
  password: "",
};

function validateLoginForm(form: LoginFormState) {
  if (!form.email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (!form.password) {
    return "Password is required.";
  }

  return null;
}

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateLoginForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authApi.login(form);
      tokenStorage.set(result.accessToken);
      router.replace("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input
          className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="you@example.com"
          type="email"
          value={form.email}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <input
          className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Your password"
          type="password"
          value={form.password}
        />
      </label>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

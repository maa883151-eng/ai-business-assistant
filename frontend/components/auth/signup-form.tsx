"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/token-storage";

interface SignupFormState {
  fullName: string;
  email: string;
  password: string;
}

const initialState: SignupFormState = {
  fullName: "",
  email: "",
  password: "",
};

function validateSignupForm(form: SignupFormState) {
  if (form.fullName.trim().length < 2) {
    return "Full name must be at least 2 characters.";
  }

  if (!form.email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (form.password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateSignupForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authApi.signup({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      tokenStorage.set(result.accessToken);
      router.replace("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Full name
        <input
          className="rounded-md border px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-teal-700"
          onChange={(event) =>
            setForm((current) => ({ ...current, fullName: event.target.value }))
          }
          placeholder="Nayef Ahmed"
          value={form.fullName}
        />
      </label>
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
          placeholder="At least 8 characters"
          type="password"
          value={form.password}
        />
      </label>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

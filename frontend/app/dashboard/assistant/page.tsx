"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { Button } from "@/components/ui/button";
import { assistantApi } from "@/lib/api/assistant";

export default function AssistantPage() {
  const [businessType, setBusinessType] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("Professional and friendly");
  const [content, setContent] = useState("");
  const [provider, setProvider] = useState<"openai" | "template" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await assistantApi.generatePost({ businessType, goal, tone });
      setContent(result.content);
      setProvider(result.provider);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate content.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      {(user) => (
        <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
          <header className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link className="text-sm font-medium text-teal-700 hover:text-teal-800" href="/dashboard">
                Dashboard
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">AI Post Assistant</h1>
              <p className="mt-2 text-slate-600">Generate a social post draft for {user.fullName}.</p>
            </div>
            <LogoutButton />
          </header>

          <section className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Business Type
                <input
                  className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-700"
                  onChange={(event) => setBusinessType(event.target.value)}
                  placeholder="e.g. Digital marketing agency"
                  required
                  value={businessType}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Goal
                <textarea
                  className="min-h-28 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-700"
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="e.g. Announce our new monthly SEO package"
                  required
                  value={goal}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tone
                <input
                  className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-700"
                  onChange={(event) => setTone(event.target.value)}
                  placeholder="Professional and friendly"
                  value={tone}
                />
              </label>

              <div className="pt-2">
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Generating..." : "Generate Draft"}
                </Button>
              </div>
            </form>

            {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          </section>

          {content ? (
            <section className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-950">Generated Draft</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  Provider: {provider}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-slate-700">{content}</p>
            </section>
          ) : null}
        </main>
      )}
    </ProtectedRoute>
  );
}

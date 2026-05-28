import type { ReactNode } from "react";
import Link from "next/link";

interface AuthShellProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  footerText: string;
  footerHref: string;
  footerAction: string;
}

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
  footerText,
  footerHref,
  footerAction,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        {children}
        <p className="mt-5 text-sm text-slate-600">
          {footerText}{" "}
          <Link className="font-medium text-teal-700 hover:text-teal-800" href={footerHref}>
            {footerAction}
          </Link>
        </p>
      </section>
    </main>
  );
}

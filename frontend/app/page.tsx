import Link from "next/link";
import { ArrowRight, BarChart3, Bot, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Invoices", description: "Create and track clean client invoices.", icon: FileText },
  { title: "Clients", description: "Keep customer records organized.", icon: Users },
  { title: "AI Content", description: "Prepare social content workflows.", icon: Bot },
  { title: "Analytics", description: "See simple business performance signals.", icon: BarChart3 },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-700">
            AI Business Assistant
          </p>
          <h1 className="text-5xl font-bold leading-tight text-slate-950 md:text-6xl">
            Run everyday business operations from one calm workspace.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A SaaS foundation for invoices, clients, AI-assisted content, assistant workflows, and
            analytics built for small teams and solo operators.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">
                Open Dashboard <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border bg-white p-5 shadow-sm">
              <feature.icon className="mb-4 text-teal-700" size={24} />
              <h2 className="font-semibold text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

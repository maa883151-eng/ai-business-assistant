import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      description="Access your invoices, clients, content workflows, and analytics."
      eyebrow="Welcome back"
      footerAction="Create one"
      footerHref="/register"
      footerText="No account?"
      title="Sign in"
    >
      <LoginForm />
    </AuthShell>
  );
}

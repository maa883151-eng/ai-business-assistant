import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function RegisterPage() {
  return (
    <AuthShell
      description="Create a secure workspace for managing your business operations."
      eyebrow="Start your workspace"
      footerAction="Sign in"
      footerHref="/login"
      footerText="Already registered?"
      title="Create account"
    >
      <SignupForm />
    </AuthShell>
  );
}

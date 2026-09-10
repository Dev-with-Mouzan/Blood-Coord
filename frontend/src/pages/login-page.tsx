import { LoginForm } from "@/components/forms/login-form";
import { AuthShell } from "@/components/ui/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your matches and manage your profile.">
      <LoginForm />
    </AuthShell>
  );
}
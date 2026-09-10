import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { Reveal } from "@/components/ui/reveal";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <Reveal className="rounded-3xl border border-ink-900/10 bg-bone-50 p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink-950">
          You're not signed in
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-600">
          Sign in to see your profile and matches.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-blood-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blood-500"
        >
          Sign in
        </Link>
      </Reveal>
    );
  }

  return <>{children}</>;
}

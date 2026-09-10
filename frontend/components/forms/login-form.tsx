import { Suspense, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { authApi } from "@/lib/auth-client";
import { useAuth } from "@/components/auth/auth-context";
import { Button, Field, PasswordInput, TextInput } from "@/components/ui/form";
import { PhoneInput, toFullPhone } from "@/components/ui/phone-input";

type Role = "donor" | "requester";

function LoginFormInner() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const initialRole: Role = searchParams.get("role") === "requester" ? "requester" : "donor";
  const created = searchParams.get("created") === "1";
  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    // Canonical form (+92XXXXXXXXXX); the backend also falls back to legacy formats.
    const phone = toFullPhone(String(form.get("phone_number") ?? ""));
    const password = String(form.get("password") ?? "");

    try {
      const token =
        role === "donor"
          ? await authApi.loginDonor(phone, password)
          : await authApi.loginRequester(phone, password);

      login(role, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect phone number or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-1 rounded-full border border-ink-900/10 bg-ink-900/5 p-1">
        {(["donor", "requester"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
              (role === r ? "bg-bone-50 text-ink-950 shadow-sm" : "text-ink-500 hover:text-ink-800")
            }
          >
            {r === "donor" ? "Donor" : "Requester"}
          </button>
        ))}
      </div>

      {created ? (
        <div className="rounded-xl border border-emerald-600/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Account created. Sign in to continue.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error ? (
          <div className="rounded-xl border border-blood-600/20 bg-blood-50 px-4 py-3 text-sm text-blood-700">
            {error}
          </div>
        ) : null}

        <Field label="Phone number" htmlFor="phone_number">
          <PhoneInput
            id="phone_number"
            name="phone_number"
            required
            minLength={10}
            pattern="\d{10,}"
            title="Enter 10-digit national number, e.g. 3001234567"
            placeholder="3001234567"
            autoComplete="username"
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-ink-600">
        New here?{" "}
        <Link
          to={role === "donor" ? "/signup-donor" : "/signup-requester"}
          className="font-semibold text-blood-600 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}

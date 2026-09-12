import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/lib/auth-client";
import { Button, Field, PasswordInput, TextInput } from "@/components/ui/form";
import { PhoneInput, toFullPhone } from "@/components/ui/phone-input";
import { PasswordStrength } from "@/components/ui/password-strength";

export function RequesterSignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      // Assemble full number: fixed +92 prefix + national digits (min 10).
      phone_number: toFullPhone(String(form.get("phone_number") ?? "")),
      address: String(form.get("address") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    };

    try {
      await authApi.signupRequester(payload);
      navigate("/login?role=requester&created=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error ? (
        <div className="rounded-xl border border-blood-600/20 bg-blood-50 px-4 py-3 text-sm text-blood-700">
          {error}
        </div>
      ) : null}

      <Field label="Full name" htmlFor="name">
        <TextInput id="name" name="name" required minLength={2} maxLength={100} placeholder="e.g. Ali Raza" />
      </Field>

      <Field
        label="Phone number"
        htmlFor="phone_number"
        error="Phone number must be at least 10 digits."
      >
        <PhoneInput
          id="phone_number"
          name="phone_number"
          required
          minLength={10}
          pattern="\d{10,}"
          title="Enter 10-digit national number, e.g. 3001234567"
          placeholder="3001234567"
        />
      </Field>

      <Field label="Address" htmlFor="address">
        <TextInput id="address" name="address" required minLength={3} placeholder="e.g. habib caloni burewala" />
      </Field>

      <Field label="Password" htmlFor="password">
        <PasswordInput
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </Field>
      <PasswordStrength password={password} />

      <Button type="submit" fullWidth loading={loading}>
        Create requester account
      </Button>

      <p className="text-center text-sm text-ink-600">
        Already registered?{" "}
        <Link to="/login?role=requester" className="font-semibold text-blood-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

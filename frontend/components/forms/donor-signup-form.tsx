import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { authApi } from "@/lib/auth-client";
import { Button, Field, PasswordInput, Select, TextInput } from "@/components/ui/form";
import { PhoneInput, toFullPhone } from "@/components/ui/phone-input";
import { PasswordStrength } from "@/components/ui/password-strength";
import type { BloodGroup } from "@/types";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["male", "female", "other"];

export function DonorSignupForm() {
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
      age: Number(form.get("age")),
      gender: String(form.get("gender") ?? ""),
      blood_group: String(form.get("blood_group") ?? "") as BloodGroup,
      // Assemble full number: fixed +92 prefix + national digits (min 10).
      phone_number: toFullPhone(String(form.get("phone_number") ?? "")),
      address: String(form.get("address") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      weight: form.get("weight") ? Number(form.get("weight")) : undefined,
      health_status: String(form.get("health_status") ?? "").trim() || undefined,
    };

    try {
      await authApi.signupDonor(payload);
      navigate("/login?role=donor&created=1");
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
        <TextInput id="name" name="name" required minLength={2} maxLength={100} placeholder="e.g. Ayesha Khan" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Age" htmlFor="age">
          <TextInput id="age" name="age" type="number" required min={18} max={65} placeholder="22" />
        </Field>
        <Field label="Gender" htmlFor="gender">
          <Select id="gender" name="gender" required>
            <option value="">Select</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Blood group" htmlFor="blood_group">
        <Select id="blood_group" name="blood_group" required>
          <option value="">Select</option>
          {BLOOD_GROUPS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
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

      <Field label="Address / area" htmlFor="address">
        <TextInput
          id="address"
          name="address"
          required
          minLength={3}
          placeholder="Town, city, locality"
        />
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

      <details className="text-sm text-ink-600">
        <summary className="cursor-pointer font-medium text-ink-700">Optional medical details</summary>
        <div className="mt-4 flex flex-col gap-4">
          <Field label="Weight (kg)" htmlFor="weight">
            <TextInput id="weight" name="weight" type="number" min={30} max={300} placeholder="65" />
          </Field>
          <Field label="Health status" htmlFor="health_status">
            <TextInput id="health_status" name="health_status" placeholder="Optional" />
          </Field>
        </div>
      </details>

      <Button type="submit" fullWidth loading={loading}>
        Create donor profile
      </Button>

      <p className="text-center text-sm text-ink-600">
        Already registered?{" "}
        <Link to="/login?role=donor" className="font-semibold text-blood-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

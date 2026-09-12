import { Suspense, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { AuthShell } from "@/components/ui/auth-shell";
import { Button, Field, PasswordInput, TextInput } from "@/components/ui/form";
import { PhoneInput, toFullPhone } from "@/components/ui/phone-input";
import { authApi } from "@/lib/auth-client";

type Role = "donor" | "requester";
type Step = "phone" | "code" | "password" | "done";

function ForgotPasswordInner() {
  const [searchParams] = useSearchParams();
  const role: Role = searchParams.get("role") === "requester" ? "requester" : "donor";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fullPhone = toFullPhone(phone);
      if (role === "donor") {
        await authApi.forgotPasswordDonor(fullPhone);
      } else {
        await authApi.forgotPasswordRequester(fullPhone);
      }
      setPhone(fullPhone);
      setStep("code");
      setSuccess("Check your terminal for the reset code.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (role === "donor") {
        await authApi.verifyResetCodeDonor(phone, code);
      } else {
        await authApi.verifyResetCodeRequester(phone, code);
      }
      setStep("password");
      setSuccess(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (role === "donor") {
        await authApi.resetPasswordDonor(phone, code, newPassword);
      } else {
        await authApi.resetPasswordRequester(phone, code, newPassword);
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft size={16} weight="bold" />
        Back to login
      </Link>

      {step === "phone" && (
        <form onSubmit={handleSendCode} className="flex flex-col gap-5">
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
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>

          <Button type="submit" fullWidth loading={loading}>
            Send reset code
          </Button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
          {success ? (
            <div className="rounded-xl border border-emerald-600/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-blood-600/20 bg-blood-50 px-4 py-3 text-sm text-blood-700">
              {error}
            </div>
          ) : null}

          <Field label="Verification code" htmlFor="code">
            <TextInput
              id="code"
              name="code"
              required
              pattern="\d{6}"
              maxLength={6}
              placeholder="000000"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>

          <Button type="submit" fullWidth loading={loading}>
            Verify code
          </Button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          {error ? (
            <div className="rounded-xl border border-blood-600/20 bg-blood-50 px-4 py-3 text-sm text-blood-700">
              {error}
            </div>
          ) : null}

          <Field label="New password" htmlFor="new_password">
            <PasswordInput
              id="new_password"
              name="new_password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>

          <Button type="submit" fullWidth loading={loading}>
            Reset password
          </Button>
        </form>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle size={48} weight="fill" className="text-emerald-600" />
          <p className="text-sm text-ink-600">Password reset successfully.</p>
          <Link
            to="/login"
            className="rounded-full bg-blood-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blood-500"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your phone number and we'll send you a verification code."
    >
      <Suspense fallback={null}>
        <ForgotPasswordInner />
      </Suspense>
    </AuthShell>
  );
}

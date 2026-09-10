import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

import type {
  ButtonHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-left text-sm font-medium text-ink-800">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
      {error ? <p className="text-left text-sm text-blood-600">{error}</p> : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-ink-900/15 bg-bone-50 px-4 py-2 text-base text-ink-900 placeholder:text-ink-400 transition-colors focus:border-blood-500 focus:outline-none focus:ring-2 focus:ring-blood-500/20";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${inputBase} pr-12 ${props.className ?? ""}`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-400 transition-colors hover:text-ink-700"
      >
        {visible ? <EyeSlash size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputBase} ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}) {
  const styles = {
    primary:
      "bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-blood-500",
    secondary: "bg-ink-950 text-bone-50 hover:bg-ink-800",
    ghost:
      "border border-ink-900/15 bg-bone-50 text-ink-900 hover:border-ink-900/30 hover:bg-ink-900/5",
  }[variant];

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 " +
        (fullWidth ? "w-full " : "") +
        styles +
        " " +
        (className ?? "")
      }
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

import type { InputHTMLAttributes } from "react";

/**
 * Pakistan-only phone entry: a fixed +92 prefix sits outside the input;
 * the user types only the national number (min 10 digits).
 * The form submits the full E.164 number (+92XXXXXXXXXX) under `name`.
 */
export function PhoneInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-ink-900/15 bg-bone-50 transition-colors focus-within:border-blood-500 focus-within:ring-2 focus-within:ring-blood-500/20">
      <span
        aria-hidden="true"
        className="flex select-none items-center border-r border-ink-900/15 bg-ink-900/5 px-3.5 text-sm font-semibold text-ink-800"
      >
        +92
      </span>
      <input
        type="tel"
        inputMode="numeric"
        {...props}
        className={`w-full min-w-0 bg-transparent px-4 py-2 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none ${className ?? ""}`}
      />
    </div>
  );
}

/** Convert what the user typed into the full E.164 number for submission. */
export function toFullPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  // Tolerate users pasting a leading 0 or an existing +92 prefix.
  const national = digits.replace(/^(92|0)/, "");
  return `+92${national}`;
}

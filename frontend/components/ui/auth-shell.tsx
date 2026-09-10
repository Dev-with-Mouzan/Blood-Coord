import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Drop, ArrowLeft } from "@phosphor-icons/react/ssr";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-bone-100">
      <div className="container-shell grid min-h-[100dvh] items-center justify-items-center py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-950"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to home
          </Link>

          <div className="flex items-center justify-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <Drop size={22} weight="fill" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink-950">
              Blood<span className="text-blood-600">Coord</span>
            </span>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-ink-900/10 bg-bone-50 p-8 text-center shadow-[0_24px_50px_-30px_rgba(26,20,16,0.35)]">
            {eyebrow ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blood-700">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-950">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-600">{subtitle}</p>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

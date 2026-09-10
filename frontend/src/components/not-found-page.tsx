import { Link } from "react-router-dom";
import { Drop } from "@phosphor-icons/react";

export function NotFoundPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-bone-100 px-6">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center" aria-label="Blood Coord home">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <Drop size={24} weight="fill" />
          </span>
        </Link>
        <h1 className="mt-8 font-display text-xs font-semibold uppercase tracking-[0.2em] text-blood-600">
          404
        </h1>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-950">
          This page isn't here.
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-ink-600">
          The page you're looking for may have moved or never existed. Let's get
          you back somewhere useful.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-blood-600 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors hover:bg-blood-500"
          >
            Back to home
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-ink-900/15 bg-bone-50 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900/30"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

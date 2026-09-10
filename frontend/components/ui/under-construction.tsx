import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react/ssr";

export function UnderConstruction({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-[100dvh] bg-bone-50">
      <div className="container-shell flex min-h-[100dvh] flex-col items-start justify-center py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blood-700">
          Coming soon
        </span>
        <h1 className="mt-6 text-balance font-display text-4xl leading-[1.05] tracking-tight text-ink-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-600">
          {description}
        </p>
        <Link
          to="/"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-bone-50 transition-colors hover:bg-ink-800"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to home
        </Link>
      </div>
    </main>
  );
}

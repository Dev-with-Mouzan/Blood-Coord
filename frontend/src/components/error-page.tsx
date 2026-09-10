import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Drop } from "@phosphor-icons/react";

export function ErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  let title = "Something went wrong.";
  let message = "We hit an unexpected error on our side. Try again.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} — ${error.statusText}`;
    message = error.data?.message ?? "Page not found.";
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-bone-100 px-6">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <Drop size={24} weight="fill" />
        </span>
        <h2 className="mt-8 font-display text-3xl font-semibold tracking-tight text-ink-950">
          {title}
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-ink-600">
          {message}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-blood-600 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors hover:bg-blood-500"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Drop, SignOut } from "@phosphor-icons/react";
import { useAuth } from "@/components/auth/auth-context";

export function DashboardShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-[100dvh] bg-bone-100">
      <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-bone-50/80 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link to={role === "requester" ? "/dashboard/requester" : "/dashboard/donor"} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <Drop size={20} weight="fill" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink-950">
              Blood<span className="text-blood-600">Coord</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-ink-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-500 sm:inline-flex">
              {role ?? "—"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-bone-50 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900/30 hover:bg-ink-900/5"
            >
              <SignOut size={16} weight="bold" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container-shell py-10 md:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
          {title}
        </h1>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

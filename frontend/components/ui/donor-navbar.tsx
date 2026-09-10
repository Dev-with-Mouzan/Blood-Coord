import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { useState } from "react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard/donor" },
  { label: "My Profile", href: "/dashboard/donor/profile" },
  { label: "Blood Requests", href: "/dashboard/donor/requests" },
  { label: "Donation History", href: "/dashboard/donor/history" },
];

export function DonorNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const donor = user && "blood_group" in user ? user : null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-bone-50">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.7c3.2 4.4 6 8 6 11.4a6 6 0 1 1-12 0c0-3.4 2.8-7 6-11.4Z" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-950">
            Blood<span className="text-blood-600">Coord</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blood-600 text-white"
                    : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {donor && (
            <span className="rounded-full border border-blood-200 bg-blood-50 px-3 py-1.5 text-xs font-semibold text-blood-700">
              {donor.blood_group}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-ink-900/15 bg-bone-50 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900/30 hover:bg-ink-900/5"
          >
            Sign out
          </button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-900/5 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-900/10 bg-bone-50 md:hidden">
          <div className="container-shell flex flex-col gap-1 py-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
 to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium ${
                    isActive
                      ? "bg-blood-600 text-white"
                      : "text-ink-600 hover:bg-ink-900/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-900/10 pt-4">
              {donor && (
                <span className="rounded-full border border-blood-200 bg-blood-50 px-3 py-2 text-center text-sm font-semibold text-blood-700">
                  {donor.blood_group}
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-ink-900/15 bg-bone-50 px-4 py-3 text-center text-sm font-semibold text-ink-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drop, List, X, Bell } from "@phosphor-icons/react";
import { getToken } from "@/lib/auth-client";

const navLinks = [
  { label: "Dashboard", href: "/dashboard/requester" },
  { label: "My Requests", href: "/dashboard/requester/requests" },
  { label: "Messages", href: "/dashboard/requester/chats" },
  { label: "Profile", href: "/dashboard/requester/profile" },
];

export function RequesterNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const requester = user && "address" in user && !("blood_group" in user) ? user : null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-bone-50/10 bg-ink-950/95 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between md:h-[68px]">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Blood Coord home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <Drop size={20} weight="fill" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-bone-50">
            Blood<span className="text-blood-400">Coord</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-bone-50/10 text-bone-50"
                    : "text-bone-200 hover:bg-bone-50/10 hover:text-bone-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => navigate("/dashboard/requester")}
            className="relative rounded-full p-2 text-bone-200 transition-colors hover:bg-bone-50/10 hover:text-bone-50"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-bone-50/20 px-4 py-2 text-sm font-semibold text-bone-200 transition-colors hover:border-bone-50/40 hover:text-bone-50"
          >
            Sign out
          </button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-bone-50 hover:bg-bone-50/10 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-bone-50/10 bg-ink-950/90 backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            <div className="container-shell flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-3 text-base font-medium ${
                      isActive
                        ? "bg-bone-50/10 text-bone-50"
                        : "text-bone-200 hover:bg-bone-50/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 flex flex-col gap-2 border-t border-bone-50/10 pt-4">
                <button
                  type="button"
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="rounded-full border border-bone-50/20 px-4 py-3 text-center text-sm font-semibold text-bone-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/auth-context";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drop, List, X, Bell, UserCircle } from "@phosphor-icons/react";
import { getToken } from "@/lib/auth-client";
import type { Notification } from "@/types";

const navLinks = [
  { label: "Dashboard", href: "/dashboard/requester" },
  { label: "My Requests", href: "/dashboard/requester/requests" },
  { label: "Messages", href: "/dashboard/requester/chats" },
];

export function RequesterNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const requester = user && "address" in user && !("blood_group" in user) ? user : null;

  const fetchUnreadCount = () => {
    const token = getToken("requester");
    if (!token) return;
    fetch("/api/v1/requesters/me/notifications/unread-count", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
  };

  const fetchNotifications = () => {
    const token = getToken("requester");
    if (!token) return;
    fetch("/api/v1/requesters/me/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setNotifications(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowNotifications((v) => !v);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const markAsRead = async (id: number) => {
    const token = getToken("requester");
    if (!token) return;
    try {
      await fetch(`/api/v1/requesters/me/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    const token = getToken("requester");
    if (!token) return;
    try {
      await fetch("/api/v1/requesters/me/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

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
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleBellClick}
              className="relative rounded-full p-2 text-bone-200 transition-colors hover:bg-bone-50/10 hover:text-bone-50"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blood-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-ink-900/10 bg-bone-50 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-ink-900/10 px-4 py-3">
                    <h3 className="font-display text-sm font-semibold text-ink-950">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-medium text-blood-600 hover:text-blood-500"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-ink-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => !n.is_read && markAsRead(n.id)}
                          className={`cursor-pointer border-b border-ink-900/5 px-4 py-3 transition-colors hover:bg-ink-900/5 ${
                            !n.is_read ? "bg-blood-50/50" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-ink-900">{n.title}</p>
                          <p className="mt-0.5 text-xs text-ink-500 line-clamp-2">{n.message}</p>
                          <p className="mt-1 text-[10px] text-ink-400">
                            {new Date(n.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/requester/profile")}
            className="rounded-full p-2 text-bone-200 transition-colors hover:bg-bone-50/10 hover:text-bone-50"
            aria-label="Profile"
          >
            <UserCircle size={24} weight="duotone" />
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
                  onClick={() => { navigate("/dashboard/requester/profile"); setOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-full border border-bone-50/20 px-4 py-3 text-sm font-semibold text-bone-50"
                >
                  <UserCircle size={16} weight="duotone" />
                  Profile
                </button>
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

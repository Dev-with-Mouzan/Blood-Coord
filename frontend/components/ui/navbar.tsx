import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Drop, List, X } from "@phosphor-icons/react";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("top");
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight;
      setPastHero(window.scrollY > heroBottom - 68);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    navLinks.forEach((link) => {
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          let best = "";
          let bestRatio = -1;
          visible.forEach((ratio, secId) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = secId;
            }
          });
          setActive(best);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b transition-colors duration-300 ${
        pastHero
          ? "border-bone-50/10 bg-ink-950/95 backdrop-blur-xl"
          : "border-bone-50/10 bg-ink-950/70 shadow-[0_1px_24px_rgba(0,0,0,0.4)] backdrop-blur-2xl backdrop-saturate-150"
      }`}
    >
      <div className="container-shell flex h-16 items-center justify-between md:h-[68px]">
        <Link
          to="#top"
          className="flex items-center gap-2.5"
          aria-label="Blood Coord home"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <Drop size={20} weight="fill" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-bone-50">
            Blood<span className="text-blood-400">Coord</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <Link
                key={link.href}
                href={link.href}
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

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-bone-200 transition-colors hover:text-bone-50"
          >
            Sign in
          </Link>
          <Link
            href="/signup-donor"
            className="rounded-full bg-blood-600 px-4 py-2 text-sm font-semibold text-bone-50 transition-colors hover:bg-blood-500 active:translate-y-[1px]"
          >
            Become a donor
          </Link>
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
            className={`overflow-hidden border-t border-bone-50/10 bg-ink-950/90 backdrop-blur-xl md:hidden ${
              pastHero ? "bg-ink-950/95" : ""
            }`}
            aria-label="Mobile"
          >
            <div className="container-shell flex flex-col gap-1 py-4">
              {navLinks.map((link) => {
                const isActive = active === link.href.slice(1);
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
                <Link
 to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-bone-50/20 px-4 py-3 text-center text-sm font-semibold text-bone-50"
                >
                  Sign in
                </Link>
                <Link
 to="/signup-donor"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-blood-600 px-4 py-3 text-center text-sm font-semibold text-bone-50"
                >
                  Become a donor
                </Link>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

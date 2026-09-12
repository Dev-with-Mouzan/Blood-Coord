import { Link } from "react-router-dom";
import { Drop } from "@phosphor-icons/react";

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "For donors", href: "/signup-donor" },
      { label: "For requesters", href: "/signup-requester" },
      { label: "Browse requests", href: "/search" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "The problem", href: "#problem" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Donation guidelines", href: "#" },
      { label: "Eligibility checks", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-bone-50">
      <div className="container-shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="max-w-sm">
            <Link to="#top" className="flex items-center gap-2.5" aria-label="Blood Coord home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                <Drop size={20} weight="fill" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-ink-950">
                Blood<span className="text-blood-600">Coord</span>
              </span>
            </Link>
            <p className="mt-5 text-pretty leading-relaxed text-ink-600">
              A real-time platform connecting blood donors with the people who
              need them — by blood group, eligibility, and location. Private,
              transparent, and built for the moment it matters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-950">
                  {col.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-ink-600 transition-colors hover:text-ink-950"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-900/10 pt-7 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Blood Coord. Giving isn't transactional — it's a system.</p>
          <div className="flex items-center gap-5">
            <Link to="#" className="transition-colors hover:text-ink-900">
              Privacy
            </Link>
            <Link to="#" className="transition-colors hover:text-ink-900">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

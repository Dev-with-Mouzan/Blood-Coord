import { Link } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  UsersThree,
  Timer,
} from "@phosphor-icons/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function DropMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.7c3.2 4.4 6 8 6 11.4a6 6 0 1 1-12 0c0-3.4 2.8-7 6-11.4Z" />
    </svg>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-ink-950 py-24"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/45 to-ink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(62%_56%_at_50%_30%,rgba(163,42,42,0.32),transparent_72%)]" />
        <div className="grid-dots absolute inset-0 opacity-25 [mask-image:radial-gradient(70%_60%_at_50%_28%,black,transparent)]" />
      </div>

      <motion.div
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
        transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
        className="container-shell relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          variants={reduce ? undefined : fadeUp}
          className="inline-flex items-center gap-2.5 rounded-full border border-bone-50/15 bg-bone-50/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-bone-100 backdrop-blur-md"
        >
          <span className="size-1.5 rounded-full bg-blood-400" aria-hidden="true" />
          Real-time donor matching
        </motion.span>

        <motion.h1
          variants={reduce ? undefined : fadeUp}
          className="mt-7 max-w-[15ch] text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight text-bone-50 sm:text-6xl lg:text-7xl"
        >
          Blood when it&rsquo;s needed,{" "}
          <em className="font-bold not-italic text-bone-50">matched in minutes.</em>
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="mt-6 max-w-[54ch] text-pretty text-lg leading-relaxed text-bone-200/90"
        >
          Connects verified donors with people who need them — matched by blood
          group, eligibility, and location. Fast.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/signup-donor"
            className="group inline-flex items-center gap-2 rounded-full bg-blood-600 px-7 py-3.5 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_44px_-12px_rgba(163,42,42,0.75)] transition-colors hover:bg-blood-500 active:translate-y-[1px]"
          >
            Become a donor
            <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/signup-requester"
            className="inline-flex items-center gap-2 rounded-full border border-bone-50/20 bg-bone-50/10 px-7 py-3.5 text-base font-semibold text-bone-50 backdrop-blur-md transition-colors hover:border-bone-50/35 hover:bg-bone-50/15"
          >
            Request blood
          </Link>
        </motion.div>

        <motion.ul
          variants={reduce ? undefined : fadeUp}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <li className="flex items-center gap-2.5 rounded-2xl border border-bone-50/15 bg-bone-50/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood-500/25 text-blood-400">
              <DropMark />
            </span>
            <span className="text-left">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-bone-50">
                O+ match found
                <CheckCircle size={15} weight="fill" className="text-emerald-400" />
              </span>
              <span className="block text-xs text-bone-200/80">2.3 km away · available now</span>
            </span>
          </li>
          <li className="flex items-center gap-2.5 rounded-2xl border border-bone-50/15 bg-bone-50/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood-500/25 text-blood-400">
              <UsersThree size={18} weight="fill" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-bone-50">48,200+ verified donors</span>
              <span className="block text-xs text-bone-200/80">ready on the network</span>
            </span>
          </li>
          <li className="flex items-center gap-2.5 rounded-2xl border border-bone-50/15 bg-bone-50/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood-500/25 text-blood-400">
              <Timer size={18} weight="fill" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-bone-50">&lt; 5 min to first match</span>
              <span className="block text-xs text-bone-200/80">median response time</span>
            </span>
          </li>
        </motion.ul>
      </motion.div>
    </section>
  );
}
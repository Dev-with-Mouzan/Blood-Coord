import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/reveal";
import { Drop } from "@phosphor-icons/react";

export function CTA() {
  return (
    <section className="bg-bone-50">
      <div className="container-shell py-24 md:py-28">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-8 py-16 text-center md:px-16 md:py-20">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <img
              src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/60 to-ink-950/85" />
            <div className="grid-dots absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />
          </div>
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blood-500/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blood-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blood-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <Drop size={28} weight="fill" />
            </span>
            <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl leading-[1.08] tracking-tight text-bone-50 sm:text-4xl md:text-5xl">
              The next person who needs a match could be relying on you.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-300">
              Register once. When a compatible request comes in near you, you'll
              be in the loop — not on a cold-call list.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup-donor"
                className="inline-flex items-center gap-2 rounded-full bg-blood-600 px-7 py-3.5 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors hover:bg-blood-500 active:translate-y-[1px]"
              >
                Become a donor
              </Link>
              <Link
                to="/signup-requester"
                className="inline-flex items-center gap-2 rounded-full border border-bone-50/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-bone-50 backdrop-blur transition-colors hover:bg-white/10"
              >
                Request blood
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

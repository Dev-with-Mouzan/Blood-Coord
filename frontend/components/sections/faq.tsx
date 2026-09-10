import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    q: "Is it free for donors and requesters?",
    a: "Yes. Blood Coord is built to connect people, not to charge them for it. Both donors and requesters use the platform for free.",
  },
  {
    q: "Are donors verified before they're matched?",
    a: "Eligibility and availability are tracked on every donor profile. Requesters only ever connect with donors who are marked eligible and currently available to donate.",
  },
  {
    q: "Will my phone number be shared publicly?",
    a: "No. Communication happens inside the app. Numbers stay private until both the requester and donor explicitly agree to share them.",
  },
  {
    q: "How are donors matched to requests?",
    a: "The engine prioritises blood-group compatibility first, then filters for donors who are eligible and within a reasonable distance of the request's location.",
  },
  {
    q: "What if I can't donate right now?",
    a: "Set your availability to off and you'll be skipped automatically. You can turn it back on whenever you're within your healthy donation window.",
  },
  {
    q: "Which hospitals and blood banks can use this?",
    a: "Any hospital, blood bank, or individual requester can create a request. Blood Coord works alongside the existing blood supply system to fill urgent gaps.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="bg-bone-100">
      <div className="container-shell grid gap-12 py-24 md:py-32 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blood-700">
            FAQ
          </span>
          <h2 className="mt-5 text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink-950 sm:text-4xl">
            Questions, answered.
          </h2>
          <p className="mt-5 max-w-md text-pretty leading-relaxed text-ink-600">
            The basics, in plain language. If something's still unclear, get in
            touch and we'll help you sort it out.
          </p>
        </Reveal>

        <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-medium tracking-tight text-ink-900">
                    {item.q}
                  </span>
                  <span
                    className={
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all " +
                      (open
                        ? "rotate-45 border-blood-600 bg-blood-600 text-white"
                        : "border-ink-900/15 text-ink-600")
                    }
                  >
                    <Plus size={16} weight="bold" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-prose pb-6 pr-8 leading-relaxed text-ink-600">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/ui/reveal";
import {
  UserFocus,
  Hourglass,
  PhoneCall,
  Question,
} from "@phosphor-icons/react/ssr";

const problems = [
  {
    icon: Hourglass,
    title: "Waiting costs lives",
    body: "When a family needs O− blood across town, every hour they spend calling people, posting in groups, and begging is time a patient doesn't have.",
  },
  {
    icon: Question,
    title: "The right donor is hiding",
    body: "Thousands of willing donors exist — but no one knows who's eligible, available, or nearby when an emergency hits. The match is pure luck.",
  },
  {
    icon: PhoneCall,
    title: "Cold calls and spam",
    body: "Requesters scrape numbers off social media and spam strangers. Donors get hounded by people they've never met, with no way to opt out.",
  },
  {
    icon: UserFocus,
    title: "No privacy, no trust",
    body: "Phone numbers get passed around and shared. Donors can't control who reaches them, and requesters can't tell who's actually eligible to give.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="bg-bone-50">
      <div className="container-shell py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blood-700">
                The problem
              </span>
              <h2 className="mt-5 text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
                When the blood supply runs dry, the system falls apart.
              </h2>
              <p className="mt-6 max-w-[44ch] text-pretty text-lg leading-relaxed text-ink-600">
                The people who want to give, and the people who desperately need
                it, are separated by three broken links: awareness, verification,
                and trust.
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <ol>
              {problems.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <li className="group relative overflow-hidden border-t border-ink-900/10 py-8 transition-colors hover:bg-bone-100/70 md:py-10">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-5 right-2 select-none font-display text-[7rem] font-semibold leading-none tracking-tight text-ink-950/[0.05] transition-colors group-hover:text-blood-600/10 md:-top-7"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative flex flex-col gap-4 md:flex-row md:gap-8">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-blood-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <p.icon size={24} weight="duotone" />
                      </span>
                      <div>
                        <h3 className="flex flex-wrap items-center gap-x-3 font-display text-xl font-semibold tracking-tight text-ink-950">
                          {p.title}
                          <span className="font-mono text-xs font-semibold tracking-widest text-ink-400">
                            0{i + 1}
                          </span>
                        </h3>
                        <p className="mt-2 max-w-[56ch] text-pretty leading-relaxed text-ink-600">
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
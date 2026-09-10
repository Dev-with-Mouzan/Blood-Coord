import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/reveal";
import {
  MagnifyingGlass,
  ShieldCheck,
  Clock,
  ChatCircleDots,
} from "@phosphor-icons/react/ssr";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified, eligible donors only",
    body: "Every donor goes through eligibility checks, so requesters never reach someone who can't actually donate.",
  },
  {
    icon: MagnifyingGlass,
    title: "Matched by blood group & location",
    body: "The engine filters by compatibility, availability, and how close a donor is — no manual searching.",
  },
  {
    icon: ChatCircleDots,
    title: "Private in-app chat",
    body: "Requesters and donors talk inside the platform. Phone numbers stay hidden until both sides agree.",
  },
  {
    icon: Clock,
    title: "Recorded response times",
    body: "Track how quickly every request gets a donor, and close the loop once blood is received.",
  },
];

export function Solution() {
  return (
    <section id="solution" className="bg-bone-100">
      <div className="container-shell grid gap-14 py-24 md:py-32 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden rounded-[1.75rem] border border-ink-900/10">
            <img
              src="https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&w=1000&q=80"
              alt="Healthcare worker drawing blood from a donor's arm"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -left-3 -top-3 rounded-2xl border border-ink-900/10 bg-bone-50 px-5 py-4 shadow-[0_20px_40px_-20px_rgba(26,20,16,0.35)] sm:-left-6">
            <p className="font-display text-2xl font-semibold text-blood-600">Live</p>
            <p className="text-xs text-ink-500">Donor availability tracked in real time</p>
          </div>
        </div>

        <div>
          <Reveal className="mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blood-700">
              The solution
            </span>
            <h2 className="mt-5 text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
              One platform keeping donors and requesters connected.
            </h2>
            <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-ink-600">
              Blood Coord replaces the group chats, the cold calls, and the
              guessing game with a single, private pipeline from "we need blood"
              to "blood is on its way."
            </p>
          </Reveal>

          <div className="flex flex-col gap-0">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="flex gap-5 border-t border-ink-900/10 py-6 first:border-t-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blood-100 text-blood-600">
                    <f.icon size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-pretty leading-relaxed text-ink-600">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <Link
              to="/signup-donor"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-bone-50 transition-colors hover:bg-ink-800 active:translate-y-[1px]"
            >
              Become a donor
            </Link>          </Reveal>
        </div>
      </div>
    </section>
  );
}

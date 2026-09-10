import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    step: "01",
    title: "Create your profile",
    body: "Donors list their blood group, weight, and location. Requesters register with what they need.",
  },
  {
    step: "02",
    title: "We match you instantly",
    body: "A new request is matched against eligible, available donors nearby — by blood-group compatibility first.",
  },
  {
    step: "03",
    title: "Connect privately",
    body: "Requesters and matched donors talk in-app. Numbers stay hidden until both sides are comfortable.",
  },
  {
    step: "04",
    title: "Give, receive, close the loop",
    body: "The donation happens, the request is marked fulfilled, and the donor is scheduled out for the next window.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bone-50">
      <div className="container-shell py-24 md:py-32">
        <Reveal className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blood-700">
            How it works
          </span>
          <h2 className="text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
            From request to match in four clear steps.
          </h2>
        </Reveal>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const dark = i % 2 === 0;
            return (
              <Reveal key={s.step} delay={i * 0.07} className="h-full">
                <li
                  className={
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-7 transition-colors " +
                    (dark
                      ? "bg-ink-950 hover:bg-ink-900"
                      : "border border-ink-900/10 bg-bone-50 hover:border-blood-600/30")
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      "pointer-events-none absolute -top-4 right-1 select-none font-display text-[6rem] font-semibold leading-none tracking-tight transition-colors " +
                      (dark ? "text-bone-50/[0.07]" : "text-ink-950/[0.05]")
                    }
                  >
                    {s.step}
                  </span>
                  <div className="relative flex flex-col gap-3">
                    <span
                      className={
                        "font-mono text-xs font-semibold tracking-widest " +
                        (dark ? "text-blood-400" : "text-blood-600")
                      }
                    >
                      Step {s.step}
                    </span>
                    <h3
                      className={
                        "font-display text-lg font-semibold tracking-tight " +
                        (dark ? "text-bone-50" : "text-ink-950")
                      }
                    >
                      {s.title}
                    </h3>
                    <p
                      className={
                        "text-pretty text-sm leading-relaxed " +
                        (dark ? "text-bone-200/75" : "text-ink-600")
                      }
                    >
                      {s.body}
                    </p>
                  </div>
                  <span
                    className={
                      "mt-auto block h-1 w-8 rounded-full " +
                      (dark ? "bg-blood-500/80" : "bg-blood-600/50")
                    }
                  />
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
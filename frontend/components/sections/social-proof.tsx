import { Reveal } from "@/components/ui/reveal";

const stats = [
  { value: "12k+", label: "Registered donors, verified & eligible" },
  { value: "3,400", label: "Requests matched to a donor" },
  { value: "18", label: "Minutes avg. time to a match" },
  { value: "96%", label: "Requests fulfilled within 48 hours" },
];

export function SocialProof() {
  return (
    <section className="border-y border-ink-900/10 bg-bone-100">
      <div className="container-shell py-16 md:py-20">
        <Reveal className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-pretty text-lg font-medium text-ink-800">
            Serving an entire region's blood supply network — donors, hospitals,
            and families who couldn't wait.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div className="border-l-2 border-blood-500 pl-5">
                <p className="font-display text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-ink-600">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

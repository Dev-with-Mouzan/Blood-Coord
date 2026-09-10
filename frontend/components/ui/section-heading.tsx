import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignCls =
    align === "center" ? "mx-auto text-center items-center" : "text-left items-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-5 ${alignCls}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blood-700">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance font-display text-3xl leading-[1.08] tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-[58ch] text-pretty text-base leading-relaxed text-ink-600 md:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

"use client";

const typeScale = [
  {
    label: "H1",
    example: "GoAbroad Brand",
    classes: "text-4xl md:text-5xl font-bold leading-tight",
    mono: "text-4xl md:text-5xl font-bold leading-tight",
    color: "text-neutral-800",
  },
  {
    label: "H2",
    example: "Section Heading",
    classes: "text-3xl font-bold tracking-tight",
    mono: "text-3xl font-bold tracking-tight",
    color: "text-neutral-800",
  },
  {
    label: "H3",
    example: "Subsection or card title",
    classes: "text-lg font-semibold",
    mono: "text-lg font-semibold",
    color: "text-neutral-800",
  },
  {
    label: "Body lg",
    example: "Body text at standard reading size. Used for section introductions and primary descriptions.",
    classes: "text-base leading-relaxed",
    mono: "text-base leading-relaxed",
    color: "text-slate-600",
  },
  {
    label: "Body sm",
    example: "Smaller body text for secondary descriptions, captions, and supporting detail within cards or list items.",
    classes: "text-sm leading-relaxed",
    mono: "text-sm leading-relaxed",
    color: "text-slate-500",
  },
  {
    label: "Eyebrow",
    example: "Section Label",
    classes: "text-sm font-semibold uppercase tracking-widest",
    mono: "text-sm font-semibold uppercase tracking-widest",
    color: "text-slate-500",
  },
  {
    label: "Mono",
    example: "font-mono text-xs",
    classes: "font-mono text-xs",
    mono: "font-mono text-xs",
    color: "text-slate-500",
  },
] as const;

export default function BrandTypography() {
  return (
    <section
      id="typography"
      aria-labelledby="typography-heading"
      className="scroll-mt-16 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2
            id="typography-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Type Scale
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            All type styles use the system sans-serif (Geist Sans) with Tailwind utility classes. No custom font sizes outside the scale below.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {typeScale.map(({ label, example, classes, mono, color }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center gap-4 py-6"
            >
              <div className="w-20 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`${classes} ${color} block truncate`}>{example}</span>
              </div>
              <div className="shrink-0">
                <code className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">{mono}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

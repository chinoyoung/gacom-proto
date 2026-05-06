"use client";

const rhythmBands = [
  { label: "bg-slate-100", note: "Hero sections — opening, high-contrast entry point", twClass: "bg-slate-100" },
  { label: "bg-white", note: "Primary content sections — default surface", twClass: "bg-white border border-slate-200" },
  { label: "bg-slate-50", note: "Alternate content sections — subtle visual rest", twClass: "bg-slate-50" },
  { label: "bg-cobalt-500", note: "Feature/accent section — one per page, mid-page", twClass: "bg-cobalt-500" },
  { label: "bg-cobalt-700", note: "Closing CTA section — always last, darkest tone", twClass: "bg-cobalt-700" },
] as const;

const containers = [
  {
    token: "max-w-7xl mx-auto",
    use: "Hero sections and full-width grid layouts",
  },
  {
    token: "max-w-5xl mx-auto",
    use: "Standard content sections — most common",
  },
  {
    token: "max-w-2xl mx-auto",
    use: "CTA sections, centered prose blocks",
  },
] as const;

export default function BrandSpacing() {
  return (
    <section
      id="spacing"
      aria-labelledby="spacing-heading"
      className="scroll-mt-16 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2
            id="spacing-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Spacing &amp; Layout
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Consistent containers and section padding create the vertical rhythm that makes the design feel cohesive across every page.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: containers and padding */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Containers</h3>
              <div className="flex flex-col gap-4">
                {containers.map(({ token, use }) => (
                  <div key={token} className="flex flex-col gap-1">
                    <code className="font-mono text-xs text-cobalt-600 bg-cobalt-500/8 px-2 py-1 rounded self-start">{token}</code>
                    <p className="text-sm text-slate-500 leading-relaxed">{use}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Section Padding</h3>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <code className="font-mono text-xs text-cobalt-600 leading-relaxed block">
                  px-4 sm:px-6 md:px-12 lg:px-20
                </code>
                <code className="font-mono text-xs text-cobalt-600 leading-relaxed block mt-1">
                  py-16 md:py-24
                </code>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Apply to every <code className="font-mono">{"<section>"}</code> element. Do not reduce below <code className="font-mono">py-16</code> on mobile.
                </p>
              </div>
              <div className="mt-4 bg-slate-50 rounded-lg p-5 border border-slate-200">
                <code className="font-mono text-xs text-cobalt-600 block">scroll-mt-16</code>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Add to every section targeted by the in-page nav to offset the sticky nav height (56px + 8px gap).
                </p>
              </div>
            </div>
          </div>

          {/* Right: section rhythm */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Section Rhythm</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Alternate backgrounds top-to-bottom in this order. The cobalt-500 accent and cobalt-700 CTA each appear once per page.
            </p>
            <div className="flex flex-col gap-3">
              {rhythmBands.map(({ label, note, twClass }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`h-12 w-24 shrink-0 rounded-md ${twClass}`} />
                  <div>
                    <code className="font-mono text-xs text-slate-600">{label}</code>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

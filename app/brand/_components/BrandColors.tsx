"use client";

const palettes = [
  {
    name: "Cobalt",
    usage: "Primary brand / CTAs / dark sections",
    swatches: [
      { token: "cobalt-50", twClass: "bg-cobalt-50", hex: "#2DA5D2" },
      { token: "cobalt-100", twClass: "bg-cobalt-100", hex: "#14A3C3" },
      { token: "cobalt-200", twClass: "bg-cobalt-200", hex: "#0F83B9" },
      { token: "cobalt-300", twClass: "bg-cobalt-300", hex: "#0875A7" },
      { token: "cobalt-400", twClass: "bg-cobalt-400", hex: "#11688B" },
      { token: "cobalt-500", twClass: "bg-cobalt-500", hex: "#0A5E85" },
      { token: "cobalt-600", twClass: "bg-cobalt-600", hex: "#084B6A" },
      { token: "cobalt-700", twClass: "bg-cobalt-700", hex: "#023D58" },
    ],
  },
  {
    name: "Roman",
    usage: "Warm accent for ambassador / secondary CTAs",
    swatches: [
      { token: "roman-200", twClass: "bg-roman-200", hex: "#EFB7B3" },
      { token: "roman-300", twClass: "bg-roman-300", hex: "#E89690" },
      { token: "roman-500", twClass: "bg-roman-500", hex: "#DC625A" },
      { token: "roman-600", twClass: "bg-roman-600", hex: "#C85952" },
      { token: "roman-700", twClass: "bg-roman-700", hex: "#9C4640" },
    ],
  },
  {
    name: "Sun",
    usage: "Highlight for emphasis or earnings",
    swatches: [
      { token: "sun-50", twClass: "bg-sun-50", hex: "#FFF9ED" },
      { token: "sun-100", twClass: "bg-sun-100", hex: "#F6E1B6" },
      { token: "sun-200", twClass: "bg-sun-200", hex: "#FDD79D" },
      { token: "sun-300", twClass: "bg-sun-300", hex: "#FCC570" },
      { token: "sun-400", twClass: "bg-sun-400", hex: "#DCA757" },
      { token: "sun-500", twClass: "bg-sun-500", hex: "#FAA929" },
      { token: "sun-600", twClass: "bg-sun-600", hex: "#D98C12" },
      { token: "sun-700", twClass: "bg-sun-700", hex: "#B2781D" },
    ],
  },
  {
    name: "Fern",
    usage: "Success / positive states",
    swatches: [
      { token: "fern-50", twClass: "bg-fern-50", hex: "#F0FDF4" },
      { token: "fern-200", twClass: "bg-fern-200", hex: "#b9dabf" },
      { token: "fern-300", twClass: "bg-fern-300", hex: "#9AC9A2" },
      { token: "fern-500", twClass: "bg-fern-500", hex: "#68AF74" },
      { token: "fern-600", twClass: "bg-fern-600", hex: "#5F9F6A" },
      { token: "fern-700", twClass: "bg-fern-700", hex: "#4A7C52" },
      { token: "fern-800", twClass: "bg-fern-800", hex: "#297C46" },
      { token: "fern-900", twClass: "bg-fern-900", hex: "#359B55" },
    ],
  },
] as const;

export default function BrandColors() {
  return (
    <section
      id="colors"
      aria-labelledby="colors-heading"
      className="scroll-mt-16 bg-cobalt-500 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <h2
          id="colors-heading"
          className="text-3xl font-bold text-white leading-tight tracking-tight mb-4"
        >
          Color Palettes
        </h2>
        <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">
          Four token families — use them by name, never by hex
        </p>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed mb-12">
          All tokens are defined in <code className="font-mono text-white/80">app/globals.css</code> under the <code className="font-mono text-white/80">@theme inline</code> block. Use the Tailwind utility class directly in JSX.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
          {palettes.map((palette) => (
            <div key={palette.name} className="bg-white rounded-xl p-8 flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 leading-tight">{palette.name}</h3>
                <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wide mt-0.5">{palette.usage}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {palette.swatches.map(({ token, twClass, hex }) => (
                  <div key={token} className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-md border border-black/5 ${twClass}`} />
                    <span className="font-mono text-xs text-slate-500 leading-none">{token}</span>
                    <span className="font-mono text-xs text-slate-400 leading-none">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

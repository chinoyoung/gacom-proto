"use client";

export default function BrandUsage() {
  return (
    <section
      id="usage"
      aria-labelledby="usage-heading"
      className="scroll-mt-16 bg-cobalt-700 px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          id="usage-heading"
          className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-5"
        >
          Build with the system.
        </h2>
        <p className="text-base text-white/90 leading-relaxed mb-10">
          The guidelines above are the source of truth for all visual decisions across GoAbroad prototypes. When in doubt, look here first.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="/BRANDING.md"
            className="inline-flex items-center justify-center bg-white text-cobalt-700 font-semibold px-7 py-3 rounded-lg ring-1 ring-white/30 hover:bg-slate-100 transition-colors w-full sm:w-auto text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Read BRANDING.md
          </a>
          <a
            href="/marketplace/partner"
            className="inline-flex items-center justify-center bg-roman-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-roman-600 transition-colors w-full sm:w-auto text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
          >
            View partner page
          </a>
        </div>
      </div>
    </section>
  );
}

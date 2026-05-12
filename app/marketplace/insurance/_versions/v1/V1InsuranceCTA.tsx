"use client";

export default function V1InsuranceCTA() {
  return (
    <section
      id="get-started"
      aria-labelledby="get-started-heading"
      className="scroll-mt-36 bg-cobalt-700 px-6 py-24 md:py-36"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          id="get-started-heading"
          className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-5"
        >
          Tailored Coverage for Any Travel Program
        </h2>
        <p className="text-base text-white/90 leading-relaxed mb-10">
          Find the perfect travel insurance solution to keep you covered during your travel abroad.
        </p>
        <div className="flex justify-center">
          <a
            href="#hero"
            className="inline-flex items-center justify-center bg-white text-cobalt-700 font-semibold px-7 py-3 rounded-lg ring-1 ring-white/30 hover:bg-slate-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </section>
  );
}

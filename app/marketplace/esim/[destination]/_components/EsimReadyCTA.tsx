"use client";

import type { Destination } from "../../_data/destinations";

export default function EsimReadyCTA({ destination }: { destination: Destination }) {
  return (
    <section
      aria-labelledby="esim-detail-cta-heading"
      className="bg-cobalt-700 py-24 md:py-36"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 text-center">
        <h2
          id="esim-detail-cta-heading"
          className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-5"
        >
          Ready to Stay Connected in {destination.name}?
        </h2>
        <p className="text-base leading-relaxed text-white/85 mb-10">
          Pick your plan, scan the QR code, and you&apos;re online before you&apos;ve collected your luggage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center bg-white text-cobalt-700 hover:bg-slate-100 font-semibold px-7 py-3 rounded-lg ring-1 ring-white/30 text-sm transition-colors w-full sm:w-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Buy {destination.name} eSIM
          </button>
          <a
            href="/marketplace/esim/destinations"
            className="inline-flex items-center justify-center border border-white/40 text-white hover:bg-white/10 font-semibold px-7 py-3 rounded-lg text-sm transition-colors w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View All Plans
          </a>
        </div>
      </div>
    </section>
  );
}

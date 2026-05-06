"use client";

import type { Destination } from "../../_data/destinations";

export default function EsimReadyCTA({ destination }: { destination: Destination }) {
  return (
    <section className="bg-cobalt-500 py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Ready to Stay Connected in {destination.name}?
        </h2>
        <p className="text-base md:text-lg text-cobalt-50/90 mb-8 max-w-2xl mx-auto">
          Pick your plan, scan the QR code, and you're online before you've collected your luggage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center bg-white text-cobalt-600 hover:bg-slate-100 font-semibold px-7 py-3 rounded-full text-sm transition-colors w-full sm:w-auto"
          >
            Buy {destination.name} eSIM
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center border border-white/40 text-white hover:bg-white/10 font-semibold px-7 py-3 rounded-full text-sm transition-colors w-full sm:w-auto"
          >
            View All Plans
          </button>
        </div>
      </div>
    </section>
  );
}

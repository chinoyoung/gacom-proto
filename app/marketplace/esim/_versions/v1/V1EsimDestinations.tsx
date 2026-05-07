"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { popularDestinations } from "../../_data/destinations";

export default function V1EsimDestinations() {
  return (
    <section
      id="destinations"
      aria-labelledby="destinations-heading"
      className="scroll-mt-36 bg-cobalt-500 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-3">
          Popular Destinations
        </p>
        <h2
          id="destinations-heading"
          className="text-3xl font-bold text-white leading-tight tracking-tight mb-4"
        >
          Browse eSIM Plans by Country or Region
        </h2>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed mb-12">
          Coverage in 200+ countries. Select a destination to view available data packages and pricing.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-left">
          {popularDestinations.map((dest) => {
            const isRegion = dest.type === "region";
            return (
              <Link
                key={dest.slug}
                href={`/marketplace/esim/${dest.slug}`}
                className="group bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 hover:border-cobalt-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-4xl leading-none" aria-hidden="true">
                    {dest.flag}
                  </span>
                  {isRegion && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-900 bg-sun-500 px-2 py-0.5 rounded-full">
                      Region
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-800 leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {isRegion && dest.coverageNote ? `${dest.coverageNote} · ` : ""}from {dest.fromPrice}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-500 group-hover:text-cobalt-600 transition-colors mt-auto">
                  View Plans
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/marketplace/esim/destinations"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            View all destinations
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

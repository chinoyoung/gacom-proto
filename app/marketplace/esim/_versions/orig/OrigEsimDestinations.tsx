"use client";

import Link from "next/link";
import { destinations } from "../../_data/destinations";

export default function OrigEsimDestinations() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Popular Destinations
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Browse eSIM plans for the most-traveled countries around the world.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/marketplace/esim/${dest.slug}`}
              className="group flex flex-col items-center text-center bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl p-6 transition-all hover:shadow-sm"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                {dest.flag}
              </div>
              <div className="text-base font-bold text-neutral-900 mb-1">
                {dest.name}
              </div>
              <div className="text-sm text-slate-500 mb-5">
                from {dest.fromPrice}
              </div>
              <span className="inline-flex items-center justify-center w-full bg-cobalt-500 group-hover:bg-cobalt-600 text-white font-semibold px-4 py-2.5 rounded-full text-sm transition-colors">
                View Plans
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/marketplace/esim/destinations"
            className="inline-flex items-center gap-2 text-cobalt-600 hover:text-cobalt-700 font-semibold text-sm transition-colors"
          >
            View all destinations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type { Destination } from "../../_data/destinations";

export default function EsimDetailHero({ destination }: { destination: Destination }) {
  const [durationIdx, setDurationIdx] = useState(1);
  const [packageIdx, setPackageIdx] = useState(2);

  const duration = destination.durations[durationIdx];
  const pkg = destination.packages[packageIdx];
  const total = (pkg.price * duration.multiplier).toFixed(2);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          <Link
            href="/marketplace/esim"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to eSIMs
          </Link>
          <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-cobalt-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link href="/marketplace/esim" className="hover:text-cobalt-600 transition-colors">
                GoAbroad eSIM
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium" aria-current="page">
              {destination.name} eSIM
            </li>
          </ol>
        </nav>

        <div className="py-8 md:py-12">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl md:text-5xl" aria-hidden="true">{destination.flag}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
              {destination.name} eSIM
            </h1>
          </div>
          <p className="text-base text-slate-600 max-w-3xl mb-8">
            {destination.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-end">
            <div className="space-y-6 max-w-2xl">
              <div>
                <div className="text-sm font-semibold text-neutral-900 mb-2.5">
                  Duration
                </div>
                <div className="flex flex-wrap gap-2">
                  {destination.durations.map((d, idx) => {
                    const selected = idx === durationIdx;
                    return (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setDurationIdx(idx)}
                        aria-pressed={selected}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                          selected
                            ? "bg-white border-cobalt-500 text-cobalt-600 ring-1 ring-cobalt-500"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-neutral-900 mb-2.5">
                  Data Package
                </div>
                <div className="flex flex-wrap gap-2">
                  {destination.packages.map((p, idx) => {
                    const selected = idx === packageIdx;
                    return (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => setPackageIdx(idx)}
                        aria-pressed={selected}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                          selected
                            ? "bg-white border-cobalt-500 text-cobalt-600 ring-1 ring-cobalt-500"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {p.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-end lg:items-end xl:items-end gap-4 lg:gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Total
                </div>
                <div className="text-3xl md:text-4xl font-bold text-neutral-900">
                  ${total}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-cobalt-500 text-cobalt-600 hover:bg-cobalt-50/40 font-semibold px-6 py-3 rounded-full text-sm transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

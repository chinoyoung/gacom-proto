"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Destination } from "../../_data/destinations";

function durationToSlug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function packageToSlug(size: string) {
  return size.toLowerCase().replace(/\s+/g, "");
}

const DEFAULT_DURATION_IDX = 1;
const DEFAULT_PACKAGE_IDX = 2;

export default function EsimDetailHero({ destination }: { destination: Destination }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const durationParam = searchParams.get("duration");
  const dataParam = searchParams.get("data");

  const matchedDurationIdx = destination.durations.findIndex(
    (d) => durationToSlug(d.label) === durationParam,
  );
  const matchedPackageIdx = destination.packages.findIndex(
    (p) => packageToSlug(p.size) === dataParam,
  );

  const durationIdx = matchedDurationIdx >= 0 ? matchedDurationIdx : DEFAULT_DURATION_IDX;
  const packageIdx = matchedPackageIdx >= 0 ? matchedPackageIdx : DEFAULT_PACKAGE_IDX;

  const duration = destination.durations[durationIdx];
  const pkg = destination.packages[packageIdx];
  const total = (pkg.price * duration.multiplier).toFixed(2);

  function updateSelection(nextDurationIdx: number, nextPackageIdx: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("duration", durationToSlug(destination.durations[nextDurationIdx].label));
    params.set("data", packageToSlug(destination.packages[nextPackageIdx].size));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <section aria-labelledby="esim-detail-heading" className="bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          <Link
            href="/marketplace/esim"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to eSIMs
          </Link>
          <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link
                href="/"
                className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link
                href="/marketplace"
                className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
              >
                Marketplace
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link
                href="/marketplace/esim"
                className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
              >
                eSIM
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium" aria-current="page">
              {destination.name}
            </li>
          </ol>
        </nav>

        <div className="py-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
            Travel eSIM
          </p>
          <div className="flex items-start gap-4 mb-3">
            <span className="text-5xl md:text-6xl leading-none" aria-hidden="true">{destination.flag}</span>
            <div className="pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  id="esim-detail-heading"
                  className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight"
                >
                  {destination.name} eSIM
                </h1>
                {destination.type === "region" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-900 bg-sun-500 px-2 py-0.5 rounded-full">
                    Region
                  </span>
                )}
              </div>
              {destination.type === "region" && destination.coverageNote && (
                <p className="text-sm text-slate-500 mt-2">Covers {destination.coverageNote}</p>
              )}
            </div>
          </div>
          <p className="text-base leading-relaxed text-slate-600 max-w-3xl mb-10">
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
                        onClick={() => updateSelection(idx, packageIdx)}
                        aria-pressed={selected}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
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
                        onClick={() => updateSelection(durationIdx, idx)}
                        aria-pressed={selected}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
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
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
                  Total
                </div>
                <div className="text-3xl md:text-4xl font-bold text-neutral-900">
                  ${total}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-slate-300 text-neutral-800 hover:bg-white hover:border-slate-400 font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
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

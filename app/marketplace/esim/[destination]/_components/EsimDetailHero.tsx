"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { Destination } from "../../_data/destinations";

function durationToSlug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function packageToSlug(size: string) {
  return size.toLowerCase().replace(/\s+/g, "");
}

function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidISODate(s: string | null): s is string {
  if (!s) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return !Number.isNaN(new Date(s + "T00:00:00").getTime());
}

function parseDurationDays(label: string): number {
  const match = label.match(/^(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 30;
}

function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

const DEFAULT_DURATION_IDX = 0; // 30 Days
const DEFAULT_PACKAGE_IDX = 2; // 5 GB

export default function EsimDetailHero({ destination }: { destination: Destination }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const dateParam = searchParams.get("date");
  const durationParam = searchParams.get("duration");
  const dataParam = searchParams.get("data");

  const today = todayISO();
  const date = isValidISODate(dateParam) ? dateParam : today;

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
  const durationDays = parseDurationDays(duration.label);
  const total = pkg.price * duration.multiplier;
  const totalStr = total.toFixed(2);
  const perDayStr = (total / durationDays).toFixed(2);

  const isDefaultPlan =
    durationIdx === DEFAULT_DURATION_IDX && packageIdx === DEFAULT_PACKAGE_IDX;

  const startDate = new Date(date + "T00:00:00");
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + durationDays - 1);
  const coverageRange = `${formatDateShort(startDate)} → ${formatDateShort(endDate)}`;

  function updateParams(updates: { date?: string; duration?: number; data?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.date !== undefined) {
      params.set("date", updates.date);
    }
    if (updates.duration !== undefined) {
      params.set("duration", durationToSlug(destination.durations[updates.duration].label));
    }
    if (updates.data !== undefined) {
      params.set("data", packageToSlug(destination.packages[updates.data].size));
    }
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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,420px)] gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="travel-date"
                  className="block text-sm font-semibold text-neutral-900 mb-2"
                >
                  When does your trip start?
                </label>
                <input
                  id="travel-date"
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => {
                    if (e.target.value) updateParams({ date: e.target.value });
                  }}
                  className="w-full max-w-sm px-4 py-3 border border-slate-300 rounded-lg bg-white text-sm text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus:border-cobalt-500 transition-colors"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Your eSIM activates on this date.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => setCustomizeOpen((v) => !v)}
                  aria-expanded={customizeOpen}
                  aria-controls="customize-panel"
                  className="w-full flex items-center justify-between gap-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                >
                  <span>Choose a different plan</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      customizeOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {customizeOpen && (
                  <div id="customize-panel" className="mt-6 space-y-6">
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
                              onClick={() => updateParams({ duration: idx })}
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
                        Data
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2.5">
                        {destination.packages.map((p, idx) => {
                          const selected = idx === packageIdx;
                          const isPopular = idx === DEFAULT_PACKAGE_IDX;
                          const pkgTotal = (p.price * duration.multiplier).toFixed(2);
                          return (
                            <div key={p.size} className="relative">
                              {isPopular && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-wider text-neutral-900 bg-sun-500 px-1.5 py-0.5 rounded-full whitespace-nowrap z-10 pointer-events-none">
                                  Popular
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => updateParams({ data: idx })}
                                aria-pressed={selected}
                                aria-label={
                                  isPopular
                                    ? `${p.size} (most popular), $${pkgTotal}`
                                    : `${p.size}, $${pkgTotal}`
                                }
                                className={`flex flex-col items-center gap-0.5 min-w-[72px] px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                                  selected
                                    ? "bg-white border-cobalt-500 text-cobalt-600 ring-1 ring-cobalt-500"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                <span>{p.size}</span>
                                <span className="text-xs text-slate-500 font-normal">
                                  ${pkgTotal}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside
              aria-labelledby="esim-plan-card-heading"
              className="relative bg-white rounded-xl border border-slate-200 p-6 md:p-8"
            >
              {isDefaultPlan && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 bg-sun-500 px-2 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
              <h2
                id="esim-plan-card-heading"
                className={`text-lg font-semibold text-neutral-800 mb-5 ${
                  isDefaultPlan ? "pr-24" : ""
                }`}
              >
                {pkg.size} · {duration.label}
              </h2>
              <div className="text-4xl font-bold text-neutral-900 mb-1">
                ${totalStr}
              </div>
              <div className="text-sm text-slate-500 mb-6">
                ${perDayStr} / day · Active {coverageRange}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-slate-300 text-neutral-800 hover:bg-slate-50 hover:border-slate-400 font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                  Add to Cart
                </button>
              </div>
            </aside>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, Smartphone, Wifi, Zap } from "lucide-react";
import EsimBuyModal from "./EsimBuyModal";
import EsimCoverageModal from "./EsimCoverageModal";
import DateRangePicker from "@/components/DateRangePicker";
import { DestinationFlag } from "../../_components/DestinationFlag";
import type { Destination } from "../../_data/destinations";

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

function parseISODate(s: string): Date {
  return new Date(s + "T00:00:00");
}

function addDaysISO(s: string, days: number): string {
  const d = parseISODate(s);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(startISO: string, endISO: string): number {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

/**
 * Continuous price multiplier based on trip length.
 * 1–30 days: scales 0.40 → 1.00 (short trips cost less than the 30-day base).
 * 31–90 days: scales 1.00 → 1.50.
 * 90+ days: capped at 1.50.
 */
function computeMultiplier(days: number): number {
  if (days <= 1) return 0.4;
  if (days <= 30) return 0.4 + ((days - 1) * 0.6) / 29;
  if (days <= 90) return 1.0 + ((days - 30) * 0.5) / 60;
  return 1.5;
}

const DEFAULT_PACKAGE_IDX = 2; // 5 GB
const DEFAULT_TRIP_DAYS = 7;
const PRICE_UPDATE_MS = 500;

export default function EsimDetailHero({ destination }: { destination: Destination }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");
  const dataParam = searchParams.get("data");

  const today = todayISO();
  const start = isValidISODate(startParam) ? startParam : today;
  const fallbackEnd = addDaysISO(start, DEFAULT_TRIP_DAYS - 1);
  const end =
    isValidISODate(endParam) && parseISODate(endParam) >= parseISODate(start)
      ? endParam
      : fallbackEnd;

  const matchedPackageIdx = destination.packages.findIndex(
    (p) => packageToSlug(p.size) === dataParam,
  );
  const packageIdx = matchedPackageIdx >= 0 ? matchedPackageIdx : DEFAULT_PACKAGE_IDX;
  const pkg = destination.packages[packageIdx];

  const durationDays = daysBetween(start, end);
  const multiplier = computeMultiplier(durationDays);
  const total = pkg.price * multiplier;
  const totalStr = total.toFixed(2);
  const perDayStr = (total / durationDays).toFixed(2);

  const isDefaultPlan = packageIdx === DEFAULT_PACKAGE_IDX;

  const startDateObj = parseISODate(start);
  const endDateObj = parseISODate(end);
  const coverageRange = `${formatDateShort(startDateObj)} → ${formatDateShort(endDateObj)}`;

  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, []);

  const triggerPriceLoader = useCallback(() => {
    setIsUpdating(true);
    if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    updateTimerRef.current = setTimeout(() => {
      setIsUpdating(false);
      updateTimerRef.current = null;
    }, PRICE_UPDATE_MS);
  }, []);

  function updateParams(updates: { start?: string; end?: string; data?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.start !== undefined) params.set("start", updates.start);
    if (updates.end !== undefined) params.set("end", updates.end);
    if (updates.data !== undefined) {
      params.set("data", packageToSlug(destination.packages[updates.data].size));
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleRangeChange(range: { start: string; end: string }) {
    if (range.start !== start || range.end !== end) {
      triggerPriceLoader();
    }
    updateParams({ start: range.start, end: range.end });
  }

  return (
    <section aria-labelledby="esim-detail-heading" className="bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          <Link
            href="/mygoabroad/esim"
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
                href="/mygoabroad/esim"
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(440px,520px)] gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
                  Travel eSIM
                </p>
                <div className="flex flex-col mb-6 gap-0">
                  <div className="flex items-center gap-3">
                    <DestinationFlag destination={destination} size="xl" />
                    <div>
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

                    </div>

                  </div>
                  {destination.type === "region" && destination.coverageNote && (
                    destination.coveredCountries && destination.coveredCountries.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setCoverageModalOpen(true)}
                        className="inline-flex items-center gap-1 text-sm text-cobalt-500 hover:text-cobalt-600 mt-2 underline underline-offset-2 decoration-cobalt-500/40 hover:decoration-cobalt-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                      >
                        Covers {destination.coverageNote}
                      </button>
                    ) : (
                      <p className="text-sm text-slate-500 mt-2">Covers {destination.coverageNote}</p>
                    )
                  )}
                </div>
                <p className="text-base leading-relaxed text-slate-600 max-w-[600px]">
                  {destination.description}
                </p>
              </div>

              <div>
                <div className="block text-sm font-semibold text-neutral-900 mb-2">
                  Travel dates
                </div>
                <DateRangePicker
                  startValue={start}
                  endValue={end}
                  min={today}
                  onChange={handleRangeChange}
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-neutral-900 mb-2.5">
                  Data
                </div>
                <div className="flex flex-wrap gap-2 pt-2.5">
                  {destination.packages.map((p, idx) => {
                    const selected = idx === packageIdx;
                    const isPopular = idx === DEFAULT_PACKAGE_IDX;
                    const pkgTotal = (p.price * multiplier).toFixed(2);
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
                          aria-busy={isUpdating}
                          aria-label={
                            isPopular
                              ? `${p.size} (most popular), $${pkgTotal}`
                              : `${p.size}, $${pkgTotal}`
                          }
                          className={`flex flex-col items-center gap-0.5 min-w-[80px] px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${selected
                            ? "bg-white border-cobalt-500 text-cobalt-600 ring-1 ring-cobalt-500"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                        >
                          <span>{p.size}</span>
                          {isUpdating ? (
                            <span
                              className="mt-0.5 h-3 w-12 rounded bg-slate-200 animate-pulse"
                              aria-hidden="true"
                            />
                          ) : (
                            <span className="text-xs text-slate-500 font-normal">
                              ${pkgTotal}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="space-y-6">
              <aside
                aria-labelledby="esim-plan-card-heading"
                aria-busy={isUpdating}
                className="relative bg-white rounded-xl border border-slate-200 p-6 md:p-8"
              >
                {isDefaultPlan && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 bg-sun-500 px-2 py-0.5 rounded-full">
                    Most popular
                  </span>
                )}
                <h2
                  id="esim-plan-card-heading"
                  className={`text-lg font-semibold text-neutral-800 mb-5 ${isDefaultPlan ? "pr-24" : ""
                    }`}
                >
                  {pkg.size} · {durationDays} {durationDays === 1 ? "day" : "days"}
                </h2>
                {isUpdating ? (
                  <>
                    <div className="h-10 w-32 rounded bg-slate-200 animate-pulse mb-2" aria-hidden="true" />
                    <div className="h-4 w-48 rounded bg-slate-200 animate-pulse mb-6" aria-hidden="true" />
                    <span className="sr-only">Updating price</span>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-neutral-900 mb-1">
                      ${totalStr}
                    </div>
                    <div className="text-sm text-slate-500 mb-6">
                      ${perDayStr} / day · Active {coverageRange}
                    </div>
                  </>
                )}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setBuyModalOpen(true)}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 disabled:bg-cobalt-500/60 disabled:cursor-wait"
                  >
                    {isUpdating ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Updating price…
                      </span>
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center border border-slate-300 text-neutral-800 hover:bg-slate-50 hover:border-slate-400 font-semibold px-7 py-3 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 disabled:opacity-60 disabled:cursor-wait"
                  >
                    Add to Cart
                  </button>
                </div>
              </aside>

              <div className="px-2">
                <div className="text-sm font-semibold text-neutral-900 mb-3">
                  What&apos;s included
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <li className="flex items-center gap-3 text-sm text-slate-700">
                    <Wifi className="w-4 h-4 text-cobalt-500 shrink-0" aria-hidden="true" />
                    <span>5G coverage where available</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700">
                    <Smartphone className="w-4 h-4 text-cobalt-500 shrink-0" aria-hidden="true" />
                    <span>Hotspot &amp; tethering enabled</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700">
                    <Zap className="w-4 h-4 text-cobalt-500 shrink-0" aria-hidden="true" />
                    <span>Instant QR code by email</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700">
                    <RefreshCw className="w-4 h-4 text-cobalt-500 shrink-0" aria-hidden="true" />
                    <span>Top up anytime, anywhere</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
      <EsimBuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        destinationName={destination.name}
        planLabel={`${pkg.size} · ${durationDays} ${durationDays === 1 ? "day" : "days"}`}
        totalStr={totalStr}
        coverageRange={coverageRange}
      />
      {destination.coveredCountries && destination.coveredCountries.length > 0 && (
        <EsimCoverageModal
          isOpen={coverageModalOpen}
          onClose={() => setCoverageModalOpen(false)}
          regionName={destination.name}
          countries={destination.coveredCountries}
        />
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import Stars from "./Stars";
import { CATEGORY_LABELS } from "./lib";

// ── Types ────────────────────────────────────────────────────────────────────

interface ReviewStats {
  total: number;
  avg: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  categoryAverages: {
    academicsRating: number | null;
    livingSituationRating: number | null;
    culturalImmersionRating: number | null;
    programAdministrationRating: number | null;
    healthAndSafetyRating: number | null;
    communityRating: number | null;
  };
}

interface ReviewSummary2026Props {
  stats: ReviewStats;
  provider: string;
  /** Currently selected star filter (1–5) or null for all. */
  selectedStar: number | null;
  onSelectStar: (star: number | null) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** Number of categories to show before the "Show all" toggle. */
const CATEGORY_PREVIEW_LIMIT = 3;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReviewSummary2026({
  stats,
  provider,
  selectedStar,
  onSelectStar,
}: ReviewSummary2026Props) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const { total, avg, distribution, categoryAverages } = stats;

  // ── Category list (sorted highest first, nulls excluded) ──────────────────
  const sortedCategories = (
    Object.entries(categoryAverages) as [string, number | null][]
  )
    .filter(([, val]) => val !== null)
    .sort(([, a], [, b]) => (b as number) - (a as number));

  const visibleCategories = showAllCategories
    ? sortedCategories
    : sortedCategories.slice(0, CATEGORY_PREVIEW_LIMIT);
  const hasMoreCategories = sortedCategories.length > CATEGORY_PREVIEW_LIMIT;

  // ── Distribution max (for bar proportions) ────────────────────────────────
  const maxCount = Math.max(1, ...Object.values(distribution));

  // ── Render ────────────────────────────────────────────────────────────────
  // Summary card rounding aligned to v5: rounded-md
  return (
    <div className="border border-slate-200 rounded-md bg-white p-5 sm:p-6">
      {/* ── Headline: big number + stars + count ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-5xl font-extrabold text-slate-900 leading-none tabular-nums">
          {avg > 0 ? avg.toFixed(1) : "—"}
        </span>
        <div className="flex flex-col gap-1">
          <Stars rating={avg} size="md" fractional={true} />
          <span className="text-sm text-slate-500">
            {total} {total === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      {/* ── Two-column grid on md+: Histogram | Categories ── */}
      {total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ── Left: Distribution histogram ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Rating breakdown
            </p>
            <div
              className="flex flex-col gap-1.5"
              role="list"
              aria-label="Rating distribution"
            >
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = distribution[star];
                const pct = total > 0 ? (count / maxCount) * 100 : 0;
                const isActive = selectedStar === star;
                const isInteractive = count > 0;

                return (
                  <div key={star} role="listitem">
                    <button
                      type="button"
                      disabled={!isInteractive}
                      onClick={() =>
                        onSelectStar(isActive ? null : star)
                      }
                      aria-pressed={isActive}
                      aria-label={`Filter by ${star} star reviews (${count})`}
                      className={[
                        "w-full flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1",
                        isInteractive
                          ? "cursor-pointer hover:bg-slate-50"
                          : "cursor-default opacity-50",
                        isActive ? "bg-sun-50 ring-1 ring-sun-300" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {/* Star label */}
                      <span className="flex items-center gap-1 w-12 shrink-0 justify-end">
                        <span className="text-xs font-semibold text-slate-700">
                          {star}
                        </span>
                        <Star className="w-3.5 h-3.5 text-sun-500 fill-current" />
                      </span>

                      {/* Proportional bar */}
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isActive ? "bg-sun-500" : "bg-sun-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Count */}
                      <span className="text-xs font-medium text-slate-500 w-6 text-right shrink-0 tabular-nums">
                        {count}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Clear filter affordance */}
            {selectedStar !== null && (
              <button
                type="button"
                onClick={() => onSelectStar(null)}
                className="mt-3 text-xs font-semibold text-cobalt-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* ── Right: Category averages ── */}
          {sortedCategories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Top categories
              </p>
              <div className="flex flex-col gap-2.5">
                {visibleCategories.map(([key, val]) => {
                  const numVal = val as number;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">
                        {CATEGORY_LABELS[key] ?? key}
                      </span>
                      <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-sun-400 rounded-full"
                          style={{ width: `${(numVal / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-8 text-right shrink-0 tabular-nums">
                        {numVal.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {hasMoreCategories && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories((v) => !v)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cobalt-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
                >
                  {showAllCategories ? (
                    <>
                      Show less
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Show all {sortedCategories.length} categories
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── "Review this Program" CTA ── */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Studied with {provider}?
        </p>
        <button
          type="button"
          className="bg-roman-500 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-roman-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roman-500 focus-visible:ring-offset-1"
        >
          Review this Program
        </button>
      </div>
    </div>
  );
}

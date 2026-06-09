"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Star } from "lucide-react";

import type { Program, Review } from "../../_components/types";
import ReviewSummary2026 from "./ReviewSummary2026";
import AiSummary2026 from "./AiSummary2026";
import ReviewCard2026 from "./ReviewCard2026";
import ReviewFilters2026, { type IdentityFilterKey } from "./ReviewFilters2026";
import { parseReviewDate, IDENTITY_CHIP_DEFS } from "./lib";

// ── Constants ─────────────────────────────────────────────────────────────────

/** How many reviews are shown before the first "Load more". */
const INITIAL_LIMIT = 5;
/** How many to add per "Load more" click. */
const LOAD_MORE_INCREMENT = 20;

// ── Sort types ────────────────────────────────────────────────────────────────

type SortKey = "helpful" | "recent" | "highest" | "lowest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "helpful", label: "Most helpful" },
  { value: "recent", label: "Most recent" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns a timestamp for sorting. Uses the stored date string when available
 * (via parseReviewDate from lib), falling back to _creationTime.
 */
function parseDateToMs(review: Review): number {
  const parsed = parseReviewDate(review.date);
  if (parsed) return parsed.getTime();
  return review._creationTime;
}

function sortReviews(reviews: Review[], sort: SortKey): Review[] {
  return [...reviews].sort((a, b) => {
    if (sort === "helpful") {
      const diff = (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0);
      if (diff !== 0) return diff;
      // Tiebreak: most recent
      return parseDateToMs(b) - parseDateToMs(a);
    }
    if (sort === "recent") {
      return parseDateToMs(b) - parseDateToMs(a);
    }
    if (sort === "highest") {
      const diff = (b.overallRating ?? 0) - (a.overallRating ?? 0);
      if (diff !== 0) return diff;
      return (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0);
    }
    if (sort === "lowest") {
      const diff = (a.overallRating ?? 0) - (b.overallRating ?? 0);
      if (diff !== 0) return diff;
      return (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0);
    }
    return 0;
  });
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Reviews2026SectionProps {
  program: Program;
  reviews: Review[] | undefined;
  /**
   * Accepted for orchestrator parity — page.tsx passes avgRating to every
   * section variant so the switch statement stays uniform. Live stats here
   * come from api.reviews.getReviewStats (Convex live query), not this prop.
   */
  avgRating: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Reviews2026Section({
  program,
  reviews,
  avgRating: _avgRating, // acknowledged; live stats sourced from getReviewStats
}: Reviews2026SectionProps) {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityFilterKey>("all");
  const [sort, setSort] = useState<SortKey>("helpful");
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  // ── Server-side stats (from api.reviews.getReviewStats) ──────────────────
  const stats = useQuery(api.reviews.getReviewStats, {
    programId: program._id as Id<"programs">,
  });

  const reviewList = reviews ?? [];

  // ── Filter: star rating (from histogram) ─────────────────────────────────
  const afterStarFilter =
    selectedStar === null
      ? reviewList
      : reviewList.filter(
          (r) =>
            typeof r.overallRating === "number" &&
            Math.round(r.overallRating) === selectedStar
        );

  // ── Filter: topic tag (case-insensitive substring match) ─────────────────
  const afterTopicFilter =
    selectedTopic === null
      ? afterStarFilter
      : afterStarFilter.filter((r) => {
          const searchText = [
            r.reviewTitle,
            r.body,
            r.highlight,
            r.advice,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return searchText.includes(selectedTopic.toLowerCase());
        });

  // ── Filter: identity / media ──────────────────────────────────────────────
  const filteredReviews = (() => {
    if (selectedIdentity === "all") return afterTopicFilter;
    if (selectedIdentity === "has_media") {
      return afterTopicFilter.filter(
        (r) => Array.isArray(r.media) && r.media.length > 0
      );
    }
    // Identity tag chips — look up the exact tag string from IDENTITY_CHIP_DEFS
    const chipDef = IDENTITY_CHIP_DEFS.find((d) => d.key === selectedIdentity);
    if (!chipDef?.identityTag) return afterTopicFilter;
    const tag = chipDef.identityTag;
    return afterTopicFilter.filter((r) => r.identityTags?.includes(tag));
  })();

  // ── Sort ─────────────────────────────────────────────────────────────────
  const sortedReviews = sortReviews(filteredReviews, sort);

  // ── Load-more window ─────────────────────────────────────────────────────
  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const remaining = sortedReviews.length - visibleCount;
  const hasMore = remaining > 0;
  const loadMoreCount = Math.min(remaining, LOAD_MORE_INCREMENT);

  // ── Filter & sort change handlers (all reset the load-more window) ─────
  function handleSelectStar(star: number | null) {
    setSelectedStar(star);
    setVisibleCount(INITIAL_LIMIT);
  }

  function handleSelectTopic(topic: string | null) {
    setSelectedTopic(topic);
    setVisibleCount(INITIAL_LIMIT);
  }

  function handleSelectIdentity(key: IdentityFilterKey) {
    setSelectedIdentity(key);
    setVisibleCount(INITIAL_LIMIT);
  }

  function handleSortChange(newSort: SortKey) {
    setSort(newSort);
    setVisibleCount(INITIAL_LIMIT);
  }

  /** Clears ALL active filters (star + topic + identity). */
  function handleClearAllFilters() {
    setSelectedStar(null);
    setSelectedTopic(null);
    setSelectedIdentity("all");
    setVisibleCount(INITIAL_LIMIT);
  }

  const hasActiveFilters =
    selectedStar !== null ||
    selectedTopic !== null ||
    selectedIdentity !== "all";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6" aria-labelledby="reviews-heading">
      {/* Section heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2
            id="reviews-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Program Reviews
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Hear what past participants have to say about {program.provider}
          </p>
        </div>
      </div>

      {/* Summary block — only renders once stats are loaded */}
      {stats && (
        <ReviewSummary2026
          stats={stats}
          provider={program.provider}
          selectedStar={selectedStar}
          onSelectStar={handleSelectStar}
        />
      )}

      {/* AI summary card — gated on aiSummary present ∧ total ≥ 10 */}
      {stats && (
        <AiSummary2026 program={program} totalReviews={stats.total} />
      )}

      {/* ── Chip filter rows: topic tags + identity filters ──────────────── */}
      {reviewList.length > 0 && (
        <ReviewFilters2026
          topicTags={program.topicTags ?? []}
          totalReviews={stats?.total ?? reviewList.length}
          selectedTopic={selectedTopic}
          onSelectTopic={handleSelectTopic}
          selectedIdentity={selectedIdentity}
          onSelectIdentity={handleSelectIdentity}
          reviews={reviewList}
        />
      )}

      {/* Review feed */}
      {reviewList.length === 0 ? (
        /* ── Empty state: no reviews at all ── */
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-sun-500/15 flex items-center justify-center">
            <Star className="w-5 h-5 text-sun-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Be the first to review {program.provider}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            If you&apos;ve participated in this program, your review helps
            future students decide.
          </p>
          <button
            type="button"
            className="bg-roman-500 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-roman-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roman-500 focus-visible:ring-offset-1"
          >
            Review this Program
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        /* ── Empty state: filter has no matches ── */
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center">
            <Star className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No reviews match your filters
          </h3>
          <p className="text-sm text-slate-500">
            Try adjusting or clearing your filters to see more reviews.
          </p>
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="text-sm font-semibold text-cobalt-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* ── Controls row: count + sort ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Count / filter label */}
            <p className="text-sm text-slate-500">
              {hasActiveFilters ? (
                <>
                  Showing {visibleReviews.length} of {filteredReviews.length}{" "}
                  {filteredReviews.length === 1 ? "review" : "reviews"} ·{" "}
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="font-semibold text-cobalt-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  Showing {visibleReviews.length} of {filteredReviews.length}{" "}
                  {filteredReviews.length === 1 ? "review" : "reviews"}
                </>
              )}
            </p>

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              aria-label="Sort reviews"
              className="text-sm border border-slate-200 rounded-md px-2.5 py-2 text-slate-600 bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 self-start sm:self-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── Review cards ── */}
          <div className="flex flex-col gap-4">
            {visibleReviews.map((review) => (
              <ReviewCard2026 key={review._id} review={review} />
            ))}
          </div>

          {/* ── Load more ── */}
          {hasMore && (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => c + LOAD_MORE_INCREMENT)
                }
                className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-700 font-semibold px-7 py-3 rounded-md hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
              >
                Load {loadMoreCount} more
              </button>
              <p className="text-xs text-slate-400">
                {remaining} more {remaining === 1 ? "review" : "reviews"} to show
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

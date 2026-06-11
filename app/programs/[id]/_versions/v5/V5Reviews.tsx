"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  X,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
// programId is stored as string in the Program type; cast to Convex Id where needed.
import V5AiSummary from "./V5AiSummary";
import ReviewSummary2026 from "../v6/ReviewSummary2026";

export type Review = {
  _id: string;
  _creationTime: number;
  reviewTitle?: string;
  reviewerName?: string;
  reviewerCountry?: string;
  body?: string;
  reviewBody?: string;
  photo?: string;
  photos?: string[];
  overallRating?: number;
  academicsRating?: number;
  livingSituationRating?: number;
  culturalImmersionRating?: number;
  programAdministrationRating?: number;
  healthAndSafetyRating?: number;
  communityRating?: number;
  helpfulCount?: number;
};

const CATEGORY_FIELDS = [
  { label: "Academics", key: "academicsRating" },
  { label: "Living Situation", key: "livingSituationRating" },
  { label: "Cultural Immersion", key: "culturalImmersionRating" },
  { label: "Program Administration", key: "programAdministrationRating" },
  { label: "Health & Safety", key: "healthAndSafetyRating" },
  { label: "Community", key: "communityRating" },
] as const satisfies ReadonlyArray<{ label: string; key: keyof Review }>;

const INITIAL_REVIEWS_LIMIT = 3;

type ReviewSort = "recent" | "highest" | "lowest";

function getReviewPhotos(review: Review): string[] {
  if (Array.isArray(review.photos) && review.photos.length > 0) {
    return review.photos;
  }
  if (typeof review.photo === "string" && review.photo) {
    return [review.photo];
  }
  return [];
}

// DEMO ONLY: fabricates review photos for the prototype — remove before production.
function getDemoReviewPhotos(review: Review, index: number): string[] {
  const real = getReviewPhotos(review);
  const count = 2 + (index % 5); // cycles 2,3,4,5,6
  if (count <= real.length) return real.slice(0, count);
  const result = [...real];
  for (let i = real.length; i < count; i++) {
    result.push(`https://picsum.photos/seed/${review._id}-${i}/300/300`);
  }
  return result;
}

// ── Per-card Helpful button ───────────────────────────────────────────────────

interface HelpfulButtonProps {
  review: Review;
}

function HelpfulButton({ review }: HelpfulButtonProps) {
  const [voted, setVoted] = useState(false);
  const markHelpful = useMutation(api.reviews.markHelpful);

  const displayedCount = (review.helpfulCount ?? 0) + (voted ? 1 : 0);

  async function handleHelpful() {
    if (voted) return;
    setVoted(true);
    try {
      await markHelpful({ reviewId: review._id as Id<"reviews"> });
    } catch {
      setVoted(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleHelpful}
      disabled={voted}
      aria-label={voted ? "Marked as helpful" : "Mark as helpful"}
      className={[
        "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1",
        voted
          ? "bg-fern-50 border-fern-200 text-fern-700 cursor-not-allowed"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 cursor-pointer",
      ].join(" ")}
    >
      <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
      Helpful
      {displayedCount > 0 && (
        <span className="tabular-nums">({displayedCount})</span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface V5ReviewsProps {
  programId: string;
  reviews: Review[] | undefined;
  /**
   * Accepted for orchestrator parity — page.tsx passes avgRating to every
   * section variant so the switch statement stays uniform. Live stats here
   * come from api.reviews.getReviewStats (Convex live query), not this prop.
   */
  avgRating: number;
  provider: string;
  aiSummary?: {
    text: string;
    reviewCount: number;
  };
}

export default function V5Reviews({
  programId,
  reviews,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  avgRating: _avgRating, // acknowledged; live stats sourced from getReviewStats
  provider,
  aiSummary,
}: V5ReviewsProps) {
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);

  // Live stats from Convex — drives ReviewSummary2026
  const stats = useQuery(api.reviews.getReviewStats, {
    programId: programId as Id<"programs">,
  });

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(() => {
    setLightbox((cur) =>
      cur ? { ...cur, index: (cur.index - 1 + cur.photos.length) % cur.photos.length } : cur
    );
  }, []);
  const nextPhoto = useCallback(() => {
    setLightbox((cur) =>
      cur ? { ...cur, index: (cur.index + 1) % cur.photos.length } : cur
    );
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, prevPhoto, nextPhoto]);

  const reviewList = reviews ?? [];

  // ── Star filter — applied before sort/pagination ──────────────────────────
  function handleSelectStar(star: number | null) {
    setSelectedStar(star);
    setShowAll(false); // reset view-all window on filter change
  }

  const afterStarFilter =
    selectedStar === null
      ? reviewList
      : reviewList.filter(
          (r) =>
            typeof r.overallRating === "number" &&
            Math.round(r.overallRating) === selectedStar
        );

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = [...afterStarFilter].sort((a, b) => {
    if (sort === "recent") return b._creationTime - a._creationTime;
    if (sort === "highest") return (b.overallRating ?? 0) - (a.overallRating ?? 0);
    if (sort === "lowest") return (a.overallRating ?? 0) - (b.overallRating ?? 0);
    return 0;
  });

  const hasMoreThanLimit = sorted.length > INITIAL_REVIEWS_LIMIT;
  const visibleReviews = showAll || !hasMoreThanLimit
    ? sorted
    : sorted.slice(0, INITIAL_REVIEWS_LIMIT);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="w-full flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Program Reviews</h2>
          <p className="text-sm text-slate-500 mt-1">
            Hear what past participants have to say about {provider}
          </p>
        </div>
      </div>

      {/* Summary block — ReviewSummary2026 replaces v5's old summary card */}
      {stats && (
        <ReviewSummary2026
          stats={stats}
          provider={provider}
          selectedStar={selectedStar}
          onSelectStar={handleSelectStar}
        />
      )}

      {/* AI review summary */}
      <V5AiSummary summary={aiSummary} />

      {/* Review cards */}
      {reviewList.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
          <Star className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-900">Be the first to review {provider}</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            If you&apos;ve studied with {provider}, share what stood out — your insight helps future students decide.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center h-10 px-5 bg-roman-500 text-white text-sm font-semibold rounded-md cursor-pointer hover:bg-roman-600 transition-colors"
          >
            Review this Program
          </button>
        </div>
      ) : (
        <>
          {/* Controls row: count + sort */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {selectedStar !== null ? (
                <>
                  {sorted.length === 0
                    ? `No ${selectedStar}-star reviews`
                    : hasMoreThanLimit && !showAll
                      ? `Showing ${visibleReviews.length} of ${sorted.length} reviews`
                      : `Showing ${sorted.length} ${sorted.length === 1 ? "review" : "reviews"}`}
                  {" · "}
                  <button
                    type="button"
                    onClick={() => handleSelectStar(null)}
                    className="font-semibold text-cobalt-500 hover:underline cursor-pointer"
                  >
                    Clear filter
                  </button>
                </>
              ) : hasMoreThanLimit && !showAll
                ? `Showing ${visibleReviews.length} of ${reviewList.length} reviews`
                : `Showing ${reviewList.length} ${reviewList.length === 1 ? "review" : "reviews"}`}
            </p>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as ReviewSort); }}
              aria-label="Sort reviews"
              className="text-sm border border-slate-200 rounded-md px-2.5 h-10 text-slate-600 bg-white cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* No-matches state when a star filter has no results */}
          {sorted.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
              <Star className="w-8 h-8 mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-900">
                No {selectedStar}-star reviews
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                None of the reviews match this rating.
              </p>
              <button
                type="button"
                onClick={() => handleSelectStar(null)}
                className="mt-4 text-sm font-semibold text-cobalt-500 hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {visibleReviews.map((review, reviewIndex) => {
                  const isExpanded = expandedIds.has(review._id);
                  const body: string = review.body ?? review.reviewBody ?? "";
                  const isLong = body.length > 280;
                  const reviewCategoryRatings = CATEGORY_FIELDS.map((cat) => ({
                    label: cat.label,
                    value: typeof review[cat.key] === "number" ? review[cat.key] : null,
                  })).filter((c) => c.value != null);

                  return (
                    <div
                      key={review._id}
                      className="flex shrink-0 flex-col bg-white border border-slate-200 p-5 rounded-md relative overflow-visible"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-cobalt-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                              {(review.reviewerName ?? "A").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm text-neutral-900 truncate">
                                {review.reviewerName ?? "Anonymous"}
                              </span>
                              <span className="text-xs text-neutral-500 truncate">
                                {review.reviewerCountry && <>{review.reviewerCountry} · </>}
                                Reviewed{" "}
                                {new Date(review._creationTime).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          {review.overallRating != null && (
                            <div className="flex items-center gap-1 bg-slate-100 rounded-md px-2 py-1 shrink-0">
                              <Star fill="currentColor" className="text-sun-500 w-4 h-4" />
                              <span className="font-bold text-sm">
                                {Number(review.overallRating).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                          {review.reviewTitle ?? "Program Review"}
                        </h3>

                        <div className="flex flex-col md:flex-row gap-5 md:gap-6 pt-4 border-t border-slate-100">
                          {/* Left: experience + photos */}
                          <div className="flex flex-col gap-3 md:flex-1 min-w-0">
                            <div className="flex flex-col gap-2">
                              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                                Experience
                              </p>
                              <p
                                className={`text-sm leading-relaxed text-neutral-700 ${
                                  !isExpanded && isLong ? "line-clamp-3" : ""
                                }`}
                              >
                                {body}
                              </p>
                              {isLong && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(review._id)}
                                  className="text-xs text-cobalt-500 font-bold cursor-pointer hover:underline self-start text-left flex items-center gap-1"
                                >
                                  {isExpanded ? "Hide full review" : "Read full review"}
                                  {isExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>

                            {(() => {
                              const photos = getDemoReviewPhotos(review, reviewIndex);
                              if (!photos.length) return null;
                              const tiles = photos.slice(0, 3);
                              const overflow = photos.length - 3;
                              return (
                                <div className="flex flex-col gap-2">
                                  <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                                    Photos
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {tiles.map((src, i) => {
                                      const isOverflowTile = i === 2 && overflow > 0;
                                      return (
                                        <button
                                          type="button"
                                          key={i}
                                          onClick={() => setLightbox({ photos, index: i })}
                                          className="relative w-16 h-16 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                                          aria-label={
                                            isOverflowTile
                                              ? `Open photo gallery (${overflow} more)`
                                              : `Open review photo ${i + 1}`
                                          }
                                        >
                                          <img
                                            src={src}
                                            alt={`Review photo ${i + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          {isOverflowTile && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                                              <span className="text-white text-sm font-bold leading-none">
                                                +{overflow}
                                              </span>
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Right: per-review category scorecard */}
                          <div className="flex flex-col gap-4 md:w-[28rem] md:shrink-0 bg-slate-50 border border-slate-200 rounded-md p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">This reviewer&apos;s ratings</p>
                            {reviewCategoryRatings.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">No category ratings available</p>
                            ) : (
                              <div className="flex flex-col gap-2.5">
                                {reviewCategoryRatings.map((cat) => (
                                  <div key={cat.label} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-700 flex-1 min-w-0 truncate">{cat.label}</span>
                                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
                                      <div className="h-full bg-sun-500 rounded-full" style={{ width: `${((cat.value as number) / 5) * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 w-6 text-right shrink-0">
                                      {(cat.value as number).toFixed(1)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card footer: Helpful button */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                          <HelpfulButton review={review} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMoreThanLimit && (
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="inline-flex items-center justify-center gap-1.5 h-10 px-5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {showAll
                      ? "Show fewer reviews"
                      : `View all ${sorted.length} reviews`}
                    {showAll ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-7 h-7" />
          </button>
          {lightbox.photos.length > 1 && (
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh] mx-auto px-16">
            <img
              src={lightbox.photos[lightbox.index]}
              alt={`Review photo ${lightbox.index + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            <p className="text-center text-white/50 text-sm mt-3">
              {lightbox.index + 1} / {lightbox.photos.length}
            </p>
          </div>
          {lightbox.photos.length > 1 && (
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Next photo"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

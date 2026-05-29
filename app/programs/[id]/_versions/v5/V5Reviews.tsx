"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export type Review = {
  _id: string;
  _creationTime: number;
  reviewTitle?: string;
  reviewerName?: string;
  reviewerCountry?: string;
  body?: string;
  reviewBody?: string;
  photo?: string;
  overallRating?: number;
  academicsRating?: number;
  livingSituationRating?: number;
  culturalImmersionRating?: number;
  programAdministrationRating?: number;
  healthAndSafetyRating?: number;
  communityRating?: number;
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
  if (typeof review.photo === "string" && review.photo) {
    return [review.photo];
  }
  return [];
}

interface V5ReviewsProps {
  reviews: Review[] | undefined;
  avgRating: number;
  provider: string;
}

export default function V5Reviews({ reviews, avgRating, provider }: V5ReviewsProps) {
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedRatingIds, setExpandedRatingIds] = useState<Set<string>>(new Set());
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);

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

  const categoryRatings = CATEGORY_FIELDS.map((cat) => {
    const values = reviewList
      .map((r) => r[cat.key])
      .filter((v): v is number => typeof v === "number");
    const avg =
      values.length > 0
        ? values.reduce((sum, v) => sum + v, 0) / values.length
        : 0;
    return { label: cat.label, avg };
  });

  const ratedCategories = categoryRatings.filter((c) => c.avg > 0);
  const sortedCategories = [...ratedCategories].sort((a, b) => b.avg - a.avg);
  const visibleCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 3);

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const label = `${stars}`;
    const count = reviewList.filter(
      (r) => typeof r.overallRating === "number" && Math.round(r.overallRating) === stars
    ).length;
    const bar = "bg-sun-500";
    return { stars, label, count, bar };
  });
  const maxDistCount = Math.max(1, ...distribution.map((d) => d.count));

  const sorted = [...reviewList].sort((a, b) => {
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

  const toggleExpandRating = (id: string) => {
    setExpandedRatingIds((prev) => {
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
        <div className="flex gap-3 items-center shrink-0">
          <button
            type="button"
            className="hidden lg:inline-flex items-center justify-center h-10 px-5 bg-roman-500 text-white text-sm font-semibold rounded-md cursor-pointer hover:bg-roman-600 transition-colors"
          >
            Review this Program
          </button>
        </div>
      </div>

      {/* Summary card */}
      <div className="border border-slate-200 rounded-md p-5 sm:p-6 bg-white">
        {/* Headline: rating + stars + reviews pill */}
        <div className="flex items-center flex-wrap gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            <span className="text-2xl sm:text-3xl font-bold text-slate-400 ml-1">/5</span>
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  avgRating >= star ? "text-sun-500 fill-current" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="bg-cobalt-500/10 text-cobalt-600 text-xs font-semibold px-3 py-1 rounded-full">
            {reviewList.length} {reviewList.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {reviewList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Distribution */}
            <div>
              {reviewList.length >= 5 ? (
                <>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Distribution</h3>
                  <div className="flex flex-col gap-2">
                    {distribution.map(({ stars, label, count, bar }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700 w-12 text-right shrink-0">
                          {label}
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${bar} rounded-full`}
                            style={{ width: `${(count / maxDistCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500 w-8 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                  <p className="text-sm text-slate-700 font-medium">
                    Based on {reviewList.length} {reviewList.length === 1 ? "review" : "reviews"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    We&apos;ll show a full rating breakdown once more students share their experience.
                  </p>
                </div>
              )}
            </div>

            {/* Top categories */}
            {ratedCategories.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Top categories</h3>
                <div className="flex flex-col gap-2">
                  {visibleCategories.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-3">
                      <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">
                        {cat.label}
                      </span>
                      <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-sun-500 rounded-full"
                          style={{ width: `${(cat.avg / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-8 text-right shrink-0">
                        {cat.avg.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
                {sortedCategories.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((v) => !v)}
                    className="text-sm font-semibold text-cobalt-500 hover:underline cursor-pointer mt-3"
                  >
                    {showAllCategories
                      ? "Show fewer categories"
                      : `Show all ${sortedCategories.length} categories`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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
          {reviewList.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {hasMoreThanLimit && !showAll
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
          )}

          <div className="flex flex-col gap-4">
            {visibleReviews.map((review) => {
              const isExpanded = expandedIds.has(review._id);
              const isRatingExpanded = expandedRatingIds.has(review._id);
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
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleExpandRating(review._id)}
                            disabled={reviewCategoryRatings.length === 0}
                            aria-expanded={isRatingExpanded}
                            aria-label={
                              reviewCategoryRatings.length === 0
                                ? "Overall rating"
                                : isRatingExpanded
                                  ? "Hide rating breakdown"
                                  : "Show rating breakdown"
                            }
                            className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
                              reviewCategoryRatings.length > 0
                                ? "bg-slate-100 hover:bg-slate-200 cursor-pointer"
                                : "bg-slate-100"
                            }`}
                          >
                            <Star fill="currentColor" className="text-sun-500 w-4 h-4" />
                            <span className="font-bold text-sm">
                              {Number(review.overallRating).toFixed(1)}
                            </span>
                            {reviewCategoryRatings.length > 0 &&
                              (isRatingExpanded ? (
                                <ChevronUp className="w-3 h-3 text-neutral-500" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-neutral-500" />
                              ))}
                          </button>
                          {isRatingExpanded && reviewCategoryRatings.length > 0 && (
                            <div
                              role="dialog"
                              className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-md shadow-lg p-4 z-20 flex flex-col gap-2.5"
                            >
                              {reviewCategoryRatings.map((cat) => (
                                <div key={cat.label} className="flex items-center gap-3">
                                  <span className="text-xs text-slate-500 w-28 shrink-0">{cat.label}</span>
                                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-sun-500 rounded-full"
                                      style={{ width: `${((cat.value ?? 0) / 5) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-700 w-8 text-right shrink-0">
                                    {Number(cat.value).toFixed(1)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
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
                          const photos = getReviewPhotos(review);
                          if (!photos.length) return null;
                          return (
                            <div className="flex flex-col gap-2">
                              <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                                Photos
                              </p>
                              <div className="flex gap-2">
                                {photos.map((src, i) => (
                                  <button
                                    type="button"
                                    key={i}
                                    onClick={() => setLightbox({ photos, index: i })}
                                    className="w-16 h-16 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                                    aria-label={`Open review photo ${i + 1}`}
                                  >
                                    <img
                                      src={src}
                                      alt={`Review photo ${i + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
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

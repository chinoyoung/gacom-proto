"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
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

const MAX_REVIEW_PHOTOS = 4;

function getReviewPhotos(review: Review): string[] {
  const photos: string[] = [];
  if (typeof review.photo === "string" && review.photo) {
    photos.push(review.photo);
  }
  const seed = String(review._id ?? "review");
  while (photos.length < MAX_REVIEW_PHOTOS) {
    photos.push(
      `https://picsum.photos/seed/${encodeURIComponent(seed)}-${photos.length}/400/400`
    );
  }
  return photos.slice(0, MAX_REVIEW_PHOTOS);
}

const FILLER_PROS = [
  "Incredible cultural immersion with local homestay families",
  "Knowledgeable, responsive program staff",
  "Well-organized excursions and weekend trips",
];

const FILLER_CONS = [
  "Limited free time for independent exploration",
  "Housing placement options could be more flexible",
];

const CATEGORY_FIELDS = [
  { label: "Academics", key: "academicsRating" },
  { label: "Living Situation", key: "livingSituationRating" },
  { label: "Cultural Immersion", key: "culturalImmersionRating" },
  { label: "Program Administration", key: "programAdministrationRating" },
  { label: "Health & Safety", key: "healthAndSafetyRating" },
  { label: "Community", key: "communityRating" },
] as const satisfies ReadonlyArray<{ label: string; key: keyof Review }>;

export const REVIEWS_PER_PAGE = 5;

type ReviewSort = "recent" | "highest" | "lowest";

export function ReviewsSection({
  reviews,
  avgRating,
}: {
  reviews: Review[] | undefined;
  avgRating: number;
  provider: string;
}) {
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedRatingIds, setExpandedRatingIds] = useState<Set<string>>(
    new Set()
  );
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<{
    photos: string[];
    index: number;
  } | null>(null);

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

  const sorted = [...reviewList].sort((a, b) => {
    if (sort === "recent") return b._creationTime - a._creationTime;
    if (sort === "highest") return (b.overallRating ?? 0) - (a.overallRating ?? 0);
    if (sort === "lowest") return (a.overallRating ?? 0) - (b.overallRating ?? 0);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / REVIEWS_PER_PAGE);
  const pageReviews = sorted.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

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
    <div className="flex flex-col px-4 xl:px-0 gap-4">
      {/* Header row */}
      <div className="w-full flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="w-full">
          <h2 className="flex items-center text-2xl font-bold gap-2">
            Program Reviews
          </h2>
          <p className="text-sm">
            Hear what past participants have to say about the programs
          </p>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <button className="bg-roman-500 text-white hidden lg:block h-10 text-sm font-bold rounded-md px-5 cursor-pointer">
            Review this Program
          </button>
          <div className="hidden lg:grid w-full md:w-auto text-xs md:text-sm grid-cols-1 grid-flow-row gap-4 h-10">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as ReviewSort);
                setPage(1);
              }}
              className="text-sm border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 bg-white cursor-pointer h-10"
              aria-label="Sort reviews"
            >
              <option value="recent">Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rating summary card */}
      <div className="border border-gray-200 rounded-md p-4 sm:p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10">
          {/* Left — overall score */}
          <div className="flex flex-col items-center justify-center sm:border-r sm:border-slate-100 sm:pr-10">
            <span className="text-5xl font-extrabold text-slate-900 leading-none">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </span>
            <div className="flex items-center gap-0.5 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${avgRating >= star ? "text-sun-500 fill-current" : "text-slate-300"}`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Based on {reviewList.length} {reviewList.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Right — category bars */}
          {reviewList.length > 0 && (
            <div className="flex flex-col gap-3 justify-center">
              {categoryRatings.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-32 shrink-0">{cat.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cobalt-400 rounded-full"
                      style={{ width: `${(cat.avg / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-6 text-right shrink-0">
                    {cat.avg.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sort */}
      <div className="lg:hidden w-full text-xs flex justify-end h-10">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as ReviewSort);
            setPage(1);
          }}
          className="text-sm border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 bg-white cursor-pointer"
        >
          <option value="recent">Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Review cards */}
      {reviewList.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {pageReviews.map((review) => {
              const isExpanded = expandedIds.has(review._id);
              const isRatingExpanded = expandedRatingIds.has(review._id);
              const body: string = review.body ?? review.reviewBody ?? "";
              const isLong = body.length > 280;
              const reviewCategoryRatings = CATEGORY_FIELDS.map((cat) => ({
                label: cat.label,
                value:
                  typeof review[cat.key] === "number" ? review[cat.key] : null,
              })).filter((c) => c.value != null);

              return (
                <div
                  key={review._id}
                  className="flex shrink-0 flex-col bg-white border border-gray-200 p-5 rounded-md relative overflow-visible"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header: reviewer + rating */}
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
                            {review.reviewerCountry && (
                              <>{review.reviewerCountry} · </>
                            )}
                            Reviewed{" "}
                            {new Date(review._creationTime).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}
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
                            <Star
                              fill="currentColor"
                              className="text-lg text-sun-500 w-4 h-4"
                            />
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

                          {isRatingExpanded &&
                            reviewCategoryRatings.length > 0 && (
                              <div
                                role="dialog"
                                className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-20 flex flex-col gap-2.5"
                              >
                                {reviewCategoryRatings.map((cat) => (
                                  <div
                                    key={cat.label}
                                    className="flex items-center gap-3"
                                  >
                                    <span className="text-xs text-slate-500 w-28 shrink-0">
                                      {cat.label}
                                    </span>
                                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-cobalt-400 rounded-full"
                                        style={{
                                          width: `${((cat.value ?? 0) / 5) * 100}%`,
                                        }}
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

                    {/* Title */}
                    <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                      {review.reviewTitle ?? "Program Review"}
                    </h3>

                    {/* Body + pros/cons split */}
                    <div className="flex flex-col md:flex-row gap-5 md:gap-6 pt-4 border-t border-gray-100">
                      {/* Left: experience + thumbnails */}
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
                          if (photos.length === 0) return null;
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

                      {/* Right: pros & cons panel */}
                      <div className="flex flex-col gap-4 md:w-[28rem] md:shrink-0 bg-slate-50 border border-gray-200 rounded-md p-4">
                        <div className="flex flex-col gap-2">
                          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-fern-500">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Pros
                          </p>
                          <ul className="flex flex-col gap-1.5 text-sm text-neutral-700">
                            {FILLER_PROS.map((p, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-fern-500 font-bold shrink-0">
                                  +
                                </span>
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t border-gray-200" />
                        <div className="flex flex-col gap-2">
                          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-roman-500">
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Cons
                          </p>
                          <ul className="flex flex-col gap-1.5 text-sm text-neutral-700">
                            {FILLER_CONS.map((c, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-roman-500 font-bold shrink-0">
                                  −
                                </span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-full flex items-center justify-center">
              <nav className="flex items-center text-gray-600 text-xs md:text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 mr-2 md:mr-4 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-sm rounded font-medium transition-colors cursor-pointer ${
                        p === page
                          ? "bg-cobalt-500 text-white"
                          : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 ml-2 md:ml-4 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

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

"use client";

import { useState } from "react";
import {
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const REVIEWS_PER_PAGE = 5;

type ReviewSort = "recent" | "highest" | "lowest";

function renderStars(ratingOutOf10: number) {
  // Each star = 2 points (out of 10 = 5 stars)
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      fill={i < Math.round(ratingOutOf10 / 2) ? "currentColor" : "none"}
      className="w-3 h-3 text-sun-500"
    />
  ));
}

export function ReviewsSection({
  reviews,
  avgRating,
  provider,
}: {
  reviews: any[] | undefined;
  avgRating: number;
  provider: string;
}) {
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const reviewList = reviews ?? [];

  const categoryRatings = [
    { label: "Academics", key: "academicsRating" },
    { label: "Living Situation", key: "livingSituationRating" },
    { label: "Cultural Immersion", key: "culturalImmersionRating" },
    { label: "Program Administration", key: "programAdministrationRating" },
    { label: "Health & Safety", key: "healthAndSafetyRating" },
    { label: "Community", key: "communityRating" },
  ].map((cat) => {
    const values = reviewList
      .map((r: any) => r[cat.key])
      .filter((v: any) => v != null && typeof v === "number");
    const avg =
      values.length > 0
        ? values.reduce((sum: number, v: number) => sum + v, 0) / values.length
        : 0;
    return { label: cat.label, avg };
  });

  const sorted = [...reviewList].sort((a, b) => {
    if (sort === "recent") return b._creationTime - a._creationTime;
    if (sort === "highest") return b.overallRating - a.overallRating;
    if (sort === "lowest") return a.overallRating - b.overallRating;
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
                  className={`w-5 h-5 ${avgRating / 2 >= star ? "text-sun-500 fill-current" : "text-slate-300"}`}
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
                      style={{ width: `${(cat.avg / 10) * 100}%` }}
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
              const body: string = review.body ?? review.reviewBody ?? "";
              const isLong = body.length > 280;

              return (
                <div
                  key={review._id}
                  className="flex shrink-0 flex-col bg-white border border-gray-200 p-4 rounded-md justify-between relative overflow-visible"
                >
                  <div className="flex flex-col md:flex-row justify-between h-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <h3 className="text-lg font-bold">
                            {review.reviewTitle ?? "Program Review"}
                          </h3>
                          <small>
                            by:{" "}
                            <strong>
                              {review.reviewerName ?? "Anonymous"}
                            </strong>
                            {review.reviewerCountry && (
                              <span> - {review.reviewerCountry}</span>
                            )}
                          </small>
                        </div>
                        {review.overallRating != null && (
                          <div className="flex items-center gap-1 bg-slate-100 rounded-md px-2 ml-4">
                            <Star
                              fill="currentColor"
                              className="text-lg text-sun-500 w-4 h-4"
                            />
                            <span className="font-bold">
                              {Number(review.overallRating).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          !isExpanded && isLong ? "line-clamp-3" : ""
                        }`}
                      >
                        {body}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(review._id)}
                          className="mt-1 text-xs text-cobalt-500 font-bold cursor-pointer hover:underline"
                        >
                          {isExpanded ? "Hide full review" : "Read full review"}
                        </button>
                      )}
                      {review.photo && (
                        <div className="mt-2">
                          <img
                            src={review.photo}
                            alt="Review photo"
                            className="rounded-md max-h-40 object-cover"
                          />
                        </div>
                      )}
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
    </div>
  );
}

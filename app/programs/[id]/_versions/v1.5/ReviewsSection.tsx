"use client";

import { useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
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

function ProsCons() {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Pros */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 mb-1">
          <ThumbsUp className="w-3.5 h-3.5 text-fern-500" />
          <span className="text-xs font-bold text-fern-600">Pros</span>
          <span className="text-xs text-slate-400 italic">(placeholder)</span>
        </div>
        <ul className="flex flex-col gap-0.5">
          <li className="text-xs text-slate-400 italic">Great cultural immersion</li>
          <li className="text-xs text-slate-400 italic">Supportive program staff</li>
        </ul>
      </div>

      {/* Cons */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 mb-1">
          <ThumbsDown className="w-3.5 h-3.5 text-roman-500" />
          <span className="text-xs font-bold text-roman-600">Cons</span>
          <span className="text-xs text-slate-400 italic">(placeholder)</span>
        </div>
        <ul className="flex flex-col gap-0.5">
          <li className="text-xs text-slate-400 italic">Limited free time</li>
        </ul>
      </div>
    </div>
  );
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
  const [showRatingDetails, setShowRatingDetails] = useState(false);

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

      {/* Rating summary box */}
      <div className="flex flex-col items-center md:flex-row md:items-start text-xl lg:text-2xl p-4 bg-white justify-between border border-gray-200 rounded-md font-bold gap-2">
        <div className="grid grid-cols-2 gap-4 lg:gap-8 mb-2 w-full md:w-auto lg:mb-0 shrink-0">
          <div>
            <h3>Overall Rating</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {avgRating > 0 ? avgRating.toFixed(2) : "—"}
              </span>
              <div className="flex items-center gap-0.5">
                {renderStars(avgRating)}
              </div>
            </div>
          </div>
          <div>
            <h3>Total Reviews</h3>
            <div className="flex items-center text-lg lg:text-xl gap-2">
              <strong>{reviewList.length > 0 ? reviewList.length : "—"}</strong>
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="flex items-center md:items-end flex-col w-full">
          <button
            onClick={() => setShowRatingDetails((v) => !v)}
            className="text-sm border border-gray-200 rounded-md w-full py-2.5 px-5 bg-white gap-2 items-center flex justify-center cursor-pointer"
          >
            {showRatingDetails ? "Hide rating details" : "Show rating details"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showRatingDetails ? "rotate-180" : ""
              }`}
            />
          </button>
          {showRatingDetails && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm shrink-0 bg-white border border-gray-200 px-4 py-6 rounded-md w-full mt-2">
              {categoryRatings.map((cat) => (
                <div key={cat.label} className="flex flex-col gap-1">
                  <span className="font-bold">{cat.label}</span>
                  <div className="flex gap-1 items-center">
                    {renderStars(cat.avg)}
                    <span>{cat.avg.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="rounded-md bg-roman-500 text-white font-bold text-sm mt-4 w-full py-2.5 md:hidden cursor-pointer">
            Review this Program
          </button>
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
        <div className="text-center py-12 text-slate-400">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium text-slate-500 mb-1">No reviews yet</p>
          <p className="text-sm mb-4">Share your experience to help others choose the right program.</p>
          <button className="bg-roman-500 text-white text-sm font-bold rounded-md px-5 py-2.5 cursor-pointer">
            Be the first to review this program
          </button>
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
                    <div className="flex flex-col gap-2 w-full">
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

                      <ProsCons />
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

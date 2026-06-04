"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { ProviderReview } from "../../_components/types";

const INITIAL = 3;

interface Props {
  reviews: ProviderReview[];
  avgRating: number;
  reviewCount: number;
}

export default function V1ProviderReviews({ reviews, avgRating, reviewCount }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (reviewCount === 0) return null;

  const sorted = [...reviews].sort((a, b) => b._creationTime - a._creationTime);
  const visible = showAll ? sorted : sorted.slice(0, INITIAL);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Reviews</h2>

      <div className="border border-slate-200 rounded-md p-5 sm:p-6 bg-white mb-4">
        <div className="flex items-center flex-wrap gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
            {avgRating.toFixed(1)}
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
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"} across all programs
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-slate-200 p-5 rounded-md"
          >
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
                    {new Date(review._creationTime).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {review.overallRating != null && (
                <div className="flex items-center gap-1 rounded-md px-2 py-1 bg-slate-100 shrink-0">
                  <Star fill="currentColor" className="text-sun-500 w-4 h-4" />
                  <span className="font-bold text-sm">
                    {Number(review.overallRating).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {review.reviewTitle && (
              <h3 className="text-base font-bold text-neutral-900 mt-3">
                {review.reviewTitle}
              </h3>
            )}
            {review.body && (
              <p className="text-sm leading-relaxed text-neutral-700 mt-2 line-clamp-3">
                {review.body}
              </p>
            )}
            {review.programTitle && (
              <p className="text-xs text-slate-400 mt-3">
                On <span className="font-semibold text-slate-500">{review.programTitle}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {sorted.length > INITIAL && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center justify-center h-10 px-5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {showAll ? "Show fewer reviews" : `View all ${sorted.length} reviews`}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { Star } from "lucide-react";

interface InquiryReviewsProps {
  programId: string;
  reviews: any[] | undefined;
  avgRating: number;
}

// Static breakdown percentages for the prototype
const RATING_BREAKDOWN = [
  { stars: 5, pct: 60 },
  { stars: 4, pct: 25 },
  { stars: 3, pct: 10 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

// Static placeholder review cards shown when no real data is available
const PLACEHOLDER_REVIEWS = [
  {
    id: "placeholder-1",
    name: "Maria G.",
    meta: "Study in Paris · Fall 2024",
    rating: 5,
    body: "An incredible experience from start to finish. The program advisors were responsive and helped me navigate every step of the application process. Living and studying abroad completely changed my perspective.",
  },
  {
    id: "placeholder-2",
    name: "James T.",
    meta: "Study in Paris · Spring 2024",
    rating: 4,
    body: "Great academic environment and a truly welcoming host institution. The housing was convenient and the city itself is endlessly exciting. I'd recommend this program to any student serious about growing globally.",
  },
];

function StarRow({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={i < filled ? "text-amber-500 fill-amber-500" : "text-zinc-300 fill-zinc-300"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof PLACEHOLDER_REVIEWS)[0] }) {
  const initial = review.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-5 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Author info */}
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-cobalt-500 text-white text-[13px] font-semibold flex items-center justify-center shrink-0">
            {initial}
          </div>
          {/* Name + meta */}
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-zinc-900 leading-tight">
              {review.name}
            </span>
            <span className="text-[12px] text-zinc-500 leading-tight">
              {review.meta}
            </span>
          </div>
        </div>
        {/* Stars */}
        <StarRow rating={review.rating} size={14} />
      </div>

      {/* Quote */}
      <p className="text-[14px] text-zinc-600 leading-[1.5]">
        &ldquo;{review.body}&rdquo;
      </p>
    </div>
  );
}

export default function InquiryReviews({
  reviews,
  avgRating,
}: InquiryReviewsProps) {
  const reviewCount = reviews?.length ?? 0;

  // Normalize rating: if the scale is out of 10, convert to out of 5
  const normalizedRating = avgRating > 5 ? avgRating / 2 : avgRating;

  // Build display review list — use real data if available, otherwise placeholders
  const displayReviews: (typeof PLACEHOLDER_REVIEWS)[0][] =
    reviews && reviews.length > 0
      ? reviews.slice(0, 2).map((r) => ({
          id: r._id,
          name: r.reviewerName ?? "Anonymous",
          meta: r.date ?? "",
          rating: r.overallRating > 5 ? r.overallRating / 2 : r.overallRating,
          body: r.body ?? "",
        }))
      : PLACEHOLDER_REVIEWS;

  // Approximate per-star counts from percentages and total
  const totalForBreakdown = reviewCount > 0 ? reviewCount : 100;
  const breakdownCounts = RATING_BREAKDOWN.map((row) => ({
    ...row,
    count: Math.round((row.pct / 100) * totalForBreakdown),
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Section header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[22px] font-semibold text-zinc-900">
          Student Reviews
        </h2>
        <button
          type="button"
          className="text-[14px] font-medium text-cobalt-500 hover:underline"
        >
          See All Reviews &rarr;
        </button>
      </div>

      {/* Reviews body */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Rating Overview card */}
        <div className="w-full lg:w-[280px] lg:shrink-0 bg-zinc-50 rounded-lg border border-zinc-200 p-6 flex flex-col gap-4">
          {/* Big rating */}
          <div className="flex items-center gap-3">
            <span className="text-[40px] font-bold text-zinc-900 leading-none">
              {normalizedRating > 0 ? normalizedRating.toFixed(1) : "—"}
            </span>
            <div className="flex flex-col gap-0.5">
              <StarRow rating={normalizedRating} size={14} />
              <span className="text-[13px] text-zinc-500">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="flex flex-col gap-1.5">
            {breakdownCounts.map((row) => (
              <div key={row.stars} className="flex items-center gap-2">
                {/* Star label */}
                <span className="text-[13px] text-zinc-500 w-4 text-right">
                  {row.stars}
                </span>
                {/* Star icon */}
                <Star
                  size={12}
                  aria-hidden="true"
                  className="text-amber-500 fill-amber-500 shrink-0"
                />
                {/* Bar */}
                <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                {/* Count */}
                <span className="text-[13px] text-zinc-400 w-6 text-right">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Review Cards */}
        <div className="flex-1 flex flex-col gap-4">
          {displayReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

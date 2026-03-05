"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageSquare, ChevronDown, ChevronUp, Star } from "lucide-react";

interface ProgramReviewsProps {
  programId: string;
}

interface Review {
  _id: string;
  _creationTime: number;
  reviewTitle: string;
  reviewerName: string;
  reviewerCountry?: string;
  date: string;
  overallRating: number;
  body: string;
  photo?: string;
  academicsRating: number;
  livingSituationRating: number;
  culturalImmersionRating: number;
  programAdministrationRating: number;
  healthAndSafetyRating: number;
  communityRating: number;
  status: string;
}

type SortBy = "recent" | "highest" | "lowest";

interface ReviewCardProps {
  review: Review;
}


function StarDisplay({ rating }: { rating?: number }) {
  if (rating == null) return null;
  return (
    <span className="flex items-center gap-1">
      <span className="text-amber-400 text-sm">★</span>
      <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
    </span>
  );
}

function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryRatings: { label: string; value: number }[] = [
    { label: "Academics", value: review.academicsRating },
    { label: "Living Situation", value: review.livingSituationRating },
    { label: "Cultural Immersion", value: review.culturalImmersionRating },
    { label: "Program Administration", value: review.programAdministrationRating },
    { label: "Health & Safety", value: review.healthAndSafetyRating },
    { label: "Community", value: review.communityRating },
  ];

  const hasCategories = categoryRatings.some((c) => c.value != null);

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900 truncate">
            {review.reviewTitle}
          </h3>
          <p className="text-sm italic text-slate-400 mt-0.5">
            {review.date}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Overall rating badge */}
          <span className="flex items-center gap-1.5 text-sun-700">
            <span className="text-amber-400 text-lg">★</span>
            <span className="font-bold text-lg">{review.overallRating}</span>
          </span>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse review" : "Expand review"}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Reviewer */}
      <p className="text-sm text-slate-600 mt-1">
        by{" "}
        <span className="font-semibold text-slate-800">{review.reviewerName}</span>
        {review.reviewerCountry && (
          <span> - {review.reviewerCountry}</span>
        )}
      </p>

      <hr className="border-slate-100 my-3" />

      {/* Body */}
      <div className="relative">
        {review.photo && (
          <img
            src={review.photo}
            alt="Review photo"
            className="w-20 h-16 object-cover rounded-lg ml-4 float-right"
          />
        )}
        <p
          className={`text-sm text-slate-700 leading-relaxed mt-3 ${expanded ? "" : "line-clamp-3"
            }`}
        >
          {review.body}
        </p>
      </div>

      {/* Expand / collapse toggle */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="text-sm font-semibold text-cobalt-500 hover:underline cursor-pointer flex items-center gap-1 mt-3"
      >
        {expanded ? (
          <>
            Hide full review <ChevronUp size={14} />
          </>
        ) : (
          <>
            Show full review <ChevronDown size={14} />
          </>
        )}
      </button>

      {/* Category ratings — only shown when expanded */}
      {expanded && hasCategories && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 pt-4 border-t border-slate-100">
          {categoryRatings.map((category) => (
            <div key={category.label} className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 min-w-0">
                {category.label}
              </span>
              <StarDisplay rating={category.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  avgRating,
  totalReviews,
}: {
  avgRating: number;
  totalReviews: number;
}) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white flex flex-wrap sm:flex-nowrap items-center justify-around sm:justify-start gap-6 sm:gap-12 mb-6">
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
          Overall Rating
        </p>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {avgRating.toFixed(2)}
          </span>
          <span className="text-amber-400 text-2xl">★</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
          Total Reviews
        </p>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {totalReviews}
          </span>
          <MessageSquare size={24} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

export default function ProgramReviews({ programId }: ProgramReviewsProps) {
  const [sortBy, setSortBy] = useState<SortBy>("recent");

  const reviews = useQuery(api.reviews.listReviewsByProgram, {
    programId: programId as Id<"programs">,
    status: "published",
  });

  // Loading state
  if (reviews === undefined) {
    return (
      <section className="pt-10 border-t border-slate-100">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-4 bg-slate-100 rounded w-72" />
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-40 bg-slate-100 rounded-xl" />
          <div className="h-40 bg-slate-100 rounded-xl" />
        </div>
      </section>
    );
  }

  const avgRating =
    reviews.length > 0
      ? Math.round(
        (reviews.reduce((sum, r) => sum + r.overallRating, 0) /
          reviews.length) *
        100
      ) / 100
      : 0;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.overallRating - a.overallRating;
    if (sortBy === "lowest") return a.overallRating - b.overallRating;
    // "recent" — newest first
    return b._creationTime - a._creationTime;
  });

  return (
    <section
      aria-labelledby="reviews-heading"
      className="pt-10 border-t border-slate-100"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2
            id="reviews-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Program Reviews
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Hear what past participants have to say about the programs
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors"
          >
            Review this Program
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          >
            <option value="recent">Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Summary card */}
      {reviews.length > 0 && (
        <SummaryCard avgRating={avgRating} totalReviews={reviews.length} />
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
          <Star size={40} className="mb-3 text-slate-300" />
          <p className="text-base font-medium text-slate-500">
            No reviews yet
          </p>
          <p className="text-sm mt-1">
            Be the first to share your experience with this program.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review._id} review={review as Review} />
          ))}
        </div>
      )}
    </section>
  );
}

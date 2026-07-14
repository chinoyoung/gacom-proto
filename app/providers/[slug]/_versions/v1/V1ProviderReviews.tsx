"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Provider, ProviderReview } from "../../_components/types";
import V1ReviewSummary from "@/app/programs/[id]/_versions/v1/V1ReviewSummary";
import V1ReviewCard from "@/app/programs/[id]/_versions/v1/V1ReviewCard";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoryAverages {
  academicsRating: number | null;
  livingSituationRating: number | null;
  culturalImmersionRating: number | null;
  programAdministrationRating: number | null;
  healthAndSafetyRating: number | null;
  communityRating: number | null;
}

interface ReviewStats {
  total: number;
  avg: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  categoryAverages: CategoryAverages;
}

const CATEGORY_KEYS = [
  "academicsRating",
  "livingSituationRating",
  "culturalImmersionRating",
  "programAdministrationRating",
  "healthAndSafetyRating",
  "communityRating",
] as const;

// ── Props ─────────────────────────────────────────────────────────────────────

interface V1ProviderReviewsProps {
  provider: Provider;
  reviews: ProviderReview[] | undefined;
  avgRating: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function V1ProviderReviews({
  provider,
  reviews,
  avgRating,
}: V1ProviderReviewsProps) {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const stats: ReviewStats = useMemo(() => {
    const list = reviews ?? [];

    const distribution: ReviewStats["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of list) {
      if (typeof r.overallRating !== "number") continue;
      const star = Math.round(r.overallRating);
      if (star >= 1 && star <= 5) {
        distribution[star as 1 | 2 | 3 | 4 | 5] += 1;
      }
    }

    const categoryAverages = CATEGORY_KEYS.reduce((acc, key) => {
      const values = list
        .map((r) => r[key])
        .filter((v): v is number => typeof v === "number");
      acc[key] = values.length > 0
        ? values.reduce((sum, v) => sum + v, 0) / values.length
        : null;
      return acc;
    }, {} as CategoryAverages);

    return {
      total: list.length,
      avg: avgRating,
      distribution,
      categoryAverages,
    };
  }, [reviews, avgRating]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (reviews === undefined) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-md w-64" />
        <div className="border border-slate-200 rounded-md bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="h-12 w-16 bg-slate-200 rounded-md" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-3 w-20 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="h-24 bg-slate-100 rounded-md" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-md p-5 space-y-3">
              <div className="h-4 bg-slate-200 rounded-md w-40" />
              <div className="h-3 bg-slate-100 rounded-md w-full" />
              <div className="h-3 bg-slate-100 rounded-md w-[85%]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Reviews of {provider.name}
        </h2>
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
          <p className="text-sm text-slate-500">
            No reviews yet for {provider.name}&apos;s programs.
          </p>
        </div>
      </div>
    );
  }

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filteredReviews =
    selectedStar === null
      ? reviews
      : reviews.filter(
          (r) =>
            typeof r.overallRating === "number" &&
            Math.round(r.overallRating) === selectedStar
        );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-slate-900">
        Reviews of {provider.name}
      </h2>

      <V1ReviewSummary
        stats={stats}
        provider={provider.name}
        selectedStar={selectedStar}
        onSelectStar={setSelectedStar}
        ctaLabel="Review this provider"
      />

      {filteredReviews.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-slate-500">No reviews match this filter.</p>
          <button
            type="button"
            onClick={() => setSelectedStar(null)}
            className="text-sm font-semibold text-cobalt-500 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReviews.map((r) => (
            <div key={r._id}>
              {r.programSlug ? (
                <Link
                  href={`/programs/${r.programSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-500 hover:underline mb-1.5"
                >
                  From: {r.programTitle}
                </Link>
              ) : (
                <span className="inline-block text-xs font-semibold text-slate-500 mb-1.5">
                  From: {r.programTitle}
                </span>
              )}
              <V1ReviewCard review={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

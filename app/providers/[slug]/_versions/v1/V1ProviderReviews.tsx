"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Provider, ProviderReview } from "../../_components/types";
import Pagination from "../../_components/Pagination";
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

type SortOption = "recent" | "highest" | "lowest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
];

const ITEMS_PER_PAGE = 3;

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
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [page, setPage] = useState(0);

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

  // ── Filter option lists (distinct program titles / reviewer countries) ────
  const typeOptions = useMemo(() => {
    const list = reviews ?? [];
    const titles = new Set<string>();
    for (const r of list) {
      if (r.programTitle) titles.add(r.programTitle);
    }
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [reviews]);

  const countryOptions = useMemo(() => {
    const list = reviews ?? [];
    const countries = new Set<string>();
    for (const r of list) {
      if (r.reviewerCountry) countries.add(r.reviewerCountry);
    }
    return Array.from(countries).sort((a, b) => a.localeCompare(b));
  }, [reviews]);

  // ── Filtered + sorted list (client-side over the full reviews array) ──────
  const filteredAndSorted = useMemo(() => {
    const list = reviews ?? [];

    const filtered = list.filter((r) => {
      if (typeFilter !== "all" && r.programTitle !== typeFilter) return false;
      if (countryFilter !== "all" && r.reviewerCountry !== countryFilter) return false;
      return true;
    });

    if (sort === "highest") {
      return [...filtered].sort(
        (a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0)
      );
    }
    if (sort === "lowest") {
      return [...filtered].sort(
        (a, b) => (a.overallRating ?? 0) - (b.overallRating ?? 0)
      );
    }
    // "recent": keep original order — review dates aren't consistently
    // parseable across the prototype's seed data, so we don't re-sort.
    return filtered;
  }, [reviews, typeFilter, countryFilter, sort]);

  // ── Paginated slice for the current page ───────────────────────────────────
  const paginatedReviews = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, page]);

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

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setPage(0);
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountryFilter(e.target.value);
    setPage(0);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as SortOption);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {provider.name} Reviews
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Hear what past participants have to say about {provider.name}
          </p>
        </div>

        {reviews.length > 3 && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={typeFilter}
              onChange={handleTypeChange}
              aria-label="Filter by type"
              className="text-sm border border-slate-200 rounded-md px-2.5 py-2 text-slate-600 bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              <option value="all">All Types</option>
              {typeOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            <select
              value={countryFilter}
              onChange={handleCountryChange}
              aria-label="Filter by country"
              className="text-sm border border-slate-200 rounded-md px-2.5 py-2 text-slate-600 bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              <option value="all">All Countries</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={handleSortChange}
              aria-label="Sort reviews"
              className="text-sm border border-slate-200 rounded-md px-2.5 py-2 text-slate-600 bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <V1ReviewSummary
          stats={stats}
          provider={provider.name}
          interactive={false}
          ctaLabel="Review this Provider"
        />
      )}

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="bg-sun-500/15 flex h-10 w-10 items-center justify-center rounded-md">
            <Star className="text-sun-600 h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Be the first to review {provider.name}
          </h3>
          <p className="max-w-sm text-sm text-slate-500">
            If you&apos;ve participated with this provider, your review helps
            future students decide.
          </p>
          <button
            type="button"
            className="bg-roman-500 hover:bg-roman-600 inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roman-500 focus-visible:ring-offset-1"
          >
            Review this Provider
          </button>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No reviews match these filters. Try clearing them.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginatedReviews.map((r) => (
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

          {filteredAndSorted.length > ITEMS_PER_PAGE && (
            <Pagination
              current={page + 1}
              max={Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

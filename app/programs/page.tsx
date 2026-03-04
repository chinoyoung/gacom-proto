"use client";

import ProgramCard from "@/components/ProgramCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
// (Removing internal Program interface as generic card handles it)
// (Removing CardSkeleton as it's small)
function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-1.5 mt-3">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-14" />
        </div>
        <div className="h-9 bg-gray-200 rounded-lg mt-2" />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
      <h2 className="text-xl font-bold text-gray-700 mb-2">
        No Programs Listed Yet
      </h2>
      <p className="text-gray-500 mb-6 max-w-sm">
        There are no published study abroad programs at this time. Check back
        soon or create a new listing.
      </p>
      <Link
        href="/admin/create-listing"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create New Listing
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramsIndexPage() {
  const programs = useQuery(api.programs.listPrograms, {
    status: "published",
  });

  const isLoading = programs === undefined;
  const isEmpty = !isLoading && programs.length === 0;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Browse Programs
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {isLoading
                  ? "Loading programs..."
                  : `${programs.length} study abroad program${programs.length !== 1 ? "s" : ""} available`}
              </p>
            </div>

            <Link
              href="/admin/create-listing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shrink-0 self-start sm:self-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create New Listing
            </Link>
          </div>
        </div>
      </div>

      {/* Programs grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : isEmpty ? (
            <EmptyState />
          ) : (
            programs.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

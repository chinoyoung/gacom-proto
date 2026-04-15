"use client";

import { ProgramHeroSkeleton } from "./ProgramHero";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumbs skeleton */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="h-4 bg-slate-200 rounded w-12" />
          <div className="h-3 bg-slate-100 rounded w-2" />
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-100 rounded w-2" />
          <div className="h-4 bg-slate-100 rounded w-20" />
        </div>
      </nav>

      <ProgramHeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <div className="flex-1 min-w-0 space-y-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-7 bg-slate-200 rounded w-48 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-[95%]" />
                  <div className="h-4 bg-slate-100 rounded w-[90%]" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-80 xl:w-80 shrink-0 space-y-4">
            <div className="h-56 bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-96 bg-slate-50 rounded-xl border border-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

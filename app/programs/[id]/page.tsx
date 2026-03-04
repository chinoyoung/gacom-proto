"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPin, Calendar, ClipboardList, Coins } from "lucide-react";

import ProgramHero from "./_components/ProgramHero";
import QuickDetails from "./_components/QuickDetails";
import ApplyCTA from "./_components/ApplyCTA";
import ProgramOverview from "./_components/ProgramOverview";
import WhatsIncluded from "./_components/WhatsIncluded";
import SubjectAreas from "./_components/SubjectAreas";
import ProgramHighlights from "./_components/ProgramHighlights";
import PhotoGallery from "./_components/PhotoGallery";
import RelatedPrograms from "./_components/RelatedPrograms";
import ProgramArticles from "./_components/ProgramArticles";
import type { Program } from "./_components/types";

// ─── Static prototype values ───────────────────────────────────────────────────

const STATIC_RATING = 8.41;
const STATIC_REVIEW_COUNT = 103;

// ─── Stats strip ──────────────────────────────────────────────────────────────

function StatsStrip({ program }: { program: Program }) {
  return (
    <div className="border-t border-[#E5E9F0] bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 py-3 text-[13px] text-slate-500 font-sans">

          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#172B4D]">{STATIC_RATING}</span>
            <span className="text-[#D98C12]">★</span>
            <span className="ml-1">· {STATIC_REVIEW_COUNT} reviews</span>
          </div>

          <span className="text-slate-300">|</span>

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0B5C85]" aria-hidden="true" />
            <span>
              {program.city}, {program.country}
            </span>
          </div>

          {/* Terms */}
          {program.terms.length > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-[#0B5C85]" aria-hidden="true" />
                <span>
                  {program.terms
                    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                    .join(", ")}
                </span>
              </div>
            </>
          )}

          {/* Cost */}
          {program.cost && (
            <>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#0B5C85]" aria-hidden="true" />
                <span>{program.cost}</span>
              </div>
            </>
          )}

          {/* Deadline */}
          {program.applicationDeadline && (
            <>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C85A53]" aria-hidden="true" />
                <span>Deadline: {program.applicationDeadline}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile sticky CTA bar ─────────────────────────────────────────────────────

function MobileStickyBar({ program }: { program: Program }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        className="flex-1 px-4 py-2.5 border-2 border-cobalt-500 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-500/[0.07] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
      >
        Send Inquiry
      </button>
      {program.applyUrl ? (
        <a
          href={program.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-4 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
        >
          Apply Now
        </a>
      ) : (
        <button
          type="button"
          className="flex-1 px-4 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2 cursor-pointer"
        >
          Apply Now
        </button>
      )}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[420px] bg-slate-200" />
      {/* Stats strip skeleton */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex gap-6">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-4 bg-slate-200 rounded w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column skeleton */}
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <div className="h-6 bg-slate-200 rounded w-48 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-4/6" />
              </div>
            </div>
            <div>
              <div className="h-6 bg-slate-200 rounded w-40 mb-4" />
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-48 rounded-lg overflow-hidden">
                <div className="col-span-2 row-span-2 bg-slate-200" />
                <div className="bg-slate-200" />
                <div className="bg-slate-200" />
                <div className="bg-slate-200" />
                <div className="bg-slate-200" />
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:w-[320px] xl:w-[340px] shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="h-14 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-10 bg-slate-200 rounded-lg" />
                <div className="h-10 bg-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="h-12 bg-slate-200" />
              <div className="p-5 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-4 h-4 bg-slate-200 rounded mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-200 rounded w-24" />
                      <div className="h-4 bg-slate-200 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 404 state ────────────────────────────────────────────────────────────────

function ProgramNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <svg
        className="w-16 h-16 text-slate-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Program Not Found
      </h1>
      <p className="text-slate-600 mb-6">
        The program you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <a
        href="/programs"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
      >
        Browse All Programs
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params?.id as string | undefined;

  const program = useQuery(
    api.programs.getBySlug,
    slug ? { slug } : "skip"
  );

  if (program === undefined) {
    return <LoadingSkeleton />;
  }

  if (program === null) {
    return <ProgramNotFound />;
  }

  return (
    <>
      <main className="pb-20 lg:pb-0">
        {/* Full-width hero */}
        <ProgramHero program={program} />

        {/* Stats strip — quick-glance bar below hero */}
        <StatsStrip program={program} />

        {/* Page content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left column ── */}
            <div className="flex-1 min-w-0 space-y-10">
              {/* 1. Overview — context first */}
              <ProgramOverview program={program} />

              {/* 2. Highlights — value proposition before media */}
              <ProgramHighlights program={program} />

              {/* 3. What's Included — concrete value drivers */}
              <WhatsIncluded program={program} />

              {/* 4. Photo gallery — aspiration / social proof */}
              <PhotoGallery program={program} />

              {/* 5. Subject areas — discovery / SEO */}
              <SubjectAreas program={program} />
            </div>

            {/* ── Right sidebar ── */}
            <div className="lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-6 self-start space-y-4">
              {/* Apply CTA first — primary conversion goal */}
              <ApplyCTA program={program} />

              {/* Quick details second — supporting info */}
              <QuickDetails program={program} />
            </div>

          </div>

          {/* Related Articles Section */}
          <ProgramArticles />

          {/* Related Programs Section */}
          <RelatedPrograms currentProgramId={program._id} />
        </div>
      </main>

      {/* Mobile sticky apply bar */}
      <MobileStickyBar program={program} />
    </>
  );
}

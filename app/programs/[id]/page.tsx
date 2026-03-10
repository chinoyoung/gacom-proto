"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Bookmark, ExternalLink } from "lucide-react";
import { api } from "@/convex/_generated/api";

import ProgramHero, { ProgramHeroSkeleton } from "./_components/ProgramHero";
import QuickDetails from "./_components/QuickDetails";
import ProgramOverview from "./_components/ProgramOverview";
import WhatsIncluded from "./_components/WhatsIncluded";
import SubjectAreas from "./_components/SubjectAreas";
import ProgramHighlights from "./_components/ProgramHighlights";
import ProgramReviews from "./_components/ProgramReviews";
import WhyChooseProgram from "./_components/WhyChooseProgram";
import RelatedPrograms from "./_components/RelatedPrograms";
import ProgramArticles from "./_components/ProgramArticles";
import type { Program } from "./_components/types";
import { Id } from "@/convex/_generated/dataModel";

// ─── Desktop sticky header ─────────────────────────────────────────────────────

const STICKY_RATING = 8.41;
const STICKY_REVIEW_COUNT = 103;

function StickyProgramHeader({
  program,
  visible,
  saved,
  onToggleSave,
}: {
  program: Program;
  visible: boolean;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={[
        "hidden lg:block",
        "fixed top-0 left-0 right-0 z-50",
        "bg-white border-b border-slate-200 shadow-sm",
        "transition-transform duration-200",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">
        {/* Left: logo + title + rating */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {program.providerLogo && (
            <div className="shrink-0 w-8 h-8 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
              <img
                src={program.providerLogo}
                alt={`${program.provider} logo`}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          )}

          <p className="font-semibold text-slate-900 text-sm truncate">
            {program.title}
          </p>

          <span className="shrink-0 flex items-center gap-1 text-xs text-sun-700 font-medium">
            <span className="text-sun-500" aria-hidden="true">★</span>
            {STICKY_RATING}
            <span className="text-slate-500 font-normal">· {STICKY_REVIEW_COUNT} reviews</span>
          </span>
        </div>

        {/* Right: CTAs — button hierarchy */}
        <div className="flex items-center gap-3 shrink-0">
          {program.applyUrl && (
            <a
              href={program.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt-600 hover:text-cobalt-700 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              Visit Website
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            className="inline-flex justify-center items-center px-5 py-2 border-2 border-cobalt-500 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
          >
            Inquire
          </button>

          {program.applyUrl ? (
            <a
              href={program.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
            >
              Apply Now
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex justify-center items-center px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
            >
              Apply Now
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSave}
            className={`inline-flex justify-center items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2 ${
              saved
                ? "bg-cobalt-50 border-cobalt-300 text-cobalt-600"
                : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
            }`}
            aria-label={saved ? "Unsave program" : "Save program"}
          >
            <Bookmark
              className="w-4 h-4"
              fill={saved ? "currentColor" : "none"}
              strokeWidth={2}
            />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile sticky CTA bar ─────────────────────────────────────────────────────

function MobileStickyBar({ program }: { program: Program }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex gap-3 shadow-lg">
      <button
        type="button"
        className="flex-1 px-4 py-2.5 border-2 border-cobalt-500 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
      >
        Inquire
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

  const reviews = useQuery(
    api.reviews.listReviewsByProgram,
    program?._id ? { programId: program._id as Id<"programs">, status: "published" } : "skip"
  );

  const avgRating =
    reviews && reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length) * 100
        ) / 100
      : 0;

  const [saved, setSaved] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky header when the hero is no longer intersecting
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [program]);

  if (program === undefined) {
    return <LoadingSkeleton />;
  }

  if (program === null) {
    return <ProgramNotFound />;
  }

  return (
    <>
      <StickyProgramHeader program={program} visible={stickyVisible} saved={saved} onToggleSave={() => setSaved((v) => !v)} />

      <main className="pb-20 lg:pb-0">
        {/* Breadcrumbs — full width above hero, not on hero background */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 mb-3">
          {/* Mobile: simple back link */}
          <Link
            href="/programs"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Programs
          </Link>

          {/* Desktop: full breadcrumb trail */}
          <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link
                href="/"
                className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link
                href="/programs"
                className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
              >
                Programs
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link
                href={`/programs?city=${encodeURIComponent(program.city)}`}
                className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
              >
                {program.city}
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li
              className="text-slate-700 font-medium truncate max-w-60"
              aria-current="page"
            >
              {program.title}
            </li>
          </ol>
        </nav>

        {/* Full-width hero — observed to trigger sticky header */}
        <div ref={heroRef}>
          <ProgramHero program={program} />
        </div>

        {/* Page content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

            {/* ── Left column ── */}
            <div className="flex-1 min-w-0 space-y-20">
              {/* 1. Overview — context first */}
              <ProgramOverview program={program} />

              {/* 2. Highlights — key selling points */}
              <ProgramHighlights program={program} />

              {/* 3. What's Included — concrete value up front */}
              <WhatsIncluded program={program} />
            </div>

            {/* ── Right sidebar ── */}
            <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-6 lg:self-start space-y-4">
              {/* Quick details second — supporting info */}
              <QuickDetails program={program} />
            </div>

          </div>

          {/* Full-width sections — below the sidebar */}
          <div className="space-y-20 mt-20">
            {/* 4. Reviews */}
            <ProgramReviews programId={program._id} />

            {/* 5. Why Students Choose This Program */}
            <WhyChooseProgram
              program={program}
              avgRating={avgRating}
              totalReviews={reviews?.length ?? 0}
            />

            {/* 6. Subject areas — discovery / SEO */}
            <SubjectAreas program={program} />
          </div>

          {/* Related Articles Section */}
          <ProgramArticles />

          {/* Related Programs Section */}
          <RelatedPrograms currentProgramId={program._id} subjectAreas={program.subjectAreas ?? []} />
        </div>
      </main>

      {/* Mobile sticky apply bar */}
      <MobileStickyBar program={program} />
    </>
  );
}

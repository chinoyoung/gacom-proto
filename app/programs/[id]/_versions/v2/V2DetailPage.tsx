"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { Program } from "../../_components/types";
import ProgramHero from "../../_components/ProgramHero";
import QuickDetails from "../../_components/QuickDetails";
import ProgramOverview from "../../_components/ProgramOverview";
import WhatsIncluded from "../../_components/WhatsIncluded";
import ProgramHighlights from "../../_components/ProgramHighlights";
import ProgramReviews from "../../_components/ProgramReviews";
import WhyChooseProgram from "../../_components/WhyChooseProgram";
import RelatedPrograms from "../../_components/RelatedPrograms";
import ProgramArticles from "../../_components/ProgramArticles";
import ProgramDetails from "../../_components/ProgramDetails";
import StickyProgramHeader from "../../_components/StickyProgramHeader";
import MobileStickyBar from "../../_components/MobileStickyBar";

interface V2DetailPageProps {
  program: Program;
  reviews: any[] | undefined;
  avgRating: number;
}

export default function V2DetailPage({
  program,
  reviews,
  avgRating,
}: V2DetailPageProps) {
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

  return (
    <>
      <StickyProgramHeader
        program={program}
        visible={stickyVisible}
        saved={saved}
        onToggleSave={() => setSaved((v) => !v)}
      />

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
            <ProgramDetails program={program} />

            {/* 4. Reviews */}
            <ProgramReviews programId={program._id} />

            {/* 5. Why Students Choose This Program */}
            <WhyChooseProgram
              program={program}
              avgRating={avgRating}
              totalReviews={reviews?.length ?? 0}
            />
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

"use client";

import Link from "next/link";
import {
  BookOpen,
  Globe,
  GraduationCap,
  Briefcase,
  Languages,
  Users,
  CheckCircle2,
  MapPin,
  House,
  Timer,
  Calendar,
  CalendarClock,
  School,
} from "lucide-react";

import type { Program } from "../../_components/types";
import RelatedPrograms from "../../_components/RelatedPrograms";
import MobileStickyBar from "../../_components/MobileStickyBar";
import InquiryHero from "./InquiryHero";
import TrustBar from "./TrustBar";
import InquirySidebar from "./InquirySidebar";
import PricingBar from "./PricingBar";
import InquiryReviews from "./InquiryReviews";
import InquiryFormSection from "./InquiryFormSection";

interface V4DetailPageProps {
  program: Program;
  reviews: any[] | undefined;
  avgRating: number;
}

// Maps highlight index to a Lucide icon so we cycle through a set of
// contextual icons without trying to parse the highlight text.
const HIGHLIGHT_ICONS = [
  Languages,
  House,
  Briefcase,
  Globe,
  GraduationCap,
  Users,
  BookOpen,
];

function getHighlightIcon(index: number) {
  return HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];
}

interface DetailItem {
  icon: React.ElementType;
  label: string;
  value: string;
}

function buildDetailItems(program: Program): DetailItem[] {
  const items: (DetailItem | null)[] = [
    program.city && program.country
      ? { icon: MapPin, label: "Location", value: `${program.city}, ${program.country}` }
      : null,
    program.housingType
      ? { icon: House, label: "Housing", value: program.housingType }
      : null,
    program.duration
      ? { icon: Timer, label: "Duration", value: program.duration }
      : null,
    program.subjectAreas && program.subjectAreas.length > 0
      ? { icon: BookOpen, label: "Program Type", value: program.subjectAreas.join(", ") }
      : null,
    program.creditsAvailable
      ? { icon: GraduationCap, label: "Credits", value: program.creditsAvailable }
      : null,
    program.languageOfInstruction
      ? { icon: Languages, label: "Language", value: program.languageOfInstruction }
      : null,
    program.terms.length > 0
      ? { icon: Calendar, label: "Terms", value: program.terms.join(", ") }
      : null,
    program.applicationDeadline
      ? { icon: CalendarClock, label: "Deadline", value: program.applicationDeadline }
      : null,
    program.educationLevels.length > 0
      ? { icon: School, label: "Education Levels", value: program.educationLevels.join(", ") }
      : null,
  ];
  return items.filter(Boolean) as DetailItem[];
}

export default function V4DetailPage({
  program,
  reviews,
  avgRating,
}: V4DetailPageProps) {
  const descriptionParagraphs = program.description
    ? program.description.split(/\n\n+/).filter(Boolean)
    : [];

  const detailItems = buildDetailItems(program);

  return (
    <>
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="bg-zinc-100 border-b border-zinc-200">
        {/* Mobile: back link */}
        <Link
          href="/programs"
          className="sm:hidden flex items-center gap-1.5 py-2.5 px-4 text-sm text-zinc-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>

        {/* Desktop: full trail */}
        <ol className="hidden sm:flex items-center gap-1.5 py-2.5 max-w-7xl mx-auto px-4 sm:px-6 text-sm flex-wrap">
          <li>
            <Link href="/" className="text-zinc-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">/</li>
          <li>
            <Link href="/programs" className="text-zinc-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded">
              Programs
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">/</li>
          <li>
            <Link
              href={`/programs?city=${encodeURIComponent(program.city)}`}
              className="text-zinc-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              {program.city}
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">/</li>
          <li className="text-zinc-700 font-medium truncate max-w-60" aria-current="page">
            {program.title}
          </li>
        </ol>
      </nav>

      {/* 2. Hero */}
      <InquiryHero program={program} avgRating={avgRating} />

      {/* 3. Trust bar */}
      <TrustBar program={program} avgRating={avgRating} />

      {/* 4. Two-column content area */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-12">
            {/* Program Overview */}
            <section aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="text-[22px] font-semibold text-zinc-900 mb-4"
              >
                Program Overview
              </h2>
              {descriptionParagraphs.length > 0 ? (
                <div className="space-y-4">
                  {descriptionParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-[15px] text-zinc-600 leading-relaxed"
                      style={{ lineHeight: 1.6 }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[15px] text-zinc-400 italic">
                  No description provided yet.
                </p>
              )}
            </section>

            {/* Program Highlights */}
            {program.highlights.length > 0 && (
              <section aria-labelledby="highlights-heading">
                <h2
                  id="highlights-heading"
                  className="text-[22px] font-semibold text-zinc-900 mb-4"
                >
                  Program Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {program.highlights.map((highlight, i) => {
                    const Icon = getHighlightIcon(i);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-cobalt-500/[0.06] rounded-lg p-4"
                      >
                        <Icon
                          className="w-5 h-5 text-cobalt-500 shrink-0"
                          aria-hidden="true"
                        />
                        <p className="text-sm font-medium text-zinc-900">
                          {highlight}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* What's Included */}
            {program.whatsIncluded.length > 0 && (
              <section aria-labelledby="included-heading">
                <h2
                  id="included-heading"
                  className="text-[22px] font-semibold text-zinc-900 mb-4"
                >
                  What's Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {program.whatsIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-zinc-600">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar — desktop only */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <InquirySidebar />
          </div>
        </div>

        {/* Mobile: simplified inquiry CTA below content */}
        <div className="mt-8 lg:hidden border border-zinc-200 rounded-lg overflow-hidden">
          <InquirySidebar />
        </div>
      </div>

      {/* 5. Reviews */}
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <InquiryReviews
          programId={program._id}
          reviews={reviews}
          avgRating={avgRating}
        />
      </div>

      {/* 6. Pricing bar */}
      <PricingBar program={program} />

      {/* 7. Program Details */}
      {detailItems.length > 0 && (
        <section
          aria-labelledby="details-heading"
          className="py-12 max-w-7xl mx-auto px-4 sm:px-6"
        >
          <h2
            id="details-heading"
            className="text-[28px] font-semibold text-zinc-900 mb-8"
            style={{ letterSpacing: "-0.5px" }}
          >
            Program Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {detailItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon
                  className="w-5 h-5 text-cobalt-500 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Related Programs */}
      <div className="bg-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RelatedPrograms
            currentProgramId={program._id}
            subjectAreas={program.subjectAreas ?? []}
          />
        </div>
      </div>

      {/* 9. Inquiry form section */}
      <InquiryFormSection />

      {/* 10. Mobile sticky bar */}
      <MobileStickyBar program={program} />
    </>
  );
}

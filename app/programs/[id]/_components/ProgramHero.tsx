"use client";

import Link from "next/link";
import { CheckCircle, MapPin, Calendar, Coins, Clock } from "lucide-react";
import type { Program } from "./types";

interface ProgramHeroProps {
  program: Program;
}

// Static rating for prototype
const STATIC_RATING = 8.41;
const STATIC_REVIEW_COUNT = 103;

interface FactItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  urgent?: boolean;
}

export default function ProgramHero({ program }: ProgramHeroProps) {
  // Build key facts — only include items with data
  const facts: FactItem[] = [
    {
      key: "location",
      icon: <MapPin className="w-4 h-4 text-[#0A5E85]" aria-hidden="true" />,
      label: "Location",
      value: `${program.city}, ${program.country}`,
    },
  ];

  if (program.terms.length > 0) {
    const termsValue = program.terms
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
      .join(" · ");
    facts.push({
      key: "terms",
      icon: <Calendar className="w-4 h-4 text-[#0A5E85]" aria-hidden="true" />,
      label: "Terms",
      value: termsValue,
    });
  }

  if (program.duration) {
    facts.push({
      key: "duration",
      icon: <Clock className="w-4 h-4 text-[#0A5E85]" aria-hidden="true" />,
      label: "Duration",
      value: program.duration,
    });
  }

  if (program.cost) {
    facts.push({
      key: "cost",
      icon: <Coins className="w-4 h-4 text-[#0A5E85]" aria-hidden="true" />,
      label: "Cost",
      value: program.cost,
    });
  }

  if (program.applicationDeadline) {
    facts.push({
      key: "deadline",
      icon: <Clock className="w-4 h-4 text-[#0A5E85]" aria-hidden="true" />,
      label: "Apply by",
      value: program.applicationDeadline,
      urgent: true,
    });
  }

  // Collect all images: cover first, then additional photos
  const allPhotos = [program.coverImage, ...program.photos].filter(
    Boolean
  ) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8">
      {/* Breadcrumbs — full width above both columns */}
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
          <li>
            <Link
              href="/"
              className="hover:text-[#084B6A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] rounded"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li>
            <Link
              href="/programs"
              className="hover:text-[#084B6A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] rounded"
            >
              Programs
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li>
            <Link
              href={`/programs?city=${encodeURIComponent(program.city)}`}
              className="hover:text-[#084B6A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] rounded"
            >
              {program.city}
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li
            className="text-slate-700 font-medium truncate max-w-[240px]"
            aria-current="page"
          >
            {program.title}
          </li>
        </ol>
      </nav>

      {/* Two-column editorial layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">

        {/* Left: identity + conversion info */}
        <div className="flex-1 min-w-0 lg:max-w-[55%] flex flex-col gap-4">

          {/* Provider + trust signals */}
          <div>
            <p className="text-[11px] font-bold text-[#023D58] uppercase tracking-[0.15em] mb-2">
              {program.provider}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[#FFF9ED] text-[#B07B22] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#F6E1B6]">
                <span className="text-[#D98C12]" aria-hidden="true">★</span>
                <span>{STATIC_RATING}</span>
                <span className="font-normal text-[#DCA757]">/ {STATIC_REVIEW_COUNT} reviews</span>
              </div>
              <div className="flex items-center gap-1 bg-[#F0FDF4] text-[#297C46] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#BCE8CB]">
                <CheckCircle className="w-3.5 h-3.5 text-[#359B55] shrink-0" aria-hidden="true" />
                Verified
              </div>
            </div>
          </div>

          {/* Title + tagline */}
          <div>
            <h1 className="text-3xl md:text-[34px] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-2">
              {program.title}
            </h1>
            {program.tagline && (
              <p className="text-base text-slate-500 leading-relaxed">
                {program.tagline}
              </p>
            )}
          </div>

          {/* Key facts strip */}
          <div className="pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
              {facts.map((fact, idx) => (
                <div key={fact.key} className="flex items-center gap-2 sm:contents">
                  {/* The fact item — always visible */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#EEF4F8] shrink-0">
                      {fact.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-0.5">
                        {fact.label}
                      </p>
                      <p className={`text-sm font-semibold leading-snug ${fact.urgent ? "text-[#9C4640]" : "text-slate-800"}`}>
                        {fact.value}
                      </p>
                    </div>
                  </div>
                  {/* Divider — desktop only, between items */}
                  {idx < facts.length - 1 && (
                    <div className="hidden sm:block h-7 w-px bg-slate-200 self-center shrink-0" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {program.applyUrl ? (
              <a
                href={program.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A5E85] text-white font-bold text-sm rounded-lg hover:bg-[#084B6A] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] focus-visible:ring-offset-2"
              >
                Apply Now
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A5E85] text-white font-bold text-sm rounded-lg hover:bg-[#084B6A] transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] focus-visible:ring-offset-2"
              >
                Apply Now
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}

            <button
              type="button"
              className="px-5 py-2.5 border border-[#0A5E85] text-[#0A5E85] font-semibold text-sm rounded-lg hover:bg-[#0A5E85]/[0.06] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85]"
            >
              Send Inquiry
            </button>

            {program.applyUrl && (
              <a
                href={program.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] text-slate-400 hover:text-[#084B6A] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] rounded"
              >
                Visit website
                <svg className="w-3 h-3 opacity-70 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3M9 2h5m0 0v5m0-5L7 10" />
                </svg>
              </a>
            )}
          </div>

        </div>

        {/* Right: compact photo grid */}
        <div className="w-full lg:w-[45%] shrink-0">
          <div className="h-[300px] sm:h-[340px] lg:h-[360px] rounded-xl overflow-hidden">
            <PhotoGrid photos={allPhotos} title={program.title} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PhotoGrid — isolated so the conditional rendering stays readable
// ---------------------------------------------------------------------------

interface PhotoGridProps {
  photos: string[];
  title: string;
}

function PhotoGrid({ photos, title }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#023D58] to-[#0A5E85] rounded-xl" />
    );
  }

  if (photos.length === 1) {
    return (
      <div className="w-full h-full relative rounded-xl overflow-hidden">
        <img
          src={photos[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 2 or more photos: main image left spanning both rows, up to 2 thumbs stacked right
  return (
    <div className="grid grid-cols-[2fr_1fr] grid-rows-2 gap-1.5 h-full rounded-xl overflow-hidden">
      {/* Main image — spans both rows */}
      <div className="row-span-2 relative">
        <img
          src={photos[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumb 1 */}
      {photos[1] && (
        <div className="relative">
          <img
            src={photos[1]}
            alt={`${title} photo 2`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Thumb 2 — or empty filler cell to keep grid balanced */}
      {photos[2] ? (
        <div className="relative">
          <img
            src={photos[2]}
            alt={`${title} photo 3`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-[#EEF4F8]" />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loader / Skeleton
// ---------------------------------------------------------------------------

export function ProgramHeroSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8 animate-pulse">
      {/* Breadcrumbs skeleton */}
      <nav className="mb-5">
        <div className="flex items-center gap-1.5">
          <div className="h-4 bg-slate-200 rounded w-12" />
          <div className="h-3 bg-slate-100 rounded w-2" />
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-100 rounded w-2" />
          <div className="h-4 bg-slate-100 rounded w-20" />
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
        {/* Left Column Skeleton */}
        <div className="flex-1 min-w-0 lg:max-w-[55%] flex flex-col gap-4">
          <div>
            <div className="h-3.5 bg-slate-200 rounded w-24 mb-3" />
            <div className="flex items-center gap-2">
              <div className="h-6 bg-slate-100 rounded-full w-24" />
              <div className="h-6 bg-slate-100 rounded-full w-20" />
            </div>
          </div>

          <div>
            <div className="h-9 bg-slate-200 rounded w-[85%] mb-3" />
            <div className="h-5 bg-slate-100 rounded w-full" />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-slate-100 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-slate-50 rounded w-8" />
                    <div className="h-3 bg-slate-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="h-10 bg-slate-200 rounded-lg w-32" />
            <div className="h-10 bg-slate-50 rounded-lg w-32 border border-slate-100" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="w-full lg:w-[45%] shrink-0">
          <div className="h-[300px] sm:h-[340px] lg:h-[360px] rounded-xl bg-slate-100 overflow-hidden" />
        </div>
      </div>
    </div>
  );
}

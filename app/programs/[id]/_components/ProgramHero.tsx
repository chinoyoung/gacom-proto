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
  const hasImage = Boolean(program.coverImage);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-6">
      {/* Breadcrumbs — above the image */}
      <nav aria-label="Breadcrumb" className="mb-3">
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

      {/* Hero image — clean, no overlay, no text on image */}
      <div
        className="w-full h-[340px] sm:h-[400px] rounded-xl overflow-hidden"
        style={
          hasImage
            ? {
              backgroundImage: `url(${program.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : undefined
        }
      >
        {/* Gradient fallback when no image */}
        {!hasImage && (
          <div className="h-full w-full bg-gradient-to-br from-[#023D58] to-[#0A5E85]" />
        )}
      </div>

      {/* Below-image content */}
      <div className="pt-6 pb-4">
        {/* Row A: Provider label (left) | Rating + Verified badges (right) */}
        <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
          <p className="text-[11px] font-bold text-[#023D58] uppercase tracking-[0.15em] font-sans">
            {program.provider}
          </p>

          <div className="flex items-center gap-2">
            {/* Rating badge */}
            <div className="flex items-center gap-1.5 bg-[#FFF9ED] text-[#B07B22] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#F6E1B6]">
              <span className="text-[#D98C12]" aria-hidden="true">★</span>
              <span>{STATIC_RATING}</span>
              <span className="font-normal text-[#DCA757]">/ {STATIC_REVIEW_COUNT} reviews</span>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-1 bg-[#F0FDF4] text-[#297C46] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#BCE8CB]">
              <CheckCircle className="w-3.5 h-3.5 text-[#359B55] shrink-0" aria-hidden="true" />
              Verified
            </div>
          </div>
        </div>

        {/* Program title */}
        <h1 className="text-3xl md:text-[34px] font-extrabold text-slate-900 leading-[1.15] mb-3 max-w-4xl tracking-tight">
          {program.title}
        </h1>

        {/* Tagline */}
        {program.tagline && (
          <p className="text-base text-slate-500 max-w-3xl leading-relaxed font-normal">
            {program.tagline}
          </p>
        )}

        {/* Key Facts Strip */}
        <div className="my-5 bg-slate-50 rounded-lg p-5 border-t border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {facts.map((fact, idx) => (
              <div key={fact.key} className="flex items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-2.5">
                  {/* Icon in a small cobalt tinted square */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#EEF4F8] shrink-0">
                    {fact.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-0.5">
                      {fact.label}
                    </p>
                    <p
                      className={
                        fact.urgent
                          ? "text-sm font-semibold text-[#9C4640] leading-none"
                          : "text-sm font-semibold text-slate-800 leading-none"
                      }
                    >
                      {fact.value}
                    </p>
                  </div>
                </div>

                {/* Vertical divider — only between items, not after last */}
                {idx < facts.length - 1 && (
                  <div className="h-8 w-px bg-slate-200 self-center" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visit Website — subtle link only; Apply Now lives in the sidebar */}
        {program.applyUrl && (
          <div className="mt-4">
            <a
              href={program.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-[#084B6A] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5E85] rounded"
            >
              Visit program website
              {/* External link icon */}
              <svg
                className="w-3.5 h-3.5 opacity-60 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3M9 2h5m0 0v5m0-5L7 10" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

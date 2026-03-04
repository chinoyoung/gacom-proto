"use client";

import Link from "next/link";
import { CheckCircle, MapPin } from "lucide-react";
import type { Program } from "./types";

interface ProgramHeroProps {
  program: Program;
}

// Static rating for prototype
const STATIC_RATING = 8.41;
const STATIC_REVIEW_COUNT = 103;

export default function ProgramHero({ program }: ProgramHeroProps) {
  const hasImage = Boolean(program.coverImage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-6">
      {/* ── Breadcrumbs — above the image, on white ── */}
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
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
            className="text-slate-700 font-medium truncate max-w-[240px]"
            aria-current="page"
          >
            {program.title}
          </li>
        </ol>
      </nav>

      {/* ── Hero image — max-w-7xl, rounded ── */}
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
        {!hasImage && (
          <div className="w-full h-full bg-gradient-to-br from-cobalt-700 to-cobalt-500" />
        )}
      </div>

      {/* ── Hero content — below the image, on white ── */}
      <div className="pt-8 pb-4">
        {/* Provider name */}
        <p className="text-[11px] font-bold text-cobalt-700 uppercase tracking-[0.15em] mb-2 font-sans">
          {program.provider}
        </p>

        {/* Program title */}
        <h1 className="text-3xl md:text-[34px] font-extrabold text-slate-900 leading-[1.15] mb-4 max-w-4xl tracking-tight">
          {program.title}
        </h1>

        {/* Tagline */}
        {program.tagline && (
          <p className="text-base text-slate-500 mb-6 max-w-3xl leading-relaxed font-normal">
            {program.tagline}
          </p>
        )}

        {/* Badges + CTAs row */}
        <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rating badge */}
            <div className="flex items-center gap-1.5 bg-[#FFF9ED] text-[#B07B22] text-[13px] font-semibold px-4 py-2 rounded-full border border-[#F6E1B6]">
              <span className="text-[#D98C12]">★</span>
              <span>{STATIC_RATING}</span>
              <span className="font-medium text-[#DCA757]">
                / {STATIC_REVIEW_COUNT} reviews
              </span>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-1.5 bg-[#F0FDF4] text-[#297C46] text-[13px] font-semibold px-4 py-2 rounded-full border border-[#BCE8CB]">
              <CheckCircle className="w-4 h-4 text-[#359B55]" aria-hidden="true" />
              Verified
            </div>

            {/* Location chip */}
            <div className="flex items-center gap-1.5 bg-[#F4F6F9] text-[#42526E] text-[13px] font-semibold px-4 py-2 rounded-full border border-[#DFE3EB]">
              <MapPin className="w-4 h-4 text-[#0B5C85]" aria-hidden="true" />
              {program.city}, {program.country}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            {program.applyUrl ? (
              <a
                href={program.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 border border-slate-200 bg-white text-slate-700 font-bold text-[13px] rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 shadow-sm"
              >
                Visit Website
              </a>
            ) : (
              <button
                type="button"
                className="px-5 py-2 border border-slate-200 bg-white text-slate-700 font-bold text-[13px] rounded hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer shadow-sm"
              >
                Visit Website
              </button>
            )}

            <button
              type="button"
              className="px-5 py-2 border border-[#0F5A81] text-[#0F5A81] font-bold text-[13px] rounded hover:bg-[#0F5A81]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer shadow-sm"
            >
              Inquire Here
            </button>

            {program.applyUrl ? (
              <a
                href={program.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#0F5A81] text-white font-bold text-[13px] rounded hover:bg-[#0E4F71] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
              >
                Apply Now
              </a>
            ) : (
              <button
                type="button"
                className="px-6 py-2 bg-[#0F5A81] text-white font-bold text-[13px] rounded hover:bg-[#0E4F71] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2 cursor-pointer"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

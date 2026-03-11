"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle, MapPin, Calendar, Coins, Clock, Expand } from "lucide-react";
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
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Build key facts — only include items with data
  const facts: FactItem[] = [
    {
      key: "location",
      icon: <MapPin className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
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
      icon: <Calendar className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Terms",
      value: termsValue,
    });
  }

  if (program.duration) {
    facts.push({
      key: "duration",
      icon: <Clock className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Duration",
      value: program.duration,
    });
  }

  if (program.cost) {
    facts.push({
      key: "cost",
      icon: <Coins className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Cost",
      value: program.cost,
    });
  }

  // Collect all images: cover first, then additional photos
  const allPhotos = [program.coverImage, ...program.photos].filter(
    Boolean
  ) as string[];

  return (
    <>
      <section className="bg-slate-100 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Two-column editorial layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">

            {/* Left: identity + conversion info */}
            <div className="flex-1 min-w-0 lg:max-w-[55%] flex flex-col gap-4">

              {/* Provider + trust signals */}
              <div>
                <p className="text-xs font-bold text-cobalt-700 uppercase tracking-[0.15em] mb-2">
                  {program.provider}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-sun-50 text-sun-800 text-xs font-semibold px-3 py-1 rounded-full border border-sun-200">
                    <span className="text-sun-600" aria-hidden="true">★</span>
                    <span>{STATIC_RATING}</span>
                    <span className="font-normal text-sun-600">/ {STATIC_REVIEW_COUNT} reviews</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-fern-50 text-fern-800 text-xs font-semibold px-3 py-1 rounded-full border border-fern-200">
                    <CheckCircle className="w-3.5 h-3.5 text-fern-600 shrink-0" aria-hidden="true" />
                    Verified
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="flex items-stretch gap-4">
                {program.providerLogo && (
                  <div className="shrink-0 aspect-square w-16 h-16 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden flex items-center justify-center">
                    <img
                      src={program.providerLogo}
                      alt={`${program.provider} logo`}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-2">
                  {program.title}
                </h1>
              </div>

              {/* Key facts strip */}
              <div className="py-3 border-y border-slate-200">
                <ul
                  className="flex flex-wrap items-center gap-x-4 gap-y-2"
                  aria-label="Program key facts"
                >
                  {facts.map((fact, idx) => (
                    <li key={fact.key} className="flex items-center gap-1.5">
                      {idx > 0 && (
                        <span className="mr-2 text-slate-300 select-none" aria-hidden="true">·</span>
                      )}
                      {fact.icon}
                      <span className={`text-sm font-semibold leading-none ${fact.urgent ? "text-roman-700" : "text-slate-700"}`}>
                        {fact.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>


              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {program.applyUrl ? (
                  <a
                    href={program.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
                  >
                    Apply Now
                  </a>
                ) : (
                  <button
                    type="button"
                    className="inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
                  >
                    Apply Now
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSaved((v) => !v)}
                  className={`inline-flex justify-center items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2 ${saved
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

            {/* Right: compact photo grid */}
            <div className="w-full lg:w-[45%] shrink-0 mt-6 lg:mt-0">
              <div className="h-60 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-sm border border-slate-200/60">
                <PhotoGrid photos={allPhotos} title={program.title} onPhotoClick={setLightboxIdx} />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/50 hover:text-white p-2 cursor-pointer transition-colors"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev button */}
          {lightboxIdx > 0 && (
            <button
              type="button"
              className="absolute left-2 sm:left-6 lg:left-12 text-white/50 hover:text-white p-3 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx - 1);
              }}
              aria-label="Previous photo"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {lightboxIdx < allPhotos.length - 1 && (
            <button
              type="button"
              className="absolute right-2 sm:right-6 lg:right-12 text-white/50 hover:text-white p-3 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx + 1);
              }}
              aria-label="Next photo"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allPhotos[lightboxIdx]}
              alt={`${program.title} - photo ${lightboxIdx + 1}`}
              className="object-contain w-auto h-auto max-w-full max-h-[85vh] rounded-lg shadow-2xl"
            />
            <p className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm font-medium tracking-wide">
              {lightboxIdx + 1} / {allPhotos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// PhotoGrid — isolated so the conditional rendering stays readable
// ---------------------------------------------------------------------------

interface PhotoGridProps {
  photos: string[];
  title: string;
  onPhotoClick: (idx: number) => void;
}

function PhotoGrid({ photos, title, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-cobalt-700 to-cobalt-500 rounded-xl" />
    );
  }

  if (photos.length === 1) {
    return (
      <div
        className="w-full h-full relative rounded-xl overflow-hidden group cursor-pointer"
        onClick={() => onPhotoClick(0)}
      >
        <img
          src={photos[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Gallery Indicator */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 text-slate-800 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:-translate-y-0.5">
          <Expand className="w-4 h-4" />
          <span className="text-sm font-semibold">View gallery</span>
        </div>
      </div>
    );
  }

  // 2 or more photos: main image left spanning both rows, up to 2 thumbs stacked right
  return (
    <div className="grid grid-cols-[1fr] sm:grid-cols-[2fr_1fr] grid-rows-[2fr_1fr] sm:grid-rows-2 gap-1.5 sm:gap-2 h-full rounded-xl overflow-hidden bg-slate-50">
      {/* Main image — spans both rows on desktop, top row on mobile */}
      <div
        className="row-span-1 sm:row-span-2 relative group cursor-pointer overflow-hidden"
        onClick={() => onPhotoClick(0)}
      >
        <img
          src={photos[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Gallery Indicator */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 text-slate-800 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:-translate-y-0.5">
          <Expand className="w-4 h-4" />
          <span className="text-sm font-semibold">View gallery</span>
        </div>
      </div>

      {/* Thumbnails Row on mobile / Right Column on desktop */}
      <div className="grid grid-cols-2 sm:contents gap-1.5 sm:gap-2">
        {/* Thumb 1 */}
        {photos[1] && (
          <div
            className="relative group cursor-pointer overflow-hidden"
            onClick={() => onPhotoClick(1)}
          >
            <img
              src={photos[1]}
              alt={`${title} photo 2`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Subtle expand icon for thumbnails */}
            <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-md text-white transition-opacity duration-300 group-hover:bg-black/60">
              <Expand className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Thumb 2 — or empty filler cell to keep grid balanced */}
        {photos[2] ? (
          <div
            className="relative group cursor-pointer overflow-hidden"
            onClick={() => onPhotoClick(2)}
          >
            <img
              src={photos[2]}
              alt={`${title} photo 3`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Overlay if there are more photos */}
            {photos.length > 3 && (
              <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center group-hover:bg-slate-900/50 transition-colors duration-300">
                <Expand className="w-6 h-6 text-white mb-1.5 opacity-90" />
                <span className="text-white font-semibold tracking-wide text-sm sm:text-base">
                  +{photos.length - 3} photos
                </span>
              </div>
            )}

            {/* If no overlay, just show subtle expand icon */}
            {photos.length <= 3 && (
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-md text-white transition-opacity duration-300 group-hover:bg-black/60 hidden sm:block">
                <Expand className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-100" />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loader / Skeleton
// ---------------------------------------------------------------------------

export function ProgramHeroSkeleton() {
  return (
    <section className="bg-slate-100 border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
          {/* Left Column Skeleton */}
          <div className="flex-1 min-w-0 lg:max-w-[55%] flex flex-col gap-4">
            <div>
              <div className="h-3.5 bg-slate-200 rounded w-24 mb-3" />
              <div className="flex items-center gap-2">
                <div className="h-6 bg-slate-100 rounded-full w-24" />
                <div className="h-6 bg-slate-100 rounded-full w-20" />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
              <div className="flex-1">
                <div className="h-9 bg-slate-200 rounded w-[85%] mb-3" />
                <div className="h-5 bg-slate-100 rounded w-full" />
              </div>
            </div>

            <div className="py-3 border-y border-slate-200 flex flex-wrap gap-x-4 gap-y-2">
              {[48, 72, 56, 44].map((w, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded" style={{ width: w }} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="h-10 bg-slate-200 rounded-lg w-32" />
              <div className="h-10 bg-slate-200 rounded-lg w-24" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="w-full lg:w-[45%] shrink-0 mt-6 lg:mt-0">
            <div className="h-60 sm:h-80 lg:h-96 rounded-xl bg-slate-100 overflow-hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

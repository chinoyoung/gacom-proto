"use client";

import { useState } from "react";
import { Bookmark, CheckCircle, MapPin, Calendar, Coins, Clock, Expand, GraduationCap, Award, Mail } from "lucide-react";
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
  emphasized?: boolean;
}

export default function ProgramHero({ program }: ProgramHeroProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Build left-column facts
  const leftFacts: FactItem[] = [
    {
      key: "location",
      icon: <MapPin className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Location",
      value: `${program.city}, ${program.country}`,
    },
  ];

  if (program.terms.length > 0) {
    leftFacts.push({
      key: "terms",
      icon: <Calendar className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Terms",
      value: program.terms
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
        .join(" · "),
    });
  }

  if (program.duration) {
    leftFacts.push({
      key: "duration",
      icon: <Clock className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Duration",
      value: program.duration,
    });
  }

  // Build right-column facts
  const rightFacts: FactItem[] = [];

  if (program.cost) {
    rightFacts.push({
      key: "cost",
      icon: <Coins className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Cost",
      value: program.cost,
      emphasized: true,
    });
  }

  if (program.educationLevels.length > 0) {
    rightFacts.push({
      key: "education",
      icon: <GraduationCap className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Education Level",
      value: program.educationLevels
        .map((l) => l.charAt(0).toUpperCase() + l.slice(1).replace(/_/g, " "))
        .join(", "),
    });
  }

  if (program.creditsAvailable) {
    rightFacts.push({
      key: "credits",
      icon: <Award className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
      label: "Credits",
      value: program.creditsAvailable,
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
            <div className="flex-1 min-w-0 lg:max-w-[60%] flex flex-col gap-4">

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

              {/* Fact grid */}
              <div className="py-3 border-y border-slate-200">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {/* Left column */}
                  <div className="flex flex-col gap-3">
                    {leftFacts.map((fact, idx) => (
                      <div key={fact.key} className={`flex items-start gap-2 ${idx > 0 ? "pt-3 border-t border-slate-200" : ""}`}>
                        <div className="mt-0.5 shrink-0">{fact.icon}</div>
                        <div>
                          <p className="text-xs text-slate-500">{fact.label}</p>
                          <p className="text-sm font-semibold text-slate-700">{fact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Right column */}
                  {rightFacts.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {rightFacts.map((fact, idx) => (
                        <div key={fact.key} className={`flex items-start gap-2 ${idx > 0 ? "pt-3 border-t border-slate-200" : ""}`}>
                          <div className="mt-0.5 shrink-0">{fact.icon}</div>
                          <div>
                            <p className="text-xs text-slate-500">{fact.label}</p>
                            <p className={fact.emphasized ? "text-base font-bold text-slate-900" : "text-sm font-semibold text-slate-700"}>
                              {fact.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* CTAs */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex flex-col sm:flex-row flex-1 sm:flex-none gap-3">
                  {/* Apply Now */}
                  {program.applyUrl ? (
                    <a
                      href={program.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
                    >
                      Apply Now
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
                    >
                      Apply Now
                    </button>
                  )}

                  {/* Inquire */}
                  {program.contactEmail ? (
                    <a
                      href={`mailto:${program.contactEmail}`}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-5 py-2.5 bg-white border border-cobalt-300 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2"
                    >
                      <Mail className="w-4 h-4" />
                      Inquire
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById("quick-details")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-5 py-2.5 bg-white border border-cobalt-300 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2"
                    >
                      <Mail className="w-4 h-4" />
                      Inquire
                    </button>
                  )}
                </div>

                {/* Save — icon only */}
                <button
                  type="button"
                  onClick={() => setSaved((v) => !v)}
                  className={`inline-flex justify-center items-center w-10 h-10 shrink-0 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2 ${
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
                </button>
              </div>

            </div>

            {/* Right: photo grid — only when photos exist */}
            {allPhotos.length > 0 && (
              <div className="w-full lg:w-[40%] shrink-0 mt-6 lg:mt-0">
                <div className="h-48 sm:h-64 lg:h-96 rounded-xl overflow-hidden shadow-sm border border-slate-200/60">
                  <PhotoGrid photos={allPhotos} title={program.title} onPhotoClick={setLightboxIdx} />
                </div>
              </div>
            )}

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
          <div className="flex-1 min-w-0 lg:max-w-[60%] flex flex-col gap-4">
            {/* Provider + trust badges */}
            <div>
              <div className="h-3.5 bg-slate-200 rounded w-24 mb-3" />
              <div className="flex items-center gap-2">
                <div className="h-6 bg-slate-100 rounded-full w-24" />
                <div className="h-6 bg-slate-100 rounded-full w-20" />
              </div>
            </div>

            {/* Logo + title */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
              <div className="flex-1">
                <div className="h-9 bg-slate-200 rounded w-[85%] mb-3" />
                <div className="h-5 bg-slate-100 rounded w-full" />
              </div>
            </div>

            {/* Fact grid skeleton */}
            <div className="py-3 border-y border-slate-200">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-4">
                  {[80, 64, 56].map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded shrink-0 mt-0.5" />
                      <div>
                        <div className="h-3 bg-slate-100 rounded w-12 mb-1.5" />
                        <div className="h-4 bg-slate-200 rounded" style={{ width: w }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {[72, 60, 48].map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded shrink-0 mt-0.5" />
                      <div>
                        <div className="h-3 bg-slate-100 rounded w-12 mb-1.5" />
                        <div className="h-4 bg-slate-200 rounded" style={{ width: w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA skeleton */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="h-10 bg-slate-200 rounded-lg w-32" />
              <div className="h-10 bg-slate-200 rounded-lg w-28" />
              <div className="h-10 w-10 bg-slate-200 rounded-lg" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="w-full lg:w-[40%] shrink-0 mt-6 lg:mt-0">
            <div className="h-48 sm:h-64 lg:h-96 rounded-xl bg-slate-100 overflow-hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

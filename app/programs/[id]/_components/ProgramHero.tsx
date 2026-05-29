"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  MapPin,
  Star,
  Heart,
  Calendar,
  Clock,
  Coins,
  Images,
  CheckCircle,
} from "lucide-react";
import type { Program } from "./types";
import { CommentAnchor } from "@/components/comments/CommentAnchor";

interface ProgramHeroProps {
  program: Program;
}

function formatUpdatedAt(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) { const w = Math.floor(diffDays / 7); return `${w} ${w === 1 ? "week" : "weeks"} ago`; }
  return new Date(ts).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Static values for prototype
const STATIC_RATING = "4.2 / 5";
const STATIC_REVIEWS = "103 reviews";
export default function ProgramHero({ program }: ProgramHeroProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Collect all images: cover first, then additional photos
  const allPhotos = [program.coverImage, ...program.photos].filter(
    Boolean
  ) as string[];

  return (
    <CommentAnchor id="hero">
      <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero Main                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white border-b border-slate-200">

        {/* Mobile: image on top — full bleed */}
        {allPhotos.length > 0 && (
          <div className="lg:hidden">
            <HeroImage
              coverImage={program.coverImage}
              title={program.title}
              photos={allPhotos}
              onPhotoClick={setLightboxIdx}
              heightClass="h-64"
              mobile
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-5 py-6 lg:px-4 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-center">

            {/* Left column — text content */}
            <div className="flex-1 min-w-0 flex flex-col gap-5 lg:gap-7">

              {/* 1. Provider identity */}
              <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                {program.providerLogo && (
                  <div className="shrink-0 w-11 h-11 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src={program.providerLogo}
                      alt={`${program.provider} logo`}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 bg-cobalt-700/10 rounded-full px-3 py-1 lg:px-3.5 lg:py-1.5">
                  <Building2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-cobalt-700 shrink-0" aria-hidden="true" />
                  <span className="text-xs lg:text-sm font-semibold text-cobalt-700">{program.provider}</span>
                </div>
                <span className="text-xs text-slate-400">
                  Updated {formatUpdatedAt(program.updatedAt ?? program._creationTime)}
                </span>
              </div>

              {/* 2. Headline group */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <h1 className="text-[2rem] lg:text-4xl font-bold text-cobalt-500 leading-[1.15] tracking-tight">
                  {program.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="inline-flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-sun-500 fill-sun-500 shrink-0" aria-hidden="true" />
                    <span className="text-xs lg:text-sm font-semibold text-slate-700">{STATIC_RATING}</span>
                    <span className="text-xs text-slate-400 font-normal">/ {STATIC_REVIEWS}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-fern-600 shrink-0" aria-hidden="true" />
                    <span className="text-xs lg:text-sm font-semibold text-slate-700">Verified</span>
                  </div>
                </div>
                <p className="text-[15px] lg:text-base text-slate-500 leading-relaxed line-clamp-3">
                  {program.description}
                </p>
              </div>

              {/* 3. CTA buttons */}
              <div className="flex flex-col lg:flex-row gap-3">
                {program.applyUrl ? (
                  <a
                    href={program.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-cobalt-500 text-white font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3.5 rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-700 focus-visible:ring-offset-2"
                  >
                    Visit Website
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-cobalt-500 text-white font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3.5 rounded-lg hover:bg-cobalt-600 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-700 focus-visible:ring-offset-2"
                  >
                    Visit Website
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 border border-cobalt-700 text-cobalt-700 font-semibold text-[15px] lg:text-base px-6 lg:px-7 py-3.5 rounded-lg bg-transparent hover:bg-cobalt-700/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-700 focus-visible:ring-offset-2"
                >
                  Inquire Here
                </button>

                <button
                  type="button"
                  onClick={() => setSaved((v) => !v)}
                  className={`hidden lg:inline-flex items-center justify-center gap-2 px-3.5 py-3.5 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-700 focus-visible:ring-offset-2 ${saved
                      ? "bg-roman-50 border-roman-300 text-roman-500"
                      : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  aria-label={saved ? "Unsave program" : "Save program"}
                >
                  <Heart
                    className={`w-4 h-4 ${saved ? "text-roman-500" : ""}`}
                    fill={saved ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </button>
              </div>


            </div>

            {/* Right column — hero image (desktop only) */}
            {allPhotos.length > 0 && (
              <div className="hidden lg:block w-[45%] shrink-0">
                <HeroImage
                  coverImage={program.coverImage}
                  title={program.title}
                  photos={allPhotos}
                  onPhotoClick={setLightboxIdx}
                  heightClass="h-[480px]"
                />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Facts Bar                                                            */}
      {/* ------------------------------------------------------------------ */}
      <FactsBar program={program} />

      {/* ------------------------------------------------------------------ */}
      {/* Lightbox                                                             */}
      {/* ------------------------------------------------------------------ */}
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
              className="object-contain w-auto h-auto max-w-full max-h-[85vh] rounded-lg"
            />
            <p className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm font-medium tracking-wide">
              {lightboxIdx + 1} / {allPhotos.length}
            </p>
          </div>
        </div>
      )}
      </>
    </CommentAnchor>
  );
}

// ---------------------------------------------------------------------------
// HeroImage — shared between mobile (top) and desktop (right column)
// ---------------------------------------------------------------------------

interface HeroImageProps {
  coverImage?: string;
  title: string;
  photos: string[];
  onPhotoClick: (idx: number) => void;
  heightClass: string;
  mobile?: boolean;
}

function HeroImage({ coverImage, title, photos, onPhotoClick, heightClass, mobile }: HeroImageProps) {
  // Thumbnails: skip cover (index 0), show up to 3 extras
  const thumbs = photos.slice(1, 4);
  const remainingCount = photos.length - 4;

  return (
    <div
      className={`relative overflow-hidden ${mobile ? "" : "rounded-2xl"} ${heightClass}`}
    >
      {/* Main image or gradient placeholder */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
          onClick={() => onPhotoClick(0)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt-700 to-cobalt-500" />
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {/* Gallery thumbnail strip — bottom */}
      {photos.length > 1 && (
        <div className={`absolute bottom-0 left-0 right-0 flex items-end gap-1.5 ${mobile ? "px-4 pb-4" : "px-6 pb-6"
          }`}>
          {thumbs.map((photo, i) => {
            const photoIdx = i + 1;
            const isLast = i === thumbs.length - 1 && remainingCount > 0;
            return (
              <button
                key={photoIdx}
                type="button"
                onClick={(e) => { e.stopPropagation(); onPhotoClick(photoIdx); }}
                className={`relative shrink-0 overflow-hidden border-2 border-white/60 cursor-pointer transition-transform hover:scale-105 ${mobile ? "w-12 h-12 rounded-md" : "w-16 h-16 rounded-lg"
                  }`}
              >
                <img
                  src={photo}
                  alt={`${title} photo ${photoIdx + 1}`}
                  className="w-full h-full object-cover"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">+{remainingCount}</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Gallery button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPhotoClick(0); }}
            className={`shrink-0 bg-white/90 backdrop-blur-sm flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-white ${mobile ? "rounded-md px-2.5 py-2" : "rounded-lg px-3 py-2.5"
              }`}
          >
            <Images className={`${mobile ? "w-3.5 h-3.5" : "w-4 h-4"} text-slate-700`} aria-hidden="true" />
            <span className={`${mobile ? "text-[11px]" : "text-xs"} font-semibold text-slate-700`}>
              {photos.length} photos
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FactsBar — dynamic program details
// ---------------------------------------------------------------------------

function FactsBar({ program }: { program: Program }) {
  const facts: { icon: React.ReactNode; label: string; value: string }[] = [];

  facts.push({
    icon: <MapPin className="w-4 h-4 text-white/70 shrink-0" aria-hidden="true" />,
    label: "Location",
    value: `${program.city}, ${program.country}`,
  });

  if (program.terms.length > 0) {
    facts.push({
      icon: <Calendar className="w-4 h-4 text-white/70 shrink-0" aria-hidden="true" />,
      label: "Terms",
      value: program.terms
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
        .join(" · "),
    });
  }

  if (program.duration) {
    facts.push({
      icon: <Clock className="w-4 h-4 text-white/70 shrink-0" aria-hidden="true" />,
      label: "Duration",
      value: program.duration,
    });
  }

  if (program.cost) {
    facts.push({
      icon: <Coins className="w-4 h-4 text-white/70 shrink-0" aria-hidden="true" />,
      label: "Cost",
      value: program.cost,
    });
  }

  if (facts.length === 0) return null;

  return (
    <div className="bg-cobalt-500">
      {/* Mobile: 2×2 grid */}
      <div className="grid grid-cols-2 gap-4 px-5 py-5 lg:hidden">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col items-center text-center">
            <span className="text-lg font-bold text-white leading-tight">{fact.value}</span>
            <span className="text-[11px] text-white/70 mt-0.5">{fact.label}</span>
          </div>
        ))}
      </div>

      {/* Desktop: single row with dividers */}
      <div className="hidden lg:flex items-center justify-center gap-10 max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {facts.map((fact, idx) => (
          <div key={fact.label} className="flex items-center gap-10">
            {idx > 0 && <div className="w-px h-10 bg-white/20" aria-hidden="true" />}
            <div className="flex items-center gap-3">
              {fact.icon}
              <div>
                <span className="text-xs text-white/60 uppercase tracking-wide">{fact.label}</span>
                <p className="text-sm font-semibold text-white leading-tight">{fact.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function ProgramHeroSkeleton() {
  return (
    <>
      <section className="bg-white border-b border-slate-200">
        {/* Mobile image skeleton */}
        <div className="lg:hidden h-64 bg-slate-100 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-16 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-center">

            {/* Left column */}
            <div className="flex-1 min-w-0 flex flex-col gap-5 lg:gap-7">
              {/* Provider identity */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0" />
                <div className="h-7 bg-slate-100 rounded-full w-36" />
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-3">
                <div className="h-10 bg-slate-200 rounded w-[90%]" />
                <div className="h-6 bg-slate-200 rounded w-[75%]" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-[80%]" />
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <div className="h-12 bg-slate-200 rounded-lg w-40" />
                <div className="h-12 bg-slate-100 rounded-lg w-36" />
                <div className="h-12 bg-slate-100 rounded-lg w-12" />
              </div>

              {/* Trust signals */}
              <div className="flex gap-6">
                {[80, 100, 72].map((w, i) => (
                  <div key={i} className="h-4 bg-slate-100 rounded" style={{ width: w }} />
                ))}
              </div>
            </div>

            {/* Right column (desktop) */}
            <div className="hidden lg:block w-[45%] shrink-0">
              <div className="h-[480px] rounded-2xl bg-slate-100" />
            </div>

          </div>
        </div>
      </section>

      {/* Facts bar skeleton */}
      <div className="bg-cobalt-700 hidden lg:flex items-center justify-center gap-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 animate-pulse">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-10">
            {i > 0 && <div className="w-px h-10 bg-white/20" />}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-white/20 rounded" />
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-white/10 rounded w-12" />
                <div className="h-4 bg-white/20 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-cobalt-700 px-4 sm:px-6 py-5 flex flex-col gap-3 lg:hidden animate-pulse">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white/20 rounded" />
            <div className="flex flex-col gap-1">
              <div className="h-3 bg-white/10 rounded w-12" />
              <div className="h-4 bg-white/20 rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

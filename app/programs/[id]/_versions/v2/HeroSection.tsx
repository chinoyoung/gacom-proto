"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Clock,
  CalendarClock,
  ArrowRight,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { Program } from "../../_components/types";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

function formatRelativeDate(timestampMs: number): string {
  const now = Date.now();
  const diffMs = now - timestampMs;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 30) return `Updated ${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Updated ${months} month${months > 1 ? "s" : ""} ago`;
  }
  return `Updated ${new Date(timestampMs).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

function GalleryPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-cobalt-500 to-cobalt-700" />
  );
}

export function HeroSection({
  program,
  avgRating,
  reviewCount,
  programCount: _programCount,
}: {
  program: Program;
  avgRating: number;
  reviewCount: number;
  programCount: number;
}) {
  const institution = program.hostInstitution ?? program.provider;

  const descriptionExcerpt =
    program.description.length > 150
      ? program.description.slice(0, 150).trimEnd() + "…"
      : program.description;

  // Defer time-dependent values to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const yearsInOperation =
    mounted && program.yearFounded != null
      ? new Date().getFullYear() - program.yearFounded
      : null;

  const lastUpdatedLabel = mounted
    ? program.updatedAt
      ? formatRelativeDate(program.updatedAt)
      : "Recently updated"
    : "";

  const displayTags =
    program.programTags && program.programTags.length > 0
      ? program.programTags
      : null;
  const placeholderTags = [
    "Adventure",
    "Cultural",
    "Study Abroad",
    "Language Immersion",
    "Academic Credit",
  ];

  const photos = program.photos ?? [];

  // Build thumbnail sources (up to 4), padded with nulls for placeholders
  const thumbSources = Array.from({ length: 4 }, (_, i) =>
    photos[i] ?? null
  );
  const remainingCount = Math.max(0, photos.length - 3);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((cur) =>
      cur != null ? (cur - 1 + photos.length) % photos.length : null
    );
  }, [photos.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((cur) =>
      cur != null ? (cur + 1) % photos.length : null
    );
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prevPhoto, nextPhoto]);

  return (
    <>
      <section id="overview" className="w-full bg-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col-reverse gap-10 lg:flex-row lg:items-start">
          {/* ── Left column: text content ─────────────────────── */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Badge row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Verified badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-fern-500/[0.06] py-1.5 px-3">
                <ShieldCheck className="w-3.5 h-3.5 text-fern-500" aria-hidden="true" />
                <span className="text-xs font-semibold text-fern-500">Verified</span>
              </span>

              {/* Rating badge */}
              {avgRating > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-500/[0.08] py-1.5 px-3">
                  <Star
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-sun-500"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-sun-600">
                    {avgRating.toFixed(1)} Rating
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 py-1.5 px-3">
                  <Star className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                  <span className="text-xs font-semibold text-neutral-500">No reviews yet</span>
                  {reviewCount === 0 && (
                    <a
                      href="#reviews"
                      className="text-xs text-cobalt-500 underline underline-offset-2 ml-0.5"
                    >
                      Write a review
                    </a>
                  )}
                </span>
              )}

              {/* Review count badge */}
              {reviewCount > 0 && (
                <a
                  href="#reviews"
                  className="inline-flex items-center gap-1.5 rounded-full bg-cobalt-500/[0.08] py-1.5 px-3 hover:bg-cobalt-500/[0.14] transition-colors"
                >
                  <MessageCircle
                    className="w-3.5 h-3.5 text-cobalt-500"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-cobalt-600">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </a>
              )}

              {/* Years in Operation badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-fern-500/[0.08] py-1.5 px-3">
                <Clock className="w-3.5 h-3.5 text-fern-500" aria-hidden="true" />
                <span className="text-xs font-semibold text-fern-600">
                  {yearsInOperation != null
                    ? `${yearsInOperation} years of service`
                    : "15 years of service"}
                </span>
              </span>

              {/* Last Updated badge */}
              <span className="inline-flex items-center gap-1.5 py-1.5 px-1">
                <CalendarClock
                  className="w-3.5 h-3.5 text-neutral-400"
                  aria-hidden="true"
                />
                <span className="text-xs text-neutral-500">
                  {lastUpdatedLabel}
                </span>
              </span>
            </div>

            {/* Provider / institution name */}
            <p className="text-sm font-semibold text-cobalt-500 tracking-wide">
              {institution}
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
              {program.title}
            </h1>

            {/* Starting price */}
            {program.isFree ? (
              <p className="text-base font-semibold text-fern-500">No Upfront Fees</p>
            ) : program.startingPrice != null ? (
              <p className="text-base font-semibold text-neutral-800">
                Starting from {formatPrice(program.startingPrice)}
              </p>
            ) : (
              <p className="text-base font-semibold text-neutral-800">
                Starting from $2,500
              </p>
            )}

            {/* Program tags */}
            <div className="flex flex-wrap gap-1.5">
              {displayTags
                ? displayTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-cobalt-500/[0.06] text-cobalt-600 font-medium"
                    >
                      {tag}
                    </span>
                  ))
                : placeholderTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-cobalt-500/[0.06] text-cobalt-600 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {program.applyUrl ? (
                <a
                  href={program.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cobalt-500 text-white text-sm font-semibold py-3 px-6 rounded-lg hover:bg-cobalt-600 transition-colors"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <button className="inline-flex items-center gap-2 bg-cobalt-500 text-white text-sm font-semibold py-3 px-6 rounded-lg hover:bg-cobalt-600 transition-colors">
                  Apply Now
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <button className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 px-6 rounded-lg hover:border-cobalt-300 transition-colors">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Inquire Here
              </button>

              {program.applyUrl && (
                <Link
                  href={program.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cobalt-500 underline underline-offset-2 hover:text-cobalt-700 transition-colors"
                >
                  Visit Website
                </Link>
              )}
            </div>
          </div>

          {/* ── Right column: gallery (lg+ only) ─────────────── */}
          <div className="hidden lg:flex w-[480px] flex-col gap-3 shrink-0">
            {/* Main cover image */}
            <div
              className="rounded-lg overflow-hidden h-[280px] cursor-pointer"
              onClick={() => {
                if (program.coverImage) openLightbox(0);
              }}
            >
              {program.coverImage ? (
                <img
                  src={program.coverImage}
                  alt={program.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <GalleryPlaceholder />
              )}
            </div>

            {/* Thumbnails row */}
            <div className="grid grid-cols-4 gap-3">
              {thumbSources.map((src, index) => {
                const isOverlaySlot = index === 3 && remainingCount > 0;
                return (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden h-[72px] cursor-pointer"
                    onClick={() => {
                      if (src) openLightbox(index);
                    }}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <GalleryPlaceholder />
                    )}
                    {isOverlaySlot && (
                      <div
                        className="absolute inset-0 bg-black/55 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(3);
                        }}
                      >
                        <span className="text-white text-sm font-semibold">
                          +{remainingCount}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mobile-only: cover image above text ──────────────
              Rendered via flex-col-reverse on parent, so this
              appears visually on top while sitting last in DOM order. */}
          <div
            className="block lg:hidden rounded-lg overflow-hidden h-[220px] cursor-pointer"
            onClick={() => {
              if (program.coverImage) openLightbox(0);
            }}
          >
            {program.coverImage ? (
              <img
                src={program.coverImage}
                alt={program.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <GalleryPlaceholder />
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex != null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-7 h-7" />
          </button>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh] mx-auto px-16">
            <img
              src={photos[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            <p className="text-center text-white/50 text-sm mt-3">
              {lightboxIndex + 1} / {photos.length}
            </p>
          </div>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Next photo"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </>
  );
}

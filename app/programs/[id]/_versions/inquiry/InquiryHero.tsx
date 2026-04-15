"use client";

import { ShieldCheck, Star, ArrowRight, MessageCircle } from "lucide-react";
import type { Program } from "../../_components/types";

interface InquiryHeroProps {
  program: Program;
  avgRating?: number;
}

function GalleryPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-cobalt-500 to-cobalt-700" />
  );
}

export default function InquiryHero({ program, avgRating }: InquiryHeroProps) {
  const institution = program.hostInstitution ?? program.provider;
  const tagline =
    program.description.length > 150
      ? program.description.slice(0, 150).trimEnd() + "…"
      : program.description;

  const rating =
    typeof avgRating === "number" && avgRating > 0
      ? avgRating.toFixed(1)
      : "N/A";

  // Build thumbnail sources (up to 4), padded with nulls for placeholders
  const thumbSources = Array.from({ length: 4 }, (_, i) =>
    program.photos[i] ?? null
  );
  const remainingCount = Math.max(0, program.photos.length - 3);

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse gap-10 lg:flex-row lg:items-center">
        {/* ── Left column: text content ─────────────────────── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Badge row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Verified badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cobalt-500/[0.06] py-1.5 px-3">
              <ShieldCheck
                className="w-3.5 h-3.5 text-cobalt-500"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-cobalt-500">
                Verified
              </span>
            </span>

            {/* Rating badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-1.5 px-3">
              <Star
                className="w-3.5 h-3.5 text-amber-500"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-amber-700">
                {rating} Rating
              </span>
            </span>
          </div>

          {/* Institution */}
          <p
            className="text-sm font-semibold text-cobalt-500 tracking-wide"
            style={{ letterSpacing: "0.5px" }}
          >
            {institution}
          </p>

          {/* Title */}
          <h1
            className="text-4xl font-bold text-zinc-900 tracking-tight leading-tight"
            style={{ letterSpacing: "-0.5px", lineHeight: 1.15 }}
          >
            {program.title}
          </h1>

          {/* Tagline / description excerpt */}
          <p className="text-base text-zinc-500 leading-relaxed">{tagline}</p>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {program.applyUrl ? (
              <a
                href={program.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cobalt-500 text-white text-sm font-semibold py-3.5 px-7 rounded-lg hover:bg-cobalt-600 transition-colors"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 bg-cobalt-500 text-white text-sm font-semibold py-3.5 px-7 rounded-lg hover:bg-cobalt-600 transition-colors">
                Apply Now
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            <button className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 text-sm font-semibold py-3.5 px-7 rounded-lg hover:border-cobalt-300 transition-colors">
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Request Info
            </button>
          </div>
        </div>

        {/* ── Right column: gallery (lg+) ───────────────────── */}
        <div className="hidden lg:flex w-[520px] flex-col gap-3 shrink-0">
          {/* Main image */}
          <div className="rounded-xl overflow-hidden h-[280px]">
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

          {/* Thumbnails row */}
          <div className="grid grid-cols-4 gap-3">
            {thumbSources.map((src, index) => {
              const isOverlaySlot = index === 3 && remainingCount > 0;
              return (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden h-[80px]"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GalleryPlaceholder />
                  )}
                  {isOverlaySlot && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
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

        {/* ── Mobile-only: cover image above text ─────────────
            Rendered via flex-col-reverse on the parent, so this
            appears visually on top while sitting last in DOM order. */}
        <div className="block lg:hidden rounded-xl overflow-hidden h-[220px]">
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
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Review } from "../../_components/types";
import Stars from "./Stars";
import { CATEGORY_LABELS, parseReviewDate } from "./lib";

// ── Constants ─────────────────────────────────────────────────────────────────

const BODY_TRUNCATE_LENGTH = 280;

// Hoisted from inside MediaTiles so it is accessible at module scope.
const TILE_LIMIT = 4;

const CATEGORY_KEYS = [
  "academicsRating",
  "livingSituationRating",
  "culturalImmersionRating",
  "programAdministrationRating",
  "healthAndSafetyRating",
  "communityRating",
] as const;

// Tailwind grid-cols class keyed by tile count (1–4).
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a date value as "Month YYYY" (e.g. "March 2025").
 * Accepts stored strings like "March 15, 2025" or numeric timestamps.
 * Falls back to raw string if unparseable.
 */
function formatDateMonthYear(value: string | number): string {
  const opts: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
  if (typeof value === "number") {
    return new Date(value).toLocaleDateString("en-US", opts);
  }
  const parsed = parseReviewDate(value);
  if (parsed) return parsed.toLocaleDateString("en-US", opts);
  // Not parseable — return raw string
  return value;
}

/** Returns single first-name initial (first character of first word). */
function getFirstNameInitial(name: string | undefined): string {
  const first = (name ?? "A").trim().split(/\s+/)[0];
  return (first[0] ?? "A").toUpperCase();
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface ExpandButtonProps {
  expanded: boolean;
  onToggle: () => void;
}

/** File-local Read more / Show less toggle button. */
function ExpandButton({ expanded, onToggle }: ExpandButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-500 hover:underline cursor-pointer self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
    >
      {expanded ? (
        <>Show less <ChevronUp className="w-3 h-3" /></>
      ) : (
        <>Read more <ChevronDown className="w-3 h-3" /></>
      )}
    </button>
  );
}

interface CategoryDropdownProps {
  review: Review;
  /** Unique id for the panel element (used for aria-controls). */
  panelId: string;
}

function CategoryDropdown({ review, panelId }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape; return focus to toggle button
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const categories = CATEGORY_KEYS.map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    value: review[key as keyof Review] as number | undefined,
  })).filter((c) => typeof c.value === "number");

  if (categories.length === 0) return null;

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Hide category ratings" : "Show category ratings"}
        className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 hover:bg-slate-100 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
      >
        <Star className="w-3.5 h-3.5 text-sun-500 fill-current" aria-hidden="true" />
        <span className="text-sm font-bold text-slate-900 tabular-nums">
          {Number(review.overallRating).toFixed(1)}
        </span>
        {open ? (
          <ChevronUp className="w-3 h-3 text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-label="Category ratings"
          className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-md p-4 z-20 flex flex-col gap-2.5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
            Category ratings
          </p>
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 flex-1 min-w-0 truncate">
                {cat.label}
              </span>
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-sun-400 rounded-full"
                  style={{ width: `${((cat.value as number) / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 w-6 text-right shrink-0 tabular-nums">
                {Number(cat.value).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaTilesProps {
  media: string[];
}

function MediaTiles({ media }: MediaTilesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(
    () =>
      setLightboxIndex((cur) =>
        cur != null ? (cur - 1 + media.length) % media.length : null
      ),
    [media.length]
  );
  const nextPhoto = useCallback(
    () =>
      setLightboxIndex((cur) =>
        cur != null ? (cur + 1) % media.length : null
      ),
    [media.length]
  );

  useEffect(() => {
    if (lightboxIndex == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, prevPhoto, nextPhoto]);

  if (!media.length) return null;

  const tiles = media.slice(0, TILE_LIMIT);
  const overflow = media.length - TILE_LIMIT;
  const gridColsClass = GRID_COLS[Math.min(tiles.length, 4)] ?? "grid-cols-4";

  return (
    <>
      <div className={`grid gap-1.5 ${gridColsClass}`}>
        {tiles.map((src, i) => {
          const isOverflowTile = i === TILE_LIMIT - 1 && overflow > 0;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1"
              aria-label={
                isOverflowTile
                  ? `Open photo gallery (${overflow} more)`
                  : `Open review photo ${i + 1}`
              }
            >
              <img
                src={src}
                alt={`Review photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {isOverflowTile && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                  <span className="text-white text-sm font-bold leading-none">
                    +{overflow}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex != null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close lightbox"
          >
            <X className="w-7 h-7" />
          </button>
          {media.length > 1 && (
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh] mx-auto px-4 sm:px-16">
            <img
              src={media[lightboxIndex]}
              alt={`Review photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            {media.length > 1 && (
              <p className="text-center text-white/50 text-sm mt-3">
                {lightboxIndex + 1} / {media.length}
              </p>
            )}
          </div>
          {media.length > 1 && (
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

// ── Main Component ────────────────────────────────────────────────────────────

interface ReviewCard2026Props {
  review: Review;
}

export default function ReviewCard2026({ review }: ReviewCard2026Props) {
  const [expanded, setExpanded] = useState(false);
  // Only track whether the current user has voted; Convex live query is the
  // source of truth for the actual count.
  const [voted, setVoted] = useState(false);

  const markHelpful = useMutation(api.reviews.markHelpful);

  // Displayed count = live value from Convex + optimistic +1 when voted.
  const displayedCount = (review.helpfulCount ?? 0) + (voted ? 1 : 0);

  async function handleHelpful() {
    if (voted) return;
    setVoted(true);
    try {
      await markHelpful({ reviewId: review._id as Id<"reviews"> });
    } catch {
      // Roll back optimistic vote on error
      setVoted(false);
    }
  }

  // ── Date display ────────────────────────────────────────────────────────────
  // Prefer the stored date string; fall back to _creationTime
  const dateDisplay = formatDateMonthYear(
    review.date ?? review._creationTime
  );

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const initial = getFirstNameInitial(review.reviewerName);

  // ── Body / structured content ───────────────────────────────────────────────
  const body: string = review.body ?? review.reviewBody ?? "";
  const hasStructured = !!(review.highlight || review.advice);

  // For reviews WITH structured content: body goes behind "Read more"
  // For legacy reviews: body is shown with clamp as before
  const isLong = body.length > BODY_TRUNCATE_LENGTH;
  const displayedBody =
    !expanded && isLong ? body.slice(0, BODY_TRUNCATE_LENGTH) + "…" : body;

  // ── Media ────────────────────────────────────────────────────────────────────
  const media = review.media ?? [];

  // ── Identity chips ───────────────────────────────────────────────────────────
  const identityTags = review.identityTags ?? [];

  // ── Category ratings present ─────────────────────────────────────────────────
  const hasCategories = CATEGORY_KEYS.some(
    (key) => typeof review[key as keyof Review] === "number"
  );

  // ── aria-controls id for CategoryDropdown panel ──────────────────────────────
  const categoryPanelId = `category-panel-${review._id}`;

  return (
    <article className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-4">
      {/* ── Header: avatar + meta + rating badge ── */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: avatar + name + location/date */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full bg-cobalt-500 text-white text-xs font-bold flex items-center justify-center shrink-0 select-none"
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-900 truncate">
              {review.reviewerName ?? "Anonymous"}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {review.reviewerCountry ? `${review.reviewerCountry} · ` : ""}
              {dateDisplay}
            </span>
          </div>
        </div>

        {/* Right: star rating with optional category dropdown */}
        {review.overallRating != null && (
          hasCategories ? (
            <CategoryDropdown review={review} panelId={categoryPanelId} />
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 shrink-0">
              <Star className="w-3.5 h-3.5 text-sun-500 fill-current" />
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {Number(review.overallRating).toFixed(1)}
              </span>
            </div>
          )
        )}
      </div>

      {/* ── Star row (visual, small) ── */}
      {review.overallRating != null && (
        <Stars rating={Math.round(review.overallRating)} size="sm" fractional={false} />
      )}

      {/* ── Title ── */}
      {review.reviewTitle && (
        <h3 className="text-base font-semibold text-slate-900 leading-snug">
          {review.reviewTitle}
        </h3>
      )}

      {/* ── Body / Structured content ── */}
      {hasStructured ? (
        /* Structured review: highlight + advice sections + optional plain body */
        <div className="flex flex-col gap-3">
          {/* Highlight — fern tint */}
          {review.highlight && (
            <div className="bg-fern-50 border border-fern-200 rounded-md px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-fern-700 mb-1">
                Highlight
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                {review.highlight}
              </p>
            </div>
          )}

          {/* Advice — sun tint */}
          {review.advice && (
            <div className="bg-sun-50 border border-sun-100 rounded-md px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-sun-700 mb-1">
                Advice for future travellers
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                {review.advice}
              </p>
            </div>
          )}

          {/* Remaining plain body (if any) behind Read more */}
          {body ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-relaxed text-slate-600">{displayedBody}</p>
              {isLong && (
                <ExpandButton
                  expanded={expanded}
                  onToggle={() => setExpanded((v) => !v)}
                />
              )}
            </div>
          ) : null}
        </div>
      ) : body ? (
        /* Legacy review: plain body with clamp */
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed text-slate-600">{displayedBody}</p>
          {isLong && (
            <ExpandButton
              expanded={expanded}
              onToggle={() => setExpanded((v) => !v)}
            />
          )}
        </div>
      ) : null}

      {/* ── Media tiles ── */}
      {media.length > 0 && <MediaTiles media={media} />}

      {/* ── Identity chips ── */}
      {identityTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {identityTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Footer: Helpful button ── */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={voted}
          aria-label={voted ? "Marked as helpful" : "Mark as helpful"}
          className={[
            "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1",
            voted
              ? "bg-fern-50 border-fern-200 text-fern-700 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 cursor-pointer",
          ].join(" ")}
        >
          <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
          Helpful
          {displayedCount > 0 && (
            <span className="tabular-nums">({displayedCount})</span>
          )}
        </button>
      </div>
    </article>
  );
}

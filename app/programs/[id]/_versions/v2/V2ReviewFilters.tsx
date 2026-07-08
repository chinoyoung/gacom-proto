"use client";

import type { Review } from "../../_components/types";
import {
  IDENTITY_CHIP_DEFS,
  type IdentityChipDef,
  type IdentityFilterKey,
} from "./lib";

// ── Re-export so V2ReviewsSection can import from one place ─────────────────
export type { IdentityFilterKey };

// ── Types ─────────────────────────────────────────────────────────────────────

interface TopicTag {
  label: string;
  count: number;
}

interface V2ReviewFiltersProps {
  /** Topic tags from program.topicTags — only rendered when totalReviews ≥ 10. */
  topicTags: TopicTag[];
  /** Total review count from stats (controls ≥10 gate for topic tags row). */
  totalReviews: number;
  /** Currently selected topic tag label, or null for none. */
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  /** Currently selected identity filter key. */
  selectedIdentity: IdentityFilterKey;
  onSelectIdentity: (key: IdentityFilterKey) => void;
  /** Full review list — used to determine which identity chips to show. */
  reviews: Review[];
}

// ── Shared chip button ────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

function Chip({ label, active, onClick, ariaLabel }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel ?? label}
      className={[
        // Base: small, modest rounding matching page language
        "inline-flex items-center px-3 py-1.5 rounded-md border text-xs font-semibold",
        "whitespace-nowrap transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-1",
        // Tap target: min-height ~32px handled by py-1.5 + text-xs line-height
        active
          ? // Active: cobalt tint background with cobalt border
            "bg-cobalt-500/10 border-cobalt-500/40 text-cobalt-700"
          : // Idle: slate neutral
            "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function V2ReviewFilters({
  topicTags,
  totalReviews,
  selectedTopic,
  onSelectTopic,
  selectedIdentity,
  onSelectIdentity,
  reviews,
}: V2ReviewFiltersProps) {
  // ── Topic tags gate: only show when program has tags AND ≥10 reviews ─────
  const showTopicTags = topicTags.length > 0 && totalReviews >= 10;

  // ── Identity chips: conditionally render data-driven chips ──────────────
  // "All" always renders. "Has media" renders only when at least one review
  // carries media. Identity tag chips render only when at least one review
  // carries the matching tag.
  const visibleIdentityChips: IdentityChipDef[] = IDENTITY_CHIP_DEFS.filter(
    (def) => {
      if (def.key === "all") return true;
      if (def.key === "has_media") {
        return reviews.some((r) => (r.media?.length ?? 0) > 0);
      }
      return reviews.some((r) => r.identityTags?.includes(def.identityTag!));
    }
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleTopicClick(label: string) {
    // Toggle: clicking the active chip clears it
    onSelectTopic(selectedTopic === label ? null : label);
  }

  function handleIdentityClick(key: IdentityFilterKey) {
    // Clicking "all" or the active chip clears the selection back to "all"
    if (key === "all" || key === selectedIdentity) {
      onSelectIdentity("all");
    } else {
      onSelectIdentity(key);
    }
  }

  // Nothing to render (rare: no topic tags and only "All" identity chip)
  if (!showTopicTags && visibleIdentityChips.length <= 1) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Topic tags row ("Reviews mention") ── */}
      {showTopicTags && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Reviews mention
          </p>
          {/* Horizontally scrollable on mobile, wraps on larger screens */}
          <div
            role="group"
            aria-label="Filter reviews by topic"
            className="flex flex-wrap gap-1.5"
          >
            {topicTags.map((tag) => (
              <Chip
                key={tag.label}
                label={`${tag.label} (${tag.count})`}
                active={selectedTopic === tag.label}
                onClick={() => handleTopicClick(tag.label)}
                ariaLabel={`Filter by topic: ${tag.label}, ${tag.count} mentions`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Identity / media filter row ── */}
      {visibleIdentityChips.length > 1 && (
        <div
          role="group"
          aria-label="Filter reviews by reviewer type"
          className="flex flex-wrap gap-1.5"
        >
          {visibleIdentityChips.map((def) => (
            <Chip
              key={def.key}
              label={def.label}
              active={selectedIdentity === def.key}
              onClick={() => handleIdentityClick(def.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

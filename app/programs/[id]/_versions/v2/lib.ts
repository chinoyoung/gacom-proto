// ── Shared constants & helpers for the v6 design version ──────────────────────

import type { Review } from "../../_components/types";

/**
 * Human-readable labels for each rating category key.
 * Shared by V2ReviewCard (CategoryDropdown) and V2ReviewSummary.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  academicsRating: "Academics",
  livingSituationRating: "Living situation",
  culturalImmersionRating: "Cultural immersion",
  programAdministrationRating: "Program administration",
  healthAndSafetyRating: "Health & safety",
  communityRating: "Community",
};

/**
 * Parses a stored date string (e.g. "March 15, 2025") into a Date object.
 * Returns null when the value is undefined or results in an invalid date.
 */
export function parseReviewDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// ── Identity filter chip definitions ─────────────────────────────────────────

/**
 * Filter chip types for the identity/media filter row.
 * "all" is the default unfiltered state; the others are data-driven.
 */
export type IdentityFilterKey =
  | "all"
  | "has_media"
  | "solo_traveler"
  | "first_timer"
  | "bipoc"
  | "women_solo";

/**
 * Static definition for each identity filter chip.
 * - `key`: unique identifier used in component state.
 * - `label`: display text shown in the chip.
 * - `identityTag`: the exact tag string to match against `review.identityTags`
 *   (undefined for "all" and "has_media" which have special logic).
 */
export interface IdentityChipDef {
  key: IdentityFilterKey;
  label: string;
  /** Exact string to look up in review.identityTags. Undefined for non-tag filters. */
  identityTag?: string;
}

/**
 * Ordered list of identity filter chip definitions.
 * "All" is always rendered. "Has media" is rendered only when at least one
 * review carries media. The four identity chips are rendered conditionally —
 * only when at least one review carries the matching tag.
 */
export const IDENTITY_CHIP_DEFS: IdentityChipDef[] = [
  { key: "all", label: "All" },
  { key: "has_media", label: "Has media" },
  { key: "solo_traveler", label: "Solo travelers", identityTag: "Solo traveler" },
  { key: "first_timer", label: "First-timers", identityTag: "First-timer" },
  { key: "bipoc", label: "BIPOC", identityTag: "BIPOC" },
  { key: "women_solo", label: "Women solo", identityTag: "Women solo" },
];

// ── Demo review media (prototype only) ────────────────────────────────────────

/** Simple deterministic string hash → non-negative int. */
function hashReviewId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// DEMO ONLY: fabricates reviewer media for the prototype so the v6 review
// cards showcase the thumbnail + lightbox treatment (mirrors V1Reviews.tsx).
// Reviews with real media always keep it; of the rest, ~half get 2–6
// deterministic placeholder photos so the "Has media" filter stays useful.
// Remove before production.
export function getDemoReviewMedia(review: Review): string[] {
  const real = review.media ?? [];
  if (real.length > 0) return real;
  const h = hashReviewId(review._id);
  if (h % 2 !== 0) return [];
  const count = 2 + (h % 5); // 2–6
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/${review._id}-${i}/300/300`
  );
}

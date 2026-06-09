// ── Shared constants & helpers for the reviews-2026 design version ────────────

/**
 * Human-readable labels for each rating category key.
 * Shared by ReviewCard2026 (CategoryDropdown) and ReviewSummary2026.
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

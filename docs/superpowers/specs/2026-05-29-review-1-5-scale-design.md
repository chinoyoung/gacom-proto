# Convert review system from 1–10 to 1–5 star scale

**Date:** 2026-05-29
**Status:** Approved (pending implementation plan)

## Goal

Convert the entire program-review rating system from a 1–10 scale to a 1–5 star
scale. Ratings should live *natively* on the 1–5 scale in the database (existing
data migrated by halving), the admin input form should capture whole stars (1–5),
and all display code should drop the divide-by-2 / divide-by-10 compensation it
currently uses to map a 10-point scale onto 5 stars.

Applies to **all** program-detail versions (default, v1, v2, v4, v5), shared
components, the admin review form, and AI review generation.

## Decisions (confirmed with user)

1. **Existing data:** migrate by halving every stored rating (1–10 → 1–5). No
   mixed-scale display logic remains afterward.
2. **Granularity:** whole stars (1–5) for new input; averages still render with
   one decimal (e.g. `4.3`). Migrated values may carry `.5` (e.g. `9 → 4.5`) — this
   is acceptable since averages already show decimals.
3. **Scope:** all versions + shared components + admin + AI generation.

## Out of scope (YAGNI)

- No redesign of the admin number inputs into a star-picker widget — keep the
  existing number inputs, just retargeted to 1–5.
- No new schema range validation (`v.number()` stays as-is; the scale is convention).
- `marketplace/*` and `/brand` are untouched (they do not display program review ratings).

## Conversion rules

- A stored rating `r` on the old scale maps to `r / 2` on the new scale.
- A "/10" suffix becomes "/5".
- Star fill that previously used `avgRating / 2 >= star` becomes `avgRating >= star`.
- Category bar widths `value / 10 * 100%` become `value / 5 * 100%`.

## Touch points

### 1. Data layer

**`convex/schema.ts`** (lines ~89–96)
- Update comments `// 1–10` and `// Category ratings (each 1–10)` → `// 1–5`.
- No field-type changes.

**`convex/reviews.ts`** — new one-time migration mutation
- Add `migrateRatingsTo5Scale` mutation: iterate all reviews; for each, set
  `overallRating` and the 6 category ratings (`academicsRating`,
  `livingSituationRating`, `culturalImmersionRating`,
  `programAdministrationRating`, `healthAndSafetyRating`, `communityRating`) to
  their current value divided by 2.
- **Run exactly once** (Convex dashboard or `npx convex run`). It is **not
  idempotent** — running twice halves twice. Delete the mutation after the run.

### 2. Write side (input + generation)

**`app/admin/_components/ReviewsManager.tsx`**
- 7 rating fields. For each:
  - Label text `(1–10)` → `(1–5)`.
  - Input attributes `max={10} step={0.5}` → `max={5} step={1}` (min stays `1`).
- Default form values `overallRating: 10` … (all 7) → `5`.

**`app/api/ai/generate/route.ts`** (line ~59)
- Review-generation prompt: `overallRating is a number 1-10 (lean towards 7-10 …)`
  → `1-5 (lean towards 4-5 …)`; the 6 category ratings `each a number 1-10` → `1-5`.

**`app/admin/create-listing/_components/AIGenerateButton.tsx`** (lines ~96, 102–107)
- `const rating = Math.floor(Math.random() * 3) + 8; // 8–10` → range `4–5`
  (`Math.floor(Math.random() * 2) + 4`).
- Category clamps `Math.min(10, …)` → `Math.min(5, …)`; keep jitter within 1–5.

### 3. Read side (display) — remove 10-scale compensation

**`/10` → `/5` suffix (6 spots)**
- `app/programs/[id]/_components/ProgramHero.tsx:34` — `STATIC_RATING = "8.4 / 10"` → `"4.2 / 5"`.
- `app/programs/[id]/_components/ProgramReviews.tsx:80` — `/10` → `/5`.
- `app/programs/[id]/_components/WhyChooseProgram.tsx:~29` — `/10` → `/5`.
- `app/programs/[id]/_versions/v1/TrustBar.tsx:34` — `… / 10` → `… / 5`.
- `app/programs/[id]/_versions/v5/V5TrustBar.tsx:34` — `… / 10` → `… / 5`.
- `app/programs/[id]/_versions/v5/V5Reviews.tsx:172` — `/10` → `/5`.

**Star fill — drop `/ 2` mapping**
- `ProgramReviews.tsx:175–176` — `avgRating / 2 >= star` → `avgRating >= star`;
  half-star `avgRating / 2 >= star - 0.5` → `avgRating >= star - 0.5`.
- `v1/ReviewsSection.tsx:205`, `v2/ReviewsSection.tsx:205`, `v5/V5Reviews.tsx:180`
  — `avgRating / 2 >= star` → `avgRating >= star`.
- `WhyChooseProgram.tsx:33–35` — `starValue = star * 2` → `starValue = star`;
  `rating >= starValue - 1` → `rating >= starValue - 0.5` (half-star threshold).

**Category bar widths — `/10` → `/5` (7 spots)**
- `ProgramReviews.tsx:202`.
- `ProgramReviews.tsx:250–255` — the `* 10) / 10` rounding stays (it's decimal
  rounding, not scale); only confirm no `/10` width math remains.
- `v1/ReviewsSection.tsx:223, 355`.
- `v2/ReviewsSection.tsx:223, 355`.
- `v5/V5Reviews.tsx:240, 381, 471`.

**V5 distribution buckets** — `v5/V5Reviews.tsx:105–113`
- Currently `min = stars*2-1; max = stars*2` (e.g. 5★ = 9–10). Change to integer-star
  buckets on the 1–5 scale: bucket by `Math.round(overallRating)` into stars 1–5,
  with labels reflecting the single star value rather than a 2-wide range.

**V4 normalization removal** — `v4/InquiryReviews.tsx:102, 111`
- Remove the `avgRating > 5 ? avgRating / 2 : avgRating` heuristic and the per-review
  `r.overallRating > 5 ? r.overallRating / 2 : r.overallRating`. Use the values
  directly (data is now natively 1–5).

## Verification

- After migration, spot-check a program detail page in each version (`?v=v1` …
  `?v=v5` and default): aggregate rating shows `X.X / 5`, star rows fill correctly
  (a 4.5 shows 4½ stars), category bars are proportional.
- Admin form: creating a review with whole-star inputs (1–5) saves and renders correctly.
- AI-generated review ratings fall in 1–5.
- No remaining `/10`, `/ 10`, `avgRating / 2`, or `/ 10 * 100` in program-review code.

## Risks

- **Migration idempotency:** running `migrateRatingsTo5Scale` more than once
  corrupts data. Mitigation: run once, verify, then delete the mutation.
- **Missed touch point:** the inventory above is exhaustive per a full-codebase
  sweep; the verification grep for residual `/10` / `/ 2` patterns catches stragglers.

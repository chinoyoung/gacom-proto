# Insurance Plans Section — Readability Redesign

**Date:** 2026-05-12
**Page:** `/marketplace/insurance` (component: `V1InsurancePlans.tsx`)
**Status:** Design approved, ready for implementation

## Problem

The current plans section renders 4 plan cards in a `grid-cols-4` layout. Each card repeats the same 14-item inclusions list verbatim — 11 of those items are identical across all four plans, and only 3 (Repatriation, Emergency Reunion, Baggage Theft & Loss) have a real differentiator (a "2x the coverage limit" note that applies only to Premium+ and Premium).

Effects:
- Cards are extremely tall, dense, and visually repetitive.
- Cross-plan comparison is hard — to compare a single feature, the eye must jump between cards.
- The mobile experience is four very tall stacked cards.

## Goal

Make comparison across plans the primary affordance. Keep the visual tier identity established by the existing color system (roman / sun / cobalt / slate accents).

## Approach — Hybrid: header cards + comparison table

Split the section into two stacked elements:

1. **Header cards row** — slim cards, one per plan, conveying tier identity, coverage limit, deductible, and the per-plan CTA.
2. **Comparison table** — a single shared table with one row per inclusion and four plan columns, replacing the per-card inclusions list entirely.

Both elements sit inside the existing `bg-cobalt-500` section. The current section header — eyebrow `INSURANCE PLANS`, h2 `GoAbroad Insurance Plans & Inclusions`, intro paragraph — stays exactly as it is. Only the body changes.

## Structure

### Header cards row

- Layout: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`, `items-start`.
- Card wrapper: `bg-white rounded-xl border border-slate-200 p-6`.
- Top accent bar (existing pattern): `h-1.5 rounded-t-xl -mx-6 -mt-6 mb-5 ${plan.tier.accentClass}`.
- Tier eyebrow (existing): `text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${plan.tier.textClass}`.
- Plan name: `<h3 className="text-lg font-semibold text-neutral-800">`.
- Tagline: `text-sm text-slate-500 leading-relaxed mt-1`. Allow wrap; no truncation.
- Divider: `border-t border-slate-200 my-5`.
- Stat block (vertical stack):
  - **Coverage Limit** — label `text-xs font-semibold uppercase tracking-wider text-slate-500`; value `text-2xl font-bold ${plan.tier.textClass}`.
  - **Deductible** — label same; value `text-xl font-bold text-neutral-800`.
- Divider: `border-t border-slate-200 my-5`.
- Per-card CTA: a real `<Link href="#hero">` styled with the brand primary button class — `w-full inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500`. Label: `Get a quote`.
  - All four buttons use the same cobalt color. Tier identity is already conveyed by the accent stripe, eyebrow, and coverage-limit color; coloring buttons too would add noise.
- Premium card retains `ring-2 ring-sun-500` (existing emphasis). No ring on other cards.

The current bottom "Get a quote" link below the grid is **removed** — CTAs live inside cards now.

### Comparison table

- Wrapper: `bg-white rounded-xl border border-slate-200 mt-8 overflow-x-auto`.
- Inner: `<table className="w-full text-left">`.
- Header row (`<thead>`):
  - First column: `"What's included"` (`text-xs font-semibold uppercase tracking-wider text-slate-500 py-4 px-4`).
  - Each plan column: a stacked label
    - Top line: tier eyebrow text (`text-[11px] font-semibold uppercase tracking-widest`) in the tier color.
    - Bottom line: plan name (`text-sm font-semibold text-neutral-800`).
  - Cell padding: `py-4 px-4`. Plan columns are `text-center`.
  - Header bottom border: `border-b border-slate-200`.
- Body rows (`<tbody>`), 12 rows total (see data section below):
  - Row border: `border-b border-slate-100`. Last row has no bottom border.
  - First column (feature label):
    - `<td className="py-3 px-4 sticky left-0 bg-white">` to keep the label visible on mobile horizontal scroll.
    - Feature: `text-sm text-neutral-800 leading-snug`.
    - Optional caption (telehealth providers): `text-[11px] text-slate-500 leading-snug mt-0.5`.
  - Plan cells: `<td className="py-3 px-4 text-center">`.
    - Standard inclusion: `<Check className="w-4 h-4 text-fern-600 inline-block" aria-hidden="true" />` with `<span className="sr-only">Included</span>`.
    - Boosted (2x) inclusion: `<span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-fern-500/15 text-fern-700">2x</span>` with `<span className="sr-only">Included, 2x the coverage limit</span>`.
- The sticky first-column treatment means on mobile the user can scroll horizontally to compare plans without losing the feature name. The inner `<table>` gets `min-w-2xl` (42rem) so plan cells stay readable while still triggering the horizontal scroll on phones.

## Data

Restructure `app/marketplace/insurance/_data/plans.ts`:

```ts
export interface InsuranceTier {
  label: string;
  accentClass: string;
  textClass: string;
  ringClass?: string;
}

export type PlanId = "premium-plus" | "premium" | "standard" | "saver";

export interface InsurancePlan {
  id: PlanId;
  name: string;
  tagline: string;
  coverageLimit: string;
  deductible: string;
  tier: InsuranceTier;
}

export interface ComparisonRow {
  feature: string;
  caption?: string;
  boosted: PlanId[]; // plans where this feature gets the "2x" treatment instead of a checkmark
}

export const insurancePlans: InsurancePlan[]; // 4 entries, Premium+ → Saver order
export const comparisonRows: ComparisonRow[]; // 12 entries, exact order below
```

Drop the existing `InsuranceInclusion` type and the per-plan `inclusions` array entirely.

### `insurancePlans` data

Preserve current order (Premium+ → Premium → Standard → Saver). Existing tier objects unchanged.

### `comparisonRows` data (12 entries, in order)

| Feature | Caption | Boosted plans |
|---|---|---|
| `100% Coinsurance` | — | `[]` |
| `Emergency Medical Evacuation` | — | `[]` |
| `Repatriation for Medical Treatment` | — | `["premium-plus", "premium"]` |
| `Emergency Reunion` | — | `["premium-plus", "premium"]` |
| `Political Evacuation & Repatriation` | — | `[]` |
| `Accidental Death & Dismemberment` | — | `[]` |
| `Telehealth — US` | `Teladoc, DialCare` | `[]` |
| `Telehealth — Non-US` | `AllHealth360, Telus Health` | `[]` |
| `Baggage Theft & Loss` | — | `["premium-plus", "premium"]` |
| `Dental Care` | — | `[]` |
| `Personal Liability` | — | `[]` |
| `Terrorism Benefits` | — | `[]` |

## Files touched

| File | Change |
|---|---|
| `app/marketplace/insurance/_data/plans.ts` | Restructure: remove `InsuranceInclusion`, remove per-plan `inclusions`, add `ComparisonRow` interface and `comparisonRows` export. |
| `app/marketplace/insurance/_versions/v1/V1InsurancePlans.tsx` | Rewrite the section body: header cards become slimmer (no inclusions list, add per-card "Get a quote" button); add comparison table below; remove the bottom centered "Get a quote" link. |

No other files change. No new dependencies.

## Constraints respected

- **Tailwind brand tokens only** — `cobalt-*`, `roman-*`, `sun-*`, `fern-*`, plus standard slate / neutral / white. No hex.
- **Mobile-first** — cards stack on mobile; the table scrolls horizontally with a sticky feature-name column so the comparison remains usable at 375px.
- **Restrained design** — no gradients, no shadows beyond existing utility ring, `rounded-lg` / `rounded-xl` only, no oversized buttons.
- **Section rhythm preserved** — section keeps `bg-cobalt-500`, `scroll-mt-36`, `aria-labelledby="plans-heading"`, all section paddings unchanged.

## Accessibility

- Table header row uses `<th scope="col">` for plan columns and a `<th scope="col">` for the feature column.
- Each plan cell adds an `<span className="sr-only">` describing the value ("Included" or "Included, 2x the coverage limit") since visual ✓ / 2x alone is ambiguous to screen readers.
- Telehealth provider captions are inline text inside the feature cell (no `aria-describedby` plumbing needed).
- Plan tier eyebrows are decorative; the `<h3>` plan name handles semantic level.
- Per-card "Get a quote" buttons are real anchors to `#hero` with `focus-visible:ring-2`.

## Out of scope

- Pricing per plan (the page intentionally avoids transactional pricing).
- Plan selection state / toggle filters / "show only differences" filters.
- A "highlight differentiators" mode.
- Any changes to other insurance page sections.

# eSIM Detail Hero — UX Redesign

**Date:** 2026-05-07
**Status:** Approved (pending user review of this spec)
**Scope:** `app/marketplace/esim/[destination]/_components/EsimDetailHero.tsx`

## Problem

The current hero asks the user to pick "Duration" and "Data Package" as two abstract pill rows, with the resulting price tucked into a separate right-hand column. Specific issues:

- **Price disconnected from choice** — the total appears in a different visual zone from the controls that determine it.
- **No per-day cost** — the most-asked question for eSIM purchases isn't shown anywhere.
- **Abstract duration** — "30 Days / 90 Days" tells you nothing about *when* coverage begins or ends. There's no trip framing.
- **Equal weight to all options** — every package and duration looks the same, with no guidance toward the popular choice.
- **Dense desktop layout, cramped mobile** — the two-column structure compresses awkwardly below `lg`.

## Goals

1. Make the **price decision-relevant**: per-day cost visible, coverage range visible, total prominent.
2. Frame the purchase around the **trip start date**, not abstract durations.
3. Surface a **recommended default** so the 80% of users who don't want to optimize see one clear path.
4. Keep advanced configuration available but **demoted** to a collapsible section.
5. **Mobile-first**: every section is full-width and reads top-to-bottom on a 375px viewport.
6. **Brand-aligned**: cobalt CTAs, `rounded-lg` buttons, slate-100 hero, no gradients or new visual patterns.

## Non-Goals

- No schema or data-model changes. The existing `Destination.durations` (30 / 90 days) and `Destination.packages` (1, 3, 5, 8, 20 GB) are unchanged.
- No real pricing API integration. The static price math in the current hero is preserved; the redesign treats it *as if* it came from an API call requiring a start date (this is a forward-compat note, not implementation).
- No new components beyond the hero itself. The rest of the product page is unchanged.

## Design

### Information architecture (top → bottom on mobile)

1. **Identity** (unchanged) — breadcrumb, eyebrow, flag + h1, optional Region badge, optional coverage note, description.
2. **Travel start date** — single date input, defaults to today.
3. **Recommended plan card** — featured card with the active selection (5 GB / 30 days by default), per-day cost, coverage end date, and the primary CTAs.
4. **Customize section** (collapsed by default) — duration toggle and data pills that drive the recommended card live.
5. **Trust strip** — instant QR · 30-day refund · 5G included.

### Default state

- **Date**: `today` (required by the price API; pre-filled so the price is visible immediately).
- **Duration**: `30 Days` (most popular).
- **Data**: `5 GB` (3rd index of the package array — middle option).

### Recommended plan card (the headline)

Visual: a single white card with a `border border-slate-200`, `rounded-xl`, `p-6 md:p-8`. Inside:

- Top-right pill: `Most popular` — `bg-sun-500 text-neutral-900` (matches Region badge pattern).
- Plan name (card title): `5 GB · 30 days` — semantic `<h2>` styled per brand card title (`text-lg font-semibold text-neutral-800`).
- Price (visual headline, not a heading): `$9.99` — `text-4xl font-bold text-neutral-900`.
- Meta line: `$0.33 / day · Active May 15 → Jun 14` — `text-sm text-slate-500`.
- Buttons: `Buy Now` (cobalt-500 primary) and `Add to Cart` (secondary `border-slate-300`), both `rounded-lg px-7 py-3`.

When the user customizes, the card values update live — no separate "preview" panel needed.

### Customize section

Trigger: a button with `▼ Choose a different plan` text + chevron rotation when open. Defaults to collapsed.

When open:

- **Duration**: two pills (`30 days` / `90 days`), same selectable-pill styling already used in the codebase.
- **Data**: five pills (`1 GB`, `3 GB`, `5 GB`, `8 GB`, `20 GB`) with the per-package price displayed underneath each pill (text-xs text-slate-500).
- The currently-selected combination is reflected in the headline card above.

### Date input

Use **native `<input type="date">`** for v1:

- Zero deps, smallest bundle.
- Mobile triggers OS-native picker (iOS wheel, Android calendar).
- Fully accessible by default.
- Easy to swap for a custom popover later if the team wants more polish.

The date input gets brand-styled via Tailwind (`border-slate-300 rounded-lg px-4 py-3 focus-visible:ring-cobalt-500`).

Format displayed below the input: `Active <date> → <date+duration-1>` updates live.

### Coverage range computation

```ts
const startDate = new Date(date);
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + durationDays - 1);
```

Format using `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })` — e.g. "May 15 → Jun 14".

### URL state

All three controls persist to query params:

- `?date=2026-05-15&duration=30-days&data=5gb`

Existing `duration` and `data` slugification helpers stay; `date` uses ISO `YYYY-MM-DD`. `router.replace(..., { scroll: false })` keeps the page from jumping on each change.

If a param is missing or invalid, the default applies (today, 30 days, 5 GB).

### Layout

**Mobile (<md)**: single column, sections stack in the order above.

**Desktop (md+)**: two-column grid `lg:grid-cols-[1fr_minmax(380px,420px)]`:
- Left column: identity block + date picker + customize.
- Right column: the recommended plan card, vertically centered against the left stack.

### Section background

No change — the hero remains `bg-slate-100` per the previous brand pass.

## What's removed

- The current right-column "Total + buttons" stack.
- The flat "Duration" / "Data Package" pill rows as a *primary* picker (they move into the collapsible Customize section).

## What stays

- All breadcrumb, region badge, coverage note logic.
- The same 5-package × 2-duration data model — no schema change.
- Existing slugification helpers for URL params.

## Accessibility

- Date input: native, fully accessible.
- Customize trigger: `<button>` with `aria-expanded`, `aria-controls` pointing to the customize panel.
- Recommended card: title is an `<h2>` with `aria-labelledby` linking the card region.
- Pills inside Customize: keep current `aria-pressed` pattern.
- All interactive elements: `cursor-pointer`, `focus-visible:ring-2 focus-visible:ring-cobalt-500`.

## Visual tokens

All cobalt / sun / slate tokens already defined in `app/globals.css`. No new colors, no inline hex.

## Open questions

None for v1. Future polish (post-prototype):

- Replace native date input with a custom popover calendar if stakeholders want more brand control.
- Show plan comparison table when Customize is open (currently we show the same pill rows the existing hero has — simpler).
- Add a sticky bottom CTA bar on mobile when the hero scrolls out of view.

## Files touched

- `app/marketplace/esim/[destination]/_components/EsimDetailHero.tsx` (full rewrite)

No other files change.

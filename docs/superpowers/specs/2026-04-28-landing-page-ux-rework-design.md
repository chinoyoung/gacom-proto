# Landing Page UX Rework — Design Spec

**Date:** 2026-04-28
**Scope:** `app/page.tsx` (the prototype hub stakeholders see first)
**Audience:** Internal GoAbroad stakeholders (PMs, designers, leadership) reviewing prototypes

## Problem

The landing page reads like an engineering file tree, not a stakeholder-facing review hub. Specifically:

- The "Beta" tag on Program Directory has no shared definition and fails WCAG contrast (`bg-cobalt-50 text-white`).
- Module descriptions describe *what each module is*, not *what reviewers should evaluate*.
- The hero gives no orientation — first-time stakeholders don't know whether to browse, comment, or approve.
- A two-level heading hierarchy ("Available Modules" → "Prototypes" / "Admin") adds cognitive overhead for five items.
- The "Articles & Content" card renders at 60% opacity with `cursor-not-allowed` and a dead `href="#"`, which reads as a bug rather than a planned placeholder.
- Two stacked footer-like blocks (the inline "Footer Branding" section + `AdminFooter`) fragment the bottom of the page.
- Hero `py-16` pushes the first module card below the fold on mobile.

## Goals

1. Reframe the page as a review hub: orient the reviewer, tell them what each module asks of them.
2. Remove visual and structural noise that doesn't serve that goal.
3. Fix the mobile above-the-fold issue.
4. No new component patterns, no design-language additions — operate within existing `cobalt`/`roman`/`sun`/`fern` palette and standard Tailwind classes.

## Non-Goals (explicitly out of scope)

- A status-tag taxonomy (e.g., "Ready for Review" / "In Progress"). All four prototypes are equivalent works-in-progress, so per-module status is not surfaced.
- Numbered or phased module ordering.
- Surfacing the comment system on the landing page.
- Visual restyle of the module cards themselves (hover, shadow, radius, icon block all stay).
- New routes or schema changes.

## Design

### Page structure (top → bottom)

1. **`AdminHeader`** — unchanged.
2. **Hero section**
   - Keep the "Internal Prototype" pill (the cobalt pulse + uppercase label).
   - Keep the `Design Prototypes.` headline.
   - Keep the existing subtitle paragraph.
   - **Append one sentence to the subtitle paragraph:** "Open a module below to review the prototype and leave feedback."
   - Change padding from `py-16` to `py-10 md:py-16` so the first module card is above the fold on a 390px viewport.
3. **Module list section**
   - Remove the `<h2>Available Modules</h2>` heading entirely.
   - Remove the `<h3>Prototypes</h3>` heading entirely.
   - Keep the `<h3>Admin</h3>` heading as the visual separator between the prototype cards and the Admin card.
   - Module cards: no status tags. Just icon block, title, description, and the "Open →" affordance.
   - **Articles & Content card removed entirely** (along with the unused `FileText` import).
4. **Footer**
   - Remove the inline `<section>` containing "Restricted Engineering Environment" and "Property of GoAbroad.com" — `AdminFooter` already handles attribution.
   - The "Restricted Engineering Environment" string is dropped; the hero's "Internal Prototype" pill conveys the same signal more prominently.
5. **`AdminFooter`** — unchanged.

### Module card copy (rewrite)

Each description is reframed from *what it is* → *what to review*. Final strings:

- **Program Directory** — "The modernized search and discovery experience. Browse programs, filter by criteria, and open a detail page. Feedback wanted on the search/filter UX and listing presentation."
- **Create Listing** — "The new 8-step flow for drafting and publishing a program. Walk through the steps and submit a test listing. Feedback wanted on step pacing and field labeling."
- **Partner Marketplace** — "Landing page for recruiting ambassadors and program partners. Feedback wanted on messaging hierarchy and the call-to-action."
- **Admin** — "Administrative hub for managing listings, applications, and organizational settings. Browse the dashboards and review the IA."

### `ModuleListItem` component changes

The component currently accepts `tag`, `isPrimary`, and `isDraft`. After this rework:

- `tag` prop: **removed** (no module shows a tag anymore).
- `isDraft` prop: **removed** (Articles is gone, no other module is a draft).
- `isPrimary` prop: **kept** (Program Directory still gets the cobalt-filled icon block to signal it's the centerpiece).
- The internal branches that handled `tag`, `isDraft`, `cursor-not-allowed`, and `grayscale` are deleted along with the props. The conditional `href={isDraft ? "#" : href}` collapses to just `href`.

### Imports to remove from `app/page.tsx`

- `FileText` from `lucide-react` (only used by the removed Articles card).

## Acceptance criteria

- The page renders with no `tag` badges and no draft/disabled card.
- The first module card (Program Directory) is fully visible above the fold on a 390px-wide viewport.
- Only one footer is visually present below the module list (`AdminFooter`).
- Module copy reads as reviewer prompts, not engineering descriptions — every card answers "what is the reviewer being asked to do?"
- No inline hex colors. All color classes use brand tokens (`cobalt-*`, `slate-*`, etc.) per `CLAUDE.md`.
- Mobile layout still uses the `flex-col md:flex-row` card layout already in `ModuleListItem` — no regressions on small screens.
- No new components, no schema changes, no new dependencies.

## Files affected

- `app/page.tsx` — all edits land here. No other files modified.

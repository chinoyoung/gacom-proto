# Program Hero Conversion Redesign

## Goal

Redesign the ProgramHero component to serve all stages of the student decision funnel — from early explorers to ready-to-commit applicants. Primary conversion goals: drive applications (Apply Now) and capture leads (Inquire), weighted equally.

The core problem: serious students comparing programs need key decision info (especially financial) visible without scrolling. The current horizontal facts strip doesn't surface enough.

## Layout Structure

### Desktop (lg+)

Two columns:
- **Left (`lg:max-w-[60%]`):** Identity block, fact grid, CTAs — stacked vertically
- **Right (`lg:w-[40%]`):** Photo grid — conditional. When no photos exist, right column is not rendered; left column expands to full width.

### Mobile / Tablet (below lg)

Single column, top to bottom:
1. Identity block
2. Fact grid (2-col grid)
3. CTAs (full-width)
4. Photo grid (full-width, `h-48` on mobile, `sm:h-64` on tablet)

Two-column layout only kicks in at `lg` breakpoint, matching the current implementation.

## Identity Block (top of left column)

No major changes from current implementation:
- Provider name — small uppercase `text-xs font-bold text-cobalt-700 uppercase tracking-[0.15em]`
- Trust badges row — rating pill (sun colors) + verified pill (fern colors), consistent `gap-1.5`
- Provider logo (if exists) + program title

Tagline is out of scope — it does not exist in the schema, types, or form. Can be added in a future iteration.

## Fact Grid (replaces horizontal key facts strip)

2-column grid of fact cells. Each cell: icon + muted label + semibold value.

| Left Column | Right Column |
|-------------|--------------|
| Location (city, country) | **Cost** (visually emphasized) |
| Terms | Education levels |
| Duration | Credits (if exists) |

### Icons
- Location: `MapPin`
- Terms: `Calendar`
- Duration: `Clock`
- Cost: `Coins`
- Education levels: `GraduationCap`
- Credits: `Award`

All icons: `w-4 h-4 text-cobalt-500`

### Cell styling
- Label: `text-xs text-slate-500`
- Value: `text-sm font-semibold text-slate-700`
- Separated by subtle horizontal borders (`border-slate-200`) between rows
- No background cards on individual cells — clean, flat design per project design language

### Cost emphasis
- Value rendered with `text-base font-bold text-slate-900` (larger/bolder than other cells)

### Missing fields
- If a field has no data, that cell does not render
- Grid stays 2-column but rows may be uneven — acceptable

## CTAs

Directly below the fact grid, single row on desktop:

1. **"Apply Now"** — primary: `bg-cobalt-500 text-white font-bold text-sm rounded-lg px-5 py-2.5`
   - Links to `program.applyUrl` if available, otherwise a button
2. **"Inquire"** — secondary: `bg-white border border-cobalt-300 text-cobalt-600 font-semibold text-sm rounded-lg px-5 py-2.5`
   - Scrolls to the contact/inquiry section of the page (or opens mailto:`program.contactEmail` if no inquiry form exists)
   - Keep the existing Inquire button in QuickDetails sidebar as well — redundancy is intentional for conversion (sidebar serves users who scroll past the hero)
3. **"Save"** — icon-only bookmark button (`w-10 h-10` tap target), no label text
   - Sits to the right of Inquire on the same row
   - Same toggle behavior as current (filled/unfilled Bookmark icon)

### Mobile
- "Apply Now" and "Inquire" are full-width, stacked vertically
- "Save" icon button sits on the same row as "Apply Now" (right-aligned)

## Photo Grid (right column)

### When photos exist
- `lg:w-[40%]` on desktop, same internal layout: main image + 2 thumbnails
- Lightbox, hover effects, expand icons — all unchanged

### When no photos
- Right column is not rendered at all
- Remove the existing gradient placeholder (`bg-gradient-to-br from-cobalt-700 to-cobalt-500`) from the PhotoGrid empty state
- Left column takes full width

### Mobile
- Full-width below CTAs
- Height: `h-48 sm:h-64` (shorter than desktop `lg:h-96`)

## Skeleton Loader

Update `ProgramHeroSkeleton` to match new layout:
- Left column:
  - Provider placeholder: `h-3.5 w-24`
  - Trust badges: two `h-6 rounded-full` pills
  - Title: `h-9 w-[85%]`
  - Fact grid: 2x3 grid of cells, each `h-10 rounded` with varying widths
  - CTAs: two `h-10 rounded-lg` buttons (`w-32`, `w-28`) + one `h-10 w-10 rounded-lg`
- Right column: photo grid placeholder `rounded-xl bg-slate-100` (same dimensions as current)

## What stays unchanged

- Provider label styling
- Trust badge pills (rating + verified)
- Logo + title layout
- Photo grid internals (PhotoGrid component, lightbox, navigation)
- Overall section wrapper (`bg-slate-100 border-b border-slate-300`)
- QuickDetails sidebar Inquire button (kept for scroll-past conversion)

## What changes

1. Key facts horizontal strip -> 2-column fact grid with financial emphasis
2. New fact cells: education levels (`GraduationCap`), credits (`Award`)
3. "Inquire" elevated to hero-level CTA (scroll-to-contact or mailto)
4. "Save" button becomes icon-only
5. Photo column becomes conditional (collapses when no photos, gradient placeholder removed)
6. Mobile photo height reduced (`h-48 sm:h-64`)
7. Skeleton updated to match new structure

## Files affected

- `app/programs/[id]/_components/ProgramHero.tsx` — primary changes (layout, fact grid, CTAs, photo conditional, skeleton)

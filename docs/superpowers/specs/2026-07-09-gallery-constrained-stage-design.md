# Constrained Gallery Stage — Program Detail (v1)

**Date:** 2026-07-09
**Status:** Superseded by Revision 2 (collage layout) below — approved by Chino (chat)

## Problem

The media gallery on the program detail page (`app/programs/[id]/_versions/v1/V1MediaGallery.tsx`) renders its main image at the full `max-w-7xl` content width — measured at **1280×520 CSS px** on desktop. On retina (2x DPR) displays this requires a ~2560px-wide source. Clients typically upload 800–1200px images, which get upscaled 2.5–3× and look blurry. The 1280×520 stage is also a ~2.46:1 panoramic crop with `object-cover`, so standard 3:2 / 4:3 photos lose roughly half their vertical content.

## Decision

Constrain the gallery media stage instead of rendering it full width. (Alternatives considered and rejected for now: object-contain over a blurred backdrop; Airbnb-style collage grid.)

## Design

All changes are inside `V1MediaGallery.tsx`; the section wrapper in `V1DetailPage.tsx` is untouched.

1. **Section chrome unchanged.** The section stays inside the `max-w-7xl` container; the "Media Gallery" heading keeps its current position and style.
2. **Media stage capped at `max-w-3xl` (768px), centered.** The main image button and the thumbnail strip are wrapped together in a single `max-w-3xl mx-auto` wrapper so they stay aligned with each other.
3. **Aspect ratio replaces fixed heights.** Replace `h-[320px] md:h-[460px] lg:h-[520px]` on the main image with `aspect-[3/2]` (on the image or its button container, with the image filling it via `object-cover w-full h-full`). At 768px wide this is 512px tall — near-identical height to today, but the crop matches what clients upload.
4. **Everything else stays.** Thumbnails, photo counter badge, "View full size" affordance, lightbox (already `object-contain`, never upscales), keyboard navigation, focus rings.

## Rationale

A 1000–1200px client upload renders at ≤768 CSS px: pixel-perfect on 1x displays, ~1.3× stretch on retina instead of 2.5–3× today. The 3:2 stage also stops chopping half the photo.

## Constraints

- Standard Tailwind classes only; no inline hex; brand tokens per `BRANDING.md`.
- Mobile: stage is full-width at 3:2 (~250px tall at 375px viewport) — acceptable.
- No schema or data changes; purely presentational.

## Out of scope

- Enforcing minimum upload resolution in the create-listing form.
- Image CDN / next/image optimization.
- Other design versions or the hero image.

---

# Revision 2 — Collage Layout (approved 2026-07-09)

The centered `max-w-3xl` stage fixed resolution but left dead space beside it in the `max-w-7xl` section. Approved follow-up: replace the preview + thumbnail-strip model with an Airbnb-style collage that fills the section width while rendering every image smaller.

## Layout rules (in `V1MediaGallery.tsx`)

Layout adapts to photo count:

- **1 photo** — keep the Revision-1 treatment: centered `max-w-3xl`, `aspect-[3/2]` stage.
- **2 photos** — two `aspect-[3/2]` images side by side (`grid grid-cols-1 md:grid-cols-2 gap-2`).
- **3+ photos** — outer `grid grid-cols-1 lg:grid-cols-3 gap-2 lg:aspect-[7/3]`; the lead spans 2 of 3 columns (`lg:col-span-2`). At full section width the lead renders ~845×549 (≈3:2) and side tiles ~206×270. (Revised 2026-07-09: user asked for a wider lead and smaller tiles than the original 50/50 split.) Mobile keeps the lead full-width at 3:2 with tiles in a 2-col grid below:
  - Left: lead image filling the collage height (~845px wide at full section width).
  - Right: always a fixed 2 cols × 3 rows grid (`gap-2`) matching the lead's height (revised 2026-07-09):
    - Up to 6 remaining photos fill the cells in order.
    - Unused cells render as blank decorative placeholder squares (`rounded-md bg-slate-100`, `aria-hidden`), keeping the 2×3 shape at any photo count. Placeholders are hidden on mobile (`hidden lg:block`), where only real tiles show in a 2-col grid below the lead.
    - If more than 6 remain (total > 7), the 6th tile gets a dark scrim overlay reading "View all {total}" (e.g. "View all 10").
- Every image is a button opening the existing lightbox at its index. The "View all {total}" tile opens the lightbox at that photo's index.
- The thumbnail strip and the active-preview swap behavior are removed (lightbox arrows/keyboard already cover browsing).
- Images: `object-cover`, `rounded-md`, existing focus-visible ring treatment. Subtle hover scrim as click affordance.
- Mobile: collage stacks — lead full-width 3:2, remaining tiles in a 2-col grid below (max 4 + "+N" overlay).
- Lightbox, keyboard navigation unchanged.

## Why this is better for low-res images

No image renders wider than ~630 CSS px (lead) / ~310px (tiles) on desktop — below Revision 1's 768px and far below the original 1280px. Full section width is used, so the section no longer reads as a centered island.

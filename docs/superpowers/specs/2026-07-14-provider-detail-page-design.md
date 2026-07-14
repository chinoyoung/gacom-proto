# Provider Detail Page — Design Spec

**Date:** 2026-07-14
**Route:** `/providers/[slug]`
**Registry pageId:** `provider-detail` (already registered in `lib/design-versions.ts`, single version `v1`)

## Overview

Build a provider profile page that mirrors the design and layout of the program
detail page (`app/programs/[id]/`, active version `_versions/v1/`), but focused on
the **provider** rather than a single program. Program-specific content (pricing,
eligibility, dates, apply flow, "what's included") is removed; provider content
(about, why-choose, awards, FAQs, their programs, aggregate reviews) takes its place.

The backend is already complete — no schema or Convex changes are required:

- `providers` table (`convex/schema.ts`): `name, slug, logo, coverImage, tagline,
  about, whyChoosePoints[], headquarters, yearFounded, website, socialLinks[],
  photos[], awards[], faqs[], status`.
- Queries (`convex/providers.ts`): `getProviderBySlug`, `listProgramsByProvider`,
  `listReviewsByProvider` (returns published reviews across ALL of a provider's
  programs, each annotated with `programTitle` + `programSlug`), plus `seedProviders`.

## Goals

- A provider detail page at `/providers/[slug]` that reuses the program page's visual
  language, section rhythm, and chrome.
- Primary CTA is **Inquire with provider** (hero + sticky header + mobile bar +
  dedicated inquire section). Secondary CTA is **Visit Website** (`provider.website`).
- Aggregate reviews across all of the provider's programs, each review card labeled
  with its source program (links to that program).
- The provider's own published programs shown as the content centerpiece.
- Fully mobile-responsive, brand-consistent (cobalt/roman/sun/fern, standard Tailwind,
  no inline hex), matching `BRANDING.md`.

## Non-Goals / Out of Scope

- A `/providers` index/listing page (only the detail page was requested). The
  breadcrumb will still point its "Providers" crumb at `/providers` so it is ready
  when an index exists.
- Schema or Convex query changes (backend already done).
- Adding new design versions beyond `v1`.
- Save/favorite persistence (the heart toggle stays local-state only, as on programs).

## Architecture

Mirror the programs page structure exactly, adapted for `provider-detail`:

```
app/providers/
  layout.tsx                       # wraps children in <PrototypeShell> (switcher + comment canvas)
  [slug]/
    page.tsx                       # orchestrator (client): slug -> 3 queries -> loading/404 -> version switch
    _components/
      types.ts                     # Provider type (mirrors convex schema) + re-export shared Review type
      LoadingSkeleton.tsx          # adapted from programs LoadingSkeleton
      ProviderNotFound.tsx         # adapted from ProgramNotFound
      StickyProviderHeader.tsx     # adapted from StickyProgramHeader
      MobileStickyBar.tsx          # adapted from programs MobileStickyBar
    _versions/v1/
      V1ProviderPage.tsx           # full composition (adapted from V1DetailPage)
      V1ProviderHero.tsx           # adapted from V1Hero
      V1ProviderTrustBar.tsx       # adapted from V1TrustBar
      V1ProviderAbout.tsx          # adapted from V1Overview (renders provider.about + tagline)
      V1WhyChooseProvider.tsx      # renders provider.whyChoosePoints[]
      V1ProviderInfoCard.tsx       # sidebar: HQ, founded, website, socials, program count, Inquire (replaces V1Sidebar)
      V1ProviderPrograms.tsx       # grid of provider's programs (adapted from RelatedPrograms, reuses ProgramCard)
      V1ProviderMediaGallery.tsx   # adapted from V1MediaGallery (provider.photos)
      V1ProviderReviews.tsx        # adapted from V1ReviewsSection (aggregate + per-program labels)
      V1ProviderInquire.tsx        # adapted from V1InquireSection (contact provider)
      V1ProviderFAQ.tsx            # adapted from V1FAQ (provider.faqs)
      V1ProviderRecognitions.tsx   # adapted from V1Recognitions -> renders provider.awards[] as data
```

**Orchestrator (`page.tsx`) data flow:**

```ts
const slug = params.slug;
const provider = useQuery(api.providers.getProviderBySlug, slug ? { slug } : "skip");
const programs = useQuery(api.providers.listProgramsByProvider,
  provider ? { providerName: provider.name, status: "published" } : "skip");
const reviews  = useQuery(api.providers.listReviewsByProvider,
  provider ? { providerName: provider.name } : "skip");
const avgRating = /* mean of reviews[].overallRating, rounded to 2dp, else 0 */;

if (provider === undefined) return <LoadingSkeleton />;
if (provider === null)      return <ProviderNotFound />;
return <V1ProviderPage provider={provider} programs={programs}
                       reviews={reviews} avgRating={avgRating} />;
```

Version resolution uses the same pattern as programs (`resolveVersion("provider-detail", vParam)`).
Only `v1` exists, so a plain render is acceptable; keep the switch shape for parity/extensibility.

## Page Composition (top → bottom)

| # | Section | Adapted from | Notes |
|---|---------|--------------|-------|
| 1 | Sticky header | `StickyProgramHeader` | Logo + name + aggregate rating; **Inquire** (primary) + **Visit Website** (`provider.website`). Toggled by hero IntersectionObserver. |
| 2 | Hero | `V1Hero` | slate-100 band. Breadcrumb (Home / Providers / {name}). Cover image / photos on right. Logo + name + tagline + aggregate rating + HQ. CTAs: **Inquire Here** (primary), **Visit Website**, save heart (local state). Remove city/terms/apply-deadline. |
| 3 | Trust bar | `V1TrustBar` | Stats: Verified provider · Student rating · Reviews · Programs (count) · Year established (`yearFounded`) · Headquarters. Remove "Program Costs". Straddle seam as in V1DetailPage. |
| 4 | Two-column | `V1Overview` + `V1Sidebar` | **Left:** About (`tagline` + `about`) then Why-choose (`whyChoosePoints[]`). **Right sidebar:** `V1ProviderInfoCard` — HQ, founded, website link, social links, program count, Inquire button. |
| 5 | Programs by provider | `RelatedPrograms` | Section titled e.g. "Programs by {name}". Uses `programs` prop (already fetched via `listProgramsByProvider`) — do NOT re-query all programs. Reuse `@/components/ProgramCard`. Grid `sm:grid-cols-2 lg:grid-cols-3`. Empty state if none. |
| 6 | Media gallery | `V1MediaGallery` | `provider.photos`. Render only if non-empty. Anchor id `gallery` (hero photo CTA scrolls here). |
| 7 | Reviews | `V1ReviewsSection` | Aggregate reviews across programs. Each card shows a "from {programTitle}" label linking to `/programs/{programSlug}`. Rating summary + cards. Keep filters if they adapt cleanly; simplify if a filter depends on a single-program assumption. |
| 8 | Inquire | `V1InquireSection` | slate-100 band, anchor `inquire`. Contact-the-provider form. Primary CTA target from hero/sticky/mobile. Adapt copy from "this program" -> provider name. |
| 9 | FAQs | `V1FAQ` | `provider.faqs` (real data; no `buildFaqs`). |
| 10 | Recognitions | `V1Recognitions` | Render `provider.awards[]` ({name, result, year?}) as data cards instead of hardcoded badge images. |
| 11 | Help + Articles | `V1HelpSection`, `ProgramArticles` | Reuse as-is (generic, no provider coupling). |
| 12 | Mobile sticky bar | `MobileStickyBar` | **Inquire** (primary) + **Visit Website** (`provider.website`). |

### Removed (program-specific)
Apply modal / apply wizard / apply-inline (`V1ApplyModal`, `V1ApplyWizardSection`,
`V1ApplyInlineSection`), What's Included (`V1WhatsIncluded`), Program Details
(`V1ProgramDetails` — eligibility/pricing/dates), Why-Choose-Program stats block
tied to a single program (`WhyChooseProgram`), quick-details sidebar fields
(duration/terms/credits/housing/cost/deadline), per-program interviews
(`V1InterviewsSection`), and the `#apply` anchor CTA (`V1AnchorCTA`).

## Component Reuse Strategy

- Create provider-specific adapted copies typed against the new `Provider` type
  rather than forcing `Program`-typed components to accept providers.
- Reuse genuinely generic components as-is: `V1HelpSection`, `ProgramArticles`,
  `V1Stars` (`@/components/ProgramCard`), and `CommentAnchor`.
- Match existing spacing rhythm (`mt-20`, `max-w-7xl mx-auto px-4 xl:px-0`) and the
  `text-neutral-800` main wrapper from `V1DetailPage`.

## Data Model — `Provider` type (`_components/types.ts`)

```ts
export interface Provider {
  _id: string;
  _creationTime: number;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  about?: string;
  whyChoosePoints: string[];
  headquarters?: string;
  yearFounded?: number;
  website?: string;
  socialLinks: { platform: string; url: string }[];
  photos: string[];
  awards: { name: string; result: string; year?: string }[];
  faqs: { question: string; answer: string }[];
  status: "draft" | "published";
}
```

Reviews from `listReviewsByProvider` carry the shared `Review` shape plus
`programTitle: string` and `programSlug?: string`. Define a
`ProviderReview = Review & { programTitle: string; programSlug?: string }` for the
reviews section props.

## Risks / Gotchas

1. **Slug consistency (must verify first).** `V1Hero` links to
   `/providers/${slugify(program.provider)}` using `@/lib/slug`, but `seedProviders`
   stores `slug` via `generateSlug(name)` from `convex/programs`. If these two
   functions produce different slugs, the provider link 404s. Verify both produce the
   same output for representative names (e.g. "GoAbroad Education Partners",
   "WorldBridge Study Abroad"); reconcile if they differ. This is task 1.
2. **Seed data must exist.** The `providers` table is populated by the `seedProviders`
   mutation. Verify rows exist in the running Convex deployment (run the seed if not)
   before manual verification of the page.
3. **`listProgramsByProvider` is not status-filtered by index.** It filters in-handler;
   pass `status: "published"` from the orchestrator.
4. **Comment canvas / switcher.** `app/providers/layout.tsx` must wrap children in
   `<PrototypeShell>` (as `app/programs/layout.tsx` does) so the design-version
   switcher and comment anchors render.
5. **Reviews section complexity.** `V1ReviewsSection` (~14KB) + `V1InquireSection`
   (~34KB) are the heaviest adaptations. Keep behavior; only swap program→provider
   data and add the per-program source label on review cards. If a review filter
   assumes a single program, drop or generalize it rather than breaking it.
6. **No inline hex, brand tokens only** (`CLAUDE.md` / `BRANDING.md`). Adapted copies
   already comply; preserve that.

## Verification

- `npx tsc --noEmit` (or project typecheck) passes.
- `/providers/<slug>` renders for a seeded provider: hero, trust bar, about,
  why-choose, info card, programs grid, gallery (if photos), reviews with per-program
  labels, inquire form, FAQs, recognitions, help, articles.
- Loading skeleton shows while queries resolve; unknown slug shows ProviderNotFound.
- Inquire CTA (hero, sticky header, mobile bar) scrolls to / focuses the inquire form.
- The provider link in a program hero (`/programs/[id]`) navigates to the matching
  provider page (confirms slug consistency end to end).
- Mobile layout verified (stacked columns, 2x2 trust grid, mobile sticky bar).

## Implementation Order (for the plan)

1. Verify slug consistency + seed data (`lib/slug` vs `convex/programs.generateSlug`).
2. Scaffold: `layout.tsx`, `_components/types.ts`, `page.tsx` orchestrator,
   `LoadingSkeleton`, `ProviderNotFound`, `V1ProviderPage` skeleton rendering a hero.
3. Chrome: `StickyProviderHeader`, `MobileStickyBar`, `V1ProviderHero`,
   `V1ProviderTrustBar`.
4. Body left/right: `V1ProviderAbout`, `V1WhyChooseProvider`, `V1ProviderInfoCard`.
5. Content: `V1ProviderPrograms`, `V1ProviderMediaGallery`.
6. `V1ProviderReviews` (aggregate + per-program labels).
7. `V1ProviderInquire`, `V1ProviderFAQ`, `V1ProviderRecognitions`; wire Help + Articles.
8. Typecheck + manual verification pass.
```

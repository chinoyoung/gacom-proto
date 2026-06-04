# Provider Pages — Design Spec

**Date:** 2026-06-04
**Scope:** A new "Provider page" feature — a providers **index** (`/providers`) and a versioned provider **detail** page (`/providers/[slug]`), analogous to the program listing pages but focused on a study-abroad provider. Modeled on the reference page `goabroad.com/providers/cisabroad`.

## Goal

Give each provider a profile page that aggregates their identity (logo, name, HQ, year founded), their narrative ("Why choose X?"), their full catalog of programs, aggregated reviews across those programs, media, FAQ, awards, and an inquiry CTA. Plus a directory grid listing all providers.

## Decisions (locked with user)

- **Data model:** Add a real Convex `providers` table (not derived-only).
- **Scope:** Build both the provider **detail** page and the providers **index**.
- **Versioning:** Plug the detail page into the design-version system as `provider-detail`, starting at `v1`. The index is not versioned (matches `/programs` index).
- **Sections:** Include **all** reference sections (hero, trust bar, about/why-choose, programs grid, reviews, gallery, FAQ, awards, inquiry CTA).
- **Program ↔ provider link:** Use a `by_provider` index on the existing `programs.provider` string. No foreign-key backfill — a provider's programs are `programs` where `provider === provider.name`.

## Architecture

### 1. Convex backend

**`convex/schema.ts` — new `providers` table:**
```ts
providers: defineTable({
  name: v.string(),
  slug: v.string(),
  logo: v.optional(v.string()),
  coverImage: v.optional(v.string()),
  tagline: v.optional(v.string()),
  about: v.optional(v.string()),
  whyChoosePoints: v.array(v.string()),
  headquarters: v.optional(v.string()),
  yearFounded: v.optional(v.number()),
  website: v.optional(v.string()),
  socialLinks: v.array(v.object({ platform: v.string(), url: v.string() })),
  photos: v.array(v.string()),
  awards: v.array(
    v.object({ name: v.string(), result: v.string(), year: v.optional(v.string()) })
  ),
  faqs: v.array(v.object({ question: v.string(), answer: v.string() })),
  status: v.union(v.literal("draft"), v.literal("published")),
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"]),
```

**`convex/schema.ts` — programs:** add an index on the existing `provider` string:
```ts
.index("by_provider", ["provider"])
```
(No new field on `programs`; the `provider` string already exists.)

**`convex/providers.ts` (new):**
- `listProviders({ status? })` — directory listing (published by default).
- `getProviderBySlug(slug)` — single provider.
- `listProgramsByProvider(providerName, status?)` — programs via the `by_provider` index, filtered to published.
- `listReviewsByProvider(providerName)` — gather published reviews across the provider's programs (look up programs by `by_provider`, then their reviews via `by_program_status`), returning the flat review list. Aggregate rating/count is computed on the page from this.
- `seedProviders()` — one-time utility. For each distinct `provider` name among published programs, create a `providers` row (if none with that slug exists): slug = kebab(name), logo from the first program that has `providerLogo`, plus seeded placeholder `tagline`, `about`, `whyChoosePoints`, `headquarters`, `yearFounded`, `website`, `socialLinks`, `photos` (sampled from the providers' programs' photos), `awards` (reuse the recognitions sample set), `faqs`, and `status: "published"`. Returns `{ created, total }`. Idempotent (skip slugs that already exist).

### 2. Routing & versioning

- `app/providers/layout.tsx` — wraps children in `PrototypeShell` (same as `app/programs/layout.tsx`).
- `app/providers/page.tsx` — **index**. `useQuery(api.providers.listProviders, { status: "published" })`, renders a responsive grid of `ProviderCard`. Loading skeleton + empty state. Not versioned.
- `app/providers/[slug]/page.tsx` — **detail orchestrator**. Reads `slug` from params, `useDesignVersion("provider-detail")`, fetches `getProviderBySlug`, `listProgramsByProvider`, `listReviewsByProvider`; computes `avgRating`/`reviewCount`; renders loading / not-found; `switch(version)` → `V1ProviderDetailPage` (default v1).
- `lib/design-versions.ts` — add a `provider-detail` entry to `PAGE_VERSIONS` with `versions: [{ id: "v1", label: "V1", description: "Provider profile" }]`, `defaultVersion: "v1"`.
- `components/canvas/ToolbarVersionSwitcher.tsx` — extend `pageIdForPath()` so `/providers/[slug]` (a single segment after `/providers/`, not the bare index) maps to `provider-detail`.
- **Cross-link:** in the program detail v5 hero, wrap the "Provided by [provider]" name in a `next/link` to `/providers/[providerSlug]` (slug = kebab of `program.provider`, matching the seed's slug rule). Keep it subtle (hover underline).

### 3. Provider detail page — v1 sections

Self-contained section components under `app/providers/[slug]/_versions/v1/`, composed by `V1ProviderDetailPage` which receives `{ provider, programs, reviews, avgRating, reviewCount }`.

1. **Hero + breadcrumbs** — breadcrumbs (Home / Providers / [name]); provider logo, name, aggregate rating + review count, HQ + year founded, tagline; CTAs **Visit Website (solid cobalt + arrow)** / **Inquire (outline cobalt)** — matching the v5 CTA convention. Optional cover image.
2. **Trust bar** — # programs · avg rating · total reviews · # distinct countries · year founded. Reuse the v5 trust-bar visual pattern.
3. **About / "Why choose [provider]?"** — `about` paragraph + `whyChoosePoints` as a checkmark list.
4. **Programs grid** *(centerpiece)* — all `programs` rendered with the existing `components/ProgramCard`. Heading "[name] Programs" + count. Empty state if none.
5. **Reviews** — aggregated: big overall rating + total, then a few review cards across the provider's programs (reuse the v5 review-card visual; show the program name on each card since these span multiple programs). "View all" if many.
6. **Media gallery** — `provider.photos` in a gallery/lightbox (reuse the v5 gallery pattern). Hidden if no photos.
7. **FAQ** — `provider.faqs` in the eSIM two-column accordion style (same as `V5FAQ`). Hidden if empty.
8. **Awards / Recognitions** — `provider.awards` rendered as the square badge grid (same component style as `V5Recognitions`, color-coded result chips). Hidden if empty.
9. **Inquiry CTA** — "Get in touch with [provider]" section with the name/email/message form (reuse the v5 / BottomInquirySection pattern), provider-scoped copy.

### 4. Providers index (`/providers`)

`ProviderCard` (`app/providers/_components/ProviderCard.tsx`): logo, name, HQ, aggregate rating (computed or from a lightweight stat), program count, short `tagline`, and a "View Provider" link to `/providers/[slug]`. Responsive grid (1 / 2 / 3 cols), matching the `/programs` index rhythm.

> Note: the index card's rating/program-count ideally come without N+1 queries. For the prototype, `listProviders` may return providers only; the card can show `tagline` + a static "View Provider" CTA, and (optionally) the detail page computes the live aggregates. Live per-card aggregates are a nice-to-have, not required for v1.

## File structure

| File | Action | Responsibility |
| --- | --- | --- |
| `convex/schema.ts` | Modify | Add `providers` table + `by_provider` index on `programs` |
| `convex/providers.ts` | Create | Provider queries + `seedProviders` |
| `lib/design-versions.ts` | Modify | Register `provider-detail` v1 |
| `components/canvas/ToolbarVersionSwitcher.tsx` | Modify | Map `/providers/[slug]` → `provider-detail` |
| `app/providers/layout.tsx` | Create | PrototypeShell wrapper |
| `app/providers/page.tsx` | Create | Providers index grid |
| `app/providers/_components/ProviderCard.tsx` | Create | Index card |
| `app/providers/[slug]/page.tsx` | Create | Detail orchestrator + data fetch |
| `app/providers/[slug]/_components/types.ts` | Create | `Provider` TS type |
| `app/providers/[slug]/_components/LoadingSkeleton.tsx` | Create | Loading state |
| `app/providers/[slug]/_components/ProviderNotFound.tsx` | Create | 404 state |
| `app/providers/[slug]/_versions/v1/V1ProviderDetailPage.tsx` | Create | Page composition |
| `app/providers/[slug]/_versions/v1/*` | Create | Section components (hero, trust bar, about, programs, reviews, gallery, faq, awards, inquiry) |
| `app/programs/[id]/_versions/v5/V5Hero.tsx` | Modify | Link "Provided by [provider]" → provider page |

## Out of scope (v1)

- Admin UI to create/edit providers (seed mutation only for now).
- Real foreign-key relation / migration of `programs` to `providerId`.
- Live per-card aggregate stats on the index if they require N+1 queries (acceptable to defer).
- Additional design variants beyond v1.

## Testing / verification

- No unit-test harness in this repo → verify via `npx tsc --noEmit`, `npm run lint`, and visual checks in the browser (Chrome DevTools MCP): index grid renders; a seeded provider's detail page renders all 9 sections; "Provided by" link from a program navigates to the provider; version switcher shows on `/providers/[slug]`; mobile layout holds.
- Git: the implementing agent must not run git commands (user rule); commits are the user's manual step.

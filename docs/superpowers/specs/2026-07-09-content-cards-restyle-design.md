# Content Cards Restyle (ArticleCard + ProgramCard) — Design

**Date:** 2026-07-09
**Status:** Approved (pending spec review)

## Summary

Restyle the shared `components/ArticleCard.tsx` and `components/ProgramCard.tsx` to adopt
the markup/design from the gacom-next reference
(`/Users/chinoyoung/Code/gacom-next/app/brand/_components/content-cards/`), adapted to
gacom-proto's stack. The existing prop APIs are preserved so every caller keeps working;
only the internal JSX/styling changes. The program detail page's Related Articles and
Related Programs sections inherit the new look automatically (they render these cards).

## Background / Current State

- **Shared cards** (each takes a full domain object):
  - `components/ArticleCard.tsx` — `{ article: { _id, title, author, publishDate, tags[], coverImage?, slug } }`.
  - `components/ProgramCard.tsx` — `{ program: { _id, title, provider, providerLogo?, rating?, reviewCount?, verified?, coverImage?, slug? } }`.
- **Callers (must keep compiling):**
  - `ArticleCard`: `app/programs/[id]/_components/ProgramArticles.tsx` (Related Articles), `app/brand/_components/BrandComponents.tsx`.
  - `ProgramCard`: `app/programs/[id]/_components/RelatedPrograms.tsx` (Related Programs), `app/programs/page.tsx` (directory), `app/providers/[slug]/_versions/v1/V1ProviderPrograms.tsx`, `app/brand/_components/BrandComponents.tsx`.
- **Reference** (`gacom-next` `content-cards/`): `ArticleCard.tsx`, `ProgramCard.tsx`, `SaveButton.tsx`. Uses `next/image`, `react-icons/lu`, brand tokens (cobalt/sun/fern), and gacom-next-only theme utilities (`z-ground`, `z-sky`, `h-50`, `min-h-79`).

## Decisions (from brainstorming)

- **Restyle the shared cards** (updates the look everywhere they render), not scoped copies.
- **Related Programs already exists** on the program detail page → it just inherits the new `ProgramCard`. Nothing new is added.

## Goals

1. `ArticleCard` and `ProgramCard` visually match the gacom-next reference design.
2. All 6 existing call sites keep working with no prop changes.
3. No new npm dependency; adhere to gacom-proto conventions (lucide-react, brand tokens, no inline hex, `cursor-pointer` on clickables).

## Non-Goals (YAGNI)

- No prop-API changes; no caller edits (beyond nothing).
- No new dependency (`react-icons` stays absent).
- No new SaveButton component — the heart stays inline in each card (as today).
- No changes to the Convex data or the section wrappers (`ProgramArticles`, `RelatedPrograms`).

## Adaptations (reference → gacom-proto)

- **Icons:** `react-icons/lu` → `lucide-react`: `LuGlobe→Globe`, `LuStar→Star`, `LuCircleCheck→CircleCheck`, `LuExternalLink→ExternalLink`, `LuHeart→Heart`.
- **Theme-only utilities:** replace `z-ground`/`z-sky` → `z-10`; `h-50`/`min-h-79`/`min-w-75` → standard Tailwind (`aspect-[2/1]` for the image, natural heights otherwise).
- **Images:** keep gacom-proto's current handling — `ArticleCard` uses `<img>` with the existing coverImage/no-preview fallback; `ProgramCard` keeps `next/image` (`fill` + `sizes`). Restyle containers only; do not introduce new remote-image domains.
- **Save button:** inline `<button>` with a lucide `Heart`, styled per the reference (overlay top-right). No separate component.

## Design

### `components/ArticleCard.tsx` (rewrite internals; keep `{ article }` prop)

Match the reference `ArticleCard`:
- Outer: `rounded-lg border border-slate-200 bg-white`, flex column, `overflow-hidden`.
- Image block (`aspect-[2/1]`): `article.coverImage` via `<img object-cover>`, else the existing no-preview placeholder. Badge (`article.tags[0]`) top-left as a small `bg-cobalt-500` pill (keep when tags exist). Save heart button top-right (`z-10`).
- Body (`p-4`, grow): title as `<Link href={/articles/${article.slug}}>` — `line-clamp-2 text-lg font-bold text-slate-800 hover:text-cobalt-600` with the subtle hover-lift; footer meta row (`mt-auto`, `text-xs text-slate-500`): `article.author` (left) and the formatted `publishDate` (right). Keep the existing `formatDate` helper and its hydration-safe `useEffect` pattern.

### `components/ProgramCard.tsx` (rewrite internals; keep `{ program }` prop)

Match the reference `ProgramCard`:
- Outer: `rounded-md border border-slate-200 bg-white shadow-md`, flex column, `overflow-hidden`, `h-full`.
- Image block (`aspect-[2/1]`): `program.coverImage` via `next/image` (`fill`, existing `sizes`) with hover-zoom (`hover:scale-110` on the image, `overflow-hidden` container), else the existing no-photo placeholder. Save heart top-right (`z-10`).
- Body: provider row — logo tile (`program.providerLogo` `<img>` if present, else a `Globe` icon in the tile); provider `name`; rating line: `rating.toFixed(1)` + `Star` (sun-500), `reviewCount` "reviews", and `verified` → `CircleCheck` (fern-500). Title as `<Link>` to the program (`text-cobalt-500 hover:text-cobalt-600 line-clamp-2 text-lg font-bold`). CTA: full-width `bg-cobalt-500 hover:bg-cobalt-600` button linking to `/programs/${program.slug ?? program._id}`, label "View Program" + `ExternalLink` icon.
- Guard optional fields exactly as today (`rating != null`, `reviewCount != null`, `verified`, `providerLogo`).

## Testing / Verification

- `npx tsc --noEmit` clean (proves all 6 callers still satisfy the unchanged prop APIs).
- Visual/manual drive: program detail page (Related Articles + Related Programs), Programs directory (`/programs`), and Brand page (`/brand`) — confirm cards render with the new design and no broken images/links.

## Files

- `components/ArticleCard.tsx` — internal rewrite.
- `components/ProgramCard.tsx` — internal rewrite.
- (No caller changes; no new files.)

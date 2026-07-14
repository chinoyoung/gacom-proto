# Provider Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a provider profile page at `/providers/[slug]` that mirrors the program detail page's design (`app/programs/[id]/_versions/v1/`) but is focused on the provider — dropping all program-specific content.

**Architecture:** Client-rendered Next.js App Router page slotting into the existing design-versioning system (`pageId: "provider-detail"`, single `v1`). An orchestrator `page.tsx` runs three Convex queries and delegates to a `V1ProviderPage` composition built from provider-specific section components adapted from the program `V1*` components. Generic components (`ProgramCard`, `V1HelpSection`, `ProgramArticles`, `V1FAQ`) are reused as-is.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind CSS v4, Convex, lucide-react.

## Rebuild Context (READ FIRST)

A prior session already built a simpler provider detail page. This is a **from-scratch rebuild** of the detail page to the richer, program-faithful design below. It is NOT greenfield — reconcile against the existing tree:

- **PRESERVE (do not touch — out of scope, still working):**
  - `app/providers/layout.tsx` (already `<PrototypeShell>` wrapper — identical to what this plan would create)
  - `app/providers/page.tsx` (providers **index** page)
  - `app/providers/_components/ProviderCard.tsx`
  - `app/providers/[slug]/_components/types.ts` — **authoritative shared types.** The index page and `ProviderCard` import `Provider` from here. Keep `Provider` field-compatible. `ProviderReview` and `ProviderProgram` also live here. Extend **additively** only (never remove/rename existing fields); do NOT import the programs `Review` type into it (keep it self-contained).
- **DELETE (old divergent-name files, replaced by this plan's names — remove in Task 1):**
  - `app/providers/[slug]/_versions/v1/V1ProviderDetailPage.tsx` → replaced by `V1ProviderPage.tsx`
  - `app/providers/[slug]/_versions/v1/V1ProviderGallery.tsx` → replaced by `V1ProviderMediaGallery.tsx`
  - `app/providers/[slug]/_versions/v1/V1ProviderInquiry.tsx` → replaced by `V1ProviderInquire.tsx`
  - `app/providers/[slug]/_versions/v1/V1ProviderAwards.tsx` → replaced by `V1ProviderRecognitions.tsx`
- **OVERWRITE (exist already; this plan replaces their contents wholesale):** `[slug]/page.tsx`, `[slug]/_components/LoadingSkeleton.tsx`, `[slug]/_components/ProviderNotFound.tsx`, and v1 `V1ProviderHero.tsx`, `V1ProviderTrustBar.tsx`, `V1ProviderAbout.tsx`, `V1ProviderPrograms.tsx`, `V1ProviderReviews.tsx`, `V1ProviderFAQ.tsx`.
- **CREATE (new):** `StickyProviderHeader.tsx`, `MobileStickyBar.tsx` (in `[slug]/_components/`), and v1 `V1ProviderPage.tsx`, `V1WhyChooseProvider.tsx`, `V1ProviderInfoCard.tsx`, `V1ProviderMediaGallery.tsx`, `V1ProviderInquire.tsx`, `V1ProviderRecognitions.tsx`.

Wherever a task step below says "Create" for an OVERWRITE file, it means **overwrite the existing file** with the new contents. Do NOT create `types.ts` — reuse the existing one.

## Global Constraints

- Brand colors only via tokens (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`, `slate-*`, `neutral-*`); **no inline hex** in className strings (`CLAUDE.md`, `BRANDING.md`).
- Standard Tailwind classes; avoid custom values unless necessary. No overuse of gradients/shadows/rounding; no oversized buttons.
- Mobile-first — every section must be verified on a narrow viewport.
- **No schema or Convex query changes** — backend (`convex/schema.ts`, `convex/providers.ts`) is complete.
- **Git is the user's responsibility.** Do NOT run any state-changing git command (no commit/branch/etc.). Each task ends with a verification gate, not a commit. The user will commit.
- Match the program page's spacing rhythm: `max-w-7xl mx-auto px-4 xl:px-0`, section gaps `mt-20`, main wrapper `text-neutral-800`.
- All new page-level components are Client Components (`"use client"`), consistent with the program page.
- The Inquire scroll target is `id="inquire"` everywhere (hero, sticky header, mobile bar, info-card all scroll to `#inquire`). Use this id consistently.
- New/rewritten files must not introduce ESLint errors: use `next/link` for internal route links (never a raw `<a href="/...">`), and never `any` (use the real types from `types.ts`). Verify with `npx tsc --noEmit`; run `npx eslint <changed files>` when in doubt.
- `Provider`, `ProviderReview`, `ProviderProgram` types come from the existing `app/providers/[slug]/_components/types.ts` (see Rebuild Context) — import from there; do not redefine.
- Reference spec: `docs/superpowers/specs/2026-07-14-provider-detail-page-design.md`.

---

## Provider type reference (used by every task)

The types already exist in `app/providers/[slug]/_components/types.ts` (authoritative — see Rebuild Context). Import from there; do not redefine. Current shape:

```ts
export interface Provider {
  _id: string; _creationTime: number;
  name: string; slug: string;
  logo?: string; coverImage?: string; tagline?: string; about?: string;
  whyChoosePoints: string[];
  headquarters?: string; yearFounded?: number; website?: string;
  socialLinks: { platform: string; url: string }[];
  photos: string[];
  awards: { name: string; result: string; year?: string }[];
  faqs: { question: string; answer: string }[];
  status: "draft" | "published";
}

// A published review annotated with its source program (self-contained; do NOT
// import the programs Review type). Extend ADDITIVELY if the reviews section
// needs more fields (e.g. date?, category ratings) — the query spreads full docs.
export interface ProviderReview {
  _id: string; _creationTime: number;
  reviewerName?: string; reviewerCountry?: string; reviewTitle?: string;
  body?: string; overallRating?: number;
  programTitle?: string; programSlug?: string;
}

// Minimal program shape for the programs grid (compatible with ProgramCard).
export interface ProviderProgram {
  _id: string; title: string; provider: string; city: string; country: string;
  terms: string[]; coverImage?: string; cost?: string; subjectAreas: string[]; slug?: string;
}
```

The Convex queries (already built, in `convex/providers.ts`):
- `api.providers.getProviderBySlug({ slug })` → provider doc | null
- `api.providers.listProgramsByProvider({ providerName, status: "published" })` → program docs
- `api.providers.listReviewsByProvider({ providerName })` → reviews annotated with `programTitle` + `programSlug`

---

## Task 1: Cleanup old detail-page files + confirm baseline

Remove the four old divergent-name components so the rebuild's new names are the only implementation, and confirm the page will resolve.

**Files:**
- Delete: `app/providers/[slug]/_versions/v1/V1ProviderDetailPage.tsx`
- Delete: `app/providers/[slug]/_versions/v1/V1ProviderGallery.tsx`
- Delete: `app/providers/[slug]/_versions/v1/V1ProviderInquiry.tsx`
- Delete: `app/providers/[slug]/_versions/v1/V1ProviderAwards.tsx`

**Interfaces:**
- Produces: a clean v1 directory ready for the rebuild; a confirmed test slug for later verification.

- [ ] **Step 1: Delete the four old files**

Use `rm` (not git). Do NOT delete anything else — `types.ts`, `LoadingSkeleton.tsx`, `ProviderNotFound.tsx`, `V1ProviderHero/TrustBar/About/Programs/Reviews/FAQ.tsx` are overwritten in later tasks, and `layout.tsx` / the index `page.tsx` / `ProviderCard.tsx` are preserved.

```bash
rm "app/providers/[slug]/_versions/v1/V1ProviderDetailPage.tsx" \
   "app/providers/[slug]/_versions/v1/V1ProviderGallery.tsx" \
   "app/providers/[slug]/_versions/v1/V1ProviderInquiry.tsx" \
   "app/providers/[slug]/_versions/v1/V1ProviderAwards.tsx"
```

Note: the orchestrator `[slug]/page.tsx` still imports `V1ProviderDetailPage` at this point — the app will not compile until Task 2 overwrites `page.tsx`. That is expected; Task 2 immediately follows.

- [ ] **Step 2: Confirm slug + seed baseline**

`lib/slug.ts` (`slugify`) and `convex/programs.ts` (`generateSlug`) are byte-identical transforms — already confirmed, no action needed unless a later edit diverges them. Confirm `providers` rows exist in the running Convex deployment (Convex dashboard `providers` table, or `npx convex run providers:seedProviders` if empty). Record one real slug (e.g. `worldbridge-study-abroad`, `expanish`, `goabroad-education-partners`) as the manual-test slug for later tasks.

- [ ] **Step 3: Verification gate**

State the four files are deleted and the confirmed test slug. Typecheck is expected to FAIL here (dangling `V1ProviderDetailPage` import) — that is fixed in Task 2; do not attempt to fix it in this task.

---

## Task 2: Scaffold route, layout, types, orchestrator, loading/404

**Files:**
- Preserve (verify only): `app/providers/layout.tsx`, `app/providers/[slug]/_components/types.ts`
- Overwrite: `app/providers/[slug]/_components/LoadingSkeleton.tsx`
- Overwrite: `app/providers/[slug]/_components/ProviderNotFound.tsx`
- Create: `app/providers/[slug]/_versions/v1/V1ProviderPage.tsx` (minimal — placeholder, expanded in later tasks)
- Overwrite: `app/providers/[slug]/page.tsx`

**Interfaces:**
- Produces:
  - `Provider`, `ProviderReview` types (from types.ts above).
  - `V1ProviderPage` props: `{ provider: Provider; programs: any[] | undefined; reviews: ProviderReview[] | undefined; avgRating: number }`.
- Consumes: Convex queries listed in the type reference; `PrototypeShell` from `@/components/canvas/PrototypeShell`.

- [ ] **Step 1: Verify `app/providers/layout.tsx` (preserve)**

It already wraps children in `<PrototypeShell>` (mirrors `app/programs/layout.tsx`). Confirm it is unchanged — do not rewrite it.

- [ ] **Step 2: Verify `app/providers/[slug]/_components/types.ts` (preserve)**

It already defines `Provider`, `ProviderReview`, `ProviderProgram` (see Provider type reference). Do NOT recreate it. It is imported by the preserved index page and `ProviderCard`, so keep `Provider` compatible. Only extend `ProviderReview` additively (in Task 6) if the reviews section needs more fields.

- [ ] **Step 3: Create `LoadingSkeleton.tsx`**

Adapt from `app/programs/[id]/_components/LoadingSkeleton.tsx`. Do NOT import `ProgramHeroSkeleton`; inline a self-contained skeleton (a slate hero band + two-column body) so there is no cross-coupling to program components:

```tsx
"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-6 pb-8">
          <div className="h-4 bg-slate-200 rounded w-56 mb-6" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-9 bg-slate-200 rounded w-2/3" />
              <div className="h-16 w-16 bg-slate-200 rounded-md" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-10 bg-slate-200 rounded w-40" />
            </div>
            <div className="w-full lg:w-[560px] h-[300px] bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 xl:px-0 mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-7 bg-slate-200 rounded w-48" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-[92%]" />
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[380px] h-96 bg-slate-50 border border-slate-100 rounded-lg" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Overwrite `ProviderNotFound.tsx`**

Provider copy, `next/link` to the **`/providers` index** (which exists — `app/providers/page.tsx`). Do NOT link to `/programs` and do NOT use a raw `<a>`:

```tsx
"use client";

import Link from "next/link";

export default function ProviderNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Provider Not Found</h1>
      <p className="text-slate-600 mb-6">
        The provider you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/providers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500">
        Browse all providers
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Create minimal `V1ProviderPage.tsx`**

Placeholder body — just prove data arrives. Later tasks replace the inner sections.

```tsx
"use client";

import type { Provider, ProviderReview } from "../../_components/types";

interface V1ProviderPageProps {
  provider: Provider;
  programs: any[] | undefined;
  reviews: ProviderReview[] | undefined;
  avgRating: number;
}

export default function V1ProviderPage({
  provider,
  programs,
  reviews,
  avgRating,
}: V1ProviderPageProps) {
  return (
    <main className="pb-20 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-16">
        <h1 className="text-3xl font-bold text-slate-900">{provider.name}</h1>
        <p className="mt-2 text-slate-600">{provider.tagline}</p>
        <p className="mt-4 text-sm text-slate-500">
          {programs?.length ?? 0} programs · {reviews?.length ?? 0} reviews · avg {avgRating}
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Create the orchestrator `page.tsx`**

```tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDesignVersion } from "@/lib/use-design-version";

import type { Provider, ProviderProgram, ProviderReview } from "./_components/types";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import ProviderNotFound from "./_components/ProviderNotFound";
import V1ProviderPage from "./_versions/v1/V1ProviderPage";

export default function ProviderDetailPage() {
  const { version } = useDesignVersion("provider-detail");
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const provider = useQuery(
    api.providers.getProviderBySlug,
    slug ? { slug } : "skip"
  ) as Provider | null | undefined;

  const programs = useQuery(
    api.providers.listProgramsByProvider,
    provider ? { providerName: provider.name, status: "published" } : "skip"
  ) as ProviderProgram[] | undefined;

  const reviews = useQuery(
    api.providers.listReviewsByProvider,
    provider ? { providerName: provider.name } : "skip"
  ) as ProviderReview[] | undefined;

  const avgRating =
    reviews && reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + (r.overallRating ?? 0), 0) /
            reviews.length) *
            100
        ) / 100
      : 0;

  if (provider === undefined) return <LoadingSkeleton />;
  if (provider === null) return <ProviderNotFound />;

  switch (version) {
    default:
      return (
        <V1ProviderPage
          provider={provider}
          programs={programs}
          reviews={reviews}
          avgRating={avgRating}
        />
      );
  }
}
```

- [ ] **Step 7: Verification gate**

Run: `npx tsc --noEmit`
Expected: no new type errors.
Then run the app (`npm run dev` + `npx convex dev` if not running) and open `/providers/<test-slug>` from Task 1. Expected: provider name, tagline, and the "N programs · M reviews" line render. An unknown slug shows "Provider Not Found". While loading, the skeleton shows.

---

## Task 3: Chrome — sticky header, mobile bar, hero, trust bar

**Files:**
- Create: `app/providers/[slug]/_components/StickyProviderHeader.tsx` (adapt `_components/StickyProgramHeader.tsx`)
- Create: `app/providers/[slug]/_components/MobileStickyBar.tsx` (adapt `_components/MobileStickyBar.tsx`)
- Create: `app/providers/[slug]/_versions/v1/V1ProviderHero.tsx` (adapt `_versions/v1/V1Hero.tsx`)
- Create: `app/providers/[slug]/_versions/v1/V1ProviderTrustBar.tsx` (adapt `_versions/v1/V1TrustBar.tsx`)
- Modify: `app/providers/[slug]/_versions/v1/V1ProviderPage.tsx`

**Interfaces:**
- Produces:
  - `StickyProviderHeader` props: `{ provider: Provider; visible: boolean; avgRating?: number; reviewCount?: number; onInquire: () => void }` (no save toggle in sticky).
  - `MobileStickyBar` props: `{ provider: Provider; onInquire: () => void }`.
  - `V1ProviderHero` props: `{ provider: Provider; avgRating: number; reviewCount: number; saved: boolean; onToggleSave: () => void; onInquire: () => void; programCount: number }`.
  - `V1ProviderTrustBar` props: `{ provider: Provider; avgRating: number; reviewCount: number; programCount: number }`.
- Consumes: `Provider` type; `scrollToInquire` helper = `onInquire` scrolls to `#inquire`.

- [ ] **Step 1: `StickyProviderHeader.tsx`**

Copy `StickyProgramHeader.tsx`. Changes:
- Import `Provider` from `../_components/types`.
- Replace `program.providerLogo`→`provider.logo`, `program.provider`→`provider.name`, title text `program.title`→`provider.name`.
- Keep the star-rating block (uses `avgRating`/`reviewCount`).
- Primary CTA button "Inquire Here" → `onClick={onInquire}`.
- Secondary "Visit Website": render `<a>` only when `provider.website` is set (href=`provider.website`, `target="_blank" rel="noopener noreferrer"`), otherwise omit it. Remove the save/heart button and `saved`/`onToggleSave` props from the sticky (keep the sticky minimal). Remove the `applyUrl` fallback button branch.

- [ ] **Step 2: `MobileStickyBar.tsx`**

Copy `_components/MobileStickyBar.tsx`. Changes:
- Import `Provider`. Props `{ provider, onInquire }`.
- "Inquire Here" button keeps `onClick={onInquire}`.
- Second button: "Visit Website" — render the `<a href={provider.website}>` branch only when `provider.website` exists; if absent, make the Inquire button full-width (`flex-1` alone). Remove all `program.applyUrl` references.

- [ ] **Step 3: `V1ProviderHero.tsx`**

Copy `_versions/v1/V1Hero.tsx`. Changes:
- Import `Provider` from `../../_components/types`. Remove `slugify` import (not needed — this IS the provider page).
- Media logic: use `provider.photos` and `provider.coverImage` exactly as the original uses `program.photos`/`program.coverImage`. `alt` text → `provider.name`.
- Breadcrumb: replace the trail with **Home / Providers / {provider.name}**. Mobile back link → `/providers` labelled "Back" (the `/providers` index exists). Desktop `<ol>`:
  - `Home` → `/`
  - `Providers` → `/providers`
  - current: `provider.name` (`aria-current="page"`).
  Remove the city crumb.
- Title `<h1>` → `provider.name`.
- Logo block: `provider.logo` (guard on it), alt `${provider.name} logo`.
- Replace the "Provided by …" sub-line with the tagline: render `provider.tagline` in a `<p className="text-[15px] text-slate-600 mt-1 max-w-2xl">` (only if present).
- Rating row: keep the `avgRating`/`reviewCount` stars block. Replace the `MapPin` city line with `provider.headquarters` (icon `Building2` from lucide-react) rendered only if present; append a `programCount` pill e.g. "{programCount} programs".
- CTAs: **Inquire Here** (primary, filled cobalt) → `onClick={onInquire}`. **Visit Website** → `<a href={provider.website}>` (only if `provider.website`), style as the white/outline secondary. Keep the save heart button (local state) as-is. Swap the filled/outline styling so **Inquire** is the filled `bg-cobalt-500 text-white` primary and Visit Website is the outline `border-cobalt-500 text-cobalt-500`.
- The hero photo click still scrolls to `#gallery`.

- [ ] **Step 4: `V1ProviderTrustBar.tsx`**

Copy `_versions/v1/V1TrustBar.tsx`. Changes:
- Import `Provider`. Props `{ provider, avgRating, reviewCount, programCount }`.
- Remove the "Program Costs" stat entirely (no pricing on a provider).
- `establishedYear` uses `provider.yearFounded` (fallback `currentYear - 12` as in original).
- Stats to show: `Verified` / "Provider" (BadgeCheck, fern); `ratingValue` / "Student rating" (Star, sun); `reviewCount` / "Reviews" (MessageSquare, fern); `programCount` / "Programs" (FileText, cobalt); `establishedYear` / "Year established" (Building2, cobalt); and `provider.headquarters ?? "—"` / "Headquarters" (MapPin, cobalt). Keep the desktop row + mobile 2×2 grid layout.

- [ ] **Step 5: Wire chrome into `V1ProviderPage.tsx`**

Rewrite `V1ProviderPage` to add state + IntersectionObserver (mirroring `V1DetailPage`), the sticky header, hero (in an observed `ref` div), the trust-bar seam band, and the mobile bar. `onInquire` scrolls to `#inquire`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import type { Provider, ProviderProgram, ProviderReview } from "../../_components/types";
import StickyProviderHeader from "../../_components/StickyProviderHeader";
import MobileStickyBar from "../../_components/MobileStickyBar";
import V1ProviderHero from "./V1ProviderHero";
import V1ProviderTrustBar from "./V1ProviderTrustBar";

interface V1ProviderPageProps {
  provider: Provider;
  programs: ProviderProgram[] | undefined;
  reviews: ProviderReview[] | undefined;
  avgRating: number;
}

export default function V1ProviderPage({ provider, programs, reviews, avgRating }: V1ProviderPageProps) {
  const reviewCount = reviews?.length ?? 0;
  const programCount = programs?.length ?? 0;

  const [saved, setSaved] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const scrollToInquire = () =>
    document.getElementById("inquire")?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [provider]);

  return (
    <>
      <StickyProviderHeader
        provider={provider}
        visible={stickyVisible}
        avgRating={avgRating}
        reviewCount={reviewCount}
        onInquire={scrollToInquire}
      />

      <main className="pb-20 text-neutral-800">
        <div ref={heroRef}>
          <V1ProviderHero
            provider={provider}
            avgRating={avgRating}
            reviewCount={reviewCount}
            saved={saved}
            onToggleSave={() => setSaved((v) => !v)}
            onInquire={scrollToInquire}
            programCount={programCount}
          />
        </div>

        <div className="bg-gradient-to-b from-slate-100 from-50% to-white to-50%">
          <div className="w-full mx-auto max-w-7xl px-4 xl:px-0 py-5">
            <V1ProviderTrustBar
              provider={provider}
              avgRating={avgRating}
              reviewCount={reviewCount}
              programCount={programCount}
            />
          </div>
        </div>

        {/* Body sections added in Tasks 4–7 */}
      </main>

      <MobileStickyBar provider={provider} onInquire={scrollToInquire} />
    </>
  );
}
```

- [ ] **Step 6: Verification gate**

Run `npx tsc --noEmit` (no new errors). In-app: `/providers/<test-slug>` shows the hero (cover image, logo, name, tagline, rating, HQ, program count), the trust bar straddling the seam, a working sticky header on scroll (desktop), and the mobile Inquire bar (narrow viewport). Inquire buttons scroll toward the bottom (the `#inquire` target lands in Task 7; before then they scroll to page end harmlessly).

---

## Task 4: Body left column (About, Why-choose) + right sidebar info card

**Files:**
- Create: `app/providers/[slug]/_versions/v1/V1ProviderAbout.tsx` (adapt `_versions/v1/V1Overview.tsx`)
- Create: `app/providers/[slug]/_versions/v1/V1WhyChooseProvider.tsx`
- Create: `app/providers/[slug]/_versions/v1/V1ProviderInfoCard.tsx` (replaces `V1Sidebar.tsx`)
- Modify: `app/providers/[slug]/_versions/v1/V1ProviderPage.tsx`

**Interfaces:**
- Produces:
  - `V1ProviderAbout` props: `{ provider: Provider }`.
  - `V1WhyChooseProvider` props: `{ provider: Provider }`.
  - `V1ProviderInfoCard` props: `{ provider: Provider; programCount: number; onInquire: () => void }`.

- [ ] **Step 1: `V1ProviderAbout.tsx`**

Adapt `V1Overview.tsx`. Same Read-More paragraph behavior, but source `provider.about` (split on `\n\n+`); heading `About {provider.name}`. If `provider.about` is empty, render nothing (`return null`).

```tsx
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Provider } from "../../_components/types";

const PREVIEW_PARAGRAPHS = 2;

export default function V1ProviderAbout({ provider }: { provider: Provider }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = provider.about ? provider.about.split(/\n\n+/).filter(Boolean) : [];
  if (paragraphs.length === 0) return null;

  const isLong = paragraphs.length > PREVIEW_PARAGRAPHS;
  const visible = !isLong || expanded ? paragraphs : paragraphs.slice(0, PREVIEW_PARAGRAPHS);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">About {provider.name}</h2>
      <div className="mt-4 flex flex-col gap-2">
        {visible.map((para, i) => (
          <p key={i} className="text-[15px] text-slate-700 leading-relaxed">{para}</p>
        ))}
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex mt-2 font-bold items-center gap-1 text-sm text-cobalt-500 cursor-pointer hover:text-cobalt-600 transition-colors self-start"
          >
            {expanded ? "Read Less" : "Read More"}
            <ChevronRight className={`${expanded ? "-rotate-90" : "rotate-90"} transform w-3.5 h-3.5 transition-transform`} />
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `V1WhyChooseProvider.tsx`**

New component rendering `provider.whyChoosePoints[]` as a check-marked list. Follow brand tokens; use `CheckCircle2` from lucide-react in `text-fern-500`.

```tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1WhyChooseProvider({ provider }: { provider: Provider }) {
  const points = provider.whyChoosePoints ?? [];
  if (points.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Why choose {provider.name}</h2>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-fern-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[15px] text-slate-700 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: `V1ProviderInfoCard.tsx`**

New sidebar card replacing the program quick-details. Rows: Headquarters (MapPin), Founded (CalendarCheck, from `yearFounded`), Website (Globe → external link), Programs (FileText, `programCount`), plus a social-links row and an Inquire button. Match `V1Sidebar` card styling (`bg-white border border-slate-200 rounded-lg p-5`).

```tsx
"use client";

import { MapPin, CalendarCheck, Globe, FileText } from "lucide-react";
import type { Provider } from "../../_components/types";

function Row({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm text-slate-900">{children}</span>
      </div>
    </div>
  );
}

export default function V1ProviderInfoCard({
  provider,
  programCount,
  onInquire,
}: {
  provider: Provider;
  programCount: number;
  onInquire: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900">About the provider</h3>

      {provider.headquarters && (
        <Row icon={MapPin} label="Headquarters">{provider.headquarters}</Row>
      )}
      {provider.yearFounded && (
        <Row icon={CalendarCheck} label="Founded">{provider.yearFounded}</Row>
      )}
      <Row icon={FileText} label="Programs">
        {programCount} {programCount === 1 ? "program" : "programs"}
      </Row>
      {provider.website && (
        <Row icon={Globe} label="Website">
          <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-cobalt-500 hover:underline break-all">
            Visit website
          </a>
        </Row>
      )}

      {provider.socialLinks?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {provider.socialLinks.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors rounded-md px-2.5 py-1"
            >
              {s.platform}
            </a>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onInquire}
        className="block text-center text-sm font-semibold bg-cobalt-500 text-white rounded-md py-2.5 hover:bg-cobalt-600 transition-colors mt-1 cursor-pointer"
      >
        Inquire with {provider.name.length > 22 ? "provider" : provider.name}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Add the two-column block to `V1ProviderPage.tsx`**

Below the trust-bar band, insert the two-column layout (mirrors `V1DetailPage` lines ~111–124). Import the three new components. Left column stacks `V1ProviderAbout` + `V1WhyChooseProvider` (`space-y-12`); right sidebar is `V1ProviderInfoCard` (`lg:sticky lg:top-20`):

```tsx
{/* Two-column: about + info card */}
<div className="w-full max-w-7xl mx-auto mt-8 px-4 xl:px-0 flex flex-col lg:flex-row gap-8 items-start">
  <div className="flex-1 min-w-0 space-y-12">
    <V1ProviderAbout provider={provider} />
    <V1WhyChooseProvider provider={provider} />
  </div>
  <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-20 lg:self-start">
    <V1ProviderInfoCard provider={provider} programCount={programCount} onInquire={scrollToInquire} />
  </div>
</div>
```

- [ ] **Step 5: Verification gate**

`npx tsc --noEmit` clean. In-app: About (with Read More when long), Why-choose checklist (2-col on desktop), and the sticky info card render. Info card Inquire button scrolls toward `#inquire`. Verify mobile stacking.

---

## Task 5: Programs grid + media gallery

**Files:**
- Create: `app/providers/[slug]/_versions/v1/V1ProviderPrograms.tsx` (adapt `_components/RelatedPrograms.tsx`)
- Create: `app/providers/[slug]/_versions/v1/V1ProviderMediaGallery.tsx` (adapt `_versions/v1/V1MediaGallery.tsx`)
- Modify: `app/providers/[slug]/_versions/v1/V1ProviderPage.tsx`

**Interfaces:**
- Produces:
  - `V1ProviderPrograms` props: `{ provider: Provider; programs: any[] | undefined }`.
  - `V1ProviderMediaGallery` props: `{ provider: Provider }`.

- [ ] **Step 1: `V1ProviderPrograms.tsx`**

Adapt `RelatedPrograms.tsx`, but do NOT re-query — use the `programs` prop already fetched by the orchestrator. Reuse `@/components/ProgramCard` and `CommentAnchor`. Show a loading grid when `programs === undefined`, an empty state when zero.

```tsx
"use client";

import ProgramCard from "@/components/ProgramCard";
import { CommentAnchor } from "@/components/comments/CommentAnchor";
import type { Provider, ProviderProgram } from "../../_components/types";

export default function V1ProviderPrograms({
  provider,
  programs,
}: {
  provider: Provider;
  programs: ProviderProgram[] | undefined;
}) {
  return (
    <CommentAnchor id="provider-programs">
      <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Programs by {provider.name}</h2>

        {programs === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-lg h-80" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <p className="text-slate-500 text-sm">This provider has no published programs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        )}
      </section>
    </CommentAnchor>
  );
}
```

- [ ] **Step 2: `V1ProviderMediaGallery.tsx`**

Copy `_versions/v1/V1MediaGallery.tsx`. Changes: import `Provider`; source images from `provider.photos` (and `provider.coverImage` where the original used `program.coverImage`); `alt` → `provider.name`; keep the `id="gallery"` anchor and all layout/lightbox behavior. If `provider.photos.length === 0`, `return null`. Read the source file for its full lightbox/state logic and preserve it — only swap the data source and alt text.

- [ ] **Step 3: Wire into `V1ProviderPage.tsx`**

After the two-column block, add:

```tsx
<V1ProviderPrograms provider={provider} programs={programs} />

{provider.photos.length > 0 && (
  <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
    <V1ProviderMediaGallery provider={provider} />
  </section>
)}
```

Import both at the top.

- [ ] **Step 4: Verification gate**

`npx tsc --noEmit` clean. In-app: "Programs by {name}" grid shows the provider's `ProgramCard`s (each links to its program); empty state shows when none. Gallery renders `provider.photos` and the hero photo CTA scrolls to it. Mobile: single-column grid, gallery scrolls/stacks correctly.

---

## Task 6: Aggregate reviews section

**Files:**
- Create: `app/providers/[slug]/_versions/v1/V1ProviderReviews.tsx` (adapt `_versions/v1/V1ReviewsSection.tsx` + its children)
- Modify: `app/providers/[slug]/_versions/v1/V1ProviderPage.tsx`

**Interfaces:**
- Produces: `V1ProviderReviews` props: `{ provider: Provider; reviews: ProviderReview[] | undefined; avgRating: number }`.
- Consumes: existing program review components (in `app/programs/[id]/_versions/v1/`): `V1ReviewSummary`, `V1ReviewCard`, `V1ReviewFilters`, `V1Stars`. Import via the `@/app/programs/[id]/_versions/v1/<Name>` alias.

### Recommended approach (verified against the source)
`listReviewsByProvider` returns **full review docs** (spread `...r`) plus `programTitle`/`programSlug`, so each item satisfies the programs `Review` type at runtime. Reuse the polished program components directly:
- **`V1ReviewCard`** (`{ review }`) — works as-is with a real review doc; its `api.reviews.markHelpful({ reviewId: review._id })` call is valid for these real reviews. Reuse per review.
- **`V1ReviewSummary`** (`{ stats, provider, selectedStar, onSelectStar }`) — reuse it, passing `provider={provider.name}`. It needs a `stats` object of shape `{ total: number; avg: number; distribution: {1..5: number}; categoryAverages: {academicsRating|livingSituationRating|culturalImmersionRating|programAdministrationRating|healthAndSafetyRating|communityRating: number|null} }`. **Do NOT use `api.reviews.getReviewStats` — it is per-program only.** Compute `stats` client-side with `useMemo` over the aggregated `reviews` array (count per `overallRating` for distribution; mean of each `*Rating` field, `null` if none present; `avg` = the passed `avgRating`).
- Star filter: hold `selectedStar` state; when set, filter the card list to reviews whose rounded `overallRating` equals it (same as the program section).
- Do NOT reuse `V1ReviewsSection` wholesale (needs a `Program`) or `V1AiSummary`/topic tags (program-only).

- [ ] **Step 1: Extend the `ProviderReview` type + read the sources**

In `app/providers/[slug]/_components/types.ts`, redefine `ProviderReview` as the full programs `Review` plus the annotations (ADDITIVE — the index/ProviderCard do not use `ProviderReview`, and `Provider` is untouched):

```ts
import type { Review } from "@/app/programs/[id]/_components/types"; // type-only import
export type ProviderReview = Review & { programTitle?: string; programSlug?: string };
```

Then read `app/programs/[id]/_versions/v1/V1ReviewsSection.tsx` (for how it lays out summary + card list), `V1ReviewSummary.tsx` (the `ReviewStats` shape + `provider` prop), `V1ReviewCard.tsx` (`{ review }`), `V1Stars.tsx`. Confirm the `stats` shape matches what you compute.

- [ ] **Step 2: Build `V1ProviderReviews.tsx`**

Build per the Recommended approach above. `V1ProviderReviews` (`{ provider, reviews, avgRating }`) renders inside a section headed `Reviews of {provider.name}`, containing:
- `<V1ReviewSummary stats={computedStats} provider={provider.name} selectedStar={selectedStar} onSelectStar={setSelectedStar} />` — `computedStats` via `useMemo` over `reviews` (see the required shape above).
- The (optionally star-filtered) list of reviews, each rendered with `<V1ReviewCard review={r} />` and a per-program source label (below).
- No AI-summary/topic-tag block.
- **Per-program source label:** each card shows which program it came from — wrap each card:

```tsx
<div key={r._id}>
  {r.programSlug ? (
    <a href={`/programs/${r.programSlug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-500 hover:underline mb-1.5">
      From: {r.programTitle}
    </a>
  ) : (
    <span className="inline-block text-xs font-semibold text-slate-500 mb-1.5">From: {r.programTitle}</span>
  )}
  <V1ReviewCard review={r} /* pass whatever props V1ReviewCard requires */ />
</div>
```

- Loading state: when `reviews === undefined`, render an animate-pulse placeholder. Empty state: when `reviews.length === 0`, render "No reviews yet for {provider.name}'s programs."
- Match section shell: `id="reviews"`, `scroll-mt-36`, `w-full max-w-7xl mx-auto px-4 xl:px-0`.

Neither `V1ReviewCard` (`{ review }`) nor `V1ReviewSummary` (`{ stats, provider, selectedStar, onSelectStar }`) requires a `program` object — confirmed. Do not fabricate one. If you hit an unexpected program dependency, stop and report it rather than faking data.

- [ ] **Step 3: Wire into `V1ProviderPage.tsx`**

After the gallery, add:

```tsx
<section id="reviews" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 scroll-mt-36">
  <V1ProviderReviews provider={provider} reviews={reviews} avgRating={avgRating} />
</section>
```

- [ ] **Step 4: Verification gate**

`npx tsc --noEmit` clean. In-app: reviews section shows aggregate rating + count, individual cards each labeled with their source program (link navigates to `/programs/<slug>`), and loading/empty states behave. Mobile layout verified.

---

## Task 7: Inquire, FAQ, Recognitions, Help + Articles

**Files:**
- Create: `app/providers/[slug]/_versions/v1/V1ProviderInquire.tsx` (adapt `_versions/v1/V1InquireSection.tsx`)
- Create: `app/providers/[slug]/_versions/v1/V1ProviderFAQ.tsx` (thin wrapper over the reusable FAQ UI)
- Create: `app/providers/[slug]/_versions/v1/V1ProviderRecognitions.tsx` (adapt `_versions/v1/V1Recognitions.tsx` to render data)
- Modify: `app/providers/[slug]/_versions/v1/V1ProviderPage.tsx`

**Interfaces:**
- Produces:
  - `V1ProviderInquire` props: `{ provider: Provider }`.
  - `V1ProviderFAQ` props: `{ provider: Provider }`.
  - `V1ProviderRecognitions` props: `{ provider: Provider }`.
- Consumes: `V1HelpSection`, `ProgramArticles`, `V1FAQ` (reused as-is).

- [ ] **Step 1: `V1ProviderInquire.tsx`**

Copy `app/programs/[id]/_versions/v1/V1InquireSection.tsx` (825 lines) into `V1ProviderInquire.tsx`. The form itself (travel window, months, contact fields, message, DayPicker) is provider-agnostic — keep ALL of it and its behavior unchanged, including the imports `import { TextInput, MONTHS } from "@/app/programs/[id]/_versions/v1/V1ApplySection";` (keep importing from the programs tree; do not copy that file). The ONLY changes:
- Prop: `{ program }: { program: Program }` → `{ provider }: { provider: Provider }` (import `Provider` from `../../_components/types`; drop the `Program` import).
- The ~6 `program` references are all display copy — swap exactly these:
  - "Inquire about this program" → `Inquire about {provider.name}` (or "Inquire with {provider.name}")
  - "Have a question? Send us a message and the program team will get back to you." → replace "the program team" with `the {provider.name} team`
  - `{program.provider} will get back …` → `{provider.name}`
  - `… about {program.title}.` → reword to drop the program title, e.g. "… about their programs." (provider has no single title)
  - "What questions do you have for {program.provider}?" → `… for {provider.name}?`
  - placeholder "What would you like to know about this program?" → "What would you like to know about their programs?"
- Keep the submit/confirmation (prototype) behavior identical.
- Do NOT add a wrapping `<section id="inquire">` inside the component — the page (Step 4) provides it. The component renders its own inner markup as the program version does.

- [ ] **Step 2: `V1ProviderFAQ.tsx`**

`V1FAQ` (`_versions/v1/V1FAQ.tsx`) is already generic (`faqs: {question, answer}[]`) and renders its own `<section id="faqs">`. Its only program-flavored copy is the subtitle "Everything you need to know about this program."

Copy the full `V1FAQ.tsx` body into `V1ProviderFAQ.tsx` and make these changes:
- Signature: `export default function V1ProviderFAQ({ provider }: { provider: Provider })` (import `Provider` from `../../_components/types`).
- Add `const faqs = provider.faqs;` at the top; keep the existing `if (faqs.length === 0) return null;` guard.
- Change the subtitle line to `Everything you need to know about {provider.name}.`
- Keep everything else identical (accordion state, `aria-expanded`/`aria-controls`, the `<section id="faqs">` shell, layout).

- [ ] **Step 3: `V1ProviderRecognitions.tsx`**

Adapt `V1Recognitions.tsx` from hardcoded badge images to rendering `provider.awards[]` ({ name, result, year? }) as data cards. `return null` if no awards.

```tsx
"use client";

import { Award } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderRecognitions({ provider }: { provider: Provider }) {
  const awards = provider.awards ?? [];
  if (awards.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by {provider.name}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {awards.map((a, i) => (
          <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
            <div className="w-9 h-9 rounded-md bg-sun-500/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-sun-500" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{a.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {a.result}{a.year ? ` · ${a.year}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire the tail of `V1ProviderPage.tsx`**

After the reviews section, add the inquire band, FAQ, recognitions, help, and articles. Import `V1ProviderInquire`, `V1ProviderFAQ`, `V1ProviderRecognitions`, plus reused `V1HelpSection` from `@/app/programs/[id]/_versions/v1/V1HelpSection` and `ProgramArticles` from `@/app/programs/[id]/_components/ProgramArticles`:

```tsx
{/* Inquire */}
<div className="mt-20 bg-slate-100 py-16">
  <section id="inquire" className="w-full max-w-7xl mx-auto px-4 xl:px-0 scroll-mt-36">
    <V1ProviderInquire provider={provider} />
  </section>
</div>

{/* FAQs */}
<V1ProviderFAQ provider={provider} />

{/* Recognitions */}
<section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
  <V1ProviderRecognitions provider={provider} />
</section>

{/* Help */}
<section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
  <V1HelpSection />
</section>

{/* Articles */}
<section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 [&_section]:mt-0 [&_section]:pt-0 [&_section]:border-t-0">
  <ProgramArticles />
</section>
```

- [ ] **Step 5: Verification gate**

`npx tsc --noEmit` clean. In-app: inquire form renders in the slate band; every Inquire CTA (hero, sticky header, mobile bar, info card) scrolls to it. FAQs accordion works with `provider.faqs`. Recognitions render from `provider.awards`. Help + Articles render. Confirm `#gallery` and `#reviews` anchors still work. Mobile verified.

---

## Task 8: End-to-end verification pass

**Files:** none (verification only).

- [ ] **Step 1: Typecheck + lint**

Run `npx tsc --noEmit` and (if configured) `npm run lint`. Expected: clean, no new errors/warnings introduced by the provider page.

- [ ] **Step 2: Full page walkthrough (desktop)**

Open `/providers/<test-slug>`. Confirm top-to-bottom: hero → trust bar → About → Why-choose → info card (sticky) → programs grid → gallery → reviews (labeled) → inquire → FAQ → recognitions → help → articles. Sticky header appears on scroll; all Inquire CTAs reach `#inquire`; Visit Website opens `provider.website` in a new tab.

- [ ] **Step 3: Cross-link check**

From a program page (`/programs/<program-slug>`), click the provider link in the hero ("Provided by …") and confirm it lands on the matching `/providers/<slug>` (proves slug consistency end-to-end).

- [ ] **Step 4: Mobile pass**

Narrow viewport: hero media stacks above title, trust bar is 2×2, columns stack, programs grid single-column, mobile Inquire bar visible and functional, no horizontal overflow.

- [ ] **Step 5: Edge states**

Unknown slug → ProviderNotFound. A provider with no photos → gallery hidden. A provider with no reviews → reviews empty state. A provider with no programs → programs empty state.

- [ ] **Step 6: Brand/design audit**

Grep the new files for inline hex (`grep -rniE "#[0-9a-f]{3,6}" app/providers`) — expect none in className strings. Confirm brand tokens, standard spacing, no oversized buttons, consistent with `BRANDING.md`.

---

## Notes for the executor

- Reuse, don't duplicate: `ProgramCard`, `V1HelpSection`, `ProgramArticles`, `V1Stars`, `CommentAnchor` are imported directly from the programs tree.
- When "adapting" a large source component (`V1Hero`, `V1MediaGallery`, `V1ReviewsSection`, `V1InquireSection`), read the full source first, copy it, then apply only the documented data/copy swaps — preserve layout, state, and a11y.
- Do not run git. Leave commits to the user.
- If any adaptation reveals a program-only assumption not covered here, prefer the simplest provider-appropriate substitution and leave a short code comment explaining it.
```

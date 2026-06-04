# Provider Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a providers directory (`/providers`) and a versioned provider profile page (`/providers/[slug]`) that aggregates a provider's identity, programs, reviews, media, FAQ, and awards.

**Architecture:** New Convex `providers` table + a `by_provider` index on `programs.provider` (string match, no FK). A providers index page (grid of `ProviderCard`) and a detail orchestrator that fetches the provider + its programs + aggregated reviews and renders `V1ProviderDetailPage` via the existing design-version system (`provider-detail`, v1). Reuses `ProgramCard` and adapts v5 visual patterns.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind CSS v4, Convex, lucide-react.

---

## Testing & git notes (read first)

- No unit-test harness in this repo. Verify each task with **`npx tsc --noEmit`** and **`npm run lint`**, and the final task with a **visual check via Chrome DevTools MCP**. Do not scaffold a test framework.
- **The implementing agent must NOT run git commands** (user rule). "Commit" steps are written as suggestions for the user.

## File structure

| File | Action | Responsibility |
| --- | --- | --- |
| `convex/schema.ts` | Modify | Add `providers` table + `by_provider` index on `programs` |
| `convex/providers.ts` | Create | Provider queries + `seedProviders` |
| `lib/slug.ts` | Create | Client-safe `slugify` (mirrors convex `generateSlug`) |
| `lib/design-versions.ts` | Modify | Register `provider-detail` v1 |
| `components/canvas/ToolbarVersionSwitcher.tsx` | Modify | Map `/providers/[slug]` → `provider-detail` |
| `app/providers/layout.tsx` | Create | PrototypeShell wrapper |
| `app/providers/page.tsx` | Create | Providers index grid |
| `app/providers/_components/ProviderCard.tsx` | Create | Index card |
| `app/providers/[slug]/page.tsx` | Create | Detail orchestrator + data fetch |
| `app/providers/[slug]/_components/types.ts` | Create | `Provider` + review types |
| `app/providers/[slug]/_components/LoadingSkeleton.tsx` | Create | Loading state |
| `app/providers/[slug]/_components/ProviderNotFound.tsx` | Create | 404 state |
| `app/providers/[slug]/_versions/v1/V1ProviderHero.tsx` | Create | Hero + breadcrumbs |
| `app/providers/[slug]/_versions/v1/V1ProviderTrustBar.tsx` | Create | Stat bar |
| `app/providers/[slug]/_versions/v1/V1ProviderAbout.tsx` | Create | About / Why choose |
| `app/providers/[slug]/_versions/v1/V1ProviderPrograms.tsx` | Create | Programs grid |
| `app/providers/[slug]/_versions/v1/V1ProviderReviews.tsx` | Create | Aggregated reviews |
| `app/providers/[slug]/_versions/v1/V1ProviderGallery.tsx` | Create | Media gallery |
| `app/providers/[slug]/_versions/v1/V1ProviderFAQ.tsx` | Create | FAQ accordion |
| `app/providers/[slug]/_versions/v1/V1ProviderAwards.tsx` | Create | Awards badge grid |
| `app/providers/[slug]/_versions/v1/V1ProviderInquiry.tsx` | Create | Inquiry CTA |
| `app/providers/[slug]/_versions/v1/V1ProviderDetailPage.tsx` | Create | Page composition |
| `app/programs/[id]/_versions/v5/V5Hero.tsx` | Modify | Link "Provided by" → provider page |

---

### Task 1: Schema — `providers` table + `by_provider` index

**Files:** Modify `convex/schema.ts`

- [ ] **Step 1: Add the `providers` table.** In `convex/schema.ts`, inside `defineSchema({ ... })`, add a new table (e.g. after the `programs` table block, before `articles`):

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
      v.object({
        name: v.string(),
        result: v.string(),
        year: v.optional(v.string()),
      })
    ),
    faqs: v.array(v.object({ question: v.string(), answer: v.string() })),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),
```

- [ ] **Step 2: Add a `by_provider` index to `programs`.** In the `programs` table's chained indexes (currently `.index("by_status", ["status"]).index("by_country", ["country"]).index("by_slug", ["slug"])`), append:

```ts
    .index("by_provider", ["provider"])
```

- [ ] **Step 3: Push schema.** Run: `npx convex dev --once`
Expected: schema pushes cleanly (both additions are additive). If Convex is unconfigured/unauthenticated in this environment and the command hangs or errors on deployment config, capture the exact error and report **BLOCKED** — do not attempt to log in.

- [ ] **Step 4 (user): Commit** — `feat(schema): add providers table and by_provider index`

---

### Task 2: Client-safe slug helper

**Files:** Create `lib/slug.ts`

This mirrors the algorithm in `convex/programs.ts` `generateSlug` so provider slugs match between the seed (server) and the "Provided by" link (client) without importing Convex server code into a client component.

- [ ] **Step 1: Create `lib/slug.ts`:**

```ts
// Mirrors convex/programs.ts generateSlug so client + server produce identical slugs.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 2: Type-check.** Run: `npx tsc --noEmit` — Expected: PASS.

---

### Task 3: Convex queries + seed (`convex/providers.ts`)

**Files:** Create `convex/providers.ts`

- [ ] **Step 1: Create `convex/providers.ts`:**

```ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateSlug } from "./programs";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listProviders = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return await ctx.db
        .query("providers")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("providers").order("desc").collect();
  },
});

export const getProviderBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("providers")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const listProgramsByProvider = query({
  args: {
    providerName: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { providerName, status }) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_provider", (q) => q.eq("provider", providerName))
      .collect();
    if (status) return programs.filter((p) => p.status === status);
    return programs;
  },
});

// Returns published reviews across all of a provider's programs, each annotated
// with the program title/slug it belongs to (reviews span multiple programs here).
export const listReviewsByProvider = query({
  args: { providerName: v.string() },
  handler: async (ctx, { providerName }) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_provider", (q) => q.eq("provider", providerName))
      .collect();

    const out = [];
    for (const program of programs) {
      const reviews = await ctx.db
        .query("reviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", program._id).eq("status", "published")
        )
        .collect();
      for (const r of reviews) {
        out.push({ ...r, programTitle: program.title, programSlug: program.slug });
      }
    }
    return out;
  },
});

// ─── One-time seed ─────────────────────────────────────────────────────────────

type SeedNarrative = {
  tagline: string;
  about: string;
  whyChoosePoints: string[];
  headquarters: string;
  yearFounded: number;
};

const NARRATIVES: Record<string, SeedNarrative> = {
  "WorldBridge Study Abroad": {
    tagline: "Immersive semesters and faculty-led programs across Europe and beyond.",
    about:
      "WorldBridge Study Abroad partners with leading universities to deliver immersive, academically rigorous semesters abroad. For over a decade we've helped students combine credit-bearing coursework with deep cultural immersion, supported end to end by on-the-ground staff.",
    whyChoosePoints: [
      "University-partnered, credit-transferable coursework",
      "On-site support staff in every host city",
      "Curated homestays and cultural excursions",
      "Dedicated pre-departure and re-entry advising",
    ],
    headquarters: "Boston, USA",
    yearFounded: 2014,
  },
  Expanish: {
    tagline: "Spanish-language immersion and internships in Latin America and Spain.",
    about:
      "Expanish specializes in Spanish-language immersion, study, and internship programs. With small class sizes and partner employers across the region, students build real-world fluency and professional experience in the heart of Spanish-speaking cities.",
    whyChoosePoints: [
      "Accredited Spanish-language instruction",
      "Vetted internship placements",
      "Small cohorts for faster fluency",
      "Housing and arrival support included",
    ],
    headquarters: "Buenos Aires, Argentina",
    yearFounded: 2009,
  },
  "GoAbroad Education Partners": {
    tagline: "Flexible global immersion semesters for the curious traveler.",
    about:
      "GoAbroad Education Partners designs flexible immersion semesters that blend academics, community engagement, and travel. Programs are built to be accessible and customizable, with a focus on meaningful, responsible travel.",
    whyChoosePoints: [
      "Flexible, customizable itineraries",
      "Community-engaged learning",
      "Transparent, all-inclusive pricing",
      "Global alumni network",
    ],
    headquarters: "Denver, USA",
    yearFounded: 2016,
  },
};

const DEFAULT_NARRATIVE: SeedNarrative = {
  tagline: "Meaningful study abroad programs for every kind of traveler.",
  about:
    "This provider offers a range of study abroad programs focused on academic quality, cultural immersion, and student support from application through return.",
  whyChoosePoints: [
    "Academically rigorous, credit-bearing programs",
    "Dedicated student support",
    "Strong cultural immersion focus",
    "Trusted by students worldwide",
  ],
  headquarters: "—",
  yearFounded: 2015,
};

const SAMPLE_AWARDS = [
  { name: "Top Rated Provider", result: "Notable Mention", year: "2025" },
  { name: "Innovative Student Video", result: "Winner", year: "2025" },
  { name: "Innovation in Sustainability", result: "Winner", year: "2024" },
  { name: "ISEP Accredited Provider", result: "Accredited", year: "Since 2018" },
  { name: "NAFSA", result: "Member", year: "Since 2016" },
  { name: "The Forum on Education Abroad", result: "Member" },
];

const SAMPLE_SOCIAL = [
  { platform: "Instagram", url: "https://instagram.com" },
  { platform: "Facebook", url: "https://facebook.com" },
  { platform: "LinkedIn", url: "https://linkedin.com" },
  { platform: "YouTube", url: "https://youtube.com" },
];

function providerFaqs(name: string) {
  return [
    {
      question: `Why should I choose a ${name} program over another provider?`,
      answer: `${name} combines academically rigorous, credit-bearing coursework with strong on-site support and cultural immersion — backed by years of experience and thousands of past participants.`,
    },
    {
      question: `Where does ${name} operate programs?`,
      answer: `${name} runs programs across multiple destinations. Browse the programs grid above to see current offerings and locations.`,
    },
    {
      question: "When do I have to apply by?",
      answer:
        "Application deadlines vary by program and term. Each program page lists its specific deadline — check the program you're interested in for exact dates.",
    },
    {
      question: "Is financial aid or scholarships available?",
      answer:
        "Many programs are eligible for financial aid and provider scholarships. Reach out through the inquiry form below and the team will share options for your situation.",
    },
  ];
}

export const seedProviders = mutation({
  args: {},
  handler: async (ctx) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const names = Array.from(new Set(programs.map((p) => p.provider))).filter(
      Boolean
    );

    let created = 0;
    for (const name of names) {
      const slug = generateSlug(name);
      const existing = await ctx.db
        .query("providers")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (existing) continue;

      const theirPrograms = programs.filter((p) => p.provider === name);
      const logo = theirPrograms.find((p) => p.providerLogo)?.providerLogo;
      const website = theirPrograms.find((p) => p.applyUrl)?.applyUrl;
      const photos = Array.from(
        new Set(theirPrograms.flatMap((p) => p.photos ?? []))
      ).slice(0, 8);
      const coverImage =
        theirPrograms.find((p) => p.coverImage)?.coverImage ?? photos[0];
      const narrative = NARRATIVES[name] ?? DEFAULT_NARRATIVE;

      await ctx.db.insert("providers", {
        name,
        slug,
        logo,
        coverImage,
        tagline: narrative.tagline,
        about: narrative.about,
        whyChoosePoints: narrative.whyChoosePoints,
        headquarters: narrative.headquarters,
        yearFounded: narrative.yearFounded,
        website,
        socialLinks: SAMPLE_SOCIAL,
        photos,
        awards: SAMPLE_AWARDS,
        faqs: providerFaqs(name),
        status: "published",
      });
      created++;
    }
    return { created, total: names.length };
  },
});
```

- [ ] **Step 2: Push + verify.** Run: `npx convex dev --once` — Expected: functions push with no errors. (If Convex is unconfigured and it fails on deployment auth, report BLOCKED with the exact error; treat code as complete.)

- [ ] **Step 3: Run the seed.** Run: `npx convex run providers:seedProviders` — Expected: `{ created: <n>, total: <n> }` with `created >= 1`.

- [ ] **Step 4: Type-check.** Run: `npx tsc --noEmit` — Expected: PASS.

- [ ] **Step 5 (user): Commit** — `feat(convex): provider queries + seedProviders`

---

### Task 4: Register `provider-detail` version + switcher path

**Files:** Modify `lib/design-versions.ts`, `components/canvas/ToolbarVersionSwitcher.tsx`

- [ ] **Step 1: Register the page.** In `lib/design-versions.ts`, add a new entry to `PAGE_VERSIONS` (after the `"program-detail"` block, before the closing `}` of the object):

```ts
  "provider-detail": {
    pageId: "provider-detail",
    versions: [
      { id: "v1", label: "v1", description: "Provider profile page" },
    ],
    defaultVersion: "v1",
  },
```

- [ ] **Step 2: Map the path.** In `components/canvas/ToolbarVersionSwitcher.tsx`, inside `pageIdForPath`, add a check (after the `program-detail` line):

```ts
  if (/^\/providers\/[^/]+$/.test(pathname)) return "provider-detail";
```

(The regex matches `/providers/<slug>` but NOT the bare `/providers` index, so the switcher only appears on detail pages. Note: with a single version the switcher self-hides via `versions.length < 2` — that's expected; it becomes visible once a v2 is added.)

- [ ] **Step 3: Type-check.** Run: `npx tsc --noEmit` — Expected: PASS.

---

### Task 5: Provider types

**Files:** Create `app/providers/[slug]/_components/types.ts`

- [ ] **Step 1: Create the types file:**

```ts
export interface ProviderSocialLink {
  platform: string;
  url: string;
}

export interface ProviderAward {
  name: string;
  result: string;
  year?: string;
}

export interface ProviderFaq {
  question: string;
  answer: string;
}

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
  socialLinks: ProviderSocialLink[];
  photos: string[];
  awards: ProviderAward[];
  faqs: ProviderFaq[];
  status: "draft" | "published";
}

// A published review annotated with the program it belongs to.
export interface ProviderReview {
  _id: string;
  _creationTime: number;
  reviewerName?: string;
  reviewerCountry?: string;
  reviewTitle?: string;
  body?: string;
  overallRating?: number;
  programTitle?: string;
  programSlug?: string;
}

// Minimal program shape needed by the programs grid (compatible with ProgramCard).
export interface ProviderProgram {
  _id: string;
  title: string;
  provider: string;
  city: string;
  country: string;
  terms: string[];
  coverImage?: string;
  cost?: string;
  subjectAreas: string[];
  slug?: string;
}
```

- [ ] **Step 2: Type-check.** Run: `npx tsc --noEmit` — Expected: PASS.

---

### Task 6: Providers layout + index page + ProviderCard

**Files:** Create `app/providers/layout.tsx`, `app/providers/_components/ProviderCard.tsx`, `app/providers/page.tsx`

- [ ] **Step 1: Create `app/providers/layout.tsx`:**

```tsx
import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
```

- [ ] **Step 2: Create `app/providers/_components/ProviderCard.tsx`:**

```tsx
"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Provider } from "../[slug]/_components/types";

export default function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-sm font-bold text-slate-400">
                {provider.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
              {provider.name}
            </h2>
            {provider.headquarters && provider.headquarters !== "—" && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {provider.headquarters}
              </p>
            )}
          </div>
        </div>

        {provider.tagline && (
          <p className="text-sm text-slate-600 mt-3 line-clamp-2">
            {provider.tagline}
          </p>
        )}

        <div className="flex-1" />

        <Link
          href={`/providers/${provider.slug}`}
          className="mt-4 block w-full text-center px-4 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors"
        >
          View Provider
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create `app/providers/page.tsx`:**

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Provider } from "./[slug]/_components/types";
import ProviderCard from "./_components/ProviderCard";

export default function ProvidersIndexPage() {
  const providers = useQuery(api.providers.listProviders, { status: "published" }) as
    | Provider[]
    | undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse Providers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore study abroad providers and their programs.
        </p>
      </header>

      {providers === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 bg-slate-100 border border-slate-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <p className="text-sm text-slate-500 py-12 text-center">
          No providers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <ProviderCard key={p._id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Type-check + lint.** Run: `npx tsc --noEmit` then `npm run lint` — Expected: PASS / no new errors in these files.

- [ ] **Step 5 (user): Commit** — `feat(providers): index page + ProviderCard`

---

### Task 7: Detail orchestrator + loading/404

**Files:** Create `app/providers/[slug]/_components/LoadingSkeleton.tsx`, `app/providers/[slug]/_components/ProviderNotFound.tsx`, `app/providers/[slug]/page.tsx`

- [ ] **Step 1: Create `app/providers/[slug]/_components/LoadingSkeleton.tsx`:**

```tsx
export default function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-10 animate-pulse">
      <div className="h-8 w-64 bg-slate-100 rounded mb-4" />
      <div className="h-40 bg-slate-100 rounded-md mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/providers/[slug]/_components/ProviderNotFound.tsx`:**

```tsx
import Link from "next/link";

export default function ProviderNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Provider not found</h1>
      <p className="text-sm text-slate-500 mt-2">
        We couldn&apos;t find that provider. It may have been removed.
      </p>
      <Link
        href="/providers"
        className="mt-6 inline-flex items-center justify-center h-10 px-5 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors"
      >
        Browse all providers
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/providers/[slug]/page.tsx`:**

```tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDesignVersion } from "@/lib/use-design-version";

import type { Provider, ProviderReview, ProviderProgram } from "./_components/types";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import ProviderNotFound from "./_components/ProviderNotFound";
import V1ProviderDetailPage from "./_versions/v1/V1ProviderDetailPage";

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

  const reviewList = reviews ?? [];
  const reviewCount = reviewList.length;
  const avgRating =
    reviewCount > 0
      ? Math.round(
          (reviewList.reduce((s, r) => s + (r.overallRating ?? 0), 0) /
            reviewCount) *
            100
        ) / 100
      : 0;

  if (provider === undefined) return <LoadingSkeleton />;
  if (provider === null) return <ProviderNotFound />;

  switch (version) {
    default:
      return (
        <V1ProviderDetailPage
          provider={provider}
          programs={programs ?? []}
          reviews={reviewList}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />
      );
  }
}
```

- [ ] **Step 4: Type-check.** Run: `npx tsc --noEmit` — Expected: it will FAIL only on the missing `./_versions/v1/V1ProviderDetailPage` import until Task 12. That's expected; proceed to build the v1 components (Tasks 8–12), then re-check. Do NOT commit until tsc passes after Task 12.

---

### Task 8: V1 hero + trust bar

**Files:** Create `app/providers/[slug]/_versions/v1/V1ProviderHero.tsx`, `app/providers/[slug]/_versions/v1/V1ProviderTrustBar.tsx`

- [ ] **Step 1: Create `V1ProviderHero.tsx`:**

```tsx
"use client";

import Link from "next/link";
import { Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import type { Provider } from "../../_components/types";

interface Props {
  provider: Provider;
  avgRating: number;
  reviewCount: number;
}

export default function V1ProviderHero({ provider, avgRating, reviewCount }: Props) {
  return (
    <div className="bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-6 pb-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-cobalt-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link href="/providers" className="hover:text-cobalt-600 transition-colors">
                Providers
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium truncate max-w-60" aria-current="page">
              {provider.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-16 w-16 sm:h-20 sm:w-20 border border-slate-200 rounded-md overflow-hidden shrink-0 bg-white flex items-center justify-center">
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="w-full h-full object-contain p-1.5"
              />
            ) : (
              <span className="text-xl font-bold text-slate-400">
                {provider.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-slate-900 leading-[1.15] tracking-tight">
              {provider.name}
            </h1>
            {provider.tagline && (
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">{provider.tagline}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              {avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-sun-500 fill-current" />
                  <span className="font-bold text-slate-900 text-base">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </span>
              )}
              {provider.headquarters && provider.headquarters !== "—" && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {provider.headquarters}
                </span>
              )}
              {provider.yearFounded && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Est. {provider.yearFounded}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="#inquiry"
              className="inline-flex items-center h-10 px-5 bg-white border border-cobalt-500 text-cobalt-500 text-sm font-semibold rounded-md hover:bg-cobalt-500/5 transition-colors"
            >
              Inquire
            </a>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-5 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors"
              >
                Visit Website
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `V1ProviderTrustBar.tsx`:**

```tsx
import { GraduationCap, Star, MessageSquare, Globe, Calendar } from "lucide-react";

interface Props {
  programCount: number;
  avgRating: number;
  reviewCount: number;
  countryCount: number;
  yearFounded?: number;
}

export default function V1ProviderTrustBar({
  programCount,
  avgRating,
  reviewCount,
  countryCount,
  yearFounded,
}: Props) {
  const stats = [
    { icon: GraduationCap, label: "Programs", value: String(programCount) },
    { icon: Star, label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "—" },
    { icon: MessageSquare, label: "Reviews", value: String(reviewCount) },
    { icon: Globe, label: "Countries", value: String(countryCount) },
    { icon: Calendar, label: "Established", value: yearFounded ? String(yearFounded) : "—" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="bg-white border border-slate-200 rounded-md p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-md bg-cobalt-500/10 text-cobalt-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Type-check.** Run: `npx tsc --noEmit` — Expected: still only the Task-12 import error remains; no errors inside these two files.

---

### Task 9: V1 about + programs grid

**Files:** Create `app/providers/[slug]/_versions/v1/V1ProviderAbout.tsx`, `app/providers/[slug]/_versions/v1/V1ProviderPrograms.tsx`

- [ ] **Step 1: Create `V1ProviderAbout.tsx`:**

```tsx
import { Check } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderAbout({ provider }: { provider: Provider }) {
  if (!provider.about && provider.whyChoosePoints.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900">
          Why choose {provider.name}?
        </h2>
        {provider.about && (
          <p className="text-sm leading-relaxed text-slate-600 mt-3">
            {provider.about}
          </p>
        )}
      </div>
      {provider.whyChoosePoints.length > 0 && (
        <div className="flex-1">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {provider.whyChoosePoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-fern-500/10 text-fern-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" aria-hidden="true" />
                </span>
                <span className="text-sm text-slate-700 leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `V1ProviderPrograms.tsx`:**

```tsx
import ProgramCard from "@/components/ProgramCard";
import type { ProviderProgram } from "../../_components/types";

interface Props {
  providerName: string;
  programs: ProviderProgram[];
}

export default function V1ProviderPrograms({ providerName, programs }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        {providerName} Programs
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        {programs.length} {programs.length === 1 ? "program" : "programs"} available
      </p>
      {programs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
          <p className="text-sm text-slate-500">
            No published programs from this provider yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program._id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Type-check.** Run: `npx tsc --noEmit` — Expected: only the Task-12 import error remains. (`ProgramCard`'s prop type is structurally compatible with `ProviderProgram`.)

---

### Task 10: V1 reviews + gallery

**Files:** Create `app/providers/[slug]/_versions/v1/V1ProviderReviews.tsx`, `app/providers/[slug]/_versions/v1/V1ProviderGallery.tsx`

- [ ] **Step 1: Create `V1ProviderReviews.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { ProviderReview } from "../../_components/types";

const INITIAL = 3;

interface Props {
  reviews: ProviderReview[];
  avgRating: number;
  reviewCount: number;
}

export default function V1ProviderReviews({ reviews, avgRating, reviewCount }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (reviewCount === 0) return null;

  const sorted = [...reviews].sort((a, b) => b._creationTime - a._creationTime);
  const visible = showAll ? sorted : sorted.slice(0, INITIAL);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Reviews</h2>

      <div className="border border-slate-200 rounded-md p-5 sm:p-6 bg-white mb-4">
        <div className="flex items-center flex-wrap gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
            {avgRating.toFixed(1)}
            <span className="text-2xl sm:text-3xl font-bold text-slate-400 ml-1">/5</span>
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  avgRating >= star ? "text-sun-500 fill-current" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="bg-cobalt-500/10 text-cobalt-600 text-xs font-semibold px-3 py-1 rounded-full">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"} across all programs
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-slate-200 p-5 rounded-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-cobalt-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {(review.reviewerName ?? "A").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-neutral-900 truncate">
                    {review.reviewerName ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-neutral-500 truncate">
                    {review.reviewerCountry && <>{review.reviewerCountry} · </>}
                    {new Date(review._creationTime).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {review.overallRating != null && (
                <div className="flex items-center gap-1 rounded-md px-2 py-1 bg-slate-100 shrink-0">
                  <Star fill="currentColor" className="text-sun-500 w-4 h-4" />
                  <span className="font-bold text-sm">
                    {Number(review.overallRating).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {review.reviewTitle && (
              <h3 className="text-base font-bold text-neutral-900 mt-3">
                {review.reviewTitle}
              </h3>
            )}
            {review.body && (
              <p className="text-sm leading-relaxed text-neutral-700 mt-2 line-clamp-3">
                {review.body}
              </p>
            )}
            {review.programTitle && (
              <p className="text-xs text-slate-400 mt-3">
                On <span className="font-semibold text-slate-500">{review.programTitle}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {sorted.length > INITIAL && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center justify-center h-10 px-5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {showAll ? "Show fewer reviews" : `View all ${sorted.length} reviews`}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `V1ProviderGallery.tsx`:**

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function V1ProviderGallery({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

  if (photos.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Media Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            aria-label={`Open photo ${i + 1}`}
          >
            <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Previous"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh] mx-auto px-16">
            <img
              src={photos[index]}
              alt={`Photo ${index + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            <p className="text-center text-white/50 text-sm mt-3">
              {index + 1} / {photos.length}
            </p>
          </div>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Next"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Type-check.** Run: `npx tsc --noEmit` — Expected: only the Task-12 import error remains.

---

### Task 11: V1 FAQ + awards + inquiry

**Files:** Create `app/providers/[slug]/_versions/v1/V1ProviderFAQ.tsx`, `app/providers/[slug]/_versions/v1/V1ProviderAwards.tsx`, `app/providers/[slug]/_versions/v1/V1ProviderInquiry.tsx`

- [ ] **Step 1: Create `V1ProviderFAQ.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProviderFaq } from "../../_components/types";

export default function V1ProviderFAQ({ faqs }: { faqs: ProviderFaq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-20">
      <div className="flex-1 max-w-xs">
        <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
          FAQ
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Common questions about this provider.
        </p>
      </div>
      <div className="flex-1">
        <div className="divide-y divide-slate-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `V1ProviderAwards.tsx`:**

```tsx
import { Trophy, Award, Sprout, ShieldCheck, BadgeCheck, Landmark, type LucideIcon } from "lucide-react";
import type { ProviderAward } from "../../_components/types";

const ICON_CYCLE: LucideIcon[] = [Trophy, Award, Sprout, ShieldCheck, BadgeCheck, Landmark];

function resultStyle(result: string): string {
  const r = result.toLowerCase();
  if (r === "winner") return "bg-fern-500/10 text-fern-700";
  if (r === "finalist") return "bg-slate-100 text-slate-600";
  if (r === "notable mention") return "bg-sun-500/10 text-sun-700";
  return "bg-cobalt-500/10 text-cobalt-600"; // member / accredited / other
}

export default function V1ProviderAwards({ awards }: { awards: ProviderAward[] }) {
  if (awards.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Awards & Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by this provider
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {awards.map((award, i) => {
          const Icon = ICON_CYCLE[i % ICON_CYCLE.length];
          return (
            <div
              key={`${award.name}-${i}`}
              className="aspect-square bg-white border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="w-11 h-11 rounded-full bg-sun-500/10 text-sun-500 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {award.name}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${resultStyle(award.result)}`}
              >
                {award.result}
              </span>
              {award.year && (
                <span className="text-[11px] text-slate-500">{award.year}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `V1ProviderInquiry.tsx`:**

```tsx
"use client";

import { Send, ShieldCheck } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderInquiry({ provider }: { provider: Provider }) {
  return (
    <section id="inquiry" className="scroll-mt-24 bg-slate-50 rounded-md p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
          Ready to learn more?
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Get in touch with {provider.name}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Send a quick message and the provider will reach out with next steps.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
            <textarea
              rows={4}
              placeholder={`Ask ${provider.name} a question…`}
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Your information is secure and only shared with {provider.name}.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Send inquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Type-check.** Run: `npx tsc --noEmit` — Expected: only the Task-12 import error remains.

---

### Task 12: Compose `V1ProviderDetailPage`

**Files:** Create `app/providers/[slug]/_versions/v1/V1ProviderDetailPage.tsx`

- [ ] **Step 1: Create `V1ProviderDetailPage.tsx`:**

```tsx
"use client";

import type { Provider, ProviderReview, ProviderProgram } from "../../_components/types";
import V1ProviderHero from "./V1ProviderHero";
import V1ProviderTrustBar from "./V1ProviderTrustBar";
import V1ProviderAbout from "./V1ProviderAbout";
import V1ProviderPrograms from "./V1ProviderPrograms";
import V1ProviderReviews from "./V1ProviderReviews";
import V1ProviderGallery from "./V1ProviderGallery";
import V1ProviderFAQ from "./V1ProviderFAQ";
import V1ProviderAwards from "./V1ProviderAwards";
import V1ProviderInquiry from "./V1ProviderInquiry";

interface Props {
  provider: Provider;
  programs: ProviderProgram[];
  reviews: ProviderReview[];
  avgRating: number;
  reviewCount: number;
}

export default function V1ProviderDetailPage({
  provider,
  programs,
  reviews,
  avgRating,
  reviewCount,
}: Props) {
  const countryCount = new Set(programs.map((p) => p.country).filter(Boolean)).size;

  return (
    <main className="pb-20 text-neutral-800">
      <V1ProviderHero provider={provider} avgRating={avgRating} reviewCount={reviewCount} />

      <div className="max-w-7xl mx-auto px-4 xl:px-0 -mt-6">
        <V1ProviderTrustBar
          programCount={programs.length}
          avgRating={avgRating}
          reviewCount={reviewCount}
          countryCount={countryCount}
          yearFounded={provider.yearFounded}
        />
      </div>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderAbout provider={provider} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderPrograms providerName={provider.name} programs={programs} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderReviews reviews={reviews} avgRating={avgRating} reviewCount={reviewCount} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderGallery photos={provider.photos} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderFAQ faqs={provider.faqs} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderAwards awards={provider.awards} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderInquiry provider={provider} />
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Full type-check.** Run: `npx tsc --noEmit` — Expected: PASS (the Task-7 orchestrator import now resolves).

- [ ] **Step 3: Lint.** Run: `npm run lint` — Expected: no new errors in the new `app/providers/**` files.

- [ ] **Step 4 (user): Commit** — `feat(providers): v1 provider detail page + sections + orchestrator`

---

### Task 13: Link "Provided by" → provider page (v5)

**Files:** Modify `app/programs/[id]/_versions/v5/V5Hero.tsx`

- [ ] **Step 1: Import the slug helper + Link.** At the top of `V5Hero.tsx`, ensure `Link` from `next/link` is imported (it already is) and add:

```tsx
import { slugify } from "@/lib/slug";
```

- [ ] **Step 2: Wrap the provider name in a link.** In `V5Hero.tsx`, the provider attribution currently reads:

```tsx
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Provided by <span className="text-cobalt-500">{program.provider}</span>
                  </p>
```

Replace the `<span>` with a `Link` to the provider page:

```tsx
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Provided by{" "}
                    <Link
                      href={`/providers/${slugify(program.provider)}`}
                      className="text-cobalt-500 hover:underline"
                    >
                      {program.provider}
                    </Link>
                  </p>
```

- [ ] **Step 3: Type-check + lint.** Run: `npx tsc --noEmit` then `npm run lint` — Expected: PASS / no new errors.

- [ ] **Step 4 (user): Commit** — `feat(v5): link "Provided by" to provider page`

---

### Task 14: Final verification (build + visual)

- [ ] **Step 1: Full type-check.** Run: `npx tsc --noEmit` — Expected: PASS.

- [ ] **Step 2: Lint.** Run: `npm run lint` — Expected: no new errors in `app/providers/**`, `convex/providers.ts`, `lib/slug.ts`, or the modified `V5Hero.tsx`.

- [ ] **Step 3: Visual check (Chrome DevTools MCP).** With the dev server running:
  - Open `/providers` — confirm the index grid shows provider cards (logo, name, HQ, tagline, "View Provider").
  - Click a provider (e.g. WorldBridge Study Abroad) → `/providers/<slug>` — confirm all 9 sections render: hero (logo/name/rating/HQ/CTAs), trust bar (5 stats), "Why choose", programs grid (their programs via ProgramCard), reviews (aggregate rating + cards showing program titles), media gallery (lightbox opens), FAQ (accordion), awards (badge grid), inquiry form.
  - From a v5 program page, click the "Provided by [provider]" link → confirm it navigates to that provider's page.
  - Check a mobile viewport (~390px): hero, trust bar (2-col), programs/gallery/awards grids reflow cleanly.

---

## Self-review

**Spec coverage:**
- `providers` table w/ all fields → Task 1. ✓
- `by_provider` index (string match, no FK) → Task 1. ✓
- Queries `listProviders`/`getProviderBySlug`/`listProgramsByProvider`/`listReviewsByProvider` + `seedProviders` → Task 3. ✓
- Register `provider-detail` v1 + switcher path mapping → Task 4. ✓
- Index page + ProviderCard → Task 6. ✓
- Detail orchestrator + loading/404 → Task 7. ✓
- All 9 detail sections → Tasks 8–11; composed in Task 12. ✓
- "Provided by" cross-link → Task 13. ✓
- Verification → Task 14. ✓

**Placeholder scan:** No TBD/TODO; every code step has complete code.

**Type consistency:** `Provider`/`ProviderReview`/`ProviderProgram` defined in Task 5 and used identically in Tasks 6–12. Query names (`api.providers.listProviders`, `getProviderBySlug`, `listProgramsByProvider`, `listReviewsByProvider`) consistent between Task 3 (definition) and Task 7 (usage). `listReviewsByProvider` returns reviews spread with `programTitle`/`programSlug`, matching `ProviderReview`. Provider slug generated by `generateSlug` (server seed, Task 3) and `slugify` (client link, Task 13) — identical algorithm (Task 2). `V1ProviderDetailPage` prop shape matches the orchestrator's call site (Task 7). ProgramCard prop type is a structural superset-compatible match for `ProviderProgram`.

**Known intentional interim state:** Task 7 leaves `tsc` failing on the not-yet-created `V1ProviderDetailPage` import until Task 12 — called out explicitly in Task 7 Step 4 and Tasks 8–11 verification notes.

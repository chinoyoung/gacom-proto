# Content Cards Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the shared `components/ArticleCard.tsx` and `components/ProgramCard.tsx` to the gacom-next `content-cards` design, keeping their prop APIs so all callers keep working.

**Architecture:** Internal-JSX-only rewrites. Both keep their current single-object prop (`{ article }` / `{ program }`). Icons ported from `react-icons/lu` to `lucide-react`; gacom-next-only theme utilities replaced with standard Tailwind; images keep gacom-proto's current handling.

**Tech Stack:** Next.js 16 App Router, React, TypeScript (strict), Tailwind v4, lucide-react, next/image.

## Global Constraints

- **No git commands.** Leave changes in the working tree.
- **No new npm dependency.** Use `lucide-react` (already installed); do NOT import `react-icons`.
- **No inline hex/rgba colors in className OR SVG attributes.** Use brand tokens (`cobalt-*`, `sun-*`, `fern-*`) and Tailwind fill utilities (e.g. `fill-slate-900/35`).
- **`cursor-pointer` on every clickable element.**
- **Do NOT change the prop interfaces** (`{ article: Article }`, `{ program: Program }`) or any caller. All 6 call sites must keep compiling unchanged.

---

### Task 1: Restyle ArticleCard + ProgramCard

**Files:**
- Modify (full internal rewrite): `components/ArticleCard.tsx`
- Modify (full internal rewrite): `components/ProgramCard.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: same exports/props as today (`export default ArticleCard({ article })`, `export default ProgramCard({ program })`) — visuals only change.

- [ ] **Step 1: Rewrite `components/ArticleCard.tsx`**

Replace the ENTIRE file with:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

interface Article {
    _id: string;
    title: string;
    author: string;
    publishDate: string;
    tags: string[];
    coverImage?: string;
    slug: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
}

export default function ArticleCard({ article }: { article: Article }) {
    const [imageError, setImageError] = useState(false);
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        setFormattedDate(formatDate(article.publishDate));
    }, [article.publishDate]);

    return (
        <div className="relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300">
            {/* Save button */}
            <button
                type="button"
                aria-label="Save article"
                className="group absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent transition-all duration-300 active:scale-100"
            >
                <Heart className="h-7 w-7 fill-slate-900/35 text-white drop-shadow-md transition-colors group-hover:fill-red-400/40 group-hover:text-red-400" />
            </button>

            {/* Image */}
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
                {article.coverImage && !imageError ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        onError={() => setImageError(true)}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-300">
                        <svg className="mb-2 h-12 w-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 opacity-40">No preview</span>
                    </div>
                )}

                {/* Badge */}
                {article.tags.length > 0 && (
                    <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-cobalt-500 px-2 py-1 text-xs font-semibold text-white">
                            {article.tags[0]}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex grow flex-col gap-3 p-4">
                <Link
                    href={`/articles/${article.slug}`}
                    className="line-clamp-2 text-lg font-bold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:text-cobalt-600"
                >
                    {article.title}
                </Link>

                <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium">{article.author}</span>
                    <span>{formattedDate ?? ""}</span>
                </div>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Rewrite `components/ProgramCard.tsx`**

Replace the ENTIRE file with the following. NOTE: `CircleCheck` must be exported by the installed `lucide-react`; if Step 3's typecheck reports it is not exported, replace the two `CircleCheck` references with `BadgeCheck` (import and usage) and re-run the typecheck.

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Globe, CircleCheck, ExternalLink } from "lucide-react";

interface Program {
    _id: string;
    title: string;
    provider: string;
    providerLogo?: string;
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    coverImage?: string;
    slug?: string;
}

export default function ProgramCard({ program }: { program: Program }) {
    const href = `/programs/${program.slug ?? program._id}`;

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-all duration-300">
            {/* Save button */}
            <button
                type="button"
                aria-label="Save program"
                className="group absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent transition-all duration-300 active:scale-100"
            >
                <Heart className="h-7 w-7 fill-slate-900/35 text-white drop-shadow-md transition-colors group-hover:fill-red-400/40 group-hover:text-red-400" />
            </button>

            {/* Image */}
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
                {program.coverImage ? (
                    <Image
                        src={program.coverImage}
                        alt={program.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                        <svg className="mb-2 h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3 3.75h18" />
                        </svg>
                        <span className="text-xs text-slate-400">No photo</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex grow flex-col justify-between gap-2 px-4 py-3">
                {/* Provider row */}
                <div className="flex items-center gap-3 pb-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                        {program.providerLogo ? (
                            <img src={program.providerLogo} alt={program.provider} className="h-full w-full object-contain p-1" />
                        ) : (
                            <Globe className="h-5 w-5 text-slate-300" />
                        )}
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="line-clamp-1 text-sm font-bold text-slate-700">{program.provider}</p>
                        {program.rating != null && (
                            <div className="flex flex-row items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                    <span className="text-xs font-bold text-slate-800">{program.rating.toFixed(1)}</span>
                                    <Star className="h-3.5 w-3.5 text-sun-500" fill="currentColor" />
                                </div>
                                {program.reviewCount != null && (
                                    <span className="text-[11px] text-slate-500">{program.reviewCount.toLocaleString()} reviews</span>
                                )}
                                {program.verified && <CircleCheck className="h-4 w-4 text-fern-500" />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <Link
                    href={href}
                    className="line-clamp-2 text-left text-lg font-bold leading-6 text-cobalt-500 transition-all duration-300 hover:-translate-y-px hover:text-cobalt-600"
                >
                    {program.title}
                </Link>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
                <Link
                    href={href}
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-cobalt-500 py-2.5 transition-all duration-300 hover:bg-cobalt-600"
                >
                    <span className="text-sm font-bold text-white">View Program</span>
                    <ExternalLink className="h-3 w-3 text-white transition-all duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. If it errors that `CircleCheck` is not exported from `lucide-react`, swap both `CircleCheck` references to `BadgeCheck` (import + usage) and re-run until exit 0. Report the substitution if made.

- [ ] **Step 4: Grep guard**

Run: `grep -rn "react-icons\|z-ground\|z-sky\|h-50\b" components/ArticleCard.tsx components/ProgramCard.tsx`
Expected: no matches (confirms no leftover reference-only deps/utilities).

- [ ] **Step 5: Checkpoint (no commit)**

Confirm `npx tsc --noEmit` passes and the grep guard is clean. Do not run git.

---

## Self-Review

**Spec coverage:**
- Restyle shared `ArticleCard` → Task 1 Step 1. ✓
- Restyle shared `ProgramCard` → Task 1 Step 2. ✓
- Prop APIs unchanged (Article/Program interfaces identical to current) → both steps keep the same interface + default-export signature; no caller edits. ✓
- Icons → lucide-react (`Globe`, `Star`, `CircleCheck`/`BadgeCheck`, `ExternalLink`, `Heart`) → Step 2 imports. ✓
- No react-icons / theme-only utilities → Step 4 grep guard. ✓
- No inline hex/rgba → hearts use `fill-slate-900/35` Tailwind utility, not `fill="rgba(...)"`. ✓
- Images: ArticleCard `<img>`+fallback, ProgramCard `next/image`+fallback → preserved. ✓
- Verification via tsc (all 6 callers) → Step 3. ✓

**Placeholder scan:** No TBD/TODO; both files provided in full. The `CircleCheck`→`BadgeCheck` contingency is a concrete, testable fallback, not a placeholder.

**Type consistency:** `Article` and `Program` interfaces are byte-identical to the current files, so all callers type-check unchanged. `program.rating`/`reviewCount`/`verified`/`providerLogo`/`coverImage`/`slug` all guarded for optionality exactly as before.

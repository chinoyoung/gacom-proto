# V5 AI Review Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a seeded AI-generated review summary card to the v5 program detail page, placed below the rating summary and above the review feed.

**Architecture:** Add an optional `aiSummary` object to the `programs` table (additive, no migration). A seed mutation populates demo programs with hand-written text. A new presentational `V5AiSummary` component renders the card; it's wired through `V5DetailPage` → `V5Reviews`. v5 only — no other version changes.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind CSS v4, Convex, lucide-react.

---

## Testing note (read first)

This is a prototype repo with **no unit-test harness** (no Jest/Vitest/Playwright test setup). Per the writing-plans intent (verify every change) adapted to this codebase, each task is verified by **`npx tsc --noEmit`** (type safety) and, at the end, a **visual check in the browser via Chrome DevTools MCP**. Do not scaffold a test framework — that's out of scope.

**Git note:** The user's global rules forbid the agent from running git commands. "Commit" steps are written as suggestions for the **user** to run manually; the implementing agent must NOT run `git`.

---

## File structure

| File | Action | Responsibility |
| --- | --- | --- |
| `convex/schema.ts` | Modify | Add optional `aiSummary` object to `programs` |
| `convex/programs.ts` | Modify | Add `setAiSummary` mutation + `seedAiSummaries` one-time utility |
| `app/programs/[id]/_components/types.ts` | Modify | Add `aiSummary?` to the shared `Program` interface |
| `app/programs/[id]/_versions/v5/V5AiSummary.tsx` | Create | The AI summary card (presentational) |
| `app/programs/[id]/_versions/v5/V5Reviews.tsx` | Modify | Accept `aiSummary` prop; render `<V5AiSummary>` after the summary card |
| `app/programs/[id]/_versions/v5/V5DetailPage.tsx` | Modify | Pass `program.aiSummary` into `<V5Reviews>` |

---

### Task 1: Schema — add `aiSummary` to `programs`

**Files:**
- Modify: `convex/schema.ts:64-66` (insert before the `// Timestamps` block, inside the `programs` table)

- [ ] **Step 1: Add the field**

In `convex/schema.ts`, inside the `programs` defineTable, immediately before the `// Timestamps` comment (currently line 64), add:

```ts
    // AI Review Summary (seeded for prototype)
    aiSummary: v.optional(
      v.object({
        text: v.string(),
        generatedAt: v.number(),
        reviewCount: v.number(),
      })
    ),

```

- [ ] **Step 2: Verify Convex accepts the schema**

Run: `npx convex dev --once`
Expected: schema pushes with no validation errors (the field is optional, so existing docs remain valid).

- [ ] **Step 3 (user): Commit**

Suggested message: `feat(schema): add optional aiSummary to programs`

---

### Task 2: Shared `Program` type — add `aiSummary`

**Files:**
- Modify: `app/programs/[id]/_components/types.ts:46` (after `yearFounded?: number;`, before the closing brace)

- [ ] **Step 1: Add the field to the interface**

In `app/programs/[id]/_components/types.ts`, after the `yearFounded?: number;` line (line 46), add:

```ts

  // AI Review Summary (seeded)
  aiSummary?: {
    text: string;
    generatedAt: number;
    reviewCount: number;
  };
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS (no new errors).

---

### Task 3: Backend — `setAiSummary` mutation + `seedAiSummaries` utility

**Files:**
- Modify: `convex/programs.ts` (append to the `// ─── One-time Admin Utilities ───` section, after `trimHighlights`, end of file ~line 176)

- [ ] **Step 1: Add the public setter mutation**

Append to `convex/programs.ts`:

```ts

// ─── AI Summary ────────────────────────────────────────────────────────────

export const setAiSummary = mutation({
  args: {
    programId: v.id("programs"),
    text: v.string(),
  },
  handler: async (ctx, { programId, text }) => {
    const publishedReviews = await ctx.db
      .query("reviews")
      .withIndex("by_program_status", (q) =>
        q.eq("programId", programId).eq("status", "published")
      )
      .collect();

    await ctx.db.patch(programId, {
      aiSummary: {
        text,
        generatedAt: Date.now(),
        reviewCount: publishedReviews.length,
      },
      updatedAt: Date.now(),
    });
    return programId;
  },
});
```

- [ ] **Step 2: Add the seed utility**

Append to `convex/programs.ts` (after `setAiSummary`):

```ts

// One-time: seed hand-written AI summaries onto demo programs.
// Tailored text for the Barcelona demo program; a themes-based generic
// paragraph for any other published program that has >= 3 published reviews.
export const seedAiSummaries = mutation({
  args: {},
  handler: async (ctx) => {
    const BARCELONA =
      "Students consistently highlight the immersive language environment and welcoming host families, with cultural immersion and community rated highest. Most found the program administration responsive and the academics well-structured, though a few noted the living situation varies by neighborhood and the early pace can feel intense. The recurring theme across reviews is strong personal growth and lasting friendships, with many recommending a full semester for the richest experience.";

    const GENERIC =
      "Across reviews, past participants most often praise the supportive staff and the cultural immersion, with day-to-day support and community rated highly. Several mention the living situation and onboarding pace as the main things to plan for. The common thread is meaningful personal growth, and most reviewers say they'd recommend the program to a friend.";

    const programs = await ctx.db
      .query("programs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    let updated = 0;
    for (const program of programs) {
      const reviews = await ctx.db
        .query("reviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", program._id).eq("status", "published")
        )
        .collect();

      const isBarcelona = /barcelona/i.test(program.title);
      if (!isBarcelona && reviews.length < 3) continue;

      await ctx.db.patch(program._id, {
        aiSummary: {
          text: isBarcelona ? BARCELONA : GENERIC,
          generatedAt: Date.now(),
          reviewCount: reviews.length,
        },
        updatedAt: Date.now(),
      });
      updated++;
    }
    return { updated, total: programs.length };
  },
});
```

- [ ] **Step 3: Type-check / push**

Run: `npx convex dev --once`
Expected: functions push with no errors.

- [ ] **Step 4: Run the seed**

Run: `npx convex run programs:seedAiSummaries`
Expected: returns `{ updated: <n>, total: <m> }` with `updated >= 1` (the Barcelona program at minimum).

- [ ] **Step 5 (user): Commit**

Suggested message: `feat(convex): add setAiSummary mutation and seedAiSummaries utility`

---

### Task 4: Create `V5AiSummary.tsx` component

**Files:**
- Create: `app/programs/[id]/_versions/v5/V5AiSummary.tsx`

- [ ] **Step 1: Write the component**

Create `app/programs/[id]/_versions/v5/V5AiSummary.tsx` with exactly:

```tsx
import { Sparkles } from "lucide-react";

interface V5AiSummaryProps {
  summary?: {
    text: string;
    reviewCount: number;
  };
}

export default function V5AiSummary({ summary }: V5AiSummaryProps) {
  if (!summary?.text) return null;

  return (
    <div className="border border-cobalt-500/20 bg-cobalt-500/5 rounded-md p-5 sm:p-6">
      <div className="flex items-center flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-cobalt-600">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          AI summary
        </span>
        <span className="bg-cobalt-500/10 text-cobalt-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-700 mt-3">
        {summary.text}
      </p>

      <p className="text-xs italic text-slate-400 mt-3">
        AI-generated — read individual reviews for full context.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 5: Wire `V5Reviews` to accept and render the summary

**Files:**
- Modify: `app/programs/[id]/_versions/v5/V5Reviews.tsx:51-57` (props interface + signature)
- Modify: `app/programs/[id]/_versions/v5/V5Reviews.tsx:1-11` (import)
- Modify: `app/programs/[id]/_versions/v5/V5Reviews.tsx:263-265` (render after summary card)

- [ ] **Step 1: Import the component**

In `V5Reviews.tsx`, after the lucide-react import block (line 11), add:

```tsx
import V5AiSummary from "./V5AiSummary";
```

- [ ] **Step 2: Extend the props interface**

Replace the `V5ReviewsProps` interface (lines 51-55) with:

```tsx
interface V5ReviewsProps {
  reviews: Review[] | undefined;
  avgRating: number;
  provider: string;
  aiSummary?: {
    text: string;
    reviewCount: number;
  };
}
```

- [ ] **Step 3: Destructure the new prop**

Replace the function signature line (line 57):

```tsx
export default function V5Reviews({ reviews, avgRating, provider }: V5ReviewsProps) {
```

with:

```tsx
export default function V5Reviews({ reviews, avgRating, provider, aiSummary }: V5ReviewsProps) {
```

- [ ] **Step 4: Render the card after the summary card**

In `V5Reviews.tsx`, find the closing of the Summary card block (the `</div>` that ends the `{/* Summary card */}` container — currently line 263, just before `{/* Review cards */}`). Immediately AFTER that closing `</div>` and BEFORE the `{/* Review cards */}` comment, insert:

```tsx

      {/* AI review summary */}
      <V5AiSummary summary={aiSummary} />
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 6: Pass `program.aiSummary` from `V5DetailPage`

**Files:**
- Modify: `app/programs/[id]/_versions/v5/V5DetailPage.tsx:140-144`

- [ ] **Step 1: Pass the prop**

In `V5DetailPage.tsx`, replace the `<V5Reviews>` usage (lines 140-144):

```tsx
          <V5Reviews
            reviews={reviews}
            avgRating={avgRating}
            provider={program.provider}
          />
```

with:

```tsx
          <V5Reviews
            reviews={reviews}
            avgRating={avgRating}
            provider={program.provider}
            aiSummary={program.aiSummary}
          />
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS. (`program.aiSummary` is `{ text, generatedAt, reviewCount } | undefined`, structurally assignable to the prop's `{ text, reviewCount } | undefined`.)

- [ ] **Step 3 (user): Commit**

Suggested message: `feat(v5): render AI review summary card`

---

### Task 7: Final verification (build + visual)

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 2: Lint (if configured)**

Run: `npm run lint`
Expected: no new errors in the changed files.

- [ ] **Step 3: Visual check (Chrome DevTools MCP)**

With the dev server running, open the v5 Barcelona program page (`/programs/<id>?v=v5`), scroll to the `#reviews` section, and confirm:
- The cobalt-tinted "AI summary" card appears **below** the rating summary card and **above** the review feed.
- It shows the sparkle icon, "AI summary" label, the review-count pill, the seeded paragraph, and the italic disclaimer.
- On a mobile viewport (~390px), the card is full-width, the header row wraps cleanly, and the paragraph reflows.
- Open a program with no seeded summary and confirm the card is absent.

---

## Self-review

**Spec coverage:**
- Schema `aiSummary { text, generatedAt, reviewCount }` on programs → Task 1. ✓
- Seeded text (no LLM) → Task 3 (`seedAiSummaries`). ✓
- Card below rating summary, above feed → Task 5 Step 4 placement. ✓
- Disclaimer text → Task 4 component. ✓
- Display rule "render whenever summary exists" → Task 4 (`if (!summary?.text) return null`). ✓
- Mobile-friendly → Task 4 (`flex-wrap`, full-width) + Task 7 check. ✓
- v5 only, no other versions touched → only v5 files modified. ✓

**Placeholder scan:** No TBD/TODO; all code blocks complete.

**Type consistency:** `aiSummary` object shape `{ text, generatedAt, reviewCount }` consistent across schema (Task 1), Program type (Task 2), mutation (Task 3). Component/prop uses the `{ text, reviewCount }` subset consistently (Tasks 4, 5, 6). `V5AiSummary` default export imported and used by the same name. ✓

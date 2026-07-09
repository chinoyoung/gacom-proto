# Program Interviews Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make program interviews database-backed and admin-managed, mirroring the existing reviews stack, so the detail page renders interviews from Convex instead of a hardcoded array.

**Architecture:** New Convex `interviews` table + `convex/interviews.ts` (CRUD + seed), modeled 1:1 on `reviews`. A new `InterviewsManager` admin tab modeled on `ReviewsManager`. `V1InterviewsSection` rewired to query published interviews by program; presentation-only fields (initials/avatar color) derived client-side via a small tested pure helper.

**Tech Stack:** Next.js 16 App Router, React, TypeScript (strict), Convex, Clerk, Tailwind v4, Vitest, lucide-react.

## Global Constraints

- **No git commands.** Leave all changes in the working tree. Each task ends at a verified checkpoint, not a commit.
- **No inline hex colors in className.** Use brand tokens (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`) and standard Tailwind.
- **Every clickable element gets `cursor-pointer`.**
- **Enums are literal unions:** `role` is `"Alumni" | "Staff"`; `status` is `"draft" | "published"`.
- **Mirror the reviews implementation** (`convex/reviews.ts`, `app/admin/_components/ReviewsManager.tsx`) for structure and semantics; do not invent new patterns.
- **Convex dev is running** and regenerates `convex/_generated/` on save; if `api.interviews` is missing during typecheck, run `npx convex codegen` from the repo root to sync types.

---

### Task 1: Convex schema + interviews backend

**Files:**
- Modify: `convex/schema.ts` (add `interviews` table after the `reviews` table)
- Create: `convex/interviews.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (Convex API, used by Tasks 2 & 3):
  - `api.interviews.listInterviews` → `query(): Interview[]`
  - `api.interviews.listInterviewsByProgram` → `query({ programId: Id<"programs">, status?: "draft"|"published" }): Interview[]`
  - `api.interviews.getInterview` → `query({ id: Id<"interviews"> })`
  - `api.interviews.createInterview` → `mutation({ programId, name, role, year, bio, quote, photo?, status, createdBy? }): Id<"interviews">`
  - `api.interviews.updateInterview` → `mutation({ id, ...all fields optional }): Id<"interviews">`
  - `api.interviews.deleteInterview` → `mutation({ id: Id<"interviews"> })`
  - `api.interviews.seedMockInterviews` → `mutation({ programId: Id<"programs"> }): number`
  - Interview doc shape: `{ programId, name, role: "Alumni"|"Staff", year, bio, quote, photo?, status: "draft"|"published", createdBy? }`

- [ ] **Step 1: Add the `interviews` table to the schema**

In `convex/schema.ts`, add this table definition immediately after the `reviews` table's index chain (inside the `defineSchema({ ... })` object, alongside the other tables):

```ts
  interviews: defineTable({
    programId: v.id("programs"),
    name: v.string(),
    role: v.union(v.literal("Alumni"), v.literal("Staff")),
    year: v.string(),
    bio: v.string(),
    quote: v.string(),
    photo: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    createdBy: v.optional(v.string()),
  })
    .index("by_program", ["programId"])
    .index("by_status", ["status"])
    .index("by_program_status", ["programId", "status"]),
```

- [ ] **Step 2: Create `convex/interviews.ts`**

Write the full file (mirrors `convex/reviews.ts`; `updateInterview` uses the same
destructure-filter-patch handler as `updateReview`):

```ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listInterviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("interviews").order("desc").collect();
  },
});

export const listInterviewsByProgram = query({
  args: {
    programId: v.id("programs"),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { programId, status }) => {
    if (status) {
      return await ctx.db
        .query("interviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", programId).eq("status", status)
        )
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("interviews")
      .withIndex("by_program", (q) => q.eq("programId", programId))
      .order("desc")
      .collect();
  },
});

export const getInterview = query({
  args: { id: v.id("interviews") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const createInterview = mutation({
  args: {
    programId: v.id("programs"),
    name: v.string(),
    role: v.union(v.literal("Alumni"), v.literal("Staff")),
    year: v.string(),
    bio: v.string(),
    quote: v.string(),
    photo: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("interviews", args);
  },
});

export const updateInterview = mutation({
  args: {
    id: v.id("interviews"),
    programId: v.optional(v.id("programs")),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("Alumni"), v.literal("Staff"))),
    year: v.optional(v.string()),
    bio: v.optional(v.string()),
    quote: v.optional(v.string()),
    photo: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    // Remove undefined values before patching
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const deleteInterview = mutation({
  args: { id: v.id("interviews") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ─── Bulk Seeding ────────────────────────────────────────────────────────────

// The 3 original placeholder interviews (verbatim from the former
// V1InterviewsSection hardcoded array), seeded as published for one program.
export const seedMockInterviews = mutation({
  args: { programId: v.id("programs") },
  handler: async (ctx, { programId }) => {
    const samples: {
      name: string;
      role: "Alumni" | "Staff";
      year: string;
      bio: string;
      quote: string;
      photo?: string;
    }[] = [
      {
        name: "Kristianna Williams",
        role: "Alumni",
        year: "2017",
        bio: "Kristianna is from Dayton, Ohio, and she is a senior Sports Science major at Wright State University. Kristianna loves coaching middle school track an...",
        quote:
          "I wanted to get out of my comfort zone and see another culture firsthand. Growing up in a small town in Ohio, I'd never really traveled outside the country, so studying abroad felt like the perfect chance to push myself. From the moment I landed I was immersed in a completely new way of life — the food, the language, the everyday rhythms — and it stretched me in ways I never expected. By the end, I'd made friends from all over the world and come back with a confidence I didn't have before.",
        photo: "/images/interview1.webp",
      },
      {
        name: "Marissa Baglione",
        role: "Alumni",
        year: "2016",
        bio: "Marissa Baglione is a senior studying communications and media studies in Boston. She just recently landed an internship with Hill Holliday in their M...",
        quote:
          "Studying abroad in college has been at the top of my to-do list since high school. I have a love of travel and discovering new places, so that's definitely what inspired me to apply. What I didn't expect was how much the program would shape my career — interning with a local agency while I was abroad gave me real-world experience I could never have gotten in a classroom. Balancing work, classes, and exploring a new city taught me how to adapt quickly, and I came home with a portfolio and a network that opened doors the moment I got back.",
      },
      {
        name: "Daniel Ortega",
        role: "Staff",
        year: "2019",
        bio: "Daniel is a program coordinator based in Barcelona who has supported hundreds of students through their study abroad journey over the past six years...",
        quote:
          "Seeing students grow in confidence over a single semester is the most rewarding part of what I do. Many of them arrive nervous and unsure, sometimes traveling on their own for the very first time, and within weeks they're navigating the city, ordering in a new language, and making friends from around the world. My job is to make sure the logistics never get in the way of that growth — from housing and safety to helping them settle in. By the time they leave, they're not just better students, they're more independent, more curious people, and that's what keeps me doing this year after year.",
      },
    ];

    for (const s of samples) {
      await ctx.db.insert("interviews", {
        programId,
        name: s.name,
        role: s.role,
        year: s.year,
        bio: s.bio,
        quote: s.quote,
        photo: s.photo,
        status: "published",
      });
    }
    return samples.length;
  },
});
```

- [ ] **Step 3: Sync Convex generated types**

Run: `npx convex codegen`
Expected: regenerates `convex/_generated/` including `api.interviews`. (If it errors because `convex dev` holds a lock, skip — the running dev already regenerated on save.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. If it reports `Property 'interviews' does not exist on type ... api`, re-run Step 3 first, then re-run tsc.

- [ ] **Step 5: Checkpoint (no commit)**

Confirm `npx tsc --noEmit` passes and `convex/_generated/api.d.ts` mentions `interviews`. Do not run git.

---

### Task 2: Admin — InterviewsManager + tab wiring

**Files:**
- Create: `app/admin/_components/InterviewsManager.tsx`
- Modify: `app/admin/page.tsx`

**Interfaces:**
- Consumes: all `api.interviews.*` from Task 1; `api.programs.listPrograms`.
- Produces: `<InterviewsManager isCreating={boolean} onCancelCreate={() => void} />` (default export).

This task mirrors `app/admin/_components/ReviewsManager.tsx`. **Read that file in full first** and adapt it — do not re-derive from scratch. The interview form is simpler (no rating fields).

- [ ] **Step 1: Create `InterviewsManager.tsx` by adapting `ReviewsManager.tsx`**

Copy the structure of `ReviewsManager.tsx` and change:
- Props interface identical: `{ isCreating: boolean; onCancelCreate: () => void }`.
- Data hooks:
  ```tsx
  const interviews = useQuery(api.interviews.listInterviews);
  const programs = useQuery(api.programs.listPrograms, {});
  const createInterview = useMutation(api.interviews.createInterview);
  const updateInterview = useMutation(api.interviews.updateInterview);
  const deleteInterview = useMutation(api.interviews.deleteInterview);
  const seedMockInterviews = useMutation(api.interviews.seedMockInterviews);
  ```
- `editingId` typed `Id<"interviews"> | null`.
- Form state = the interview fields only:
  ```tsx
  function getInitialFormData() {
    return {
      programId: "",
      name: "",
      role: "Alumni" as "Alumni" | "Staff",
      year: "",
      bio: "",
      quote: "",
      photo: "",
      status: "published" as "draft" | "published",
    };
  }
  ```
- Form inputs (mirror ReviewsManager's field markup/tokens): program `<select>` (options from `programs`, required), `name` text (placeholder e.g. `"e.g. Kristianna Williams"`), `role` `<select>` with options `Alumni` / `Staff`, `year` text (placeholder `"e.g. 2017"`), `bio` `<textarea>`, `quote` `<textarea>`, `photo` text (placeholder `"/images/interview1.webp or https://..."`), `status` `<select>` (draft/published). Remove ALL rating inputs and reviewer-specific fields.
- Create submit → `createInterview(formData)` with `programId` cast `as Id<"programs">`.
- Edit: populate `formData` from the interview (mirror the ReviewsManager edit-populate effect/handler) and submit → `updateInterview({ id: editingId, ...formData, programId: formData.programId as Id<"programs"> })`.
- Delete → `deleteInterview({ id })`.
- Seed UI: mirror ReviewsManager's seed control (program picker + button) → `seedMockInterviews({ programId: seedProgramId as Id<"programs"> })`.
- List rows: show name, role, year, program, status badge; search filters by `name`; keep pagination if ReviewsManager has it.
- Keep all styling tokens/classes consistent with ReviewsManager; `cursor-pointer` on buttons.

- [ ] **Step 2: Wire the tab into `app/admin/page.tsx`**

Make these edits:
1. Add the import: `import InterviewsManager from "./_components/InterviewsManager";`
2. Extend the tab type: `type AdminTab = "programs" | "articles" | "reviews" | "users" | "interviews";`
3. Add state: `const [isCreatingInterview, setIsCreatingInterview] = useState(false);`
4. In the header action area, add a branch so that when `activeTab === "interviews"` a "Create New Interview" button renders (mirror the reviews branch, calling `setIsCreatingInterview(true)`). Use the same button classes.
5. Add an "Interviews" tab button in the tab switcher (mirror an existing tab button; reuse the `MessageSquare` lucide icon already imported, or another already-imported icon). On click set `activeTab` to `"interviews"` and reset the other `isCreating*` flags as the sibling tabs do.
6. Where tab content renders, add: when `activeTab === "interviews"`, render
   `<InterviewsManager isCreating={isCreatingInterview} onCancelCreate={() => setIsCreatingInterview(false)} />`.

Follow the exact conditional style already used for the reviews tab.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 4: Checkpoint (no commit)**

Confirm tsc passes. Do not run git.

---

### Task 3: Frontend — presentation helper (TDD) + query-backed V1InterviewsSection

**Files:**
- Create: `app/programs/[id]/_versions/v1/interview-presentation.ts`
- Test: `app/programs/[id]/_versions/v1/interview-presentation.test.ts`
- Modify: `app/programs/[id]/_versions/v1/V1InterviewsSection.tsx` (full rewrite)
- Modify: `app/programs/[id]/_versions/v1/V1DetailPage.tsx` (pass `programId`)

**Interfaces:**
- Consumes: `api.interviews.listInterviewsByProgram` (Task 1).
- Produces:
  - `interviewInitials(name: string): string`
  - `interviewAvatarClasses(index: number): string`
  - `<V1InterviewsSection programId={string} />` (default export)

NOTE on the path: the directory contains literal brackets `app/programs/[id]/`. When running shell/test commands, single-quote paths and run `setopt nonomatch` if a glob error appears. Vitest globs by test file — run `npm test -- interview-presentation` to target it.

- [ ] **Step 1: Write the failing test**

Create `app/programs/[id]/_versions/v1/interview-presentation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { interviewInitials, interviewAvatarClasses } from "./interview-presentation";

describe("interviewInitials", () => {
  it("uses the first letter of the first two words", () => {
    expect(interviewInitials("Kristianna Williams")).toBe("KW");
    expect(interviewInitials("Daniel Ortega")).toBe("DO");
  });

  it("handles a single word", () => {
    expect(interviewInitials("Marissa")).toBe("M");
  });

  it("handles extra whitespace and empty input", () => {
    expect(interviewInitials("  Ana   Cruz  ")).toBe("AC");
    expect(interviewInitials("")).toBe("?");
  });
});

describe("interviewAvatarClasses", () => {
  it("returns a class string and rotates deterministically by index", () => {
    const a = interviewAvatarClasses(0);
    expect(typeof a).toBe("string");
    expect(a.length).toBeGreaterThan(0);
    // wraps around the palette
    expect(interviewAvatarClasses(3)).toBe(interviewAvatarClasses(0));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- interview-presentation`
Expected: FAIL — cannot resolve `./interview-presentation`.

- [ ] **Step 3: Implement the helper**

Create `app/programs/[id]/_versions/v1/interview-presentation.ts`:

```ts
// Presentation-only helpers for interview cards. The DB stores no avatar color
// or initials; these derive them so the visual matches the original placeholder.

const AVATAR_PALETTE = [
  "bg-cobalt-500/10 text-cobalt-600",
  "bg-sun-500/10 text-sun-700",
  "bg-fern-500/10 text-fern-700",
];

/** First letter of the first two words, uppercased. "?" when empty. */
export function interviewInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Deterministic avatar color classes, rotating through a fixed palette. */
export function interviewAvatarClasses(index: number): string {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- interview-presentation`
Expected: PASS (all cases).

- [ ] **Step 5: Rewrite `V1InterviewsSection.tsx` to query by program**

Replace the entire file with:

```tsx
"use client";

import { ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { interviewInitials, interviewAvatarClasses } from "./interview-presentation";

const ROLE_BADGE: Record<"Alumni" | "Staff", string> = {
  Alumni: "bg-cobalt-500 text-white",
  Staff: "bg-fern-600 text-white",
};

export default function V1InterviewsSection({ programId }: { programId: string }) {
  const interviews = useQuery(api.interviews.listInterviewsByProgram, {
    programId: programId as Id<"programs">,
    status: "published",
  });

  // Loading: render nothing to avoid a layout flash.
  if (interviews === undefined) return null;
  // Empty: no published interviews → hide the section entirely.
  if (interviews.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Interviews</h2>
      <p className="text-sm text-slate-500 mt-1">Read interviews from alumni or staff</p>

      <div className="mt-6 divide-y divide-slate-200">
        {interviews.map((person, index) => (
          <div
            key={person._id}
            className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-10 py-8 first:pt-0"
          >
            {/* Left — person card */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
              <div className="flex items-center gap-4">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-16 h-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-lg font-bold ${interviewAvatarClasses(index)}`}
                    aria-hidden="true"
                  >
                    {interviewInitials(person.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 leading-snug">{person.name}</h3>
                  <p className="text-sm text-slate-500">Participated in {person.year}</p>
                  <span
                    className={`inline-flex mt-1.5 items-center px-3 py-1 rounded-md text-xs font-semibold ${ROLE_BADGE[person.role]}`}
                  >
                    {person.role}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-4">{person.bio}</p>
            </div>

            {/* Right — quote + link */}
            <div>
              <p className="text-[15px] text-slate-700 leading-relaxed">{person.quote}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-cobalt-600 transition-colors cursor-pointer"
              >
                Show Full Interview
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Pass `programId` from `V1DetailPage.tsx`**

In `app/programs/[id]/_versions/v1/V1DetailPage.tsx`, find:

```tsx
          <V2InterviewsSection />
```

(It may already read `<V1InterviewsSection />` after the earlier consolidation.) Change the interviews render to:

```tsx
          <V1InterviewsSection programId={program._id} />
```

Ensure the import at the top is `import V1InterviewsSection from "./V1InterviewsSection";` (rename the identifier/import from `V2InterviewsSection` if it still says that). Do not change any other section.

- [ ] **Step 7: Typecheck + tests**

Run: `npx tsc --noEmit` → expect exit 0.
Run: `npm test` → expect all tests pass (including the new interview-presentation suite).

- [ ] **Step 8: Checkpoint (no commit)**

Confirm tsc + tests pass. Do not run git.

---

## Self-Review

**Spec coverage:**
- `interviews` schema table → Task 1 Step 1. ✓
- Convex CRUD + seed mirroring reviews → Task 1 Step 2. ✓
- Admin InterviewsManager mirroring ReviewsManager → Task 2 Step 1. ✓
- Admin tab wiring → Task 2 Step 2. ✓
- Frontend query-backed section + programId prop → Task 3 Steps 5-6. ✓
- Client-derived initials/avatar color (tested) → Task 3 Steps 1-4. ✓
- Loading = null, empty = null → Task 3 Step 5. ✓
- Verification (tsc, tests, convex codegen) → each task's checkpoint. ✓
- Non-goals (no fullInterview, no reviews changes, no new route) → not present. ✓

**Placeholder scan:** No TBD/TODO. Task 2 directs adapting a concrete in-repo reference (`ReviewsManager.tsx`) with an explicit field-level delta and exact hook/wiring code — not a vague placeholder. All code steps show complete code.

**Type consistency:** `role: "Alumni"|"Staff"` and `status: "draft"|"published"` used identically across schema, mutations, admin form, and frontend. `interviewInitials`/`interviewAvatarClasses` signatures match between test, impl, and usage. `programId` passed as `string`, cast to `Id<"programs">` at the query boundary (matches page.tsx's reviews cast pattern).

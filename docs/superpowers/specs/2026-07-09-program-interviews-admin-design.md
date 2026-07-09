# DB-Backed Program Interviews (Admin + Frontend) — Design

**Date:** 2026-07-09
**Status:** Approved (pending spec review)

## Summary

Add database-backed **program interviews**, mirroring the existing program **reviews**
stack, so the program detail page renders interviews from Convex instead of the hardcoded
placeholder array. Includes a Convex schema table, CRUD + seed functions, an admin
management tab, and rewiring the detail-page interviews section to query by program.

## Background / Current State

- **Reviews** are fully DB-backed and serve as the pattern to mirror:
  - `convex/schema.ts` → `reviews` table with indexes `by_program`, `by_status`,
    `by_program_status`.
  - `convex/reviews.ts` → `listReviews`, `listReviewsByProgram({programId, status?})`,
    `getReview`, `createReview`, `updateReview`, `deleteReview`, `seedMockReviews`
    (plus `markHelpful`, `getReviewStats` — not relevant to interviews).
  - `app/admin/_components/ReviewsManager.tsx` → admin CRUD UI, props
    `{ isCreating, onCancelCreate }`, program `<select>`, draft/published `<select>`,
    search, pagination, edit/delete, seed button.
  - `app/admin/page.tsx` → tab switcher (`programs | articles | reviews | users`) with a
    per-tab "Create New …" header button.
- **Interviews** are currently hardcoded: `app/programs/[id]/_versions/v1/V1InterviewsSection.tsx`
  defines a local `INTERVIEWS` array of 3 entries and renders them. The component takes no
  props and is rendered as `<V1InterviewsSection />` at `V1DetailPage.tsx:170`.
- Interview shape (from the placeholder): `name`, `year` (string), `role`
  (`"Alumni" | "Staff"`), `bio` (short), `quote` (excerpt), optional `avatar` (image URL),
  plus presentation-only `initials` and `avatarColor`.

## Decisions (from brainstorming)

- **Quote only** — store the `quote` excerpt; no long `fullInterview` field. The
  "Show Full Interview" button stays as-is (non-functional) for now.
- **Seed button** — provide `seedMockInterviews` + an admin button that inserts the 3
  current placeholder interviews for a chosen program.

## Goals

1. Interviews are stored in Convex and manageable via the admin panel (create/edit/delete).
2. The detail page interviews section reads published interviews for the current program.
3. A seed action can populate the 3 existing sample interviews.

## Non-Goals (YAGNI)

- No `fullInterview` long-form body; no functional "Show Full Interview" behavior.
- No changes to reviews.
- No new public page or route.
- No auth gating beyond what the admin panel already has (prototype admin).

## Design

### 1. Schema — new `interviews` table (`convex/schema.ts`)

Mirror the reviews index pattern:

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

`initials` and `avatarColor` are derived client-side (not stored).

### 2. Backend — new `convex/interviews.ts`

Mirror `convex/reviews.ts` structure and semantics:

- `listInterviews` — `query`, no args, `ctx.db.query("interviews").order("desc").collect()`.
- `listInterviewsByProgram` — `query`, args `{ programId: v.id("programs"), status?: "draft"|"published" }`;
  uses `by_program_status` when status given, else `by_program`, `.order("desc")`.
- `getInterview` — `query`, args `{ id: v.id("interviews") }`.
- `createInterview` — `mutation`, args = all table fields (`status` required, `photo`/`createdBy` optional);
  `return await ctx.db.insert("interviews", args)`.
- `updateInterview` — `mutation`, args `{ id: v.id("interviews"), ...all other fields optional }`;
  patches provided fields (mirror `updateReview`'s destructure-and-patch approach).
- `deleteInterview` — `mutation`, args `{ id: v.id("interviews") }`, `ctx.db.delete(id)`.
- `seedMockInterviews` — `mutation`, args `{ programId: v.id("programs") }`; inserts the 3
  placeholder interviews (verbatim `name`/`role`/`year`/`bio`/`quote`, `photo` only for
  Kristianna = `/images/interview1.webp`) as `status: "published"`. Data captured verbatim
  from the current `V1InterviewsSection.tsx` `INTERVIEWS` array before that file is rewritten.

### 3. Admin — new `app/admin/_components/InterviewsManager.tsx`

Mirror `ReviewsManager.tsx` (props `{ isCreating: boolean; onCancelCreate: () => void }`),
simplified to the interview fields:

- Data: `useQuery(api.interviews.listInterviews)`, `useQuery(api.programs.listPrograms, {})`;
  `useMutation` for create/update/delete/seed.
- Form fields: program `<select>` (required), `name` (text), `role` `<select>`
  (Alumni/Staff), `year` (text), `bio` (`<textarea>`), `quote` (`<textarea>`), `photo` URL
  (text, optional), `status` `<select>` (draft/published).
- List: search by name, pagination, edit and delete actions, seed button + program picker
  for seeding (mirror ReviewsManager's seed UX).
- Follow the same styling/tokens as ReviewsManager (no inline hex; brand tokens;
  `cursor-pointer` on clickable elements).

### 4. Admin page wiring (`app/admin/page.tsx`)

- Extend `AdminTab` to `"programs" | "articles" | "reviews" | "users" | "interviews"`.
- Import `InterviewsManager`; add `isCreatingInterview` state.
- Add an "Interviews" tab button (reuse an appropriate lucide icon) and a
  "Create New Interview" header button shown when `activeTab === "interviews"`.
- Render `<InterviewsManager isCreating={isCreatingInterview} onCancelCreate={...} />`
  when the interviews tab is active.

### 5. Frontend — `V1InterviewsSection.tsx` + `V1DetailPage.tsx`

- `V1InterviewsSection` gains a prop `{ programId: string }` and replaces the hardcoded
  `INTERVIEWS` with
  `useQuery(api.interviews.listInterviewsByProgram, { programId: programId as Id<"programs">, status: "published" })`.
- Keep the existing card layout, role badge map, and "Show Full Interview" button.
- Derive `initials` from the name (first letters of first two words) and `avatarColor`
  from a small fixed palette rotated by index, replacing the stored presentation fields.
- Loading state (`data === undefined`) → render nothing (avoid layout flash). Empty state
  (query resolved with zero published interviews) → the component returns `null` so the
  section shows nothing rather than a bare "Interviews" heading.
- `V1DetailPage.tsx:170` renders `<V1InterviewsSection programId={program._id} />`.

## Data Flow

Admin creates/seeds interviews → Convex `interviews` table → detail page
`listInterviewsByProgram({ programId, status: "published" })` (live query) → rendered cards.

## Testing / Verification

- `npx tsc --noEmit` clean.
- Convex dev picks up the new schema table + `interviews.ts` without errors.
- Manual drive: in `/admin`, open the Interviews tab, seed a program, create/edit/delete an
  interview; on that program's detail page confirm published interviews render (and drafts
  do not), and the section is empty/quiet when there are none.
- Unit-testable pure logic (initials/avatar-color derivation) extracted and tested with
  Vitest, matching the repo's pure-logic test style.

## Files

- `convex/schema.ts` — add `interviews` table.
- `convex/interviews.ts` — new; CRUD + seed.
- `app/admin/_components/InterviewsManager.tsx` — new admin tab UI.
- `app/admin/page.tsx` — register the interviews tab.
- `app/programs/[id]/_versions/v1/V1InterviewsSection.tsx` — query-backed rewrite.
- `app/programs/[id]/_versions/v1/V1DetailPage.tsx` — pass `programId`.
- Interview presentation helper (initials/avatar color) + its Vitest test.

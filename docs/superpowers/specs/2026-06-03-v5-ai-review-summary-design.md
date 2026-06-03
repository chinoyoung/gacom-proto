# V5 AI Review Summary — Design Spec

**Date:** 2026-06-03
**Scope:** v5 program detail/listing page only. Implements doc item 5 ("AI REVIEW SUMMARY") from the "REVIEWS SECTIONS PROPOSAL 2026" Google Doc, "Section in listing" tab.

## Goal

Add an AI-generated review summary card to the v5 program detail page. It sits below the rating summary card and above the review feed, surfacing themes (positive + negative) from all reviews in one paragraph so users who don't read every review still get the full picture.

## Decisions (locked)

- **Generation:** Seeded text. A hand-written `aiSummary` string is stored per program. No live LLM call. Real generation is a deliberate later phase.
- **Display rule:** Render whenever the program has a non-empty `aiSummary.text`, regardless of review count. The doc's "≥10 reviews" gate is deferred to the real-generation phase.
- **Scope guard:** v5 only. No scheduling/regeneration, no admin editor for the field (YAGNI), no changes to v1/v2/v4 or the default version.

## Architecture

### 1. Schema — `convex/schema.ts`, `programs` table

Add one optional field (additive, no migration; other versions unaffected):

```ts
aiSummary: v.optional(v.object({
  text: v.string(),
  generatedAt: v.number(),
  reviewCount: v.number(),
})),
```

### 2. Backend — `convex/programs.ts`

Add a mutation to stamp the seeded summary:

```ts
setAiSummary(programId, text)
// → counts published reviews for the program,
//   sets aiSummary = { text, generatedAt: Date.now(), reviewCount }
```

Seed the visible demo program(s) (e.g. the Barcelona "Semester in Barcelona" program) with a hand-written paragraph via this mutation so the card appears immediately in the demo.

### 3. UI — new component `app/programs/[id]/_versions/v5/V5AiSummary.tsx`

Renders the card from the doc mockup:
- Soft cobalt-tinted container (`bg-cobalt-500/5` or similar brand token), rounded-md, bordered — consistent with the existing summary card.
- Header row: sparkle icon (lucide `Sparkles`) + "AI summary" label + review-count pill (matching the existing `reviews` pill style).
- The summary paragraph (`aiSummary.text`).
- Muted footer disclaimer, italic/small: *"AI-generated — read individual reviews for full context."*
- Brand tokens only (`cobalt-*`, `slate-*`); no inline hex; restrained styling (no heavy gradients/shadows).

**Props:** `{ summary: { text: string; reviewCount: number } | undefined }`. Returns `null` when `summary?.text` is falsy.

### 4. Data flow & placement

- `app/programs/[id]/page.tsx` already fetches `program` and passes it to the version component. No change needed to the fetch.
- `V5DetailPage.tsx` passes `program.aiSummary` into `<V5Reviews>` as a new `aiSummary` prop.
- `V5Reviews.tsx` renders `<V5AiSummary summary={aiSummary} />` immediately after the summary card (after line ~263) and before the review-feed section.

### 5. Mobile

Full-width card; paragraph wraps; the icon/label/pill header row wraps gracefully on narrow screens (`flex-wrap`).

## Components & responsibilities

| Unit | Responsibility | Depends on |
| --- | --- | --- |
| `schema.programs.aiSummary` | Persist seeded summary text + metadata | — |
| `programs.setAiSummary` mutation | Stamp summary + computed review count | `reviews` by_program_status index |
| `V5AiSummary.tsx` | Render the card; hide when no summary | brand tokens, lucide `Sparkles` |
| `V5DetailPage.tsx` | Pass `program.aiSummary` to `V5Reviews` | — |
| `V5Reviews.tsx` | Place the card after the summary card | `V5AiSummary` |

## Out of scope

- Real LLM generation, scheduling, "regenerate when 10 new reviews" logic.
- `≥10 reviews` display gate.
- Admin editor UI for the summary text.
- Any version other than v5.

## Testing / verification

- Type-check / build passes.
- Visual check in v5: card renders for a seeded program below the summary card; hidden for a program with no `aiSummary`; layout holds on mobile widths.

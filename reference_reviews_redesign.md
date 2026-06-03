# Reviews Sections Redesign — Implementation Plan

> Source: ["REVIEWS SECTIONS PROPOSAL 2026" Google Doc](https://docs.google.com/document/d/1UF84rfQUrwLwImonK_FAzC4O7AmiDMro39exGePcSS4/edit?tab=t.0) — "Section in listing" tab.
> Scope: redesign of the reviews sections on the program detail/listing page.

## Context & key findings

- **Doc Phase 1, item 1 (change rating /10 → 5 stars) is already done at the data layer.** `convex/schema.ts:82-105` already stores `overallRating` and all 6 category ratings on a **1–5 scale**. The `9.52` in the mockup reflects the *legacy live site*, not this prototype. So this item becomes "confirm /5 + star display everywhere," not a data migration.
- The mockups show **directory-specific categories** ("Intern placement / Work environment / Social life") whereas the schema currently has fixed study-abroad categories (`academicsRating`, `livingSituationRating`, etc.). That gap is the single biggest data-model decision (see Decisions).
- **Delivery vehicle:** build as a **new design version** (`_versions/reviews-2026/`) per the repo's versioning system (`CLAUDE.md`), not by mutating v1/v2/v4/v5. Stakeholders compare via `?v=reviews-2026`. Schema additions are additive (optional fields), so existing versions keep working.

### Current-state inventory (codebase)
- Schema: `convex/schema.ts:82-105` — `reviews` table, 1–5 scale, 6 category ratings, single `photo`, `pros`/`cons` (optional), `status`.
- Queries/mutations: `convex/reviews.ts` — `listReviews`, `listReviewsByProgram`, `getReview`, `createReview`, `updateReview`, `deleteReview`.
- `avgRating` computed client-side in `app/programs/[id]/page.tsx:34-41`.
- Review UI: `_components/ProgramReviews.tsx`; version variants `_versions/v1`, `v2`, `v4`, `v5` (v5 most polished).
- Existing sort: Recent / Highest / Lowest. Pagination: v1/v2 = 5/page numeric; v5 = "View all" lazy. No filtering beyond `published`.
- Admin CRUD: `app/admin/_components/ReviewsManager.tsx`. Mock data: `app/admin/create-listing/_components/AIGenerateButton.tsx:90-108`. No static seed file.

---

## Phase 1 — Summary, card cleanup, helpful (doc items 1–4)

**Backend (`convex/`)**
- Add optional fields to `reviews`: `helpfulCount: number`, `highlight: string`, `advice: string`, `identityTags: string[]`, `media: string[]` (supersedes single `photo`).
- Add `markHelpful` mutation (increment `helpfulCount`).
- Add `getReviewStats` query → `{ total, avg, distribution: {1..5 counts}, categoryAverages }` (replaces inline compute at `page.tsx:34-41`).

**Frontend (new version dir)**
1. **Rating display** — big number + 5 stars, "N reviews" badge. (item 1)
2. **Summary section** — `ReviewSummary2026.tsx`: (item 3)
   - Distribution histogram (5→1 with counts), **clickable** → sets a rating filter on the feed.
   - "Top categories": top 3 + "Show all 6 categories" toggle, ratings on the right of each bar.
   - CTA button ("Review this Program") lives here.
3. **Review card** — drop redundant program name (item 2); add **Helpful (N)** button wired to `markHelpful` (item 4).

---

## Phase 2 — AI review summary (doc item 5)

- Schema: add `aiSummary: { text, generatedAt, reviewCount }` to the **`programs`** table (per-program).
- Generation: a Convex **action** pulling all published reviews → LLM → one paragraph (positive + negative themes). Triggered at ≥10 new reviews / weekly.
- UI: card *below* the rating summary, with "AI-generated — read individual reviews for full context" disclaimer. Renders only at **≥10 reviews**.
- **Prototype shortcut (recommended):** store a seeded/hand-written `aiSummary` string first; wire real generation later.

---

## Phase TBD — Topic tags, filters, card redesign, load-more, sorting (doc items 6–10)

6. **Topic tags** — "Reviews mention" chips with counts, click-to-filter, replaces free-text search. Store `topicTags: [{label, count}]` on the program (prototype) rather than running NLP. Sentiment colors deferred. Appear at 10+ reviews.
7. **Sort & identity filter chips** — All / Has media / Solo travelers / First-timers / BIPOC / Women solo. Driven by `identityTags` on each review; a chip appears only if some review carries it; no counts shown. "Most helpful" stays in the *sort* dropdown, not the filter row (per doc note).
8. **Review card redesign** — `ReviewCard2026.tsx`:
   - Auto avatar (first-name initial), month+year date, 5-star rating with category dropdown.
   - Body split into **Highlight** + **Advice for future travellers** color-coded sections; rest behind "Read more."
   - Media as equal-size click-to-expand tiles; identity chips under media; Helpful button.
   - Transition: legacy free-text reviews render as-is (AI batch-split is a later nicety).
9. **Load more** — replace v1/v2 numeric pagination with "Showing X of N / Load 20 more."
10. **Sorting** — Most helpful (new default) / Most recent / Highest / Lowest.

---

## Suggested sequencing
1. Schema additions + stats query + `markHelpful` (foundation).
2. New version scaffold (`lib/design-versions.ts` entry, dir, switch case in `page.tsx`) + seed data with new fields.
3. Phase 1 UI.
4. Card redesign (item 8) + load-more + sorting (items 8–10).
5. Topic tags + identity filters (items 6–7).
6. AI summary (item 5) — seeded first, real generation last.

---

## Decisions needed before building
1. **Categories** — keep fixed 6 study-abroad categories, or make them **directory-type-specific** (mockup implies the latter)? Biggest schema fork.
2. **AI summary** — real LLM generation now, or seeded/mocked string for the demo?
3. **Topic tags** — real keyword extraction, or hand-seeded tag arrays for the prototype?

---

## Out of scope / notes from doc
- Gallery should be community content sourced mainly from reviews, but **must not live inside the review section** (per doc ***NOTES).
- Other tabs ("Section in Provider page", "submission form") are **not** covered here — this plan is the "Section in listing" tab only.

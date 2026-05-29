# Review 1–5 Scale Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the entire program-review rating system from a 1–10 scale to a native 1–5 star scale (data migrated by halving, input captures whole stars 1–5, display drops all divide-by-2 / divide-by-10 compensation).

**Architecture:** Ratings live natively on 1–5 in Convex after a one-time halving migration. The admin form and AI generation write 1–5. All display components render values directly (no scale mapping). Applies to all program-detail versions (default, v1, v2, v4, v5) + shared components.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Convex.

**Conventions for this plan:**
- No git commands are used (project rule). "Verify" steps replace commit steps.
- After each task, run `npx tsc --noEmit` and expect no new errors in the touched files.
- Spec reference: `docs/superpowers/specs/2026-05-29-review-1-5-scale-design.md`.

---

### Task 1: Schema comments + one-time migration mutation

**Files:**
- Modify: `convex/schema.ts:89-96`
- Modify: `convex/reviews.ts` (add new mutation)

- [ ] **Step 1: Update schema comments**

In `convex/schema.ts`, change the rating comments to reflect the new scale:
- Line ~89: `overallRating: v.number(), // 1–10` → `overallRating: v.number(), // 1–5`
- Line ~90: `// Category ratings (each 1–10)` → `// Category ratings (each 1–5)`

No field-type changes.

- [ ] **Step 2: Add the migration mutation**

In `convex/reviews.ts`, append a new mutation. Match the existing import/style at the top of the file (it already imports `mutation` from `./_generated/server`). Add:

```ts
// ONE-TIME migration: halve all review ratings to convert 1–10 → 1–5.
// NOT idempotent — run exactly once, then delete this mutation.
export const migrateRatingsTo5Scale = mutation({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").collect();
    let updated = 0;
    for (const r of reviews) {
      await ctx.db.patch(r._id, {
        overallRating: r.overallRating / 2,
        academicsRating: r.academicsRating / 2,
        livingSituationRating: r.livingSituationRating / 2,
        culturalImmersionRating: r.culturalImmersionRating / 2,
        programAdministrationRating: r.programAdministrationRating / 2,
        healthAndSafetyRating: r.healthAndSafetyRating / 2,
        communityRating: r.communityRating / 2,
      });
      updated++;
    }
    return { updated };
  },
});
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new type errors. Do NOT run the mutation yet — that happens in Task 9 after all display code is converted.

---

### Task 2: Admin review form (ReviewsManager)

**Files:**
- Modify: `app/admin/_components/ReviewsManager.tsx`

- [ ] **Step 1: Change default form values**

Around lines 23–29, the initial form state sets each rating to `10`. Change all seven to `5`:
```ts
overallRating: 5,
academicsRating: 5,
livingSituationRating: 5,
culturalImmersionRating: 5,
programAdministrationRating: 5,
healthAndSafetyRating: 5,
communityRating: 5,
```

- [ ] **Step 2: Change the seven labels**

For each label, replace `(1–10)` with `(1–5)`:
- `Overall Rating (1–10)` → `Overall Rating (1–5)`
- `Academics (1–10)` → `Academics (1–5)`
- `Living Situation (1–10)` → `Living Situation (1–5)`
- `Cultural Immersion (1–10)` → `Cultural Immersion (1–5)`
- `Program Administration (1–10)` → `Program Administration (1–5)`
- `Health &amp; Safety (1–10)` → `Health &amp; Safety (1–5)`
- `Community (1–10)` → `Community (1–5)`

- [ ] **Step 3: Change the seven number inputs**

Each rating `<input type="number" …>` currently has `min={1} max={10} step={0.5}`. For all seven, change to whole-star integers on the new scale:
- `max={10}` → `max={5}`
- `step={0.5}` → `step={1}`
- leave `min={1}` unchanged.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no new errors. Confirm via grep there is no residual `1–10` or `max={10}` in this file:
Run: `grep -n "1–10\|max={10}\|step={0.5}" "app/admin/_components/ReviewsManager.tsx"`
Expected: no output.

---

### Task 3: AI review generation

**Files:**
- Modify: `app/api/ai/generate/route.ts:59`
- Modify: `app/admin/create-listing/_components/AIGenerateButton.tsx:96,102-107`

- [ ] **Step 1: Update the AI prompt**

In `app/api/ai/generate/route.ts` line ~59, in the review `stepInstructions` string:
- `overallRating is a number 1-10 (lean towards 7-10 for authenticity)` → `overallRating is a number 1-5 (lean towards 4-5 for authenticity)`
- `The 6 category ratings (…) are each a number 1-10, slightly varied` → `… are each a number 1-5, slightly varied`

- [ ] **Step 2: Update the mock generator range**

In `app/admin/create-listing/_components/AIGenerateButton.tsx` line ~96:
```ts
const rating = Math.floor(Math.random() * 2) + 4; // 4–5
```

- [ ] **Step 3: Update the category clamps**

Lines ~102–107: change each `Math.min(10, …)` to `Math.min(5, …)`, keeping the existing jitter expressions:
```ts
mockData.academicsRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
mockData.livingSituationRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
mockData.culturalImmersionRating = Math.min(5, rating);
mockData.programAdministrationRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
mockData.healthAndSafetyRating = Math.min(5, rating);
mockData.communityRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
```

- [ ] **Step 4: Verify**

Run: `grep -n "1-10\|Math.min(10" "app/api/ai/generate/route.ts" "app/admin/create-listing/_components/AIGenerateButton.tsx"`
Expected: no output. Then `npx tsc --noEmit` — no new errors.

---

### Task 4: Shared display components

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx:34`
- Modify: `app/programs/[id]/_components/ProgramReviews.tsx:80,175-176,202`
- Modify: `app/programs/[id]/_components/WhyChooseProgram.tsx:~28-35`

- [ ] **Step 1: ProgramHero static rating**

Line 34: `const STATIC_RATING = "8.4 / 10";` → `const STATIC_RATING = "4.2 / 5";`

- [ ] **Step 2: ProgramReviews suffix**

Line ~80: `<span className="text-xs text-slate-400 font-normal">/10</span>` → `…>/5</span>`

- [ ] **Step 3: ProgramReviews star fill**

Lines ~175–176:
```tsx
const filled = avgRating >= star;
const half = !filled && avgRating >= star - 0.5;
```
(was `avgRating / 2 >= star` and `avgRating / 2 >= star - 0.5`.)

- [ ] **Step 4: ProgramReviews category bar width**

Line ~202: `style={{ width: `${(value / 10) * 100}%` }}` → `${(value / 5) * 100}%`.
Leave the lines ~250–255 category-average `* 10) / 10` rounding UNCHANGED — that is decimal rounding, not scale conversion.

- [ ] **Step 5: WhyChooseProgram suffix + star logic**

Lines ~28–35:
- `/10` suffix span → `/5`.
- `const starValue = star * 2;` → `const starValue = star;`
- `const filled = rating >= starValue;` stays.
- `const half = !filled && rating >= starValue - 1;` → `const half = !filled && rating >= starValue - 0.5;`

- [ ] **Step 6: Verify**

Run: `grep -rn "/10\|/ 10\|avgRating / 2\|star \* 2\|/ 10) \* 100" app/programs/\[id\]/_components/ProgramHero.tsx app/programs/\[id\]/_components/ProgramReviews.tsx app/programs/\[id\]/_components/WhyChooseProgram.tsx`
Expected: no output. Then `npx tsc --noEmit`.

---

### Task 5: Version v1 components

**Files:**
- Modify: `app/programs/[id]/_versions/v1/TrustBar.tsx:34`
- Modify: `app/programs/[id]/_versions/v1/ReviewsSection.tsx:205,223,355`

- [ ] **Step 1: v1 TrustBar suffix**

Line 34: `const ratingValue = avgRating > 0 ? `${avgRating.toFixed(1)} / 10` : "N/A";` → `… / 5` …

- [ ] **Step 2: v1 ReviewsSection star fill**

Line ~205: `avgRating / 2 >= star` → `avgRating >= star`.

- [ ] **Step 3: v1 ReviewsSection category bar widths**

- Line ~223: `${(cat.avg / 10) * 100}%` → `${(cat.avg / 5) * 100}%`.
- Line ~355: `${((cat.value ?? 0) / 10) * 100}%` → `${((cat.value ?? 0) / 5) * 100}%`.

- [ ] **Step 4: Verify**

Run: `grep -rn "/10\|/ 10\|avgRating / 2\|/ 10) \* 100" app/programs/\[id\]/_versions/v1/TrustBar.tsx app/programs/\[id\]/_versions/v1/ReviewsSection.tsx`
Expected: no output. Then `npx tsc --noEmit`.

---

### Task 6: Version v2 components

**Files:**
- Modify: `app/programs/[id]/_versions/v2/ReviewsSection.tsx:205,223,355`

- [ ] **Step 1: v2 ReviewsSection star fill**

Line ~205: `avgRating / 2 >= star` → `avgRating >= star`.

- [ ] **Step 2: v2 ReviewsSection category bar widths**

- Line ~223: `${(cat.avg / 10) * 100}%` → `${(cat.avg / 5) * 100}%`.
- Line ~355: `${((cat.value ?? 0) / 10) * 100}%` → `${((cat.value ?? 0) / 5) * 100}%`.

- [ ] **Step 3: Verify**

Run: `grep -rn "/ 10) \* 100\|avgRating / 2" app/programs/\[id\]/_versions/v2/ReviewsSection.tsx`
Expected: no output. Then `npx tsc --noEmit`.

Note: v2 ReviewsSection has no `/10` text suffix to change (verify by inspection); only the star-fill and bar-width math.

---

### Task 7: Version v4 (remove normalization heuristic)

**Files:**
- Modify: `app/programs/[id]/_versions/v4/InquiryReviews.tsx:102,111`

- [ ] **Step 1: Remove the avgRating normalization**

Line ~102, replace:
```tsx
// Normalize rating: if the scale is out of 10, convert to out of 5
const normalizedRating = avgRating > 5 ? avgRating / 2 : avgRating;
```
with:
```tsx
const normalizedRating = avgRating;
```
(Keep the `normalizedRating` variable name so downstream usages stay valid.)

- [ ] **Step 2: Remove the per-review normalization**

Line ~111, replace:
```tsx
rating: r.overallRating > 5 ? r.overallRating / 2 : r.overallRating,
```
with:
```tsx
rating: r.overallRating,
```

- [ ] **Step 3: Verify**

Run: `grep -n "> 5 ?\|/ 2" app/programs/\[id\]/_versions/v4/InquiryReviews.tsx`
Expected: no output. Then `npx tsc --noEmit`.

---

### Task 8: Version v5 components

**Files:**
- Modify: `app/programs/[id]/_versions/v5/V5TrustBar.tsx:34`
- Modify: `app/programs/[id]/_versions/v5/V5Reviews.tsx:105-113,172,180,240,381,471`

- [ ] **Step 1: V5TrustBar suffix**

Line 34: `const ratingValue = avgRating > 0 ? `${avgRating.toFixed(1)} / 10` : "N/A";` → `… / 5` …

- [ ] **Step 2: V5Reviews headline suffix**

Line ~172: `<span className="text-2xl sm:text-3xl font-bold text-slate-400 ml-1">/10</span>` → `…>/5</span>`

- [ ] **Step 3: V5Reviews star fill**

Line ~180: `avgRating / 2 >= star` → `avgRating >= star`.

- [ ] **Step 4: V5Reviews distribution buckets**

Lines ~105–113, replace the 2-wide bucket logic with integer-star buckets on 1–5:
```tsx
const distribution = [5, 4, 3, 2, 1].map((stars) => {
  const label = `${stars}`;
  const count = reviewList.filter(
    (r) =>
      typeof r.overallRating === "number" &&
      Math.round(r.overallRating) === stars
  ).length;
  // (keep whatever `bar`/return shape the existing code uses for each bucket)
```
Preserve the rest of the existing `.map` body (the `bar` color and returned object) exactly as-is; only the `min`/`max`/`label`/`count` derivation changes. The `label` is now a single star number rather than a `min–max` range.

- [ ] **Step 5: V5Reviews category bar widths (3 spots)**

- Line ~240: `${(cat.avg / 10) * 100}%` → `${(cat.avg / 5) * 100}%`.
- Line ~381: `${((cat.value ?? 0) / 10) * 100}%` → `${((cat.value ?? 0) / 5) * 100}%`.
- Line ~471: `${((cat.value as number) / 10) * 100}%` → `${((cat.value as number) / 5) * 100}%`.

- [ ] **Step 6: Verify**

Run: `grep -rn "/10\|/ 10\|avgRating / 2\|/ 10) \* 100\|stars \* 2" app/programs/\[id\]/_versions/v5/V5TrustBar.tsx app/programs/\[id\]/_versions/v5/V5Reviews.tsx`
Expected: no output. Then `npx tsc --noEmit`.

---

### Task 9: Run migration + full verification

**Files:** none (operational task)

- [ ] **Step 1: Repo-wide residual scan**

Run: `grep -rn "/ 10) \* 100\|avgRating / 2\|rating / 2\|star \* 2\|stars \* 2" app/programs components`
Also: `grep -rn ">/10<\|/ 10\b\|/10\b" app/programs/\[id\]`
Expected: no review-rating matches remain (ignore unrelated marketplace/brand hits if any surface).

- [ ] **Step 2: Type-check the whole app**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run the one-time data migration**

Run: `npx convex run reviews:migrateRatingsTo5Scale`
Expected: returns `{ updated: <N> }` where N is the number of reviews. Run EXACTLY ONCE.

- [ ] **Step 4: Spot-check each version visually**

Start the dev server and load a program with reviews at `?v=v1`, `?v=v2`, `?v=v4`, `?v=v5`, and default. Confirm:
- Aggregate rating reads `X.X / 5`.
- Star rows fill correctly (e.g. a 4.5 average shows 4½ of 5 stars, not 2).
- Category bars are proportional to the new scale (a 4.5/5 fills ~90%).
- Admin form (`/admin`) creating a review accepts whole stars 1–5 and renders correctly.

- [ ] **Step 5: Delete the migration mutation**

Remove `migrateRatingsTo5Scale` from `convex/reviews.ts` so it cannot be re-run accidentally. Run `npx tsc --noEmit` to confirm the file is still valid.

---

## Self-Review notes

- **Spec coverage:** schema comments (T1), migration (T1/T9), admin form (T2), AI prompt + mock (T3), all `/10` suffixes (T2/T4/T5/T8), star-fill divide-by-2 removal (T4/T5/T6/T8), category bar `/10` (T4/T5/T6/T8), V5 distribution buckets (T8), V4 heuristic removal (T7). All spec touch points mapped.
- **Ordering:** display code (T2–T8) is converted before the data migration runs (T9 Step 3), so the app is never showing halved data through divide-by-2 logic.
- **Type consistency:** `normalizedRating` variable name preserved in T7; `migrateRatingsTo5Scale` name consistent across T1 and T9.

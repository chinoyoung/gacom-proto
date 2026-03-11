# Program Page Design Critique Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement design critique feedback to reduce redundancy, simplify CTAs, and improve consistency on the program detail page.

**Architecture:** Remove the duplicated ProgramDetails card grid, reduce hero CTAs to just "Apply Now" + "Save", apply consistent button hierarchy (primary/secondary/tertiary) across all CTA surfaces, and fix minor layout/accessibility issues.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Lucide icons

---

## Chunk 1: Remove ProgramDetails Card Grid & Add Age Requirement to QuickDetails

### Task 1: Add Age Requirement cell to QuickDetails sidebar

**Files:**
- Modify: `app/programs/[id]/_components/QuickDetails.tsx:220-293` (cells array)

- [ ] **Step 1: Add a ShieldIcon component to QuickDetails.tsx**

Add after the existing CertificateIcon component (around line 164), before the GridCell component:

```tsx
function ShieldIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Add Age Requirement cell to the cells array**

Insert after the Housing cell (after line 274) and before the Language cell in QuickDetails.tsx:

```tsx
{
  icon: <ShieldIcon />,
  label: "Age Requirement",
  value: program.ageRequirement ?? "Age Requirement Varies",
  fullWidth: true,
},
```

- [ ] **Step 3: Verify the app compiles**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds or only pre-existing warnings

- [ ] **Step 4: Commit**

```bash
git add app/programs/[id]/_components/QuickDetails.tsx
git commit -m "feat: add age requirement to QuickDetails sidebar"
```

### Task 2: Remove ProgramDetails component from page

**Files:**
- Modify: `app/programs/[id]/page.tsx:15,383-385` (remove import and usage)
- Delete: `app/programs/[id]/_components/ProgramDetails.tsx`

- [ ] **Step 1: Remove ProgramDetails import from page.tsx**

Remove line 15:
```tsx
import ProgramDetails from "./_components/ProgramDetails";
```

- [ ] **Step 2: Remove ProgramDetails from the render tree in page.tsx**

In the full-width sections div (around line 383-385), remove:
```tsx
{/* 3. Program Details — structured facts */}
<ProgramDetails program={program} />
```

- [ ] **Step 3: Delete ProgramDetails.tsx**

```bash
rm app/programs/[id]/_components/ProgramDetails.tsx
```

- [ ] **Step 4: Verify the app compiles**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: remove duplicated ProgramDetails card grid"
```

---

## Chunk 2: Reduce Hero CTAs

### Task 3: Simplify ProgramHero CTAs to "Apply Now" + "Save" only

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx:139-195` (CTAs section)

- [ ] **Step 1: Replace the hero CTAs block**

Replace the entire CTAs section (lines 139-195) with just "Apply Now" + "Save":

```tsx
{/* CTAs */}
<div className="flex flex-wrap items-center gap-3 pt-1">
  {program.applyUrl ? (
    <a
      href={program.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
    >
      Apply Now
    </a>
  ) : (
    <button
      type="button"
      className="inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
    >
      Apply Now
    </button>
  )}

  <button
    type="button"
    onClick={() => setSaved((v) => !v)}
    className={`inline-flex justify-center items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2 ${
      saved
        ? "bg-cobalt-50 border-cobalt-300 text-cobalt-600"
        : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
    }`}
    aria-label={saved ? "Unsave program" : "Save program"}
  >
    <Bookmark
      className="w-4 h-4"
      fill={saved ? "currentColor" : "none"}
      strokeWidth={2}
    />
    {saved ? "Saved" : "Save"}
  </button>
</div>
```

- [ ] **Step 2: Remove unused imports from ProgramHero.tsx**

The `ExternalLink` import from lucide-react is no longer used in hero CTAs. However, check if it's used elsewhere in the file first. If the `ExternalLink` icon is not used anywhere else in ProgramHero.tsx, remove it from the import line (line 5):

Change:
```tsx
import { Bookmark, CheckCircle, MapPin, Calendar, Coins, Clock, ExternalLink, Expand } from "lucide-react";
```
To:
```tsx
import { Bookmark, CheckCircle, MapPin, Calendar, Coins, Clock, Expand } from "lucide-react";
```

- [ ] **Step 3: Verify the app compiles**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "feat: simplify hero CTAs to Apply Now + Save only"
```

---

## Chunk 3: Button Style Consistency

### Task 4: Apply button hierarchy to sticky header CTAs

**Files:**
- Modify: `app/programs/[id]/page.tsx:75-131` (StickyProgramHeader CTAs)

The sticky header should use consistent button hierarchy:
- **Primary** (cobalt filled): "Apply Now"
- **Secondary** (cobalt outlined): "Inquire"
- **Tertiary** (text link): "Visit Website"

- [ ] **Step 1: Restyle sticky header CTAs**

Replace the CTAs div (lines 76-131) with the new hierarchy:

```tsx
{/* Right: CTAs — button hierarchy */}
<div className="flex items-center gap-3 shrink-0">
  {program.applyUrl && (
    <a
      href={program.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt-600 hover:text-cobalt-700 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
    >
      Visit Website
      <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
    </a>
  )}

  <button
    type="button"
    className="inline-flex justify-center items-center px-5 py-2 border-2 border-cobalt-500 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
  >
    Inquire
  </button>

  {program.applyUrl ? (
    <a
      href={program.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex justify-center items-center px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
    >
      Apply Now
    </a>
  ) : (
    <button
      type="button"
      className="inline-flex justify-center items-center px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
    >
      Apply Now
    </button>
  )}

  <button
    type="button"
    onClick={onToggleSave}
    className={`inline-flex justify-center items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2 ${
      saved
        ? "bg-cobalt-50 border-cobalt-300 text-cobalt-600"
        : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
    }`}
    aria-label={saved ? "Unsave program" : "Save program"}
  >
    <Bookmark
      className="w-4 h-4"
      fill={saved ? "currentColor" : "none"}
      strokeWidth={2}
    />
    {saved ? "Saved" : "Save"}
  </button>
</div>
```

- [ ] **Step 2: Verify the app compiles**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/programs/[id]/page.tsx
git commit -m "feat: apply button hierarchy to sticky header CTAs"
```

### Task 5: Normalize CTA labels — "Send Inquiry" → "Inquire"

**Files:**
- Modify: `app/programs/[id]/page.tsx:146` (MobileStickyBar)
- Modify: `app/programs/[id]/_components/QuickDetails.tsx:340-345` (sidebar CTA)

- [ ] **Step 1: Update MobileStickyBar label**

In page.tsx, MobileStickyBar component (line 146), change:
```tsx
Send Inquiry
```
To:
```tsx
Inquire
```

- [ ] **Step 2: Update QuickDetails sidebar CTA label**

In QuickDetails.tsx (line 343), change:
```tsx
Send Inquiry
```
To:
```tsx
Inquire
```

- [ ] **Step 3: Verify the app compiles**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add app/programs/[id]/page.tsx app/programs/[id]/_components/QuickDetails.tsx
git commit -m "feat: normalize inquiry CTA labels to 'Inquire'"
```

### Task 6: Style QuickDetails sidebar buttons with consistent hierarchy

**Files:**
- Modify: `app/programs/[id]/_components/QuickDetails.tsx:321-345` (CTA buttons)

The sidebar should match the button hierarchy:
- "Apply Now" = primary (cobalt filled) — already correct
- "Inquire" = secondary (cobalt outlined with border-2)

- [ ] **Step 1: Update the Inquire button style in QuickDetails**

In QuickDetails.tsx (around line 340-344), change the Inquire button:

From:
```tsx
<button
  type="button"
  className="w-full py-2.5 text-sm font-semibold text-cobalt-600 border border-cobalt-500 hover:bg-cobalt-50 rounded-lg transition-colors"
>
```
To:
```tsx
<button
  type="button"
  className="w-full py-2.5 text-sm font-semibold text-cobalt-600 border-2 border-cobalt-500 hover:bg-cobalt-50 rounded-lg transition-colors cursor-pointer"
>
```

- [ ] **Step 2: Commit**

```bash
git add app/programs/[id]/_components/QuickDetails.tsx
git commit -m "feat: apply consistent button hierarchy to QuickDetails sidebar"
```

---

## Chunk 4: Minor Fixes

### Task 7: Fix RelatedPrograms layout for 2 results

**Files:**
- Modify: `app/programs/[id]/_components/RelatedPrograms.tsx:44`

- [ ] **Step 1: Make grid responsive to result count**

In RelatedPrograms.tsx, change the grid container (line 44) to adapt columns based on result count:

From:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
```
To:
```tsx
<div className={`grid grid-cols-1 sm:grid-cols-2 ${relatedPrograms.length >= 3 ? "lg:grid-cols-3" : ""} gap-8`}>
```

This keeps the grid at 2 columns on large screens when only 2 results exist.

- [ ] **Step 2: Commit**

```bash
git add app/programs/[id]/_components/RelatedPrograms.tsx
git commit -m "fix: adapt related programs grid to result count"
```

### Task 8: Improve star rating badge contrast

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx:90-94` (rating badge)

- [ ] **Step 1: Darken the rating badge text for AA contrast**

In ProgramHero.tsx, update the star rating badge (around line 90-93):

From:
```tsx
<div className="flex items-center gap-1.5 bg-sun-50 text-sun-700 text-xs font-semibold px-3 py-1 rounded-full border border-sun-100">
  <span className="text-sun-600" aria-hidden="true">★</span>
  <span>{STATIC_RATING}</span>
  <span className="font-normal text-sun-400">/ {STATIC_REVIEW_COUNT} reviews</span>
</div>
```
To:
```tsx
<div className="flex items-center gap-1.5 bg-sun-50 text-sun-800 text-xs font-semibold px-3 py-1 rounded-full border border-sun-200">
  <span className="text-sun-600" aria-hidden="true">★</span>
  <span>{STATIC_RATING}</span>
  <span className="font-normal text-sun-600">/ {STATIC_REVIEW_COUNT} reviews</span>
</div>
```

Key changes: `text-sun-700` → `text-sun-800`, `text-sun-400` → `text-sun-600`, `border-sun-100` → `border-sun-200` for better contrast.

- [ ] **Step 2: Also update the sticky header rating for consistency**

In page.tsx, StickyProgramHeader (around line 68-72), the rating is already using `text-sun-700` and `text-slate-400`. Update:

From:
```tsx
<span className="text-slate-400 font-normal">· {STICKY_REVIEW_COUNT} reviews</span>
```
To:
```tsx
<span className="text-slate-500 font-normal">· {STICKY_REVIEW_COUNT} reviews</span>
```

- [ ] **Step 3: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx app/programs/[id]/page.tsx
git commit -m "fix: improve star rating badge contrast for accessibility"
```

### Task 9: Update hero skeleton to match simplified 2-button CTA layout

**Files:**
- Modify: `app/programs/[id]/page.tsx:436-440` (skeleton CTA row in ProgramHeroSkeleton)

- [ ] **Step 1: Reduce skeleton CTA placeholders from 3 to 2**

In ProgramHeroSkeleton (around line 436-439), change:
```tsx
<div className="flex flex-wrap items-center gap-3 pt-1">
  <div className="h-10 bg-slate-200 rounded-lg w-36" />
  <div className="h-10 bg-slate-200 rounded-lg w-32" />
  <div className="h-10 bg-slate-200 rounded-lg w-28" />
</div>
```
To:
```tsx
<div className="flex flex-wrap items-center gap-3 pt-1">
  <div className="h-10 bg-slate-200 rounded-lg w-32" />
  <div className="h-10 bg-slate-200 rounded-lg w-24" />
</div>
```

- [ ] **Step 2: Commit**

```bash
git add app/programs/[id]/page.tsx
git commit -m "fix: update hero skeleton to match simplified 2-button CTA layout"
```

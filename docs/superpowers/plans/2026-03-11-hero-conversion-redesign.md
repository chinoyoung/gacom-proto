# Hero Conversion Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign ProgramHero into a card-style conversion hero with a 2-column fact grid, financial emphasis, and elevated Inquire CTA.

**Architecture:** Single-file refactor of `ProgramHero.tsx`. The layout changes from a horizontal facts strip to a 2-column fact grid. CTAs are restructured (Inquire added, Save becomes icon-only). Photo grid becomes conditional. No schema or type changes needed.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS v4, Lucide React icons

**Spec:** `docs/superpowers/specs/2026-03-11-hero-conversion-redesign.md`

---

## Chunk 1: Core Hero Refactor

### Task 1: Update imports and fact data structure

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx:1-66`

- [ ] **Step 1: Add new Lucide imports**

Update the import line to include `GraduationCap`, `Award`, and `Mail`:

```tsx
import { Bookmark, CheckCircle, MapPin, Calendar, Coins, Clock, Expand, GraduationCap, Award, Mail } from "lucide-react";
```

- [ ] **Step 2: Add `emphasized` flag to FactItem interface**

```tsx
interface FactItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasized?: boolean;
}
```

Remove the `urgent` field — it is no longer used.

- [ ] **Step 3: Restructure fact building into left/right columns**

Replace the existing facts array construction (lines 29-66) with two separate arrays:

```tsx
// Build left-column facts
const leftFacts: FactItem[] = [
  {
    key: "location",
    icon: <MapPin className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
    label: "Location",
    value: `${program.city}, ${program.country}`,
  },
];

if (program.terms.length > 0) {
  leftFacts.push({
    key: "terms",
    icon: <Calendar className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
    label: "Terms",
    value: program.terms
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
      .join(" · "),
  });
}

if (program.duration) {
  leftFacts.push({
    key: "duration",
    icon: <Clock className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
    label: "Duration",
    value: program.duration,
  });
}

// Build right-column facts
const rightFacts: FactItem[] = [];

if (program.cost) {
  rightFacts.push({
    key: "cost",
    icon: <Coins className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
    label: "Cost",
    value: program.cost,
    emphasized: true,
  });
}

if (program.educationLevels.length > 0) {
  rightFacts.push({
    key: "education",
    icon: <GraduationCap className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
    label: "Education Level",
    value: program.educationLevels
      .map((l) => l.charAt(0).toUpperCase() + l.slice(1).replace(/_/g, " "))
      .join(", "),
  });
}

if (program.creditsAvailable) {
  rightFacts.push({
    key: "credits",
    icon: <Award className="w-4 h-4 text-cobalt-500" aria-hidden="true" />,
    label: "Credits",
    value: program.creditsAvailable,
  });
}
```

- [ ] **Step 4: Verify build compiles**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -20`

Note: Build may have warnings from unused `leftFacts`/`rightFacts` at this point — that's expected until the template is updated in Task 2.

- [ ] **Step 5: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "refactor: restructure hero fact data into left/right columns"
```

---

### Task 2: Replace facts strip with 2-column fact grid

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx` (the JSX template, key facts section around lines 118-136)

- [ ] **Step 1: Replace the key facts strip JSX**

Remove the existing `{/* Key facts strip */}` section (the `<div className="py-3 border-y border-slate-200">` block with the `<ul>` inside it).

Replace with a 2-column fact grid:

```tsx
{/* Fact grid */}
<div className="py-3 border-y border-slate-200">
  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
    {/* Left column */}
    <div className="flex flex-col gap-3">
      {leftFacts.map((fact, idx) => (
        <div key={fact.key} className={`flex items-start gap-2 ${idx > 0 ? "pt-3 border-t border-slate-200" : ""}`}>
          <div className="mt-0.5 shrink-0">{fact.icon}</div>
          <div>
            <p className="text-xs text-slate-500">{fact.label}</p>
            <p className="text-sm font-semibold text-slate-700">{fact.value}</p>
          </div>
        </div>
      ))}
    </div>
    {/* Right column */}
    {rightFacts.length > 0 && (
      <div className="flex flex-col gap-3">
        {rightFacts.map((fact, idx) => (
          <div key={fact.key} className={`flex items-start gap-2 ${idx > 0 ? "pt-3 border-t border-slate-200" : ""}`}>
            <div className="mt-0.5 shrink-0">{fact.icon}</div>
            <div>
              <p className="text-xs text-slate-500">{fact.label}</p>
              <p className={fact.emphasized ? "text-base font-bold text-slate-900" : "text-sm font-semibold text-slate-700"}>
                {fact.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
```

- [ ] **Step 2: Verify visually**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npm run dev`

Open a program detail page in the browser. Verify:
- Fact grid shows 2 columns
- Cost appears bolder/larger than other values
- Labels are muted, values are semibold
- Row borders separate facts vertically

- [ ] **Step 3: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "feat: replace hero facts strip with 2-column fact grid"
```

---

### Task 3: Restructure CTAs (Add Inquire, icon-only Save, mobile-responsive)

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx` (the CTAs section)

- [ ] **Step 1: Replace the CTAs section**

Remove the existing `{/* CTAs */}` section. Replace with a mobile-responsive layout that stacks on small screens:

```tsx
{/* CTAs */}
<div className="flex items-center gap-3 pt-1">
  <div className="flex flex-col sm:flex-row flex-1 sm:flex-none gap-3">
    {/* Apply Now */}
    {program.applyUrl ? (
      <a
        href={program.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
      >
        Apply Now
      </a>
    ) : (
      <button
        type="button"
        className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
      >
        Apply Now
      </button>
    )}

    {/* Inquire */}
    {program.contactEmail ? (
      <a
        href={`mailto:${program.contactEmail}`}
        className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-5 py-2.5 bg-white border border-cobalt-300 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2"
      >
        <Mail className="w-4 h-4" />
        Inquire
      </a>
    ) : (
      <button
        type="button"
        onClick={() => {
          document.getElementById("quick-details")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="w-full sm:w-auto inline-flex justify-center items-center gap-1.5 px-5 py-2.5 bg-white border border-cobalt-300 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2"
      >
        <Mail className="w-4 h-4" />
        Inquire
      </button>
    )}
  </div>

  {/* Save — icon only */}
  <button
    type="button"
    onClick={() => setSaved((v) => !v)}
    className={`inline-flex justify-center items-center w-10 h-10 shrink-0 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 focus-visible:ring-offset-2 ${
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
  </button>
</div>
```

Key details:
- `w-full sm:w-auto` on Apply Now and Inquire makes them stack full-width on mobile, inline on sm+
- Inner `flex-col sm:flex-row` wrapper handles the stacking
- Save has `shrink-0` to prevent squishing on mobile
- Inquire fallback (no contactEmail) scrolls to `#quick-details` section. The QuickDetails component needs an `id="quick-details"` attribute — add it in Task 4 if not already present.

- [ ] **Step 2: Verify visually**

Check the hero in the browser at both desktop and mobile widths:
- Desktop: three actions on one row — Apply Now (blue fill), Inquire (outlined with mail icon), Save (icon-only square)
- Mobile (~375px): Apply Now and Inquire stack full-width, Save sits to the right
- Inquire links to mailto if contactEmail exists, scrolls to sidebar otherwise
- Save toggle still works (filled/unfilled icon)

- [ ] **Step 3: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "feat: add Inquire CTA to hero, icon-only Save, mobile-responsive layout"
```

---

### Task 4: Update layout widths and make photo grid conditional

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx` (layout wrapper and photo column)

- [ ] **Step 1: Update left column max-width**

Change `lg:max-w-[55%]` to `lg:max-w-[60%]` on the left column div.

- [ ] **Step 2: Make photo column conditional**

Wrap the right column (photo grid) in a conditional that only renders when `allPhotos.length > 0`:

```tsx
{/* Right: photo grid — only when photos exist */}
{allPhotos.length > 0 && (
  <div className="w-full lg:w-[40%] shrink-0 mt-6 lg:mt-0">
    <div className="h-48 sm:h-64 lg:h-96 rounded-xl overflow-hidden shadow-sm border border-slate-200/60">
      <PhotoGrid photos={allPhotos} title={program.title} onPhotoClick={setLightboxIdx} />
    </div>
  </div>
)}
```

Note the height changes: `h-60 sm:h-80` → `h-48 sm:h-64` for mobile/tablet. Desktop `lg:h-96` stays the same.

Also change the right column width from `lg:w-[45%]` to `lg:w-[40%]`.

- [ ] **Step 3: Remove PhotoGrid empty gradient placeholder**

In the `PhotoGrid` component, remove the `photos.length === 0` branch that returns the gradient div:

```tsx
// REMOVE this block:
if (photos.length === 0) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-cobalt-700 to-cobalt-500 rounded-xl" />
  );
}
```

Since the parent no longer renders PhotoGrid when there are no photos, this code path is unreachable. Remove it entirely.

- [ ] **Step 4: Verify visually**

Check in browser:
- Program WITH photos: two-column layout, photo grid at ~40% width, shorter on mobile
- Program WITHOUT photos (or test by temporarily emptying photos): left column takes full width, no photo section rendered

- [ ] **Step 5: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "feat: conditional photo grid and updated layout widths"
```

---

## Chunk 2: Skeleton and Cleanup

### Task 5: Update skeleton loader

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx` (ProgramHeroSkeleton function)

- [ ] **Step 1: Replace the ProgramHeroSkeleton**

Replace the entire `ProgramHeroSkeleton` function with:

```tsx
export function ProgramHeroSkeleton() {
  return (
    <section className="bg-slate-100 border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
          {/* Left Column Skeleton */}
          <div className="flex-1 min-w-0 lg:max-w-[60%] flex flex-col gap-4">
            {/* Provider + trust badges */}
            <div>
              <div className="h-3.5 bg-slate-200 rounded w-24 mb-3" />
              <div className="flex items-center gap-2">
                <div className="h-6 bg-slate-100 rounded-full w-24" />
                <div className="h-6 bg-slate-100 rounded-full w-20" />
              </div>
            </div>

            {/* Logo + title */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />
              <div className="flex-1">
                <div className="h-9 bg-slate-200 rounded w-[85%] mb-3" />
                <div className="h-5 bg-slate-100 rounded w-full" />
              </div>
            </div>

            {/* Fact grid skeleton */}
            <div className="py-3 border-y border-slate-200">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-4">
                  {[80, 64, 56].map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded shrink-0 mt-0.5" />
                      <div>
                        <div className="h-3 bg-slate-100 rounded w-12 mb-1.5" />
                        <div className="h-4 bg-slate-200 rounded" style={{ width: w }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {[72, 60, 48].map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded shrink-0 mt-0.5" />
                      <div>
                        <div className="h-3 bg-slate-100 rounded w-12 mb-1.5" />
                        <div className="h-4 bg-slate-200 rounded" style={{ width: w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA skeleton */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="h-10 bg-slate-200 rounded-lg w-32" />
              <div className="h-10 bg-slate-200 rounded-lg w-28" />
              <div className="h-10 w-10 bg-slate-200 rounded-lg" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="w-full lg:w-[40%] shrink-0 mt-6 lg:mt-0">
            <div className="h-48 sm:h-64 lg:h-96 rounded-xl bg-slate-100 overflow-hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify skeleton visually**

Reload the program page (skeleton flashes briefly while data loads). Or temporarily add a delay to verify the skeleton matches the new layout structure.

- [ ] **Step 3: Commit**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "feat: update hero skeleton to match new fact grid layout"
```

---

### Task 6: Final cleanup and verification

**Files:**
- Modify: `app/programs/[id]/_components/ProgramHero.tsx`

- [ ] **Step 1: Remove unused imports**

Check if `Link` from `next/link` is still used. If not, remove it from imports.

- [ ] **Step 2: Run build to verify no errors**

Run: `cd /Users/chinoyoung/Code/gacom-proto && npx next build --no-lint 2>&1 | tail -20`

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Visual regression check**

Open the program detail page in the browser and verify the full hero:
- Desktop: two-column layout, fact grid with 6 cells, cost emphasized, 3 CTAs, photo grid
- Mobile: single column, stacked CTAs, shorter photo grid
- Save toggle works
- Lightbox still works when clicking photos
- Skeleton matches layout structure

- [ ] **Step 4: Commit final cleanup**

```bash
git add app/programs/[id]/_components/ProgramHero.tsx
git commit -m "chore: cleanup unused imports in ProgramHero"
```

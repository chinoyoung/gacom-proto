# Landing Page UX Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe `app/page.tsx` from an engineering-style file tree into a stakeholder review hub by removing dead content, dropping redundant headings, simplifying `ModuleListItem`, fixing the mobile fold, and rewriting module copy as reviewer prompts.

**Architecture:** Single-file edit. No new components, no new dependencies, no schema changes. The page already follows the project's design language (cobalt/slate palette, standard Tailwind, brand tokens) — this plan only deletes and rewrites within `app/page.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, lucide-react.

**Spec:** `docs/superpowers/specs/2026-04-28-landing-page-ux-rework-design.md`

**Operating notes:**
- Per the project's global CLAUDE.md, the executing agent cannot run `git commit`/`push`/`reset`/`fetch`/`pull`. When you reach a "Commit" step, **stop and ask the user to commit**. Do not batch work across commit boundaries.
- Design rules (from project CLAUDE.md): standard Tailwind, brand tokens only (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`, `slate-*`), no inline hex, mobile-first, simple/clean (no overused gradients, heavy shadows, very large rounded corners, oversized buttons).
- This is a UI/copy change. There are no unit tests to write — verification is `npm run lint`, `npm run build`, and a dev-server eyeball check on desktop + a 390px viewport.

---

## File Structure

**Modified files:**
- `app/page.tsx` — every change in this plan lands here.

**Files NOT touched:**
- `components/AdminHeader.tsx`, `components/AdminFooter.tsx` — chrome stays as-is.
- `app/globals.css` — palette unchanged.
- No other file is touched. If you find yourself opening another file, stop and re-read the spec.

---

## Task 1: Remove the Articles & Content card and the inline footer section

**Why:** Two structural deletions. Articles is a dead `href="#"` with `opacity-60 grayscale cursor-not-allowed` that reads as a bug. The inline "Footer Branding" `<section>` duplicates `AdminFooter` and stacks two footers below the module list.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Remove the `FileText` import**

In `app/page.tsx` line 2, change:

```tsx
import { Globe, ArrowRight, LayoutDashboard, PenTool, FileText, Handshake } from 'lucide-react';
```

to:

```tsx
import { Globe, ArrowRight, LayoutDashboard, PenTool, Handshake } from 'lucide-react';
```

- [ ] **Step 2: Remove the Articles & Content `<ModuleListItem>`**

In `app/page.tsx`, delete this block (currently lines 56–62):

```tsx
<ModuleListItem
  href="#"
  icon={FileText}
  title="Articles & Content"
  description="Editorial management system for travel guides and participant resources."
  isDraft
/>
```

The `space-y-4` container around the remaining three prototype cards (`Program Directory`, `Create Listing`, `Partner Marketplace`) stays unchanged.

- [ ] **Step 3: Remove the inline "Footer Branding" `<section>`**

In `app/page.tsx`, delete the entire block (currently lines 82–99):

```tsx
{/* Footer Branding */}
<section className="py-12 border-t border-slate-100 bg-white">
  <div className="max-w-5xl mx-auto px-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
          <span className="font-bold text-xs text-slate-400">GA</span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          Restricted Engineering Environment
        </p>
      </div>
      <p className="text-xs text-slate-300 font-medium italic">
        Property of GoAbroad.com
      </p>
    </div>
  </div>
</section>
```

After deletion, the closing `</div>` for `min-h-[calc(100vh-5rem)] bg-white` should sit directly above `<AdminFooter />`.

- [ ] **Step 4: Verify the page still renders**

Run: `npm run dev`
Open: `http://localhost:3000/`
Expected:
- No "Articles & Content" card.
- Three prototype cards: Program Directory, Create Listing, Partner Marketplace.
- Admin section still present below.
- Only one footer ("Gacom Proto Admin / © 2026 GoAbroad.com") below the module list. The "Restricted Engineering Environment" / "Property of GoAbroad.com" block is gone.
- No console errors, no TypeScript errors.

- [ ] **Step 5: Commit**

Stop and ask the user to commit with this message:

```
refactor(landing): remove Articles card and duplicate footer section
```

---

## Task 2: Simplify `ModuleListItem` — remove `tag` and `isDraft` props

**Why:** With Articles gone there are no `isDraft` consumers, and per the spec we're not surfacing per-module status, so no card uses `tag` either. The `cursor-not-allowed`/`grayscale`/disabled-link branches become dead code. `isPrimary` stays — Program Directory still gets the cobalt-filled icon.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Remove the `tag="Beta"` from the Program Directory call site**

In `app/page.tsx`, change:

```tsx
<ModuleListItem
  href="/programs"
  icon={Globe}
  title="Program Directory"
  description="A modernized search and discovery engine for global study abroad programs."
  tag="Beta"
  isPrimary
/>
```

to (removing the `tag="Beta"` line — `description` will be rewritten in Task 4, leave it as-is for now):

```tsx
<ModuleListItem
  href="/programs"
  icon={Globe}
  title="Program Directory"
  description="A modernized search and discovery engine for global study abroad programs."
  isPrimary
/>
```

- [ ] **Step 2: Remove the `tag="Admin Only"` from the Admin call site**

In `app/page.tsx`, change:

```tsx
<ModuleListItem
  href="/admin"
  icon={LayoutDashboard}
  title="Admin"
  description="Administrative hub for managing listings, applications, and organizational settings."
  tag="Admin Only"
/>
```

to:

```tsx
<ModuleListItem
  href="/admin"
  icon={LayoutDashboard}
  title="Admin"
  description="Administrative hub for managing listings, applications, and organizational settings."
/>
```

- [ ] **Step 3: Rewrite `ModuleListItem` with simplified props**

Replace the entire `ModuleListItem` function (currently lines 106–165) with:

```tsx
function ModuleListItem({
  href,
  icon: Icon,
  title,
  description,
  isPrimary = false,
}: {
  href: string,
  icon: any,
  title: string,
  description: string,
  isPrimary?: boolean,
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:border-cobalt-400 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
    >
      <div className="flex items-center space-x-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors
          ${isPrimary ? 'bg-cobalt-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-cobalt-50 group-hover:text-cobalt-600'}
        `}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 tracking-tight mb-0.5">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center font-bold text-xs uppercase tracking-widest text-slate-300 group-hover:text-cobalt-600 transition-colors">
        Open <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
```

Differences from the prior version:
- `tag` and `isDraft` props removed from the type signature.
- The `tag` and `isDraft` JSX branches removed (no more `<span>` for tags or "Coming Soon" badges).
- The conditional `href={isDraft ? "#" : href}` collapses to `href={href}`.
- The inline `mb-0.5` flex container around `title` collapses (no more sibling `<span>` to align with) — `mb-0.5` moves directly onto the `<h3>`.
- The conditional `{!isDraft && (...)}` wrapping the "Open →" affordance removed — it now always renders.

- [ ] **Step 4: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Verify in browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:3000/`
Expected:
- Three prototype cards render normally.
- Program Directory icon is filled cobalt (`bg-cobalt-600 text-white`); the other three icons are slate with cobalt hover.
- No "Beta" or "Admin Only" tags anywhere.
- Hover state still works (border turns cobalt, card lifts slightly, "Open" text turns cobalt).

- [ ] **Step 6: Commit**

Stop and ask the user to commit with this message:

```
refactor(landing): drop tag and isDraft props from ModuleListItem
```

---

## Task 3: Drop redundant headings; keep Admin separator

**Why:** "Available Modules" + "Prototypes" is a two-level hierarchy for a five-item list. "Prototypes" restates the page's own purpose. The `Admin` heading remains as the only meaningful visual separator (between prototype cards and the admin-only card).

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Remove the `<h2>Available Modules</h2>` heading**

In `app/page.tsx`, delete this line (currently line 30):

```tsx
<h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Available Modules</h2>
```

- [ ] **Step 2: Remove the `<h3>Prototypes</h3>` heading**

In `app/page.tsx`, delete this line (currently line 34):

```tsx
<h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Prototypes</h3>
```

The wrapping `<div>` around the three `<ModuleListItem>` cards stays — it just has no leading heading anymore.

- [ ] **Step 3: Keep the `<h3>Admin</h3>` heading exactly as-is**

Confirm the line stays unchanged:

```tsx
<h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Admin</h3>
```

This is the only remaining heading in the module list section and acts as the visual separator before the Admin card.

- [ ] **Step 4: Verify in browser**

Refresh `http://localhost:3000/`
Expected:
- The three prototype cards now appear directly under the hero/section padding — no headings above them.
- The "Admin" heading still sits above the Admin card.
- Vertical rhythm still feels right — if there's a sudden gap where the headings used to be, that's expected (the surrounding `py-12` on the section and `space-y-4` on the cards handle the spacing).

- [ ] **Step 5: Commit**

Stop and ask the user to commit with this message:

```
refactor(landing): drop redundant Available Modules and Prototypes headings
```

---

## Task 4: Reframe hero copy, fix mobile padding, and rewrite module descriptions

**Why:** This task lands the spec's content changes — the reviewer-orientation line in the hero, mobile-friendly hero padding so the first card is above the fold at 390px, and the module-description rewrites that turn each card into a reviewer prompt.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Append the reviewer-orientation sentence to the hero subtitle**

In `app/page.tsx`, change the hero `<p>` (currently lines 21–23):

```tsx
<p className="text-lg text-slate-500 max-w-2xl font-medium">
  A secure environment for testing the next generation of GoAbroad's digital infrastructure and core user experiences.
</p>
```

to:

```tsx
<p className="text-lg text-slate-500 max-w-2xl font-medium">
  A secure environment for testing the next generation of GoAbroad's digital infrastructure and core user experiences. Open a module below to review the prototype and leave feedback.
</p>
```

- [ ] **Step 2: Change hero padding for mobile**

In `app/page.tsx`, change the hero `<section>` opening tag (currently line 12):

```tsx
<section className="py-16 border-b border-slate-100">
```

to:

```tsx
<section className="py-10 md:py-16 border-b border-slate-100">
```

- [ ] **Step 3: Rewrite the Program Directory description**

In `app/page.tsx`, change the Program Directory `description` prop:

```tsx
description="A modernized search and discovery engine for global study abroad programs."
```

to:

```tsx
description="The modernized search and discovery experience. Browse programs, filter by criteria, and open a detail page. Feedback wanted on the search/filter UX and listing presentation."
```

- [ ] **Step 4: Rewrite the Create Listing description**

In `app/page.tsx`, change the Create Listing `description` prop:

```tsx
description="Multi-step form for drafting and publishing new program listings."
```

to:

```tsx
description="The new 8-step flow for drafting and publishing a program. Walk through the steps and submit a test listing. Feedback wanted on step pacing and field labeling."
```

- [ ] **Step 5: Rewrite the Partner Marketplace description**

In `app/page.tsx`, change the Partner Marketplace `description` prop:

```tsx
description="Landing page for recruiting ambassadors and program partners."
```

to:

```tsx
description="Landing page for recruiting ambassadors and program partners. Feedback wanted on messaging hierarchy and the call-to-action."
```

- [ ] **Step 6: Rewrite the Admin description**

In `app/page.tsx`, change the Admin `description` prop:

```tsx
description="Administrative hub for managing listings, applications, and organizational settings."
```

to:

```tsx
description="Administrative hub for managing listings, applications, and organizational settings. Browse the dashboards and review the IA."
```

- [ ] **Step 7: Verify desktop view**

Refresh `http://localhost:3000/`
Expected:
- Hero subtitle ends with "...Open a module below to review the prototype and leave feedback."
- All four card descriptions match the new copy verbatim.

- [ ] **Step 8: Verify mobile view**

In Chrome DevTools, toggle the device toolbar and select iPhone 14 (390 × 844) or a custom 390px-wide viewport.
Expected:
- The first module card (Program Directory) is fully visible above the fold without scrolling. The hero is shorter — `py-10` instead of `py-16` — which gains roughly 48px of vertical space.
- Card layouts stack vertically (icon block on top, "Open →" below) per the existing `flex-col md:flex-row` rule.

- [ ] **Step 9: Commit**

Stop and ask the user to commit with this message:

```
feat(landing): reframe hero and module copy as reviewer prompts
```

---

## Task 5: Final verification

**Why:** Catch any regressions before declaring done. Lint and build will surface unused imports, type drift, or accidental inline-hex strings.

**Files:** None modified — verification only.

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: No errors. Specifically, no "FileText is defined but never used" or similar — that import was removed in Task 1.

- [ ] **Step 2: Run TypeScript build**

Run: `npm run build`
Expected: Clean build. No type errors. (Convex may try to start; if `predev` blocks the build, run `npx tsc --noEmit` instead.)

- [ ] **Step 3: Inline-hex audit**

Run: `grep -nE "#[0-9a-fA-F]{3,8}" app/page.tsx || echo "no inline hex"`
Expected: `no inline hex`. Per project CLAUDE.md, no inline hex colors are allowed in className strings.

- [ ] **Step 4: Visual sanity pass — desktop**

Refresh `http://localhost:3000/` at full desktop width.
Expected:
- Hero section: "Internal Prototype" pill, "Design Prototypes." headline, two-sentence subtitle ending with the reviewer-orientation line.
- Module list: three prototype cards (Program Directory primary, Create Listing, Partner Marketplace), then "Admin" heading, then Admin card. No "Available Modules" / "Prototypes" headings, no Articles card, no status tags.
- Footer: only `AdminFooter` ("Gacom Proto Admin / © 2026 GoAbroad.com").

- [ ] **Step 5: Visual sanity pass — mobile (390px)**

In Chrome DevTools, set viewport to 390 × 844.
Expected:
- Program Directory card visible above the fold.
- All four cards stack vertically with icon-on-top, "Open →" affordance below the description.
- No horizontal scroll.

- [ ] **Step 6: Done**

No commit needed — this task is verification only. Report results to the user.

---

## Spec coverage check

Mapping each spec section to the tasks that implement it:

- **Hero: append reviewer-orientation sentence** → Task 4 Step 1
- **Hero: `py-16` → `py-10 md:py-16`** → Task 4 Step 2
- **Module list: drop `<h2>Available Modules</h2>`** → Task 3 Step 1
- **Module list: drop `<h3>Prototypes</h3>`, keep `<h3>Admin</h3>`** → Task 3 Steps 2–3
- **Module list: remove status tags** → Task 2 Steps 1–2
- **Module list: remove Articles card + `FileText` import** → Task 1 Steps 1–2
- **Module copy rewrites (4 cards)** → Task 4 Steps 3–6
- **Footer: remove inline section** → Task 1 Step 3
- **`ModuleListItem`: drop `tag` and `isDraft` props, keep `isPrimary`** → Task 2 Step 3
- **Acceptance: no inline hex, mobile layout intact** → Task 5 Steps 3, 5

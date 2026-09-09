# GAcom Admin — Create Ad page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-page, functional-no-backend recreation of the GoAbroad "Create Ad" admin screen at `/gacom-admin/create-ad`, in two design variants (`faithful` default, `brand`), with `faithful` built first.

**Architecture:** A version orchestrator (`page.tsx`) reads `useDesignVersion("create-ad")` and renders the active variant composition. Both variants share behavior/data (`_shared/useCreateAdForm.ts`, `mock-data.ts`, `types.ts`) but own their presentational components (styling differs). A bare `gacom-admin` layout renders the page full-screen (no marketing header/footer) plus a small floating faithful/brand switcher.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, lucide-react. No Convex/backend for this page.

**Spec:** `docs/superpowers/specs/2026-09-03-gacom-admin-create-ad-design.md`

## Global Constraints

- No test harness for React components in this repo; verify each task with `npx tsc --noEmit`, `npx eslint <file>`, and a browser drive of the running dev server (already on `http://localhost:3000`). Do NOT invent component unit tests.
- Do NOT run any git command (repo owner commits; files are uncommitted — `git checkout`/`restore` would destroy work). Fix mistakes with Edit only.
- Route: `/gacom-admin/create-ad`; default version `faithful`, alt `brand` via `?v=brand`.
- Reuse `useDesignVersion` / `PAGE_VERSIONS`; do NOT modify `PrototypeShell`, `isCanvasRoute`, or the canvas `ToolbarVersionSwitcher`.
- The `gacom-admin` layout must NOT render the marketing `Header`/`Footer` or `PrototypeShell`.
- Icons from `lucide-react`. No inline hex in `className`.
- **faithful** variant (`_versions/faithful/**` on this page only): standard Tailwind named palette (blue/slate/pink/etc.) is allowed and intended, since it mimics a different design system — this is an explicit, scoped exception to the repo's brand-token rule. No inline hex.
- **brand** variant: brand tokens only (`cobalt-*`, `fern-*`, `roman-*`) + standard Tailwind utilities; follow CLAUDE.md/BRANDING.md design language (restrained shadows, modest radius, no oversized buttons).
- Title field hard-capped at 85 characters. Dates default `2026-07-17` → `2026-08-15`. `PROGRAM_NAME="Volunteer for the Visayans"`, `PROFILE_COMPLETION=58`, `PREVIEW_URL="https://beta.goabroad.com/intern-abroad/"`, default `adType="Article Directory Destination Feature - Intern Abroad"`.
- Page(s) are client components (`"use client"`).
- No horizontal body scroll at any width.

---

### Task 1: Shared foundation (registry, types, data, hook, switcher, layout)

**Files:**
- Modify: `lib/design-versions.ts` (add `create-ad` entry)
- Create: `app/gacom-admin/create-ad/_shared/types.ts`
- Create: `app/gacom-admin/create-ad/_shared/mock-data.ts`
- Create: `app/gacom-admin/create-ad/_shared/useCreateAdForm.ts`
- Create: `app/gacom-admin/create-ad/_components/CreateAdVersionSwitcher.tsx`
- Create: `app/gacom-admin/layout.tsx`

**Interfaces (produced — later tasks depend on these exact names):**
- `types.ts`:
  ```ts
  export type PreviewDevice = "desktop" | "mobile";
  export interface CreateAdState {
    adType: string;
    startDate: string;   // ISO YYYY-MM-DD
    endDate: string;     // ISO YYYY-MM-DD
    location: string;
    adPlacementType: string;
    timing: string;
    title: string;
    clientLink: string;
    previewDevice: PreviewDevice;
    uploadedFileName: string | null;
    uploadedPreviewUrl: string | null;
    profileBannerDismissed: boolean;
  }
  export interface NavItem { key: string; label: string; }
  ```
- `useCreateAdForm.ts` default export hook returns:
  ```ts
  {
    state: CreateAdState;
    setAdType(v: string): void;
    setStartDate(v: string): void;
    setEndDate(v: string): void;
    setLocation(v: string): void;
    setAdPlacementType(v: string): void;
    setTiming(v: string): void;
    setTitle(v: string): void;         // hard-caps to 85 chars
    setClientLink(v: string): void;
    setPreviewDevice(v: PreviewDevice): void;
    setUploadedFile(file: File | null): void; // sets name + object URL (or nulls)
    dismissProfileBanner(): void;
    titleLength: number;               // derived: state.title.length
    TITLE_MAX: 85;
  }
  ```
- `mock-data.ts` exports:
  ```ts
  export const AD_TYPES: string[];              // [default first, + 3 siblings]
  export const LOCATIONS: string[];
  export const AD_PLACEMENT_TYPES: string[];
  export const TIMINGS: string[];
  export const PROGRAM_NAME = "Volunteer for the Visayans";
  export const PROFILE_COMPLETION = 58;
  export const PREVIEW_URL = "https://beta.goabroad.com/intern-abroad/";
  export const NAV_ITEMS: { key: string; label: string }[]; // 9 rail items; one key "image"
  ```
- `CreateAdVersionSwitcher.tsx`: default export, client component. Uses `useDesignVersion("create-ad")` to get `versions` + active `version`; renders a fixed bottom-right pill with a link per version (`?v=<id>`), active one highlighted. Uses `next/link` and `useSearchParams` only for read; keep it visually neutral (slate) so it suits both variants.

- [ ] **Step 1: Add the registry entry** to `PAGE_VERSIONS` in `lib/design-versions.ts`:

```ts
"create-ad": {
  pageId: "create-ad",
  versions: [
    { id: "faithful", label: "Faithful", description: "Matches the real GoAbroad admin" },
    { id: "brand", label: "Brand", description: "Same layout, restyled with the prototype brand" },
  ],
  defaultVersion: "faithful",
},
```
(Note: `resolveVersion` falls back to `"v1"` when a param is invalid but the default is used via `config.defaultVersion`, so `faithful` resolves correctly. Verify by reading `resolveVersion`.)

- [ ] **Step 2: Write `types.ts`** with the exact interfaces above.

- [ ] **Step 3: Write `mock-data.ts`.** `AD_TYPES[0]` MUST be `"Article Directory Destination Feature - Intern Abroad"`; add 3 plausible siblings. Provide 4–6 plausible options each for `LOCATIONS` (e.g. "Study Abroad", "Intern Abroad", "Volunteer Abroad", "Teach Abroad", "Homepage"), `AD_PLACEMENT_TYPES` (e.g. "Banner", "Sidebar", "Featured Listing", "Destination Feature"), `TIMINGS` (e.g. "Immediate", "Scheduled", "Evergreen"). `NAV_ITEMS` = 9 entries with keys: `verified`, `dashboard`, `contacts`, `image`, `quotes`, `articles`, `gift`, `billing`, `messages` and human labels; the icon mapping lives in the variant Sidebar, not here.

- [ ] **Step 4: Write `useCreateAdForm.ts`.** `"use client"`. `useState<CreateAdState>` with defaults from Global Constraints (`previewDevice:"desktop"`, `uploadedFileName:null`, `uploadedPreviewUrl:null`, `profileBannerDismissed:false`, selects `""`). `setTitle` caps: `setState(s => ({...s, title: v.slice(0, 85)}))`. `setUploadedFile(file)`: if null → clear name+url; else set `uploadedFileName=file.name` and, when `file.type.startsWith("image/")`, `uploadedPreviewUrl=URL.createObjectURL(file)` else `null`. `titleLength = state.title.length`. Export `TITLE_MAX = 85 as const`.

- [ ] **Step 5: Write `CreateAdVersionSwitcher.tsx`** per the interface above — fixed `bottom-4 right-4 z-50` pill, `next/link` per version to `?v=<id>`, active highlighted; wrap in `<Suspense>` is not needed (it's rendered inside layout which is fine), but it uses `useSearchParams` so the consuming layout must render it inside a `<Suspense>` boundary (handled in Step 6).

- [ ] **Step 6: Write `app/gacom-admin/layout.tsx`.** Server component is fine; render `children` full-screen and mount the switcher inside `<Suspense fallback={null}>` (because it reads search params):
```tsx
import { Suspense } from "react";
import CreateAdVersionSwitcher from "./create-ad/_components/CreateAdVersionSwitcher";
export default function GacomAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
      <Suspense fallback={null}><CreateAdVersionSwitcher /></Suspense>
    </div>
  );
}
```
(If the switcher import path causes a server/client boundary issue, the switcher file already has `"use client"`, so importing it into a server layout is fine.)

- [ ] **Step 7: Typecheck.** Run `npx tsc --noEmit`; expect no errors in the new files. (`page.tsx` doesn't exist yet — that's fine; the route just 404s until Task 2. The layout referencing the switcher compiles because the switcher exists.)

- [ ] **Step 8: Lint.** `npx eslint "app/gacom-admin/**/*.ts" "app/gacom-admin/**/*.tsx" lib/design-versions.ts` — expect clean.

- [ ] **Step 9: Stop for review (no git).** Report done.

---

### Task 2: Faithful page shell — orchestrator, layout grid, sidebar, top chrome

**Files:**
- Create: `app/gacom-admin/create-ad/page.tsx`
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCreateAd.tsx`
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulSidebar.tsx`
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulTopChrome.tsx`

**Interfaces:**
- Consumes: `useCreateAdForm` (Task 1), `NAV_ITEMS`, `PROGRAM_NAME`, `PROFILE_COMPLETION` (Task 1), `useDesignVersion` (`lib/use-design-version`).
- Produces: `FaithfulCreateAd` default export (no props — it calls `useCreateAdForm` itself and passes `form` down); `FaithfulSidebar` and `FaithfulTopChrome` take the props named below.

- [ ] **Step 1: Write `page.tsx`** (`"use client"`): orchestrator.
```tsx
"use client";
import { useDesignVersion } from "@/lib/use-design-version";
import FaithfulCreateAd from "./_versions/faithful/FaithfulCreateAd";
// import BrandCreateAd from "./_versions/brand/BrandCreateAd"; // added in Task 6
export default function CreateAdPage() {
  const { version } = useDesignVersion("create-ad");
  switch (version) {
    // case "brand": return <BrandCreateAd />; // Task 6
    case "faithful":
    default:
      return <FaithfulCreateAd />;
  }
}
```
Note: `useDesignVersion` uses `useSearchParams`; this page renders inside the `gacom-admin` layout. Wrap the switch body's consumer in Suspense is not required for the page itself in App Router client components, but if the build warns about `useSearchParams` needing Suspense, wrap the returned variant in `<Suspense>` or split the hook call into an inner component wrapped by `<Suspense>` in `page.tsx`. Prefer: keep `page.tsx` minimal and, if needed, add `export const dynamic = "force-dynamic";`.

- [ ] **Step 2: Write `FaithfulCreateAd.tsx`** (`"use client"`): calls `const form = useCreateAdForm();` and lays out the full page. Structure:
  - Root: `min-h-screen bg-slate-50 flex text-slate-800` (app background, subtle grey).
  - `<FaithfulSidebar navItems={NAV_ITEMS} activeKey="image" />` — fixed-width rail.
  - A right side `flex-1 flex flex-col min-w-0`:
    - `<FaithfulTopChrome programName={PROGRAM_NAME} profileCompletion={PROFILE_COMPLETION} bannerDismissed={form.state.profileBannerDismissed} onDismissBanner={form.dismissProfileBanner} />`
    - `<main className="flex-1 overflow-y-auto">` containing a max-width container with the page title `Create Ad` and a two-column grid: left main column (Ad Type + Ad Preview — added Task 3) and right rail (Settings + Ad Content — added Task 4). In THIS task, render the "Create Ad" heading and two empty placeholder columns (`<div>` with comment) so the grid/scaffold is visible; Tasks 3–4 fill them.
  - Grid: `grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6` inside a `max-w-[1400px] mx-auto px-6 py-6` container so it collapses to one column below `xl` (no horizontal overflow).

- [ ] **Step 3: Write `FaithfulSidebar.tsx`** (`"use client"` not required; presentational). Props: `{ navItems: {key,label}[]; activeKey: string }`. Render a fixed vertical rail: `w-16 shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-1 min-h-screen`. Top: a circular avatar `H` — `w-9 h-9 rounded-full bg-pink-500 text-white grid place-items-center font-semibold` with a small status dot (`relative` + an `absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-pink-400 ring-2 ring-white`). Then a spacer and the icon buttons. Map `navItems` to lucide icons by key: `verified→ShieldCheck, dashboard→LayoutGrid, contacts→Contact, image→Image, quotes→Quote, articles→List, gift→Gift, billing→DollarSign, messages→MessageSquare`. Each is a `w-10 h-10 rounded-lg grid place-items-center` button; inactive `text-slate-400 hover:bg-slate-100`; active (`key===activeKey`) `bg-sky-50 text-sky-600`. Pin a `Power` icon at the bottom with `mt-auto` (inside the flex column) styled like an inactive item. Include `title={label}` for hover tooltips and `aria-label`.

- [ ] **Step 4: Write `FaithfulTopChrome.tsx`** (`"use client"` for the dismiss button handler). Props: `{ programName: string; profileCompletion: number; bannerDismissed: boolean; onDismissBanner(): void }`. Two stacked pieces:
  - Banner (only when `!bannerDismissed`): `w-full bg-white border-b border-slate-200 py-2 text-center text-sm font-medium text-slate-700 relative` with text `Your profile is {profileCompletion}% complete.` and a right-aligned chevron button (`ChevronDown`, `absolute right-4 top-1/2 -translate-y-1/2`, `onClick={onDismissBanner}`, `aria-label="Dismiss"`).
  - Top bar: `h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4`: a `Menu` (hamburger) icon button, the `programName` as a `text-base font-medium`, then `ml-auto` group: a "Create Program" outline button (`border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-md hover:bg-slate-50`), a `Phone` icon button, a `Settings` gear icon button (both `text-slate-500 hover:text-slate-700`).

- [ ] **Step 5: Typecheck + lint** the new files (`npx tsc --noEmit`; `npx eslint` on the four files).

- [ ] **Step 6: Browser verify.** Ensure dev server on `:3000`. Navigate to `http://localhost:3000/gacom-admin/create-ad`. Confirm: full-screen admin shell (no marketing header/footer), left icon rail with pink "H" avatar and highlighted image icon, profile banner "Your profile is 58% complete." dismissible via chevron, top bar with title "Volunteer for the Visayans" + Create Program + phone/gear, and a "Create Ad" heading with an empty two-column scaffold. No horizontal scroll. Screenshot to `docs/screenshots/`.

- [ ] **Step 7: Stop for review (no git).**

---

### Task 3: Faithful main column — Ad Type card + Ad Preview card

**Files:**
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulAdTypeCard.tsx`
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulAdPreviewCard.tsx`
- Modify: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCreateAd.tsx` (mount the two cards in the left column, pass `form`)

**Interfaces:**
- Consumes: `useCreateAdForm` return (`form`), `AD_TYPES`, `PREVIEW_URL` (Task 1).
- Produces: `FaithfulAdTypeCard({ form })` and `FaithfulAdPreviewCard({ form })` where `form: ReturnType<typeof useCreateAdForm>` (import the type via `ReturnType`); both default exports.

- [ ] **Step 1: Write `FaithfulAdTypeCard.tsx`.** Card: `bg-white rounded-lg border border-slate-200 p-5`. A responsive row `flex flex-col sm:flex-row gap-4`: a flex-1 field group with label `Ad Type` (`text-xs font-semibold text-slate-500 mb-1.5 block`) over a `<select>` bound to `form.state.adType` / `form.setAdType`, options mapped from `AD_TYPES`, styled `h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white`. Then two narrower groups: `Start Date` and `End Date`, each an `<input type="date">` bound to `form.state.startDate`/`setStartDate` and `endDate`/`setEndDate`, same input styling, width `sm:w-40`.

- [ ] **Step 2: Write `FaithfulAdPreviewCard.tsx`.** Card `bg-white rounded-lg border border-slate-200`. Header row (`flex items-center justify-between px-4 py-3 border-b border-slate-200`): left `Ad Preview` bold + a slate divider `|` + `{form.state.adType}` in muted text (truncate). Right: a Desktop/Mobile segmented toggle — two buttons in a `bg-slate-100 rounded-md p-0.5` group; active one `bg-white shadow-sm text-slate-800`, inactive `text-slate-500`; each shows a lucide icon (`Monitor` / `Smartphone`) + label; `onClick` sets `form.setPreviewDevice("desktop"|"mobile")`.
  - Body (`p-6`): a centered frame whose max width depends on device: desktop `max-w-full`, mobile `max-w-[420px]`, with `mx-auto transition-all`. Inside, an aspect box `bg-slate-100 rounded-md overflow-hidden relative` with a subtle travel-stamp motif approximated by a CSS pattern (e.g. a `bg-[repeating-linear-gradient(...)]` or a light dotted/hatch pattern using Tailwind arbitrary values — NO external image, NO inline hex; use named slate tokens in the arbitrary value, e.g. `bg-[repeating-linear-gradient(45deg,theme(colors.slate.200)_0,theme(colors.slate.200)_1px,transparent_1px,transparent_12px)]`). Center a `100 × 100` grey placeholder tile (`w-24 h-24 bg-slate-200 border border-slate-300 rounded grid place-items-center text-slate-500 text-xs`).
  - Footer (`px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1`): an `Info` icon, text `This ad will appear on this page:` then `PREVIEW_URL` as an external link (`text-sky-600 hover:underline`, `target="_blank" rel="noopener noreferrer"`, with a small `ExternalLink` icon).

- [ ] **Step 3: Mount in `FaithfulCreateAd.tsx`.** Replace the left-column placeholder with `<div className="space-y-6"><FaithfulAdTypeCard form={form} /><FaithfulAdPreviewCard form={form} /></div>`.

- [ ] **Step 4: Typecheck + lint.**

- [ ] **Step 5: Browser verify.** Reload the page. Confirm the Ad Type select changes the preview header text; Start/End date inputs show `07/17/2026`/`08/15/2026` and are editable; Desktop/Mobile toggle narrows the preview frame in mobile mode and highlights the active button; the 100×100 tile is centered on the patterned background; the footer link shows the preview URL. Screenshot.

- [ ] **Step 6: Stop for review (no git).**

---

### Task 4: Faithful right rail — Settings card + Ad Content card

**Files:**
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulSettingsCard.tsx`
- Create: `app/gacom-admin/create-ad/_versions/faithful/FaithfulAdContentCard.tsx`
- Modify: `app/gacom-admin/create-ad/_versions/faithful/FaithfulCreateAd.tsx` (mount in right column)

**Interfaces:**
- Consumes: `form`, `LOCATIONS`, `AD_PLACEMENT_TYPES`, `TIMINGS`, `TITLE_MAX` (Task 1).
- Produces: `FaithfulSettingsCard({ form })`, `FaithfulAdContentCard({ form })` default exports.

- [ ] **Step 1: Write `FaithfulSettingsCard.tsx`.** Card `bg-white rounded-lg border border-slate-200 p-5 space-y-4`. Three field groups (`Location`→`LOCATIONS`/`form.setLocation`, `Type`→`AD_PLACEMENT_TYPES`/`setAdPlacementType`, `Timing`→`TIMINGS`/`setTiming`). Each: label (`text-xs font-semibold text-slate-500 mb-1.5 block`) over a `<select>` bound to the corresponding state value; first option is a disabled placeholder `Select {Location|Type|Timing}...` with value `""`; same input styling as Task 3.

- [ ] **Step 2: Write `FaithfulAdContentCard.tsx`.** Card `bg-white rounded-lg border border-slate-200`. Header (`px-5 py-3 border-b border-slate-200 flex items-center gap-2`): a small `LayoutPanelLeft` (or `PanelsTopLeft`) icon + `Ad Content` bold. Body `p-5 space-y-4`:
  - Title group: a label row `flex items-center justify-between` — `Title` label left, `{form.titleLength}/{TITLE_MAX}` counter right (`text-xs text-slate-400`); a text input bound to `form.state.title`/`form.setTitle`, placeholder `Enter ad title`, `maxLength={85}` as a belt-and-suspenders alongside the setter cap.
  - Client Link group: label `Client Link`; an input with a leading `Link` icon (wrap in a `relative` container, icon `absolute left-3`, input `pl-9`), bound to `form.state.clientLink`/`setClientLink`, placeholder `https://example.com`, `type="url"`.
  - Image Upload group: label `Image Upload`, sub-label `Desktop` (`text-xs text-slate-400`); a dashed dropzone `<label>` wrapping a hidden `<input type="file" accept="image/*">` whose `onChange` calls `form.setUploadedFile(e.target.files?.[0] ?? null)`. Empty state: `border-2 border-dashed border-slate-300 rounded-lg py-8 grid place-items-center text-slate-400 text-sm cursor-pointer hover:border-slate-400` with a `Monitor` icon over `Click to upload`. Filled state (when `form.state.uploadedFileName`): show the file name and, if `form.state.uploadedPreviewUrl`, a small `<img>` thumbnail (`max-h-24`, use `next/image` is NOT required — a plain `<img>` is fine for a blob URL; add `eslint-disable-next-line @next/next/no-img-element` if the linter complains).
  - Footer (`px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-3`): `Save as Draft` subtle button (`text-slate-600 text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-100`, with a small `Save`/`FileText` icon) and `Submit for Approval` primary button (`bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md inline-flex items-center gap-1.5` with a trailing `ArrowRight`). Both `type="button"` no-ops.

- [ ] **Step 3: Mount in `FaithfulCreateAd.tsx`.** Right column: `<div className="space-y-6"><FaithfulSettingsCard form={form} /><FaithfulAdContentCard form={form} /></div>`.

- [ ] **Step 4: Typecheck + lint.**

- [ ] **Step 5: Browser verify.** Reload. Confirm: the three selects open with mock options and hold selection; Title counter increments and hard-stops at 85; Client Link accepts input with the leading link icon; clicking the dropzone opens a file chooser and, after choosing an image, the zone shows the file name/thumbnail; Save as Draft and Submit for Approval render correctly. Screenshot the full faithful page (desktop). Also resize to a narrow width and confirm the grid collapses to one column with no horizontal scroll.

- [ ] **Step 6: Stop for review (no git).**

---

### Task 5: Faithful whole-page verification

**Files:** none (verification only).

- [ ] **Step 1: `npx tsc --noEmit`** — no errors anywhere in `app/gacom-admin/**`.
- [ ] **Step 2: `npx eslint "app/gacom-admin/**/*.{ts,tsx}"`** — clean (except any intentional, commented `no-img-element` disable).
- [ ] **Step 3: `npm run build`** — completes; `/gacom-admin/create-ad` appears in the route list with no build errors.
- [ ] **Step 4: Browser drive** the full faithful page and confirm every interaction from Tasks 2–4 in one pass (banner dismiss, toggle, counter cap, all selects, dates, file upload, no-op buttons, responsive collapse). Capture a desktop screenshot and a mobile-width screenshot to `docs/screenshots/`.
- [ ] **Step 5: Report** results; stop for review (no git).

---

### Task 6: Brand version (built after faithful is approved)

**Files:**
- Create: `app/gacom-admin/create-ad/_versions/brand/BrandCreateAd.tsx` (+ brand section components mirroring the faithful set: `BrandSidebar`, `BrandTopChrome`, `BrandAdTypeCard`, `BrandAdPreviewCard`, `BrandSettingsCard`, `BrandAdContentCard`)
- Modify: `app/gacom-admin/create-ad/page.tsx` (uncomment/add the `case "brand"` → `<BrandCreateAd />`)

**Interfaces:** identical structure to the faithful components (same `form` prop, same regions, same interactions). Only styling differs.

- [ ] **Step 1: Build `BrandCreateAd.tsx` and its section components** by mirroring the faithful composition region-for-region and interaction-for-interaction, restyled to brand: primary buttons/toggle-active/links in `cobalt-*`; icon-rail active state and avatar in brand tokens (avatar `bg-cobalt-500`, active nav `bg-cobalt-50 text-cobalt-600`); profile banner/progress accents may use `fern-*`; cards follow BRANDING.md (restrained shadow, modest radius, compact buttons). Reuse `_shared/*` and `mock-data`/`types` unchanged. No inline hex; brand tokens + standard Tailwind utilities only.
- [ ] **Step 2: Wire `page.tsx`** to render `<BrandCreateAd />` for `case "brand"`.
- [ ] **Step 3: Typecheck + lint.**
- [ ] **Step 4: Browser verify** at `?v=brand`: same layout/behavior as faithful, brand styling; confirm the floating switcher toggles between faithful and brand and both render. Screenshots of both.
- [ ] **Step 5: Report; stop for review (no git).**

---

## Self-Review

**Spec coverage:**
- Versioning via `PAGE_VERSIONS` + `useDesignVersion`, `faithful` default → Task 1 Step 1, Task 2 Step 1. ✓
- Bare layout, no marketing chrome, floating switcher → Task 1 Steps 5–6. ✓
- Shared hook/data/types → Task 1 Steps 2–4. ✓
- Left icon rail (9 icons + power + pink avatar, image active) → Task 2 Step 3. ✓
- Top chrome (58% banner dismissible + top bar) → Task 2 Step 4. ✓
- Ad Type card (select + dates) → Task 3 Step 1. ✓
- Ad Preview (header, Desktop/Mobile toggle, patterned bg + 100×100 tile, footer link) → Task 3 Step 2. ✓
- Right rail Settings (Location/Type/Timing) → Task 4 Step 1. ✓
- Ad Content (Title+counter cap 85, Client Link, upload dropzone, Save/Submit) → Task 4 Step 2. ✓
- Interactivity (toggle width, counter cap, selects hold, dates, file preview, banner dismiss, no-op buttons) → Tasks 2–4 + Task 5 Step 4. ✓
- faithful standard-palette exception; no inline hex → Global Constraints + Task styling. ✓
- brand variant same layout, brand tokens → Task 6. ✓
- No horizontal overflow / responsive collapse → Task 2 Step 2 grid, Task 4 Step 5, Task 5 Step 4. ✓

**Placeholder scan:** No TBD/TODO; each component has concrete structure, copy, bindings, and class conventions. The plan intentionally specifies structure+classes rather than full JSX transcription (visual build). ✓

**Type consistency:** `form = ReturnType<typeof useCreateAdForm>` used consistently as the prop type in Tasks 3–4; setter names (`setAdType`, `setPreviewDevice`, `setUploadedFile`, `dismissProfileBanner`, `setTitle`) match the Task 1 hook interface; `titleLength`/`TITLE_MAX` match; mock-data export names (`AD_TYPES`, `LOCATIONS`, `AD_PLACEMENT_TYPES`, `TIMINGS`, `PROGRAM_NAME`, `PROFILE_COMPLETION`, `PREVIEW_URL`, `NAV_ITEMS`) match across tasks. ✓

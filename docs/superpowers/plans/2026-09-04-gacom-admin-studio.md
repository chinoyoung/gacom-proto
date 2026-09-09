# GAcom Admin — "Campaign Studio" rendition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]` checkboxes.

**Goal:** Add a third design version, "studio" (Campaign Studio), to `/gacom-admin/create-ad` — a fresher, guided, visual builder that keeps the admin chrome and reuses all existing logic (27 types, live previews, adaptive form, cart, checkout). Selectable via the switcher (`?v=studio`).

**Architecture:** A new `_versions/studio/` composition. Reuse shared logic (`ad-types`, `useCreateAdForm`, `useAdCart`, `mock-data`), the preview (`PreviewSwitcher` + 9 archetypes), the chrome (`FaithfulSidebar`, `FaithfulTopChrome`), and the checkout (`FaithfulCheckoutModal`) by import. New presentation: a visual format gallery (replaces the dropdown), a big live preview, a restyled adaptive content+targeting panel, and a campaign bar (cart).

**Tech Stack:** Next.js 16, React 19, TS strict, Tailwind v4, lucide-react. No backend.

**Spec:** `docs/superpowers/specs/2026-09-04-gacom-admin-studio-design.md` — read the named sections per task.

## Global Constraints

- New version only. Do NOT modify `faithful`, `brand`, `_shared/*`, or `ad-creatives/*`. Reuse via import.
- No component test harness; verify with `npx tsc --noEmit`, `npx eslint <files>`, and a browser drive of `http://localhost:3000/gacom-admin/create-ad?v=studio` (authed in the in-app Browser pane).
- Do NOT run git. Fix mistakes with Edit only.
- Standard Tailwind palette (same non-brand admin look: sky=cobalt primary, amber/red where creatives use them, slate neutrals). NO inline hex. lucide-react. Client components. All mock.
- No horizontal body overflow; the two-column builder stacks on small widths; campaign bar is sticky-within-main (NOT `position:fixed`).
- The `<select>` is replaced by the gallery, but selection still sets `form.setAdType(spec.name)` (same value contract; keeps cart/preview working).

---

### Task 1: Register studio + orchestrator shell (chrome + scaffold)

**Read spec:** "Reuse", "Files", "Layout" (StudioCreateAd + StudioBuilder skeleton).

**Files:**
- Modify: `lib/design-versions.ts` (add `{ id: "studio", label: "Studio", description: "Campaign Studio — guided visual builder" }` to the `create-ad` versions array; keep faithful default).
- Modify: `app/gacom-admin/create-ad/page.tsx` (import `StudioCreateAd`; add `case "studio": return <StudioCreateAd />;`).
- Create: `_versions/studio/StudioCreateAd.tsx` — `"use client"`; `const form = useCreateAdForm(); const cart = useAdCart();`; root `min-h-screen bg-slate-50 flex text-slate-800`; `<FaithfulSidebar navItems={NAV_ITEMS} activeKey="image" />` + right column (`flex-1 flex flex-col min-w-0`) with `<FaithfulTopChrome programName={PROGRAM_NAME} profileCompletion={PROFILE_COMPLETION} bannerDismissed={form.state.profileBannerDismissed} onDismissBanner={form.dismissProfileBanner} />` and `<main className="flex-1 overflow-y-auto"><StudioBuilder form={form} cart={cart} /></main>`; mount `<FaithfulCheckoutModal cart={cart} programName={PROGRAM_NAME} />` at the end. Import chrome/checkout from `../faithful/…`, data from `../../_shared/mock-data`.
- Create: `_versions/studio/StudioBuilder.tsx` — `"use client"`, props `{ form, cart }` (types via `ReturnType<typeof useCreateAdForm>` / `useAdCart`). For THIS task, render the scaffold: a `max-w-[1400px] mx-auto px-6 py-6` container with a "Campaign Studio" header + a step chip row (Placement · Format · Build), and placeholder blocks for the placement selector, format gallery, builder, and campaign bar (each a bordered box labeled with its name). Later tasks fill these.

- [ ] Implement the above. `npx tsc --noEmit` clean; `npx eslint "app/gacom-admin/create-ad/_versions/studio/**/*.tsx" lib/design-versions.ts app/gacom-admin/create-ad/page.tsx` clean.
- [ ] Browser: the floating switcher now shows Faithful · Brand · Studio; `?v=studio` renders the admin chrome (rail + top bar) with the Campaign Studio scaffold; `?v=` default still renders faithful. Screenshot. Stop for review.

---

### Task 2: Format gallery (visual picker) + placement tabs

**Read spec:** "Layout" items 2–3 (placement selector + format gallery).

**Files:**
- Create: `_versions/studio/StudioFormatGallery.tsx` — `"use client"`, props `{ area, form }` where `area: PlacementArea`. Render a responsive grid (`grid grid-cols-2 sm:grid-cols-3 gap-3`) of cards for `AD_TYPES_BY_AREA[area]`. Each card (button): a small archetype thumbnail keyed by `spec.archetype` (a tiny inline schematic or a lucide icon per archetype — program-card→`LayoutGrid`/photo, simple-photo→`Image`, thumb-text→`Rows`, split-banner→`RectangleHorizontal`, brand-split→`Columns2`, centered-overlay→`Focus`, video-split→`PlayCircle`, cover-photo→`PanoramaHorizontal`/`Image`, hot-jobs→`Flame`), the `name` (`text-sm font-medium`), and a spec line (`text-xs text-slate-500`) = `spec.imageDesktop` + (titleAuto ? "· auto title" : `· title ${titleMax}`). Selected card (`spec.name === form.state.adType`) → `border-2 border-sky-600`; others `border border-slate-200 hover:border-slate-300`. `cursor-pointer`. onClick → `form.setAdType(spec.name)`.
- Modify: `StudioBuilder.tsx` — add local `const [area, setArea] = useState<PlacementArea>(getAdType(form.state.adType)?.area ?? "Homepage")`. Render the placement selector: a wrapping row of 5 chips (buttons) over `Object.keys(AD_TYPES_BY_AREA)`; active chip (`area`) `bg-sky-600 text-white`, others `bg-white border border-slate-200 text-slate-600`; onClick `setArea`. Below it render `<StudioFormatGallery area={area} form={form} />` in place of the gallery placeholder. Keep the builder + campaign bar placeholders.

- [ ] Implement. tsc + eslint clean.
- [ ] Browser: 5 placement chips filter the gallery; clicking a format card selects it (highlight) and the header/preview-elsewhere reflect it; default area matches the current type. Screenshot. Stop for review.

---

### Task 3: Builder — adaptive content + targeting/schedule + large live preview

**Read spec:** "Layout" item 4 (Builder) + "Behavior". Reference the faithful `FaithfulAdContentCard` for the per-type adaptive logic (title auto/counter, description gating, image/video/auto control, auto-fields note) — reproduce that logic here (do not import that component; build a cleaner studio panel).

**Files:**
- Create: `_versions/studio/StudioContentPanel.tsx` — `"use client"`, props `{ form }`. `const spec = getAdType(form.state.adType) ?? AD_TYPES[0]`. Two sections in rounded-xl cards:
  - **Content**: Title (render only when `spec.titleAuto || spec.titleMax != null`; auto → disabled "Auto-populated from your account", else input with `maxLength={spec.titleMax}` + `{titleLength}/{titleMax}` counter); Description (only when `spec.descriptionMax != null`, textarea + counter, `maxLength`); Client Link (url input with link icon); Image Upload block: if `spec.archetype === "video-split"` a Video URL input; else if `!spec.imageDesktop.includes("×")` an "Auto-pulled from your account" note; else the dashed dropzone (`form.setUploadedFile`), showing filename/thumbnail when set, with sublabel "Desktop · {spec.imageDesktop} px". Auto-fields note "Pulled from your account: {spec.autoFields.join(', ')}" when non-empty.
  - **Targeting & schedule**: Location / Type / Timing `<select>`s (options from `LOCATIONS`/`AD_PLACEMENT_TYPES`/`TIMINGS`, first option disabled "Select …", bound to form) + Start/End date inputs bound to form.
- Modify: `StudioBuilder.tsx` — replace the builder placeholder with a two-column grid (`grid grid-cols-1 lg:grid-cols-2 gap-6`): left `<StudioContentPanel form={form} />`; right a **Live preview** panel — a rounded-xl card with a header ("Live preview" + a Desktop/Mobile segmented toggle bound to `form.state.previewDevice`/`form.setPreviewDevice`), a body that centers `<PreviewSwitcher spec={getAdType(form.state.adType)} form={form} />` in a device frame using `frameMaxWidth(spec)` (mobile clamped), and a footer note "This ad will appear on: {PREVIEW_URL}" (link). Import `PreviewSwitcher, { frameMaxWidth }` from `../faithful/ad-creatives/PreviewSwitcher`.

- [ ] Implement. tsc + eslint clean.
- [ ] Browser: selecting formats updates both the content panel (fields appear/adapt per type) and the large live preview; typing Title/Description updates the preview; Desktop/Mobile toggle works; Location/Type/Timing/dates present. Screenshot across a few types. Stop for review.

---

### Task 4: Campaign bar + checkout wiring + full verification

**Read spec:** "Layout" item 5 (Campaign bar) + "Behavior".

**Files:**
- Create: `_versions/studio/StudioCampaignBar.tsx` — `"use client"`, props `{ form, cart }`. A sticky-within-main bar (`sticky bottom-0`, `bg-white border-t border-slate-200`, a `max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4`). Left: a shopping icon + campaign summary — when `cart.count === 0`, "Add this placement to start your campaign."; else "Your campaign · {cart.count} placement(s)" + `${cart.total.toLocaleString()}`. Right: local `addError`/`justAdded` state; an **Add to campaign** primary button (`bg-sky-600 hover:bg-sky-700 text-white`, cart icon; on click validate `location && adPlacementType && timing` else inline error "Select a location, type, and timing first.", else `cart.addItem({...snapshot from form.state...})` + `form.resetPlacementFields()` + transient "Added" for ~1.5s) and a **Review campaign** button (outline; `cart.openCart()`; disabled/hidden when `cart.count === 0`). Keep the inline error near the bar.
- Modify: `StudioBuilder.tsx` — replace the campaign-bar placeholder with `<StudioCampaignBar form={form} cart={cart} />` (pass `cart` through from StudioCreateAd → StudioBuilder). Ensure the checkout modal (mounted in StudioCreateAd) opens from Review campaign.

- [ ] Implement. tsc + eslint clean.
- [ ] `npm run build` — completes; `/gacom-admin/create-ad` builds (studio is a client branch of the same route). Report the route line.
- [ ] Browser (full flow at `?v=studio`): pick a placement + format from the gallery; fill content + targeting; Add to campaign (and the empty-targeting error path); campaign bar shows count/total; add a second; Review campaign → checkout modal (cart → billing → done); cart clears; switch to `?v=faithful` and confirm it's unchanged. No horizontal overflow; builder stacks on a narrow width. Screenshots. Stop for review.

---

## Self-Review

**Spec coverage:** version registration + orchestrator + chrome reuse → Task 1; placement tabs + visual format gallery → Task 2; adaptive content + targeting/schedule + large preview → Task 3; campaign bar + checkout + full verify → Task 4. Reuse-only of shared/creatives/chrome/checkout → Global Constraints + task imports. ✓
**Placeholder scan:** each task names concrete files, props, bindings, and reuse imports; adaptive-form logic references the faithful component to reproduce (not vaguely). ✓
**Type consistency:** `form: ReturnType<typeof useCreateAdForm>`, `cart: ReturnType<typeof useAdCart>`, `spec: AdTypeSpec`, `area: PlacementArea` used consistently; `PreviewSwitcher`/`frameMaxWidth`, `getAdType`, `AD_TYPES_BY_AREA` imported from their existing modules; `form.setAdType(spec.name)` keeps the value contract. ✓

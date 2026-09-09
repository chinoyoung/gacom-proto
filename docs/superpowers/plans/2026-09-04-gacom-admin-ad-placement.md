# GAcom Admin — "Add Placement" multi-tag targeting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]` checkboxes.

**Goal:** Replace the single Location/Type/Timing selects (both faithful + studio) with the real admin's "Add Placement" flow — an Add Placement button opens a dropdown panel (Location=regions, Timing=seasons/durations, Type=subjects); each choice becomes a removable pill.

**Architecture:** Placement state becomes three tag arrays (`locations`, `timings`, `types`) on `useCreateAdForm`. One shared `AdPlacementPicker` (pills + Add Placement dropdown panel) is used by both versions. Add-to-cart snapshots the arrays; the checkout item shows the tags.

**Tech Stack:** Next.js 16, React 19, TS strict, Tailwind v4, lucide-react. No backend.

**Spec:** `docs/superpowers/specs/2026-09-04-gacom-admin-ad-placement-design.md` — read the named sections per task.

## Global Constraints

- No component test harness; verify with `npx tsc --noEmit`, `npx eslint <files>`, and a browser drive of `http://localhost:3000/gacom-admin/create-ad` (studio, default) and `?v=faithful`.
- Do NOT run git. Fix mistakes with Edit only.
- Standard Tailwind (non-brand admin): pills `bg-sky-500`, add button `sky-300/600`. NO inline hex. lucide-react. Client components. All mock.
- One shared `AdPlacementPicker` — no duplicated pill logic. Panel closes on outside-click/Escape/Save; no horizontal overflow; dedupe selected values.

---

### Task 1: Foundation — data, types, hook, cart snapshot

**Read spec:** "Data model changes".

**Files:**
- Modify `_shared/mock-data.ts`: replace `LOCATIONS`/`AD_PLACEMENT_TYPES`/`TIMINGS` with `PLACEMENT_LOCATIONS`, `PLACEMENT_TIMINGS`, `PLACEMENT_TYPES` (exact lists in the spec), plus `PLACEMENT_OPTIONS: Record<PlacementDim,string[]>` and `PLACEMENT_DIM_LABELS: Record<PlacementDim,string>`. Grep the repo for any remaining importers of the old three names and repoint/remove.
- Modify `_shared/types.ts`: add `export type PlacementDim = "location" | "timing" | "type";`; in `CreateAdState` replace `location`/`adPlacementType`/`timing` strings with `locations: string[]`, `timings: string[]`, `types: string[]`; in `PlacementSnapshot` replace the three strings with the three arrays (keep adType/startDate/endDate); `CartItem` unchanged (still extends PlacementSnapshot + {id, price}).
- Modify `_shared/useCreateAdForm.ts`: INITIAL_STATE uses `locations:[]`, `timings:[]`, `types:[]`; add `addPlacementTag(dim, value)` (append if absent to the matching array), `removePlacementTag(dim, value)` (filter out); derived `placementCount = locations.length + timings.length + types.length`; include both methods + `placementCount` in the return; `resetPlacementFields()` clears the three arrays too. Remove the old `setLocation`/`setAdPlacementType`/`setTiming` setters (nothing should use them after this feature — grep to confirm; they’re replaced by add/remove tag).
- Modify `_shared/useAdCart.ts`: `addItem` builds the CartItem from the snapshot as before; the snapshot now carries arrays (type-only change). Confirm it compiles.

- [ ] Implement. `npx tsc --noEmit` — expect errors ONLY in the consumer components that still reference the old fields (faithful/studio cards); fix those in Tasks 2–3. For THIS task, the `_shared/*` files must be internally consistent; a temporary tsc error in the not-yet-updated consumer components is expected — note them. `npx eslint "app/gacom-admin/create-ad/_shared/"*.ts` clean.
- [ ] Stop for review (no git). Report which consumer files now have type errors to fix next.

---

### Task 2: Shared AdPlacementPicker + Studio integration

**Read spec:** "Shared component — AdPlacementPicker", "Studio integration", "Cart / checkout display" (studio uses the same checkout).

**Files:**
- Create `_components/AdPlacementPicker.tsx` per spec: `{ form }`; renders pills (concat of the three arrays, each tracking its dim for removal; `bg-sky-500 text-white ... rounded-full` + X → `form.removePlacementTag`); an "Add Placement" outline button toggling a dropdown panel (`absolute z-30 mt-2 w-72 ...`) with three labeled `<select>`s (options from `PLACEMENT_OPTIONS[dim]` minus already-selected; onChange → `form.addPlacementTag(dim, value)` then reset select to ""), plus a full-width "Save Placement" button that closes the panel; close on outside-click + Escape (useEffect while open). lucide `Plus`, `X`, `ChevronDown`.
- Modify `_versions/studio/StudioContentPanel.tsx`: in "Targeting & schedule", REMOVE the three Location/Type/Timing `<select>`s and render `<AdPlacementPicker form={form} />` under an "Ad placement" label; keep the Start/End date inputs.
- Modify `_versions/studio/StudioCampaignBar.tsx`: add-to-campaign validation → `if (form.placementCount === 0) { setAddError("Add at least one placement first."); return; }`; snapshot uses `locations: form.state.locations, timings: form.state.timings, types: form.state.types` (+ adType/startDate/endDate).
- Modify `_versions/faithful/FaithfulCheckoutModal.tsx` (shared by both): cart line-item middle column — replace `{item.location} · {item.timing}` with `const tags = [...item.locations, ...item.timings, ...item.types];` rendered `tags.join(" · ")` (`text-xs text-slate-500 line-clamp-1`), omit when empty. Keep area tag, name, dates, price, remove, thumbnail.

- [ ] Implement. tsc + eslint clean (studio path fully consistent now).
- [ ] Browser (studio, default): the Targeting section shows the Add Placement button; clicking it opens the dropdown panel; selecting Location/Timing/Type adds cyan pills; the picked value disappears from the dropdown; X removes a pill; Save Placement closes the panel; Add to campaign requires ≥1 pill (error otherwise) and the cart line shows the tags joined. Screenshot. Stop for review.

---

### Task 3: Faithful integration

**Read spec:** "Faithful integration".

**Files:**
- Modify `_versions/faithful/FaithfulAdTypeCard.tsx`: add an "Ad Placement" column between Ad Type and the dates (row `flex flex-col sm:flex-row gap-4`, Ad Type flex-1, an "Ad Placement" group with `<AdPlacementPicker form={form} />`, then Start/End date groups). Label styling consistent with the card.
- Modify `_versions/faithful/FaithfulCreateAd.tsx`: remove the `<FaithfulSettingsCard .../>` mount from the right column (its Location/Type/Timing role now lives in the placement picker). Right column becomes Ad Content card + cart summary only. (Leave the FaithfulSettingsCard file unused or delete it — prefer removing the import + mount.)
- Modify `_versions/faithful/FaithfulAdContentCard.tsx`: add-to-cart validation → `form.placementCount > 0` (else "Add at least one placement first."); snapshot uses the three arrays.

- [ ] Implement. tsc + eslint clean across `app/gacom-admin/create-ad/**`.
- [ ] Browser (`?v=faithful`): the top row shows Ad Type · Ad Placement (button+pills) · Start · End; adding placements shows pills; Add to cart requires ≥1 pill; the old right-rail Location/Type/Timing card is gone; cart shows tags. Screenshot. Stop for review.

---

### Task 4: Full verification

- [ ] `npx tsc --noEmit` — no errors anywhere in `app/gacom-admin/create-ad/**`.
- [ ] `npx eslint "app/gacom-admin/create-ad/**/*.{ts,tsx}"` — clean.
- [ ] `npm run build` — completes; `/gacom-admin/create-ad` builds. Report the route line.
- [ ] Browser end-to-end on BOTH `?v=studio` (default) and `?v=faithful`: add multiple placements (region + season + subject), remove one, add to cart/campaign, open checkout, confirm the cart line shows the joined tags, complete checkout. No horizontal overflow; panel closes on outside-click/Escape. Screenshots. Stop for review.

---

## Self-Review

**Spec coverage:** data/types/hook/cart → Task 1; shared picker + studio + checkout display → Task 2; faithful (placement column, remove settings card, validation) → Task 3; full verify → Task 4. ✓
**Placeholder scan:** exact option lists + method names + class conventions given; consumer-error handling across tasks is explicit. ✓
**Type consistency:** `PlacementDim`, `addPlacementTag`/`removePlacementTag`/`placementCount`, the three arrays, `PLACEMENT_OPTIONS`/`PLACEMENT_DIM_LABELS`, and the `{ form }` prop are used consistently; `PlacementSnapshot` arrays flow into `CartItem` and the checkout display. ✓

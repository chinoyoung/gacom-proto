# GAcom Admin — "Add Placement" multi-tag targeting (design)

Replicate the real GoAbroad admin's **Ad Placement** targeting in `/gacom-admin/create-ad`: an **Add Placement** button opens a dropdown panel with three selects — **Location** (world regions), **Timing** (seasons + durations), **Type** (subjects) — and each choice becomes a removable **pill**. This replaces the current single-value Location / Type / Timing `<select>`s in BOTH the faithful and studio versions (chosen 2026-09-04: both versions, dropdown panel). All mock; no backend.

## Data model changes

The placement is now a set of tags across three dimensions, each multi-select.

`_shared/types.ts`:
- `CreateAdState`: replace `location: string`, `adPlacementType: string`, `timing: string` with:
  - `locations: string[]`
  - `timings: string[]`
  - `types: string[]`
  (Keep everything else: adType, startDate, endDate, title, description, clientLink, previewDevice, uploaded*, profileBannerDismissed.)
- Add `export type PlacementDim = "location" | "timing" | "type";`
- `PlacementSnapshot`: replace the three strings with `locations: string[]; timings: string[]; types: string[];` (keep adType, startDate, endDate). `CartItem` still `extends PlacementSnapshot` + `{ id, price }`.

`_shared/mock-data.ts` — replace the old `LOCATIONS`, `AD_PLACEMENT_TYPES`, `TIMINGS` with the real option lists (transcribed from the admin screenshots, sensibly completed). Keep the old names removed only if nothing else imports them; otherwise repoint. New exports:
- `PLACEMENT_LOCATIONS` (world regions): `["Africa","Antarctica","Asia","Australia & Oceania","Caribbean","Central America","Eastern Europe & Russia","Middle East","North America","South America","Western Europe"]`
- `PLACEMENT_TIMINGS` (seasons + durations): `["Spring","Summer","Fall","Winter","Short Term","1-3 Months","3-6 Months","6-12 Months","1 Year","Academic Year"]`
- `PLACEMENT_TYPES` (subjects): `["Architecture","Au Pair","Art","Biology","Business","Chemistry","Economics","Education","Engineering","Environmental Science","History","Journalism","Language","Law","Marketing","Music","Nursing","Physics","Political Science","Psychology"]`
- `PLACEMENT_OPTIONS: Record<PlacementDim, string[]>` = `{ location: PLACEMENT_LOCATIONS, timing: PLACEMENT_TIMINGS, type: PLACEMENT_TYPES }` and `PLACEMENT_DIM_LABELS: Record<PlacementDim, string>` = `{ location: "Location", timing: "Timing", type: "Type" }` for the picker to iterate.

`_shared/useCreateAdForm.ts`:
- INITIAL_STATE: `locations: []`, `timings: []`, `types: []` (instead of the three "" selects).
- New methods: `addPlacementTag(dim: PlacementDim, value: string)` (append to the matching array if not already present), `removePlacementTag(dim: PlacementDim, value: string)` (filter it out). Include both in the returned object.
- Derived: `placementCount: number` = `locations.length + timings.length + types.length`.
- `resetPlacementFields()` also clears `locations`, `timings`, `types` (in addition to title/description/clientLink/uploaded*).

`_shared/useAdCart.ts` — `addItem(snapshot)` unchanged in shape; the snapshot now carries the three arrays (PlacementSnapshot updated). No logic change beyond the type.

## Shared component — `AdPlacementPicker`

New `_components/AdPlacementPicker.tsx` (`"use client"`, props `{ form }` where `form = ReturnType<typeof useCreateAdForm>`), used by both versions.

- Renders the current **pills**: concat of `form.state.locations`, `form.state.timings`, `form.state.types` (track each pill's dim so removal targets the right array). Each pill: `inline-flex items-center gap-1 bg-sky-500 text-white text-xs font-semibold uppercase px-2.5 py-1 rounded-full` + an X button (`removePlacementTag(dim, value)`, `aria-label="Remove {value}"`). Bright cyan matches the admin.
- An **"Add Placement"** trigger button (outline, cyan text): `border border-sky-300 text-sky-600 text-sm font-semibold px-3 py-2 rounded-md hover:bg-sky-50 cursor-pointer` — shown when the panel is closed. Toggles the panel.
- The **dropdown panel** (opens below the button, `relative` wrapper + `absolute z-30 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-lg p-4 space-y-4`): for each dim in `["location","timing","type"]`, a labeled `<select>` (label = uppercase dim, e.g. "LOCATION"; first option disabled "Select…"; options = `PLACEMENT_OPTIONS[dim]` MINUS already-selected values) whose `onChange` calls `form.addPlacementTag(dim, value)` then resets the select back to "" (so more can be added, and selected values disappear from the list). A **"Save Placement"** button (subtle/outline, full-width) closes the panel (local `open` state → false). Clicking outside or Escape also closes (a `useEffect` listener while open).
- Empty state (no pills, panel closed): just the Add Placement button.
- The pills + button live in a small stack; consumers place `<AdPlacementPicker form={form} />` where the old selects were.

## Faithful integration

- `FaithfulAdTypeCard.tsx`: the current row is Ad Type + Start/End dates. Add an **AD PLACEMENT** column between Ad Type and the dates (matching the admin's `AD TYPE · AD PLACEMENT · START DATE · END DATE` row): a labeled group ("Ad Placement") containing `<AdPlacementPicker form={form} />`. Adjust the row to `flex-col sm:flex-row` with sensible widths (Ad Type flex-1, placement min-w, dates fixed).
- Remove `FaithfulSettingsCard` (the old Location/Type/Timing selects) from `FaithfulCreateAd.tsx`'s right column — its role now lives in the placement picker. (Delete the mount; the file can stay or be removed — prefer removing the mount and leaving the now-unused file, or delete it. Keep the right column as just the Ad Content card + cart summary.)
- `FaithfulAdContentCard.tsx` add-to-cart handler: replace the `location && adPlacementType && timing` validation with `form.placementCount > 0` (else error "Add at least one placement first."), and build the snapshot with `locations: form.state.locations, timings: form.state.timings, types: form.state.types` (plus adType/startDate/endDate).

## Studio integration

- `StudioContentPanel.tsx` "Targeting & schedule" section: replace the three `<select>`s (Location/Type/Timing) with `<AdPlacementPicker form={form} />` (label the group "Ad placement"). Keep the Start/End date inputs.
- `StudioCampaignBar.tsx` add-to-campaign handler: same validation swap (`form.placementCount > 0`, error "Add at least one placement first.") and snapshot with the three arrays.

## Cart / checkout display

`FaithfulCheckoutModal.tsx` cart line item: the middle column currently shows `{item.location} · {item.timing}`. Replace with the placement tags joined: compute `const tags = [...item.locations, ...item.timings, ...item.types];` and render `tags.join(" · ")` (a `text-xs text-slate-500`, `line-clamp-1`); if empty, omit. Keep the area tag, name, dates, price, remove, and the thumbnail as-is.

## Styling & constraints

- Standard Tailwind palette (this is the non-brand admin): pills `bg-sky-500`, add button `sky-300/600`, selects/inputs as existing. No inline hex. lucide-react (`Plus`, `X`, `ChevronDown`). Client components.
- Both faithful and studio import the ONE shared `AdPlacementPicker`; no duplicate pill logic.
- The dropdown panel must not cause horizontal overflow; it's absolutely positioned and closes on outside-click/Escape/Save.
- Deduplicate: a value already selected in its dimension is not offered again and cannot be added twice.

## Out of scope

- The brand variant (still unbuilt).
- Persisting placements, real targeting logic, or per-dimension grouping of pills (pills render as one flat cyan set, matching the admin).
- Changing dates or any other field behavior.

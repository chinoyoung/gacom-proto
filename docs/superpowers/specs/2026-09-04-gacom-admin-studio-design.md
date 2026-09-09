# GAcom Admin — Create Ad "Campaign Studio" rendition (design)

A fresh, more UX-friendly third design version of `/gacom-admin/create-ad`, selectable from the version switcher (`?v=studio`), alongside `faithful` (default) and `brand`. Same admin chrome (icon rail + top bar), redesigned builder in the content area. All existing functionality preserved: 27 ad types, live per-type preview (9 archetypes), adaptive content, add-to-cart, and checkout. Chosen (brainstorm 2026-09-04): Concept A "Campaign Studio", keep admin chrome.

The UX idea: replace the 27-item dropdown with a **visual format gallery**, front-load a **large live preview**, and reframe the cart as a **campaign** you assemble (persistent campaign bar → review → checkout).

## Reuse (do not re-implement)

- Shared logic: `_shared/ad-types.ts` (`AD_TYPES`, `AD_TYPES_BY_AREA`, `getAdType`, `PlacementArea`, `AdTypeSpec`), `useCreateAdForm`, `useAdCart`, `mock-data`.
- Preview: `_versions/faithful/ad-creatives/PreviewSwitcher` + `frameMaxWidth` + the 9 archetype creatives (they take `{ spec, form }` and are presentation-neutral).
- Chrome: `_versions/faithful/FaithfulSidebar`, `_versions/faithful/FaithfulTopChrome`.
- Checkout: `_versions/faithful/FaithfulCheckoutModal` (generic; takes `{ cart, programName }`).

The studio version adds a new composition + a few presentation components. No shared logic changes.

## Files

```
lib/design-versions.ts                         # + "studio" in create-ad versions
app/gacom-admin/create-ad/page.tsx             # + case "studio" → <StudioCreateAd/>
app/gacom-admin/create-ad/_versions/studio/
  StudioCreateAd.tsx        # orchestrator: chrome (reuse Faithful sidebar/topchrome) + StudioBuilder + mount checkout modal
  StudioBuilder.tsx         # content-area layout: header, placement tabs, format gallery, builder (content+preview), campaign bar
  StudioFormatGallery.tsx   # placement-area chips + format cards (visual picker) → form.setAdType
  StudioContentPanel.tsx    # adaptive content + targeting + schedule (restyled)
  StudioCampaignBar.tsx     # sticky campaign/cart bar → add-to-campaign + review (opens checkout)
```

## Layout (keep admin chrome)

`StudioCreateAd`: `min-h-screen bg-slate-50 flex text-slate-800` → `<FaithfulSidebar navItems activeKey="image" />` + a right column (`flex-1 flex flex-col min-w-0`) with `<FaithfulTopChrome …/>` and `<main class="flex-1 overflow-y-auto">` containing `<StudioBuilder form cart />`. Mount `<FaithfulCheckoutModal cart programName />` at the end. `StudioCreateAd` calls `useCreateAdForm()` + `useAdCart()`.

`StudioBuilder` (max-width container, generous spacing, cleaner/lighter than faithful):
1. **Header** — "Campaign Studio" title + a light step chip row (Placement · Format · Build) as visual affordance (non-blocking; all sections visible).
2. **Placement selector** — a horizontal row of 5 chips/segmented tabs from `AD_TYPES_BY_AREA` keys (Homepage, Directory Homepage, Search Results, Profile & Program Listings, Brand Promotions). Local `useState<PlacementArea>` (default = the area of the current `form.state.adType`). Selecting a chip filters the gallery; it does NOT change the selected format until a card is clicked.
3. **Format gallery** — `<StudioFormatGallery area form />`: a responsive grid of cards for `AD_TYPES_BY_AREA[area]`. Each card: a small archetype "thumbnail" (an icon/mini-schematic keyed by `spec.archetype` — e.g. photo tile, banner bars, video play, thumbnail row), the format `name`, and a spec line (image dims + title/desc limits). The card matching `form.state.adType` is highlighted (2px accent border). Click → `form.setAdType(spec.name)`. This replaces the dropdown.
4. **Builder** — a two-column area (`lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]` or content-left / preview-right):
   - Left: `<StudioContentPanel form />` — the adaptive content form, restyled cleaner (cards/sections): (a) **Content** — Title (auto vs counter per `spec.titleMax`/`titleAuto`, hidden when the type has no title), Description (when `spec.descriptionMax != null`), Client Link, and the Image Upload / Video URL / auto-pulled control (same per-type logic as faithful's `FaithfulAdContentCard`), plus the "Pulled from your account" note. (b) **Targeting & schedule** — Location / Type / Timing selects (mock, from `mock-data`) + Start/End date inputs (bound to form). This keeps all the faithful form's fields.
   - Right: **Live preview** — a device-framed panel with a Desktop/Mobile toggle (bound to `form.previewDevice`) rendering `<PreviewSwitcher spec={getAdType(form.state.adType)} form={form} />` using `frameMaxWidth`. Larger and more prominent than faithful. Show the "This ad will appear on: {PREVIEW_URL}" note under it.
5. **Campaign bar** — `<StudioCampaignBar cart form />` pinned to the bottom of the main scroll area (sticky within main, not `position:fixed`): shows the running campaign (`cart.count` placements · `cart.total`), an **Add to campaign** primary button, and a **Review campaign** button (enabled when `cart.count > 0`) that calls `cart.openCart()`. Empty state: a hint "Add this placement to start your campaign." Add-to-campaign reuses the faithful validation (location/adPlacementType/timing required; else inline error) and `cart.addItem(...)` + `form.resetPlacementFields()` + a transient "Added" confirmation.

## Behavior

- Selecting a placement chip filters the gallery; selecting a format card updates the whole builder (preview + adaptive form) live.
- All form fields bind to `useCreateAdForm` exactly as faithful; the preview updates live.
- Add to campaign / Review / checkout use `useAdCart` + `FaithfulCheckoutModal` (cart → billing → done), identical behavior to faithful. Copy uses "campaign" language where natural ("Add to campaign", "Your campaign").
- The version switcher (existing floating `CreateAdVersionSwitcher`) auto-lists `studio` from the registry — no switcher code change beyond the registry entry.

## Style

- Keep the admin chrome (reused faithful sidebar/top bar). The builder content is cleaner/lighter/more spacious than faithful: rounded-xl cards, clear section headings, the format gallery and large preview as the focal points. Standard Tailwind palette (this is the same non-brand admin look: sky for primary/cobalt, amber/red where the creatives use them, slate neutrals). No inline hex. lucide-react icons. Mobile: the two-column builder stacks; the placement chips wrap/scroll; no horizontal body overflow.

## Constraints

- New version only; do NOT change `faithful`, `brand`, or any `_shared`/`ad-creatives` logic. Reuse via import.
- Client components. All mock; no backend/network. Reuse the checkout modal (no real payment).
- The switcher must show Faithful · Brand · Studio and toggle correctly; `?v=studio` renders `StudioCreateAd`, other/no param unchanged.

## Out of scope

- The brand variant of the page (still unbuilt; `brand` continues to fall back to faithful in the orchestrator).
- New ad archetypes or registry changes.
- A distinct studio checkout design (reuse faithful's modal).

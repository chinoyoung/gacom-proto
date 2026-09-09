# GAcom Admin — 27 ad types + adaptive preview/form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the 4 mock ad types in the faithful Create Ad page with the full catalog of 27 real GoAbroad ad types (grouped by placement area), a live form-bound preview creative per type (9 reusable archetypes), and an Ad Content form that adapts per type.

**Architecture:** A shared `ad-types.ts` registry holds all 27 specs (code, area, archetype, char limits, image dims, buttons, auto-fields, price). The Ad Type `<select>` groups by area (optgroups). `FaithfulAdPreviewCard` becomes a switcher that renders the archetype component matching the selected type. `FaithfulAdContentCard` adapts (title/description limits, description field, image-size hints, auto-field notes). 9 archetype components render live from form state with mock fallbacks.

**Tech Stack:** Next.js 16, React 19, TS strict, Tailwind v4, lucide-react. No backend.

**Spec:** `docs/superpowers/specs/2026-09-04-gacom-admin-ad-types-design.md` — the detailed per-type registry data and per-archetype layouts live there; each task below references it. Implementers MUST read the spec sections named in their task.

## Global Constraints

- No component test harness; verify each task with `npx tsc --noEmit`, `npx eslint <files>`, and a browser drive of the running dev server (`http://localhost:3000/gacom-admin/create-ad`, authed in the in-app Browser pane). No invented component unit tests.
- Do NOT run git. Fix mistakes with Edit only.
- Faithful variant only; NO inline hex. Standard Tailwind palette maps GoAbroad brand: cobalt→`sky-800`/`sky-900`, roman→`red-600`, pill→`amber-500`, neutrals→slate. lucide-react icons.
- All mock: no backend, no network, no real video, no runtime Cloudinary dependency (uploaded image or local placeholder only). The spec's Cloudinary URLs are reference only.
- Keep the existing cart/checkout, Add-to-cart, Save-as-Draft, and pointer-cursor behavior working with the new 27-type list.
- No horizontal body overflow; wide formats scroll within the preview frame.
- The `<select>` value is the ad-type **name** (e.g. "Homepage Premier Feature") to stay compatible with `form.state.adType` and the cart.

---

### Task 1: Foundation — registry, grouped select, form state, adaptive-form scaffold, preview switcher (fallback)

**Files:**
- Create: `app/gacom-admin/create-ad/_shared/ad-types.ts`
- Modify: `_shared/types.ts` (+ `description` on `CreateAdState`)
- Modify: `_shared/useCreateAdForm.ts` (+ `description`/`setDescription`, default `adType`, reset)
- Modify: `_shared/mock-data.ts` (drop `AD_TYPE_PRICES`/`DEFAULT_AD_PRICE`? keep DEFAULT; keep `AD_PREVIEW_PROVIDER`/`AD_PREVIEW_DEFAULT_TITLE`; add sample rating/reviews/description constants)
- Modify: `_shared/useAdCart.ts` (price from `getAdType(name)?.price ?? DEFAULT_AD_PRICE`)
- Modify: `_versions/faithful/FaithfulAdTypeCard.tsx` (grouped optgroups)
- Modify: `_versions/faithful/FaithfulAdContentCard.tsx` (adaptive title/description/image-hint/auto-fields)
- Create: `_versions/faithful/ad-creatives/PreviewSwitcher.tsx` (switch on `spec.archetype`; fallback for unbuilt)
- Modify: `_versions/faithful/FaithfulAdPreviewCard.tsx` (body → `<PreviewSwitcher spec form />`)

**Read spec sections:** "Data model", "The 27 entries", "Grouped Ad Type select", "Adaptive Ad Content form", "Preview switcher".

Steps:
- [ ] **1.** Write `ad-types.ts` with `PlacementArea`, `AdArchetype`, `AdTypeSpec`, the full `AD_TYPES` array (all 27 per the spec table — codes, names, areas, archetypes, titleMax/titleAuto, descriptionMax, image dims + `imageRatio`, buttons, autoFields, a flat `price`, `example` URL), `AD_TYPES_BY_AREA`, and `getAdType(name)`. Assign prices per the spec's tiering note (round numbers).
- [ ] **2.** `types.ts`: add `description: string` to `CreateAdState`.
- [ ] **3.** `useCreateAdForm.ts`: default `adType` = `AD_TYPES[0].name` ("Homepage Premier Feature"); add `description:""` to INITIAL_STATE; add `setDescription(v)` (cap to 300 in-hook; per-type cap enforced by the card); include in return; `resetPlacementFields` also clears `description`.
- [ ] **4.** `useAdCart.ts`: replace `AD_TYPE_PRICES[snapshot.adType] ?? DEFAULT_AD_PRICE` with `getAdType(snapshot.adType)?.price ?? DEFAULT_AD_PRICE` (import from `ad-types`).
- [ ] **5.** `FaithfulAdTypeCard.tsx`: render the Ad Type `<select>` as grouped `<optgroup label={area}>` over `AD_TYPES_BY_AREA`, option value = spec.name.
- [ ] **6.** `FaithfulAdContentCard.tsx`: resolve `const spec = getAdType(form.state.adType)`. Title: counter `{titleLength}/{spec.titleMax}` + `maxLength`; when `spec.titleAuto`, show a disabled "Auto-populated from your account" field (hide counter). Description: render a textarea only when `spec.descriptionMax != null`, bound to `form.state.description`/`setDescription`, `maxLength={spec.descriptionMax}`, with a `{len}/{max}` counter. Image Upload sublabel: "Desktop · {spec.imageDesktop} px"; when archetype is `video-split` show a "Video URL" text input instead; when the type is logo/auto image-less show an "Auto-pulled from your account" note instead of the dropzone. Add an auto-fields note line: "Pulled from your account: {spec.autoFields.join(', ')}" when non-empty. Keep Add-to-cart/Save-as-Draft exactly as they are.
- [ ] **7.** `PreviewSwitcher.tsx`: `{ spec, form }`; `switch (spec.archetype)` → for now every case returns a `<FallbackCreative spec />` (a neat placeholder card: "Live preview for {spec.name} ({spec.imageDesktop}) — coming in a later phase", with the format/dimensions shown). Export a `frameMaxWidth(spec)` helper (cards 380 / banners+covers 640 / video 640 / others 380) for the preview frame.
- [ ] **8.** `FaithfulAdPreviewCard.tsx`: replace the current inline ad-creative body with `const spec = getAdType(form.state.adType)` and `<PreviewSwitcher spec={spec} form={form} />`, using `frameMaxWidth(spec)` for the device-frame max width (mobile still narrower). Keep header + footer link.
- [ ] **9.** `npx tsc --noEmit` clean; `npx eslint "app/gacom-admin/create-ad/**/*.{ts,tsx}"` clean.
- [ ] **10.** Browser: the Ad Type select shows 5 optgroups with all 27 types; selecting types updates the preview header and the fallback card; the form shows/hides the Description field and title counter per type (e.g. Ad A shows a 65-char description + auto title; Ad HH shows title 70 + desc 140; Ad B shows title 60, no desc); Add-to-cart still works and the cart price reflects the new type. Screenshot. Stop for review (no git).

---

### Task 2: Program-card archetype (Ad A, B, I, N, O, P)

**Files:** Create `_versions/faithful/ad-creatives/_shared.tsx` (LogoTile, ReviewStars, CoverImage, PillBadge), `_versions/faithful/ad-creatives/ProgramCardCreative.tsx`; Modify `PreviewSwitcher.tsx` (wire `program-card`).
**Read spec:** archetype #1 + the entries for Ad A/B/I/N/O/P.
- [ ] Build `_shared.tsx` helpers (see spec "Archetype components / Shared bits"): `LogoTile({provider})` initials tile; `ReviewStars({rating,reviews,verified})`; `CoverImage({form,ratio,rounded})` (uploaded or placeholder); `PillBadge({children})` amber.
- [ ] Build `ProgramCardCreative({spec, form})` per spec archetype #1: cover (ratio from spec) + heart; reviews row when `autoFields` includes Reviews (logo + provider + stars); cobalt (`sky-800`) title from `form.state.title || AD_PREVIEW_DEFAULT_TITLE`; description when the type has desc (`form.state.description` or a sample) — for auto types use a sample description; "See All N Programs" link when `autoFields` includes `SeeAllPrograms`; buttons from `spec.buttons` (Visit Website = `bg-sky-800` filled; View Program = outline). Ad P: render the LogoTile large in place of the cover.
- [ ] Wire `program-card` in `PreviewSwitcher`.
- [ ] tsc + eslint clean.
- [ ] Browser: select each of Ad A/B/I/N/O/P; confirm the card renders live (title from form, description where applicable, correct button set, reviews where applicable), cover binds to uploaded image, mobile toggle narrows it. Screenshot. Stop for review.

---

### Task 3: Simple-photo archetype (Ad F, H, M)
**Files:** Create `ad-creatives/SimplePhotoCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #2 + Ad F/H/M.
- [ ] Build `SimplePhotoCreative({spec, form})`: cover (1:1) + LogoTile + title (`sky-800`) + a full-width single button (`spec.buttons[0]`, filled `bg-sky-800`). No reviews/description.
- [ ] Wire `simple-photo`; tsc+eslint; browser-verify Ad F/H/M; screenshot; stop for review.

---

### Task 4: Thumbnail-text archetype (Ad G, R)
**Files:** Create `ad-creatives/ThumbTextCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #3 + Ad G/R.
- [ ] Build `ThumbTextCreative({spec, form})`: horizontal — square thumb (1:1, ~100px) left + provider (bold) + description (`form.state.description` or sample, 65-char feel) right. No button (or a subtle link if `spec.buttons` non-empty).
- [ ] Wire `thumb-text`; tsc+eslint; browser-verify Ad G/R; screenshot; stop for review.

---

### Task 5: Split-banner archetype (Ad C, J)
**Files:** Create `ad-creatives/SplitBannerCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #4 + Ad C/J.
- [ ] Build `SplitBannerCreative({spec, form})`: 2-col wide (1.91:1 frame) — left image with amber PillBadge ("Featured Provider of the Month"); right title (large `sky-800`) + subtitle `with {provider}` + one filled button. Ensure the banner uses the wider frame width.
- [ ] Wire `split-banner`; tsc+eslint; browser-verify Ad C/J; screenshot; stop for review.

---

### Task 6: Brand-promo split archetype (HH, GG, KK, MM, JJ, LL)
**Files:** Create `ad-creatives/BrandSplitCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #5 + HH/GG/KK/MM/JJ/LL.
- [ ] Build `BrandSplitCreative({spec, form})`: left image + amber pill; right title (`sky-800`) + description (per `descriptionMax`, from `form.state.description` or sample) + LogoTile + button (bottom-right, e.g. "Learn More").
- [ ] Wire `brand-split`; tsc+eslint; browser-verify a couple (HH, JJ); screenshot; stop for review.

---

### Task 7: Centered-overlay archetype (II, NN)
**Files:** Create `ad-creatives/CenteredOverlayCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #6 + II/NN.
- [ ] Build `CenteredOverlayCreative({spec, form})`: cover image with a dark overlay (`bg-black/40`), centered LogoTile + white title + centered button.
- [ ] Wire `centered-overlay`; tsc+eslint; browser-verify II/NN; screenshot; stop for review.

---

### Task 8: Video-split archetype (Ad E, L)
**Files:** Create `ad-creatives/VideoSplitCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #7 + Ad E/L.
- [ ] Build `VideoSplitCreative({spec, form})`: left column amber "Featured video of the month" label + title + provider + button; right a mock video player (uploaded image or placeholder thumbnail, centered Play button, a faux bottom control bar with a red progress dot + a time like "0:01 / 3:10"). No real video.
- [ ] Wire `video-split`; tsc+eslint; browser-verify Ad E/L; screenshot; stop for review.

---

### Task 9: Cover-photo archetype (Ad T/D, K)
**Files:** Create `ad-creatives/CoverPhotoCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #8 + Ad T-D/K.
- [ ] Build `CoverPhotoCreative({spec, form})`: wide banner (1440×500 ratio). Ad K: overlay a bottom-left block (LogoTile + provider white + `★ rating (reviews)` + "Verified" + "Since 2005" + "N Programs" + Visit Website [`bg-red-600`] + Contact Provider [`bg-sky-800`]). Ad T/D: image only with a subtle frame + heart. Use the wide frame width.
- [ ] Wire `cover-photo`; tsc+eslint; browser-verify Ad K + Ad T/D; screenshot; stop for review.

---

### Task 10: Hot-jobs archetype (Ad Q) + full verification
**Files:** Create `ad-creatives/HotJobsCreative.tsx`; Modify `PreviewSwitcher.tsx`.
**Read spec:** archetype #9 + Ad Q.
- [ ] Build `HotJobsCreative({spec, form})`: compact auto listing row — thumb + title + short description + a small amber "Hot" tag; from mock/auto data.
- [ ] Wire `hot-jobs`. Remove the FallbackCreative usage (all archetypes now real) or keep it as a defensive default.
- [ ] Full pass: `npx tsc --noEmit`, `npx eslint "app/gacom-admin/create-ad/**/*.{ts,tsx}"`, `npm run build` all clean; browser-drive several types across all 9 archetypes + Add-to-cart + checkout still work; no horizontal overflow. Screenshots. Stop for review.

---

## Self-Review

**Spec coverage:** registry+grouped select+form state → Task 1; each of the 9 archetypes → Tasks 2–10; adaptive form (title/desc/image/auto) → Task 1 step 6; price integration → Task 1 step 4; cart compatibility → Global Constraints + Task 1. ✓
**Placeholder scan:** archetype layouts are specified in the referenced spec sections (not restated as vague TODOs); each task names concrete files, bindings, and verification. ✓
**Type consistency:** `spec: AdTypeSpec` + `form: ReturnType<typeof useCreateAdForm>` are the uniform props for every archetype and the switcher; `getAdType(name)`, `AD_TYPES_BY_AREA`, `frameMaxWidth` names are used consistently; `description`/`setDescription` defined in Task 1 and consumed by the card + creatives. ✓

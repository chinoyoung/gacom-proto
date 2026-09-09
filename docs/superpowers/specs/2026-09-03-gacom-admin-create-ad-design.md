# GAcom Admin — Create Ad page (design)

A new prototype page at `/gacom-admin/create-ad` that recreates the GoAbroad **Create Ad** admin screen (the real Laravel admin at `admin.goabroad.test`). Full-page recreation including admin chrome, functional (no backend), rendered in two design variants: **faithful** (matches the real admin) and **brand** (same layout restyled with this prototype's cobalt/fern language). Faithful is the default and is built first.

## Approach & versioning

- Reuse the existing design-version registry as the single source of truth: register a `create-ad` entry in `PAGE_VERSIONS` (`lib/design-versions.ts`) with versions `faithful` (default) and `brand`.
- The orchestrator reads the active version with `useDesignVersion("create-ad")` (`lib/use-design-version.ts`) and switches on it. URL: `/gacom-admin/create-ad?v=brand` (no param → faithful).
- Do NOT use `PrototypeShell` / the canvas `ToolbarVersionSwitcher` — those wrap pages in the marketing `Header`/`Footer` and are gated to specific canvas routes. This page renders its own full-screen admin chrome. Instead, a small self-contained floating version pill (bottom-right) lets you toggle `faithful`/`brand`; it reads `versions` from the hook and links to `?v=<id>`.
- `app/gacom-admin/layout.tsx` is bare: it renders `children` and mounts the floating switcher. No marketing header/footer.

## File structure

```
lib/design-versions.ts                         # + "create-ad" registry entry
app/gacom-admin/
  layout.tsx                                    # bare layout + CreateAdVersionSwitcher
  create-ad/
    page.tsx                                    # orchestrator: useDesignVersion("create-ad") → switch
    _shared/
      types.ts                                  # CreateAdState, option list types
      mock-data.ts                              # ad types, locations, types, timings, program name, preview URL, nav items
      useCreateAdForm.ts                        # all interactive state (shared by both versions)
    _components/
      CreateAdVersionSwitcher.tsx               # floating faithful/brand pill (self-contained)
    _versions/
      faithful/
        FaithfulCreateAd.tsx                    # full-page composition
        (section components as needed: Sidebar, TopChrome, AdTypeCard, AdPreviewCard, SettingsCard, AdContentCard)
      brand/
        BrandCreateAd.tsx                       # built later (Task set 2)
```

Rationale for decomposition: the two variants share **behavior and data** but not **styling**, so `useCreateAdForm` + `mock-data` + `types` are shared, while each variant owns its presentational components (their markup/classes genuinely differ). Each variant is a full-page composition split into section components so no single file gets unwieldy.

## Shared interactive state — `useCreateAdForm`

One hook returning state + setters. Fields:

- `adType: string` — default `"Article Directory Destination Feature - Intern Abroad"`.
- `startDate: string` (ISO `YYYY-MM-DD`) — default `2026-07-17`; `endDate` — default `2026-08-15`.
- `location: string`, `adPlacementType: string`, `timing: string` — default `""` (show "Select…").
- `title: string` — default `""`, capped at **85** chars (enforce in setter: ignore input beyond 85).
- `clientLink: string` — default `""` (placeholder `https://example.com`).
- `previewDevice: "desktop" | "mobile"` — default `"desktop"`.
- `uploadedFileName: string | null` — default `null`; set from the file input's chosen file name (no upload).
- `profileBannerDismissed: boolean` — default `false`.

No persistence; state is component-local. `titleLength` is derived (`title.length`).

## Mock data — `mock-data.ts`

- `AD_TYPES: string[]` — the default value plus a few plausible siblings (e.g. "Article Directory Destination Feature - Study Abroad", "Homepage Feature - Volunteer Abroad", "Sidebar Banner - Intern Abroad").
- `LOCATIONS`, `AD_PLACEMENT_TYPES`, `TIMINGS: string[]` — a few plausible mock options each.
- `PROGRAM_NAME = "Volunteer for the Visayans"`; `PROFILE_COMPLETION = 58`; `PREVIEW_URL = "https://beta.goabroad.com/intern-abroad/"`.
- `NAV_ITEMS` — the icon-rail entries (label + lucide icon + `active?`), image item active.

## Full-page layout (both versions)

Left icon rail · top chrome · main column (left, wide) · right rail (narrow). On the faithful version this mirrors the screenshot; the brand version keeps the same regions and proportions.

1. **Left icon rail** (fixed, narrow vertical strip): circular avatar "H" with a small status dot at top; a vertical stack of ~9 lucide nav icons — shield-check, layout-grid (dashboard), contact/id-card, **image (active)**, quote, list, gift, dollar-sign, message-square; a power icon pinned to the bottom. Icons are visual only; the active item (image) is highlighted. Tooltips optional.
2. **Top chrome**:
   - Dismissible banner: "Your profile is 58% complete." centered, with a chevron button on the right; dismiss hides it (`profileBannerDismissed`).
   - Top bar: hamburger icon, page title "Volunteer for the Visayans", right-aligned "Create Program" button (outline), a phone icon and a gear icon.
3. **Main column**:
   - "Create Ad" heading.
   - **Ad Type card**: an "Ad Type" `<select>` (options from `AD_TYPES`), and "Start Date" / "End Date" native date inputs (`type="date"`) bound to state.
   - **Ad Preview card**: header row "Ad Preview | {adType}" on the left, a Desktop/Mobile segmented toggle on the right (bound to `previewDevice`). Body: a framed preview area whose width narrows in mobile mode; inside, a subtle travel-stamp-style patterned background (approximated with a CSS pattern / neutral tiled motif — the exact production asset is out of scope) and a centered `100 × 100` grey placeholder tile. Footer line: "This ad will appear on this page:" followed by `PREVIEW_URL` as an external link.
4. **Right rail** (two stacked cards):
   - **Settings card**: "Location", "Type", "Timing" labels each over a `<select>` defaulting to "Select…", options from mock data.
   - **Ad Content card**: header "Ad Content"; "Title" label with a right-aligned `{titleLength}/85` counter and a text input (`Enter ad title`); "Client Link" label with a link-icon-prefixed input (`https://example.com`); "Image Upload" → "Desktop" sub-label and a dashed dropzone reading "Click to upload" (a monitor icon) that, once a file is chosen, shows the chosen file name / a small preview state; footer with two buttons: "Save as Draft" (subtle) and "Submit for Approval" (primary, arrow). Buttons are clickable no-ops.

## Interactivity (no backend)

- Desktop/Mobile toggle switches the preview frame width and the active toggle styling.
- Title input updates the live `x/85` counter and hard-caps at 85 characters.
- All three right-rail selects and the Ad Type select open with mock options and retain their selection.
- Start/End date inputs are editable and bound to state.
- Choosing a file in the dropzone shows the file name (and, if an image, an object-URL thumbnail); no network upload.
- Profile banner chevron dismisses the banner.
- "Create Program", "Save as Draft", "Submit for Approval" are clickable no-ops (no navigation, no persistence).

## faithful version — styling

Match the screenshot as closely as practical, and treat these as literal, non-negotiable values (this variant intentionally departs from the cobalt/fern brand because it mimics a different product):

- Surfaces: white cards on a very light grey app background; thin `slate-200` borders; small radius; minimal shadow.
- Icon rail: light/white strip, grey inactive icons (`slate-400`/`slate-500`), the active (image) icon highlighted with a light blue tint background and blue icon.
- Avatar "H": magenta/pink circle badge with a small status dot (the one screenshot accent that is pink).
- Primary buttons ("Submit for Approval"): solid blue (`#…` blue-600-ish via a standard Tailwind blue, since this is not the brand); "Create Program" is an outline/ghost button; "Save as Draft" is a subtle grey button.
- Toggle, inputs, selects: standard light admin styling matching the screenshot (compact, `h-10`-ish, `text-sm`).
- Type scale and spacing follow the screenshot's calm, dense admin rhythm.

Note: the faithful version MAY use standard Tailwind palette colors (blue/slate/grey/pink) rather than the brand tokens, because it recreates a different design system. This is an explicit, intentional exception to the repo's "brand tokens only" rule, scoped to `_versions/faithful/**` on this page. No inline hex in `className` — use Tailwind's standard named colors (e.g. `bg-blue-600`, `text-slate-500`, `bg-pink-500`).

## brand version — styling (built after faithful)

Same layout, regions, proportions, and interactions; restyled to this prototype's language per CLAUDE.md / BRANDING.md:

- Primary actions in `cobalt-*`; active/progress/success accents in `fern-*`; destructive/attention in `roman-*` where relevant.
- Our card conventions: restrained shadows, modest radius (not overly rounded), no oversized buttons, clean spacing.
- Icon rail active state and avatar use brand tokens instead of blue/pink.
- No inline hex; brand tokens + standard Tailwind utilities only.

## Constraints

- Client component(s) (`"use client"`) — interactive state, no server data.
- Full-screen page: the `gacom-admin` layout must NOT render the marketing `Header`/`Footer` or `PrototypeShell`.
- Mobile: the page recreates a desktop admin; it should remain usable and not overflow horizontally on smaller widths (rail may collapse or the layout stack) but pixel-faithful mobile is not required — no horizontal body scroll.
- Icons: `lucide-react` (already a dependency).
- Reuse `useDesignVersion` / `PAGE_VERSIONS`; do not modify the canvas shell or `isCanvasRoute`.

## Out of scope

- Real persistence, form submission, uploads, or navigation to other icon-rail destinations.
- The other admin pages/sections; auth changes.
- Extracting the exact production travel-stamp background asset (approximate it).

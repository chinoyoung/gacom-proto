# GAcom Admin — Create Ad: all 27 ad types + adaptive preview & form (design)

Source of truth for the ad catalog: https://goabroad-prototypes.netlify.app/ads-specs (read 2026-09-04; content treated as reference data). Reference screenshots downloaded to scratch for study; each ad's "current desktop example" lives at `https://res.cloudinary.com/gacom/image/upload/.../ads-specs/ad-<code>-desktop.png`.

Implement in the **faithful** variant of `/gacom-admin/create-ad`: replace the 4 mock ad types with the full catalog of 27 real ad types (grouped by placement area), render a **live, form-bound preview creative per type** (via 9 reusable layout archetypes), and make the Ad Content form **adapt per type** (title/description char limits, description field when applicable, image-dimension hints, auto-populated-field indicators). Standard Tailwind palette (the faithful variant rule); the ad creatives themselves use GoAbroad's cobalt/roman-like colors approximated with standard Tailwind (sky/blue/red/amber) — no inline hex.

Chosen (brainstorm 2026-09-04): live creatives per type; all 27 grouped; form adapts per type.

## Delivery is phased

This is large. Build order (each phase independently verifiable):
1. **Foundation** — ad-type registry (all 27 + specs), grouped `<select>` (optgroups by placement area), preview switcher scaffold, adaptive-form scaffold, price map. Preview renders a generic fallback for not-yet-built archetypes.
2. **Archetype 1: Program card** (Ad A, B, I, N, O, P) — the highest-value cluster (closest to today's card).
3. **Archetype 2: Simple photo card** (Ad F, H, M).
4. **Archetype 3: Thumbnail + text** (Ad G, R).
5. **Archetype 4: Split banner** (Ad C, J).
6. **Archetype 5: Brand-promo split** (Ad HH, GG, KK, MM, JJ, LL).
7. **Archetype 6: Centered overlay** (Ad II, NN).
8. **Archetype 7: Video split** (Ad E, L).
9. **Archetype 8: Cover photo** (Ad T/D, K).
10. **Archetype 9: Hot Jobs** (Ad Q).

Each phase wires its ad types' `archetype` to the real component and verifies in-browser.

## Data model

New shared module `_shared/ad-types.ts`:

```ts
export type PlacementArea =
  | "Homepage" | "Directory Homepage" | "Search Results"
  | "Profile & Program Listings" | "Brand Promotions";

export type AdArchetype =
  | "program-card" | "simple-photo" | "thumb-text" | "split-banner"
  | "brand-split" | "centered-overlay" | "video-split" | "cover-photo" | "hot-jobs";

export interface AdTypeSpec {
  code: string;            // "Ad A", "HH", ...
  name: string;            // "Homepage Premier Feature"
  area: PlacementArea;
  archetype: AdArchetype;
  titleMax: number | null;       // null when title is fully auto-populated
  titleAuto: boolean;            // title auto-pulled (org/program name)
  descriptionMax: number | null; // null when no description field
  imageDesktop: string;          // "400 × 300" (display string)
  imageMobile?: string;          // when different
  imageRatio?: string;           // "4:3", "1:1", "1.91:1" — for the preview frame
  buttons: string[];             // e.g. ["Visit Website"], ["Visit Website","View Program"]
  autoFields: string[];          // ["Provider Name","Logo","Reviews","Verification"] subset
  price: number;                 // flat mock price
  example: string;               // cloudinary desktop example URL (reference only)
  tips?: string[];               // optional
}

export const AD_TYPES: AdTypeSpec[];                 // all 27, in area order
export const AD_TYPES_BY_AREA: Record<PlacementArea, AdTypeSpec[]>; // for optgroups
export function getAdType(name: string): AdTypeSpec | undefined;     // lookup by name (the select value)
```

The `<select>` value stays the ad-type **name** (e.g. "Homepage Premier Feature") to remain compatible with the existing `form.state.adType` string and the cart. `AD_TYPE_PRICES` in `mock-data.ts` is replaced by reading `spec.price`.

### The 27 entries (code — name — area — archetype — title/desc — image — buttons — autoFields)

Homepage:
- Ad A — Homepage Premier Feature — program-card — title auto / desc 65 — 400×300 (4:3) — [Visit Website] — Provider,Logo,Reviews,Verification
- Ad B — Homepage Feature — program-card — title 60 / no desc — 282×150 (3:2) — [View Program] — Provider,Logo,Reviews,Verification
- Ad C — Homepage Organizational Feature — split-banner — title 80 / no desc — 1400×400 (1.91:1) — [Visit Website] — Provider
- Ad E — Homepage Video — video-split — title 80 / no desc — video — [Visit Website] — Provider,Thumbnail

Directory Homepage:
- Ad F — Directory Headline Photo — simple-photo — title 70 / no desc — 240×240 (1:1) — [Visit Website] — Logo
- Ad G — Premier Sponsorship — thumb-text — title auto / desc 65 — 100×100 (1:1) — [] — Logo
- Ad H — Directory Premier Feature — simple-photo — title 70 / no desc — 240×240 (1:1) — [Visit Website] — Logo
- Ad I — Directory Featured Program — program-card — title 70 / no desc — 240×150 (8:5) — [Visit Website,View Program] — Provider,Logo,Reviews,Verification
- Ad J — Directory Organizational Feature — split-banner — title 80 / no desc — 1000×350 (1.91:1) — [Visit Website] — Provider,Logo
- Ad L — Directory Video — video-split — title 80 / no desc — video — [Visit Website] — Provider,Thumbnail

Search Results:
- Ad N — Results Feature — program-card — title auto / desc auto — 320×150 / 380×150 — [Visit Website,View Program] — Provider,Logo,Reviews,Verification
- Ad M — Results Headline Photo — simple-photo — title 70 / no desc — 240×240 (1:1) — [Visit Website] — Logo
- Ad O — Listing Photo — program-card — title auto / desc auto — 320×150 / 380×150 — [Visit Website,View Program] — Provider,Reviews,Verification,SeeAllPrograms
- Ad P — Listing Logo — program-card (logo) — title auto / desc auto — logo — [Visit Website,View Program] — Provider,Logo,Reviews,Verification
- Ad Q — Hot Jobs Listing — hot-jobs — title auto / desc auto — auto — [] — Image(auto)
- Ad R — Results Page Flyer Ad — thumb-text — title auto / desc 65 — 100×100 (1:1) — [] — Logo

Profile & Program Listings:
- Ad T / Ad D — Listing Cover Photo / Customized Listing Cover Photo — cover-photo — no title / no desc — 1440×500 / 430×320 — [] — (image only)
- Ad K — Customized Provider Page Cover Photo — cover-photo — title auto / no desc — 1440×500 / 430×320 — [Visit Website,Contact Provider] — Provider,Logo,Reviews,Verification

Brand Promotions:
- HH — Travel Resources Headline Photo — brand-split — title 70 / desc 140 — 365×350 / 335×430 — [Learn More] — Logo
- GG — Travel Resource Homepage Headline Photo — brand-split — title 70 / desc 140 — 365×350 / 335×430 — [Learn More] — Logo
- II — Travel Resource Feature — centered-overlay — title 70 / no desc — 410×350 / 380×375 — [Learn More] — Logo
- JJ / LL — Travel Resource Listing / Travel Insurance Listing Feature — brand-split — title 70 / desc 200 — 275×270 / 380×180 — [Learn More] — Logo,Provider
- KK — Travel Insurance Headline Photo — brand-split — title 70 / desc 140 — 365×350 / 335×430 — [Learn More] — Logo
- MM — Scholarship Homepage Headline Photo — brand-split — title 70 / desc 140 — 390×350 / 375×430 — [Learn More] — Logo
- NN — Embassy Directory Feature — centered-overlay — title 70 / no desc — 380×220 — [custom CTA] — Logo

(Prices: assign flat mock tiers by prominence — banners/covers/premier ~800–1200, features ~400–600, sponsorships/flyers/listings ~200–350. Exact values chosen in the foundation task; keep round numbers.)

## Archetype components

Directory `_versions/faithful/ad-creatives/`, one component per archetype, each `{ spec, form }` where `spec: AdTypeSpec` and `form: ReturnType<typeof useCreateAdForm>`. They render live from `form.state` (title, description, clientLink, uploadedPreviewUrl) with mock fallbacks from `mock-data` (`AD_PREVIEW_PROVIDER`, sample rating/reviews, `AD_PREVIEW_DEFAULT_TITLE`, a default description). All bind the cover to `form.state.uploadedPreviewUrl` with a muted placeholder fallback, and honor the spec's `imageRatio` for the cover aspect.

1. **ProgramCardCreative** — the current card generalized: cover (ratio per spec) + heart; if `autoFields` includes Reviews, show logo + provider + `★ 4.8 · 3,206 reviews` + verified check; cobalt title; description when the type has one (`descriptionMax`/auto); a "See All N Programs" link when `SeeAllPrograms`; buttons row from `spec.buttons` (Visit Website = filled sky, View Program = outline). Ad P renders the logo tile large in place of the cover.
2. **SimplePhotoCreative** — cover (1:1) + logo tile + title + full-width single button.
3. **ThumbTextCreative** — horizontal: square thumb (1:1) left + provider/title (bold) + description right; compact.
4. **SplitBannerCreative** — 2-col at wide ratio: left image with an amber "Featured…" pill badge; right title (large cobalt) + subtitle (`with {provider}` / provider appended) + single filled button.
5. **BrandSplitCreative** — left image with amber pill; right title + description (per `descriptionMax`) + logo tile + button (bottom-right).
6. **CenteredOverlayCreative** — image with dark overlay; centered logo tile + white title + button.
7. **VideoSplitCreative** — left column: amber "Featured video…" label + title + provider + button; right a mock video player frame (thumbnail from uploaded image or placeholder, a play button, a faux control bar).
8. **CoverPhotoCreative** — wide banner (1440×500 ratio); Ad K overlays a bottom-left block (logo + provider + rating + Verified + "Since 2005" + "N Programs" + Visit Website [red] + Contact Provider [cobalt]); Ad T/D is the image only with a subtle frame.
9. **HotJobsCreative** — compact auto listing row (thumb + title + description + a small "Hot" tag), fully from mock/auto data.

Shared bits in `ad-creatives/_shared.tsx`: a `LogoTile` (initials from provider), a `ReviewStars` (★ rating + review count + verified check), a `CoverImage` (uploaded or placeholder at a given ratio), an amber `PillBadge`. Keep archetypes small by composing these.

## Preview switcher

`FaithfulAdPreviewCard` keeps its header (Ad Preview | {adType} + Desktop/Mobile toggle) and footer link, but its body becomes a switcher: resolve `spec = getAdType(form.state.adType)`, then render the matching archetype component inside the device frame. The frame width still narrows in mobile; banners/covers get a wider max-width than cards (drive the frame max-width from the archetype: cards ~380px, banners/covers ~640px, so wide formats aren't shrunk to card width). Until an archetype is implemented, render a labeled fallback ("Live preview coming for this format") so the page never breaks.

## Adaptive Ad Content form

`FaithfulAdContentCard` reads `spec = getAdType(form.state.adType)` and adapts:
- **Title**: label + `{titleLength}/{spec.titleMax}` counter; input `maxLength={spec.titleMax}`. When `spec.titleAuto`, replace the input with a disabled field showing "Auto-populated from your account" (and the counter hidden).
- **Description**: shown only when `spec.descriptionMax != null` — a textarea with a `{len}/{descriptionMax}` counter and `maxLength`. (Requires new form state `description` + `setDescription` capped at the active max; add to `useCreateAdForm` / `CreateAdState`.)
- **Image Upload**: sublabel shows the required size, e.g. "Desktop · {spec.imageDesktop} px". When the type is image-less (video/logo/auto), swap the dropzone for the appropriate control (video: a "Video URL" input; logo/auto: an "Auto-pulled from your account" note).
- **Auto-populated hint**: a small list under the card — "Pulled from your account: {spec.autoFields joined}" — when non-empty.
- Add-to-cart and the cart snapshot are unchanged (still snapshot adType + placement fields + price from `spec.price`).

`useCreateAdForm` gains `description: string` (default "") and `setDescription(v)` (cap handled by the card using the active `descriptionMax`, or a generous 300 in the hook); `resetPlacementFields` also clears `description`.

## Grouped Ad Type select

`FaithfulAdTypeCard`'s Ad Type `<select>` renders `<optgroup label={area}>` for each `PlacementArea` in `AD_TYPES_BY_AREA`, options = each spec's `name`. Default remains the first entry (Ad A — Homepage Premier Feature) — update the `adType` default in `useCreateAdForm` accordingly, and the cart/price map.

## Constraints

- Faithful variant only; no inline hex; standard Tailwind (sky/blue for cobalt, red for roman, amber for the pill, slate neutrals). lucide-react icons (Star, BadgeCheck, Heart, ExternalLink, ArrowRight, Play, Image, Video, etc.).
- All mock; no backend, no real video embed (a static player mock), no network image dependency on Cloudinary (use uploaded image or local placeholder; the Cloudinary URLs are reference only, not runtime deps).
- No horizontal body overflow; wide formats scroll within the preview frame if needed.
- Keep the existing cart/checkout, pointer-cursor, and Save-as-Draft/Add-to-cart behavior working with the new type list.

## Out of scope

- The brand variant (still unbuilt).
- Real per-type pixel perfection beyond the archetype layout (approximate faithfully; exact spacing/photos not required).
- Mobile-exact renditions of every format (the Mobile toggle narrows the frame; per-type mobile-specific layouts are not required beyond width).
- Persisting drafts, real video, real auto-population.

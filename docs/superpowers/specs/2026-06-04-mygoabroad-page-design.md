# /mygoabroad Page — Design Spec

**Date:** 2026-06-04
**Scope:** A new `/mygoabroad` page in gacom-proto with two design versions: **v1** = a faithful copy of the existing gacom-next `/mygoabroad` page; **v2** = the same content restyled to match the `/marketplace/partner` design language.

## Source of truth
- **Content/visual source:** gacom-next, live at `http://localhost:3030/mygoabroad`, code under `/Users/chinoyoung/Code/gacom-next/pages/mygoabroad/index.tsx` and `/Users/chinoyoung/Code/gacom-next/components/mygoabroad/`. Implementers should read those files for exact copy.
- **Design-language target (v2):** gacom-proto `app/marketplace/partner/` (v1 + v2 components).

## Decisions (locked with user)
- Two versions via the design-version system: register `mygoabroad` (v1 + v2), default **v1**.
- eSIM lookup form + insurance block → **static visual mocks** (no functionality) in both versions.
- Sign up / Sign in / CTAs → **styled, non-functional** links to external goabroad.com / MyGoAbroad URLs (or `#`). No auth modals.
- Shared copy + FAQ data in one `content.ts`, imported by both versions (DRY).

## Page sections (7, same content both versions)
1. **Hero** — H1 "Your Ultimate Travel Companion"; body about browse/save/compare; "Sign up for free" CTA (roman) + "Already have an account? Sign in." link; MyGoAbroad logo; hero photo (six people holding a map).
2. **Intro** — H2 "Ready to embark on a life-changing journey?" + paragraph.
3. **Program Discovery** — H2 "Find the Perfect Program for You" + sub; 3 cards (Save Programs / Compare Programs / Get Personalized Recommendations) each with an SVG; "Begin Your Search" button (roman) → goabroad.com.
4. **Travel Essentials** — H2 "Get Everything You Need to Travel with Confidence" + sub + "Explore Resources" link; **Insurance** block (illustration + "Find Dependable Coverage for Any Trip" / "Purchase GoAbroad Travel Insurance" + ENVISAGE partner badge); **eSIM** block ("Stay Connected Worldwide" / "Buy a GoAbroad Data Plan" + static eSIM form mock with celitech logo).
5. **FAQ** — H2 "Frequently Asked Questions" + 7 accordion items (verbatim from `components/mygoabroad/faq.ts`).
6. **Travel Resources** — slate band; H2 "Travel Resources" + body + "Explore Resources" button (roman); travel-resources SVG.
7. **MyGoAbroad signup** — band; H2 "Create a MyGoAbroad account now!" + body + "Sign up for free" (roman) + sign-in link; signup SVG.

(The exact copy for each section is in the source files; implementers transcribe it verbatim.)

## Architecture
- `app/mygoabroad/layout.tsx` — wraps `PrototypeShell` (header/footer chrome), mirroring `app/programs/layout.tsx` / marketplace.
- `app/mygoabroad/page.tsx` — client orchestrator: `useDesignVersion("mygoabroad")` → `switch` (`v2` → `V2MyGoAbroadPage`; default → `V1MyGoAbroadPage`). Wrap in `<Suspense>` like `app/marketplace/partner/page.tsx` does (it reads search params).
- `lib/design-versions.ts` — add `mygoabroad` entry: `versions: [{id:"v1",label:"v1",description:"Direct copy of the live MyGoAbroad page"},{id:"v2",label:"v2",description:"Redesigned to match the marketplace design language"}]`, `defaultVersion:"v1"`.
- `components/canvas/ToolbarVersionSwitcher.tsx` — add `if (pathname === "/mygoabroad") return "mygoabroad";` in `pageIdForPath`.
- `app/mygoabroad/_shared/content.ts` — exports typed copy objects + `MYGOABROAD_FAQS: {question,answer}[]` (verbatim from source `faq.ts`).

## Assets
- Copy these 6 files from `/Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/` to `/Users/chinoyoung/Code/gacom-proto/public/images/mygoabroad/`: `save-programs.svg`, `compare-programs.svg`, `personalized-recommendations.svg`, `travel-insurance.svg`, `travel-resources.svg`, `signup.svg`.
- Reference these via plain `<img src>` (no `next/image`, to avoid remote-host config):
  - Hero photo: `https://images.goabroad.com/image/upload/v1/images2/mygoabroad/myg-hero.webp`
  - MyGoAbroad logo: `https://images.goabroad.com/image/upload/v1/images2/mygoabroad/myg-black-lozenge.webp`
  - celitech logo: `https://images.goabroad.com/image/upload/v1/images2/myg/marketplace/celitech_logo.webp`

## Styling
- **v1 (fidelity):** match the original; map source tokens to gacom-proto brand tokens — `secondary-*→roman-*` (exact #DC625A), `primary-*→cobalt-*`, `ga-black→neutral-900`, `gray-*→slate-*`. No inline hex. Standard Tailwind.
- **v2 (marketplace language):** apply `/marketplace/partner` patterns — eyebrow labels (`text-xs font-semibold uppercase tracking-wide`), section background rhythm (white / slate-50 / cobalt accents), bordered `bg-slate-50` cards for the 3 discovery items, alternating image/text product rows for Insurance & eSIM, a closing GetStarted-style band (cobalt-700 or sun-50) for the signup CTA. Container `max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20`, `py-16 md:py-24` rhythm. Reuse the same SVGs + content.
- Mobile-first throughout; sections stack on small screens.

## File structure
```
lib/design-versions.ts                          (+ mygoabroad)
components/canvas/ToolbarVersionSwitcher.tsx     (+ /mygoabroad mapping)
public/images/mygoabroad/*.svg                   (6 copied assets)
app/mygoabroad/layout.tsx
app/mygoabroad/page.tsx                           (orchestrator)
app/mygoabroad/_shared/content.ts                 (copy + FAQ data)
app/mygoabroad/_versions/v1/V1MyGoAbroadPage.tsx
app/mygoabroad/_versions/v1/{V1Hero,V1Intro,V1ProgramDiscovery,V1TravelEssentials,V1Faq,V1TravelResources,V1Signup}.tsx
app/mygoabroad/_versions/v2/V2MyGoAbroadPage.tsx
app/mygoabroad/_versions/v2/{V2Hero,V2Intro,V2ProgramDiscovery,V2TravelEssentials,V2Faq,V2TravelResources,V2Signup}.tsx
```

## Out of scope
- Real auth / signup modals; functional eSIM lookup or insurance quoting.
- Any Convex/backend work (page is fully static copy + assets).
- Additional versions beyond v1/v2; nav/home discoverability links (can be a follow-up).

## Verification
- No unit-test harness → verify with `npx tsc --noEmit`, `npm run lint`, and a visual check (Chrome DevTools MCP): `/mygoabroad` renders all 7 sections in v1 matching the source; `?v=v2` shows the marketplace-styled redesign; version switcher appears; mobile layout holds; copied SVGs and CDN images load.
- Git: implementing agent must not run git commands (user rule); commits are the user's manual step.

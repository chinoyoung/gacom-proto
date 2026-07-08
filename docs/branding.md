# GoAbroad Brand Guidelines

> **Sample / companion file.** Copy this to your project **root** and rename it to `BRANDING.md` (uppercase). It is the full written reference that the condensed `CLAUDE.md` (see `docs/claude.md` in this repo) points to. This copy lives at `docs/branding.md` on purpose — it's a reference, not the active file.

> **This is the source of truth for visual decisions across the app.** When designing or modifying any page or component, consult this document first to pick the right colors, type sizes, spacing, and component patterns. `CLAUDE.md` carries a condensed subset for quick lookup; this file carries the complete catalog. The live reference lives at `/brand`.

A practical reference for color tokens, type scale, components, and layout rules. Follow these conventions so every page speaks the same visual language without ad-hoc decisions.

For the live interactive reference, see `/brand`.

---

## Using this system (people & AI agents)

This document is written for **two audiences**:

- **People** — designers and developers. Skim the principles, then use the Colors / Typography / Components / Spacing sections as a lookup while you build.
- **AI agents** — Claude (and any other agent) working in this repo. The rules here are binding: consult them before producing or modifying any UI.

**If you're an AI agent, do this before writing any UI:**

1. **Read this file first.** Pick existing tokens, type sizes, spacing, and component patterns. Match the system; do not invent values.
2. **Never hardcode hex** in `className` strings. Use the brand tokens (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`) defined in `app/globals.css`.
3. **Design mobile-first.** Lay out the 375px view first, then scale up with responsive prefixes.
4. **Reuse before you create.** If a pattern already exists, import it. If a pattern is used in 2+ features, lift it to `components/`.
5. **Flag, don't improvise.** If a design need genuinely doesn't fit the system, say so explicitly rather than silently introducing a new color, radius, or shadow.

---

## Principles

- **Restraint over decoration.** Avoid gradients, heavy shadows, and visual noise. Every added element must earn its place.
- **Mobile-first, always.** Design the 375px breakpoint first, then scale up. Every layout decision must work on mobile before desktop.
- **Standard tokens, not hex.** Use only the brand color tokens defined in `app/globals.css`. Never hardcode hex values in `className` strings.
- **Clarity over cleverness.** Use familiar patterns and explicit labels. Predictable interfaces reduce friction and build trust.
- **Smooth anchor scroll.** `<html className="scroll-smooth">` is set globally in `app/layout.tsx` — any `#hash` link smoothly scrolls. Sections targeted by in-page nav need `scroll-mt-36`.

---

## Colors

All tokens are defined in `app/globals.css` under `@theme inline`. Use the Tailwind utility class (e.g., `bg-cobalt-500`, `text-roman-600`) — never a raw hex string in `className`.

### Cobalt — Primary brand / CTAs / dark sections

| Token | Hex | Use |
|---|---|---|
| `cobalt-50` | #2DA5D2 | Light icon backgrounds, tints |
| `cobalt-100` | #14A3C3 | Hover tints |
| `cobalt-200` | #0F83B9 | Borders on dark surfaces |
| `cobalt-300` | #0875A7 | Mid-range accent |
| `cobalt-400` | #11688B | Subdued interactive states |
| `cobalt-500` | #0A5E85 | Primary CTA background, icon color |
| `cobalt-600` | #084B6A | Button hover state |
| `cobalt-700` | #023D58 | Closing CTA section background |

### Roman — Warm accent for ambassador / secondary CTAs

| Token | Hex | Use |
|---|---|---|
| `roman-200` | #EFB7B3 | Subtle tint backgrounds |
| `roman-300` | #E89690 | Borders or soft accents |
| `roman-500` | #DC625A | Ambassador CTA button, roman accent |
| `roman-600` | #C85952 | Roman button hover state |
| `roman-700` | #9C4640 | Deep roman text or borders |

### Sun — Highlight for emphasis or earnings

| Token | Hex | Use |
|---|---|---|
| `sun-50` | #FFF9ED | Very light background tint |
| `sun-100` | #F6E1B6 | Soft highlight background |
| `sun-200` | #FDD79D | Icon tile background |
| `sun-300` | #FCC570 | Accent stripe |
| `sun-400` | #DCA757 | Mid-range emphasis |
| `sun-500` | #FAA929 | Sun CTA, earnings badge background |
| `sun-600` | #D98C12 | Sun icon color, text on light bg |
| `sun-700` | #B2781D | Deep sun for text |

### Fern — Success / positive states

| Token | Hex | Use |
|---|---|---|
| `fern-50` | #F0FDF4 | Very light success background |
| `fern-200` | #b9dabf | Soft success border |
| `fern-300` | #9AC9A2 | Mid success tint |
| `fern-500` | #68AF74 | Success icon color |
| `fern-600` | #5F9F6A | Success icon tile foreground |
| `fern-700` | #4A7C52 | Success text |
| `fern-800` | #297C46 | Deep success green |
| `fern-900` | #359B55 | Darkest fern |

---

## Typography

All type uses the system sans-serif (Geist Sans). No custom font sizes outside this scale.

| Role | Classes | Notes |
|---|---|---|
| H1 | `text-4xl md:text-5xl font-bold leading-tight` | Hero headings only |
| H2 | `text-3xl font-bold tracking-tight` | Section headings; add `aria-labelledby` |
| H3 | `text-lg font-semibold` | Card titles, subsection headings |
| Body lg | `text-base leading-relaxed text-slate-600` | Section intros, primary descriptions |
| Body sm | `text-sm leading-relaxed text-slate-500` | Card descriptions, supporting detail |
| Eyebrow | `text-sm font-semibold uppercase tracking-widest` | Section labels above h2 |
| Mono | `font-mono text-xs text-slate-500` | Code snippets, token labels |

---

## Components

### Buttons

All clickable elements — buttons, links styled as actions, `role="button"` elements, clickable cards and rows, and any other custom interactive element — need `cursor-pointer`. Tailwind v4 does not apply it by default on `<button>`, and `<a>` only shows a pointer when it has an `href`. Disabled elements use `cursor-not-allowed`.

```
Primary (cobalt):
bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-sm
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500

Secondary (border):
border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg
hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm

Roman (ambassador/warm):
bg-roman-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-roman-600 cursor-pointer transition-colors text-sm

Sun accent (small):
bg-sun-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sun-600 cursor-pointer transition-colors text-sm

White-on-dark (CTA sections):
bg-white text-cobalt-700 font-semibold px-7 py-3 rounded-lg ring-1 ring-white/30 hover:bg-slate-100 cursor-pointer transition-colors text-sm

Disabled:
bg-slate-100 text-slate-400 font-semibold px-7 py-3 rounded-lg cursor-not-allowed text-sm
```

### Selectable Cards (form choices)

For multi-choice form buttons. Tinted background marks the selected state.

```
Selected:
border-cobalt-500 bg-cobalt-500/5 text-cobalt-700

Unselected:
border-slate-200 text-slate-600 hover:border-slate-300

Shared:
px-3 py-2.5 rounded-lg border cursor-pointer transition-colors
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500
```

### Icon Tiles

Default size is `w-10 h-10` with `w-5 h-5` icon. Use the smaller `w-8 h-8` / `w-4 h-4` variant inside compact rows (e.g., stat lists, inline metadata). Color follows the surrounding accent.

```
Cobalt tile:
w-10 h-10 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0
  icon: w-5 h-5 text-cobalt-500

Roman tile:
w-10 h-10 bg-roman-500/10 rounded-lg flex items-center justify-center shrink-0
  icon: w-5 h-5 text-roman-500

Sun tile:
w-10 h-10 bg-sun-500/15 rounded-lg flex items-center justify-center shrink-0
  icon: w-5 h-5 text-sun-600

Fern tile:
w-10 h-10 bg-fern-500/10 rounded-lg flex items-center justify-center shrink-0
  icon: w-5 h-5 text-fern-600

Compact tile (in stat rows):
w-8 h-8 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0
  icon: w-4 h-4 text-cobalt-500
```

### Status Indicators (check / X)

Always render included/excluded status as a tinted circle with a small icon. Plain ungrounded icons feel weak next to the typography scale.

```
Included (fern circle):
w-5 h-5 rounded-full bg-fern-500/10 inline-flex items-center justify-center
  icon: w-3.5 h-3.5 text-fern-600 strokeWidth={3} (Check from lucide-react)

Excluded (roman circle):
w-5 h-5 rounded-full bg-roman-500/10 inline-flex items-center justify-center
  icon: w-3.5 h-3.5 text-roman-500 strokeWidth={3} (X from lucide-react)

Pair with `<span className="sr-only">Included / Not included</span>` for accessibility.
Default lucide stroke (2) reads as a hairline at this size — `strokeWidth={3}` keeps the mark crisp.
```

### Tier Badges

Solid pill labels mark plan or product tiers. Background uses the tier accent, text is white. Keep them small and one-line.

```
inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white
+ tier-specific bg: bg-roman-500 / bg-sun-500 / bg-cobalt-500 / bg-slate-400
```

### Cards

```
Standard card:
bg-white rounded-xl p-6 border border-slate-200

Subsection card (in bg-slate-50 sections):
bg-white rounded-lg border border-slate-200 p-8
```

When a comparison/data table sits beside cards in the same section, give its wrapper `p-6` so its outer padding matches the cards' rhythm — cell padding (`py-3 px-4`) is unchanged.

### Content Cards

Shared components at `components/ArticleCard.tsx` and `components/ProgramCard.tsx`. These are the canonical card patterns for editorial content and program listings respectively (lifted per the "2+ features → `components/`" rule). Do not recreate local variants — import from `components/`.

**Shared conventions:**
- No `box-shadow`, no `backdrop-blur`, no image `scale` on hover.
- Both cards share the same heart/save button: white circle (`bg-white/90`), filled `text-cobalt-700` Heart icon — `absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/90 text-cobalt-700 hover:bg-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500`.
- Image placeholder state: solid `bg-slate-100` with a muted SVG icon — no external placeholder images.
- Badge pills use `rounded-full`; card shells use `rounded-xl`.

### Stat Row

A compact label + value row prefixed by a small icon tile. Used in summary cards to surface key facts without heavy framing.

```
<div className="flex items-start gap-3">
  <span className="w-8 h-8 rounded-lg bg-cobalt-500/10 flex items-center justify-center shrink-0 mt-0.5">
    <Icon className="w-4 h-4 text-cobalt-500" />
  </span>
  <div className="min-w-0">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="text-sm font-bold text-neutral-800 mt-0.5 leading-snug">{value}</p>
  </div>
</div>
```

### Featured Stat Card

A highlighted stat sitting alongside Stat Rows when one fact deserves more weight. Uses the cobalt tint family for prominence without competing with primary CTAs.

```
bg-cobalt-500/10 border border-cobalt-500/20 rounded-lg px-5 py-4 flex flex-col gap-1
  Eyebrow row: <Icon w-4 h-4 text-cobalt-600 /> + <span className="text-xs font-semibold uppercase tracking-wider text-cobalt-700">
  Value:       text-2xl font-bold text-neutral-800
  Caption:     text-xs text-slate-500 leading-relaxed
```

### Modal Dialog

Used for in-place edits and detail views.

```
Backdrop:
fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6
bg-neutral-900/50 overflow-y-auto
+ click-outside closes (compare e.target === e.currentTarget)

Card:
relative w-full max-w-lg bg-white rounded-xl border border-slate-200
+ for long content: max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col
  (scroll inside a child <div className="overflow-y-auto ...">)

Close button (top-right corner):
absolute top-2 right-2 z-10 w-9 h-9 inline-flex items-center justify-center rounded-lg
text-slate-500 hover:bg-slate-100 hover:text-neutral-800 cursor-pointer transition-colors
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500

Behavior:
- aria-modal="true", aria-labelledby="<title-id>"
- ESC closes (document keydown listener while open)
- Body scroll locks while open (`document.body.style.overflow = "hidden"`)
- Restore previous overflow on close
```

### Numbered Lists

```
Row:
flex items-start gap-4

Number badge:
w-10 h-10 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5
  span: text-xs font-bold text-white

Title: text-lg font-semibold text-neutral-800 mb-1
Body: text-sm text-slate-500 leading-relaxed
```

### Shared Components

When a pattern is used in 2+ features, lift it to `components/` (not a route's `_components/`).

---

## Spacing & Layout

### Containers

| Class | Use |
|---|---|
| `max-w-7xl mx-auto` | Hero sections and full-width grids |
| `max-w-5xl mx-auto` | Standard content sections (most common) |
| `max-w-2xl mx-auto` | CTA sections, centered prose |

### Section Padding

Apply to every `<section>`:

```
px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24
```

CTA sections (closing, high-impact):
```
py-24 md:py-36
```

Sections targeted by in-page nav must include:
```
scroll-mt-36
```

### Section Rhythm

Top-to-bottom order per page:

| Background | Role |
|---|---|
| `bg-slate-100` | Hero — opening, high contrast |
| `bg-white` | Primary content sections |
| `bg-slate-50` | Alternate content — visual rest |
| `bg-cobalt-500` | Accent section — one per page |
| `bg-cobalt-700` | Closing CTA — always last |

---

## Do & Don't

### Do

- Use Tailwind color tokens from `globals.css` exclusively.
- Follow mobile-first responsive patterns.
- Keep section padding consistent: `px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24`.
- Add `aria-labelledby` to every section pointing at its `h2` id.
- Use `focus-visible:ring-2 focus-visible:ring-cobalt-500` on interactive elements.
- Add `cursor-pointer` to every clickable element.
- Keep buttons modest: `px-7 py-3` or `px-5 py-2.5`.
- Use `rounded-lg` for most elements; `rounded-xl` for cards only; `rounded-full` only on tier badges and status indicator circles.
- Render included/excluded status as tinted circles (see Status Indicators), not bare icons.
- Write alt text on all images.
- Lift any pattern used in 2+ features to `components/`.

### Don't

- Hardcode hex colors in `className` strings.
- Add gradients unless strictly necessary.
- Use oversized buttons or excessive padding.
- Over-round corners (`rounded-2xl` on cards).
- Add `box-shadow` outside of the existing utility set.
- Introduce new color values not defined in `globals.css`.
- Skip mobile layouts or test only at wide viewports.
- Open a feature-private component (`route/_components/`) from another route — extract it first.
- Silently invent a new pattern when something doesn't fit — flag it instead.

---

## Keeping the system in sync

`BRANDING.md` and `/brand` are two views of one system. **Every guideline change goes in both:** update this written reference and the live page (`app/brand/`) in the same change so they never drift.

---

Live reference: `/brand`

# GoAbroad Brand Guidelines

> **This is the source of truth for visual decisions across the app.** When designing or modifying any page or component, consult this document first to pick the right colors, type sizes, spacing, and component patterns. The live reference lives at `/brand`.

A practical reference for color tokens, type scale, components, and layout rules used across GoAbroad prototypes. Follow these conventions so every prototype speaks the same visual language without ad-hoc decisions.

For the live interactive reference, see `/brand`.

---

## Principles

- **Restraint over decoration.** Avoid gradients, heavy shadows, and visual noise. Every added element must earn its place.
- **Mobile-first, always.** Design the 375px breakpoint first, then scale up. Every layout decision must work on mobile before desktop.
- **Standard tokens, not hex.** Use only the brand color tokens defined in `app/globals.css`. Never hardcode hex values in `className` strings.
- **Clarity over cleverness.** Use familiar patterns and explicit labels. Predictable interfaces reduce friction and build trust.

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

```
Primary (cobalt):
bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500

Secondary (border):
border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg
hover:bg-white hover:border-slate-400 transition-colors text-sm

Roman (ambassador/warm):
bg-roman-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-roman-600 transition-colors text-sm

Sun accent (small):
bg-sun-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sun-600 transition-colors text-sm

White-on-dark (CTA sections):
bg-white text-cobalt-700 font-semibold px-7 py-3 rounded-lg ring-1 ring-white/30 hover:bg-slate-100 transition-colors text-sm

Disabled:
bg-slate-100 text-slate-400 font-semibold px-7 py-3 rounded-lg cursor-not-allowed text-sm
```

### Icon Tiles

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
```

### Cards

```
Standard card:
bg-white rounded-xl p-6 border border-slate-200

Subsection card (in bg-slate-50 sections):
bg-white rounded-lg border border-slate-200 p-8
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
- Keep buttons modest: `px-7 py-3` or `px-5 py-2.5`.
- Use `rounded-lg` for most elements; `rounded-xl` for cards only.
- Write alt text on all images.

### Don't

- Hardcode hex colors in `className` strings.
- Add gradients unless strictly necessary.
- Use oversized buttons or excessive padding.
- Over-round corners (`rounded-full` on non-pill elements, `rounded-2xl` on cards).
- Add `box-shadow` outside of the existing utility set.
- Introduce new color values not defined in `globals.css`.
- Skip mobile layouts or test only at wide viewports.

---

Live reference: `/brand`

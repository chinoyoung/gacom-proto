# CLAUDE.md

Let's use standard tailwind classes for cleaner code unless we really need to create custom values.
Don't use inline hex colors anywhere in className strings.
Use brand colors defined in `globals.css` (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`).
Always use skills if needed.
Please always consider the mobile version of the app.
Let's be mindful of our design language and use it consistently.
    - We don't oveuse gradients, shadows, or other effects.
    - We don't overly round corners.
    - We don't very large buttons.
    - We use a simple, clean design language.

## Design Versioning System

This app shows stakeholders prototypes of program pages. The same program data can be rendered in **multiple design variants** so stakeholders can compare layouts. Versioning is purely frontend — no schema changes.

### How It Works

- **URL**: `/programs/study-in-paris?v=modern` — the `?v` param selects the design. No param = default.
- **Registry**: `lib/design-versions.ts` — single source of truth for all available versions per page. Each version has `{ id, label, description }`.
- **Hook**: `lib/use-design-version.ts` — `useDesignVersion(pageId)` reads `?v` from the URL and resolves it against the registry.
- **Orchestrator pattern**: `page.tsx` fetches data once, then delegates rendering to the active version component via a switch statement.
- **Switcher UI**: `components/DesignVersionSwitcher.tsx` — floating pill bar (bottom-right) that lets stakeholders toggle between designs. Mounted in `app/programs/layout.tsx`.

### File Structure

```
lib/
  design-versions.ts            # Version registry (PAGE_VERSIONS config)
  use-design-version.ts         # useDesignVersion() hook

components/
  DesignVersionSwitcher.tsx     # Floating switcher UI

app/programs/[id]/
  page.tsx                      # Orchestrator (data fetch + version switch)
  _components/
    types.ts                    # Shared Program interface (all versions use this)
    DefaultDetailPage.tsx       # Default design (extracted from original page.tsx)
    StickyProgramHeader.tsx     # Shared sticky header
    MobileStickyBar.tsx         # Shared mobile CTA bar
    LoadingSkeleton.tsx         # Shared loading state
    ProgramNotFound.tsx         # Shared 404 state
    ProgramHero.tsx             # Default hero (reusable by any version)
    ProgramOverview.tsx         # Default overview (reusable)
    ... other section components
  _versions/
    modern/                     # Example variant
      ModernDetailPage.tsx      # Full page composition
      ModernHero.tsx            # Variant-specific components
```

### How to Create a New Design Version

1. **Register it** — add an entry to `PAGE_VERSIONS` in `lib/design-versions.ts`:
   ```ts
   { id: "minimal", label: "Minimal", description: "Stripped-down layout" }
   ```
2. **Create the directory** — `app/programs/[id]/_versions/<name>/`
3. **Create the page composition** — `<Name>DetailPage.tsx` that receives `{ program, reviews, avgRating }` as props. Import shared types from `../_components/types.ts`. Reuse any unchanged section components from `../_components/`. Create new components in the version directory for sections that differ.
4. **Add the switch case** — in `app/programs/[id]/page.tsx`:
   ```ts
   case "minimal":
     return <MinimalDetailPage program={program} reviews={reviews} avgRating={avgRating} />;
   ```
5. Done — the switcher UI auto-discovers versions from the registry.

### Rules for Version Components

- Each version component is a full page composition — it owns the layout, section order, and spacing.
- Always import `Program` type from `_components/types.ts`.
- Reuse existing section components when they don't need visual changes. Only create variant-specific components for sections that actually differ.
- Shared chrome (loading skeleton, 404, sticky header, mobile bar) lives in `_components/` and can be reused or replaced per version.
- Follow the same design language rules (brand colors, Tailwind standards, mobile-first, no inline hex).
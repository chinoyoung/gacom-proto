# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test suite configured yet.

## Architecture

This is a **Next.js 16 App Router** project bootstrapped with Create Next App.

- **Framework**: Next.js 16 with App Router (`app/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` — imported as `@import "tailwindcss"` in `globals.css`, not via a config file
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`

### Path aliases

`@/*` resolves to the project root (e.g., `@/app/...`, `@/components/...`).

### CSS / theming

CSS custom properties define light/dark theme colors (`--background`, `--foreground`) in `app/globals.css`. Tailwind v4 uses `@theme inline` to map these to utility classes (`bg-background`, `text-foreground`).

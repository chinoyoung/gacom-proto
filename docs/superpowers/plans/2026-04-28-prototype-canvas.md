# Prototype Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating version-switcher and comment-mode-toggle on prototype pages with a unified Canvas: a top toolbar (viewport switcher + version switcher + comment toggle) plus the prototype rendered inside an iframe at the chosen viewport width.

**Architecture:** Both prototype layouts (`app/programs/layout.tsx`, `app/marketplace/layout.tsx`) become a thin client wrapper that branches on `?embed=1`. With `embed=1`, render the prototype bare with a slim `CommentPinLayer` for click capture. Without it, render the canvas chrome around an iframe whose `src` is the same path with `&embed=1` appended. Comment-layer state is split: pin overlay + click capture lives inside the iframe, while mode toggle/banner/panel/composer/popover live in the canvas chrome and communicate with the iframe via typed `postMessage`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Convex, Clerk, Vitest, lucide-react.

**Spec:** `docs/superpowers/specs/2026-04-28-prototype-canvas-design.md`

**Operating notes:**
- Per the project's global CLAUDE.md, the executing agent cannot run `git commit`/`push`/`reset`/`fetch`/`pull`. When a "Commit" step is reached, **stop and ask the user to commit**. Do not batch work across commit boundaries.
- Design rules (from project CLAUDE.md): standard Tailwind, brand tokens only (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`, `slate-*`), no inline hex, mobile-first, simple/clean (no overused gradients, heavy shadows, oversized buttons, very rounded corners).
- The spec is the source of truth for visual treatment, naming, file paths, and prop shapes. Each task references the relevant spec section. Read those sections before starting.
- Verification commands the agent runs after each task: `npx tsc --noEmit`, `npm run lint` (ignore pre-existing errors not in the files you touched), and a visual check at `http://localhost:3000/programs/study-in-paris` and `http://localhost:3000/marketplace/partner` (start `npm run dev` once at the beginning, leave running).

---

## File structure

**New files:**
- `components/canvas/cross-frame-protocol.ts` — typed message types + send/receive helpers
- `components/canvas/cross-frame-protocol.test.ts` — unit tests
- `components/canvas/use-canvas-mode.ts` — reads `?embed=` and `?viewport=`
- `components/canvas/page-name-registry.ts` — pathname → display name lookup
- `components/canvas/page-name-registry.test.ts` — unit tests
- `components/canvas/PrototypeShell.tsx` — branches on `?embed=`
- `components/canvas/EmbedShell.tsx` — minimal shell rendered inside iframe
- `components/canvas/CanvasShell.tsx` — top-level chrome wrapper (mounts `CommentLayerProvider`)
- `components/canvas/CanvasToolbar.tsx` — fixed top toolbar (~48px)
- `components/canvas/PrototypeIdent.tsx` — left-side icon + prototype name
- `components/canvas/ViewportSwitcher.tsx` — Mobile / Desktop pill
- `components/canvas/ToolbarVersionSwitcher.tsx` — version pill rebuilt for the toolbar
- `components/canvas/ToolbarCommentToggle.tsx` — comment mode + panel button pair
- `components/canvas/CanvasFrame.tsx` — iframe wrapper with viewport sizing + `iframeRect` ref
- `components/comments/CommentPinLayer.tsx` — iframe-side pins + click capture
- `components/comments/CommentCanvasChrome.tsx` — canvas-side comment UI orchestration

**Modified files:**
- `app/programs/layout.tsx` — body becomes `<PrototypeShell>{children}</PrototypeShell>`
- `app/marketplace/layout.tsx` — same
- `components/comments/useCommentLayer.tsx` — kept as-is; the provider gets mounted by `CanvasShell` instead of `CommentLayer`

**Removed files:**
- `components/comments/CommentLayer.tsx`
- `components/comments/CommentLayerWrapper.tsx`
- `components/comments/ModeToggle.tsx`
- `components/DesignVersionSwitcher.tsx`
- `app/programs/_components/VersionSwitcherWrapper.tsx`
- `app/marketplace/_components/VersionSwitcherWrapper.tsx`

---

## Task 1: Foundation — protocol, hooks, registry, and tests

**Why:** Lay down the pure-TS load-bearing pieces (cross-frame protocol, search-param hooks, name registry) before touching any UI. These are unit-testable and unblock every later task.

**Files:**
- Create: `components/canvas/cross-frame-protocol.ts`
- Create: `components/canvas/cross-frame-protocol.test.ts`
- Create: `components/canvas/use-canvas-mode.ts`
- Create: `components/canvas/page-name-registry.ts`
- Create: `components/canvas/page-name-registry.test.ts`

- [ ] **Step 1: Create the cross-frame protocol types and helpers**

Create `components/canvas/cross-frame-protocol.ts` with the following content:

```ts
import type { Id } from "@/convex/_generated/dataModel";

export type ParentToIframe =
  | { type: "set-mode"; mode: "view" | "comment" }
  | { type: "set-active-thread"; threadId: Id<"commentThreads"> | null }
  | { type: "cancel-draft" };

export type IframeToParent =
  | { type: "ready"; pageKey: string }
  | {
      type: "pin-click";
      anchorId: string;
      relX: number;
      relY: number;
      clientX: number;
      clientY: number;
    }
  | {
      type: "thread-open";
      threadId: Id<"commentThreads">;
      clientX: number;
      clientY: number;
    }
  | {
      type: "pin-rect-update";
      threadId: Id<"commentThreads"> | "draft";
      rect: { left: number; top: number; width: number; height: number } | null;
    };

export const CANVAS_MESSAGE_NAMESPACE = "gacom-canvas/v1" as const;

interface Envelope<T> {
  __ns: typeof CANVAS_MESSAGE_NAMESPACE;
  payload: T;
}

export function isCanvasMessage<T>(
  data: unknown,
): data is Envelope<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).__ns === CANVAS_MESSAGE_NAMESPACE
  );
}

export function postToIframe(
  iframe: HTMLIFrameElement,
  payload: ParentToIframe,
): void {
  iframe.contentWindow?.postMessage(
    { __ns: CANVAS_MESSAGE_NAMESPACE, payload },
    window.location.origin,
  );
}

export function postToParent(payload: IframeToParent): void {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(
    { __ns: CANVAS_MESSAGE_NAMESPACE, payload },
    window.location.origin,
  );
}
```

- [ ] **Step 2: Write tests for the protocol helpers**

Create `components/canvas/cross-frame-protocol.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  CANVAS_MESSAGE_NAMESPACE,
  isCanvasMessage,
} from "./cross-frame-protocol";

describe("isCanvasMessage", () => {
  it("returns true for a properly namespaced envelope", () => {
    const msg = { __ns: CANVAS_MESSAGE_NAMESPACE, payload: { type: "ready", pageKey: "/x::desktop" } };
    expect(isCanvasMessage(msg)).toBe(true);
  });

  it("returns false for a payload without the namespace", () => {
    expect(isCanvasMessage({ payload: { type: "ready" } })).toBe(false);
  });

  it("returns false for null", () => {
    expect(isCanvasMessage(null)).toBe(false);
  });

  it("returns false for a string (e.g. extension noise)", () => {
    expect(isCanvasMessage("hello")).toBe(false);
  });

  it("returns false for an envelope with the wrong namespace", () => {
    expect(isCanvasMessage({ __ns: "other-namespace", payload: {} })).toBe(false);
  });
});
```

- [ ] **Step 3: Run the tests to confirm they pass**

Run: `npx vitest run components/canvas/cross-frame-protocol.test.ts`
Expected: 5 tests pass.

- [ ] **Step 4: Create the canvas-mode hook**

Create `components/canvas/use-canvas-mode.ts`:

```ts
"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type CanvasViewport = "mobile" | "desktop";

export function useCanvasMode(): {
  isEmbed: boolean;
  viewport: CanvasViewport;
  setViewport: (next: CanvasViewport) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEmbed = searchParams.get("embed") === "1";
  const rawViewport = searchParams.get("viewport");
  const viewport: CanvasViewport = rawViewport === "mobile" ? "mobile" : "desktop";

  const setViewport = useCallback(
    (next: CanvasViewport) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "desktop") {
        params.delete("viewport");
      } else {
        params.set("viewport", next);
      }
      const qs = params.toString();
      router.push(pathname + (qs ? `?${qs}` : ""));
    },
    [pathname, router, searchParams],
  );

  return { isEmbed, viewport, setViewport };
}
```

- [ ] **Step 5: Create the page-name registry**

Create `components/canvas/page-name-registry.ts`:

```ts
interface PageNameEntry {
  pattern: RegExp;
  name: string;
}

const ENTRIES: PageNameEntry[] = [
  { pattern: /^\/programs\/[^/]+$/, name: "Program Detail" },
  { pattern: /^\/programs$/, name: "Program Directory" },
  { pattern: /^\/marketplace\/partner$/, name: "Partner Marketplace" },
];

export function pageNameForPath(pathname: string): string {
  for (const { pattern, name } of ENTRIES) {
    if (pattern.test(pathname)) return name;
  }
  return "Prototype";
}
```

- [ ] **Step 6: Write tests for the registry**

Create `components/canvas/page-name-registry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { pageNameForPath } from "./page-name-registry";

describe("pageNameForPath", () => {
  it("matches a program detail page", () => {
    expect(pageNameForPath("/programs/study-in-paris")).toBe("Program Detail");
  });

  it("matches the programs index", () => {
    expect(pageNameForPath("/programs")).toBe("Program Directory");
  });

  it("matches the partner marketplace", () => {
    expect(pageNameForPath("/marketplace/partner")).toBe("Partner Marketplace");
  });

  it("falls back to Prototype for unknown paths", () => {
    expect(pageNameForPath("/admin/create-listing")).toBe("Prototype");
  });
});
```

- [ ] **Step 7: Run tests and TypeScript check**

Run: `npx vitest run components/canvas/`
Expected: 9 tests pass total (5 protocol + 4 registry).

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 8: Commit**

Stop and ask the user to commit:

```
feat(canvas): add cross-frame protocol, mode hook, and page-name registry
```

---

## Task 2: PrototypeShell + EmbedShell — the routing branch

**Why:** Get the iframe-side rendering working before touching the canvas chrome. After this task, visiting `/programs/study-in-paris?embed=1` directly should render the prototype with no floating chrome (no version switcher, no comment toggle), and visiting without `?embed=1` should still work as it does today (canvas comes in Task 3).

**Files:**
- Create: `components/canvas/EmbedShell.tsx`
- Create: `components/canvas/PrototypeShell.tsx`
- Modify: `app/programs/layout.tsx`
- Modify: `app/marketplace/layout.tsx`

- [ ] **Step 1: Create `EmbedShell.tsx`**

Create `components/canvas/EmbedShell.tsx`:

```tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export function EmbedShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      {/* CommentPinLayer mounts here in Task 5 */}
    </>
  );
}
```

(`CommentPinLayer` is wired in Task 5. For Task 2, embed mode renders without comment capture — the existing `CommentLayerWrapper` is still mounted by the legacy non-canvas branch and will be removed in Task 5.)

- [ ] **Step 2: Create `PrototypeShell.tsx`**

Create `components/canvas/PrototypeShell.tsx`:

```tsx
"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { EmbedShell } from "./EmbedShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VersionSwitcherWrapper as ProgramsVersionWrapper } from "@/app/programs/_components/VersionSwitcherWrapper";
import { CommentLayerWrapper } from "@/components/comments/CommentLayerWrapper";

function ShellInner({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const isEmbed = params.get("embed") === "1";

  if (isEmbed) {
    return <EmbedShell>{children}</EmbedShell>;
  }

  // Legacy non-canvas rendering — replaced by CanvasShell in Task 3.
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ProgramsVersionWrapper />
      <CommentLayerWrapper />
    </>
  );
}

export function PrototypeShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
```

Note: this temporarily imports `ProgramsVersionWrapper` for the legacy branch. The marketplace layout has its own version wrapper; for Task 2, both layouts will use the same `PrototypeShell`. We accept that during Task 2 the marketplace page briefly shows the programs version switcher logic (which returns `null` for the marketplace path) — net behavior unchanged. Task 4 removes both wrappers.

Actually — both wrappers are conditionally rendered based on path inside their own component. The cleanest move for Task 2: import both and render both; each returns `null` when not on its path.

Update `PrototypeShell.tsx` to render both:

```tsx
import { VersionSwitcherWrapper as ProgramsVersionWrapper } from "@/app/programs/_components/VersionSwitcherWrapper";
import { VersionSwitcherWrapper as MarketplaceVersionWrapper } from "@/app/marketplace/_components/VersionSwitcherWrapper";
```

And in the legacy branch:

```tsx
<ProgramsVersionWrapper />
<MarketplaceVersionWrapper />
```

Both are path-gated internally; only the matching one renders.

- [ ] **Step 3: Update `app/programs/layout.tsx`**

Replace the body of `app/programs/layout.tsx` with:

```tsx
import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
```

- [ ] **Step 4: Update `app/marketplace/layout.tsx`**

Replace the body of `app/marketplace/layout.tsx` with:

```tsx
import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
```

- [ ] **Step 5: TypeScript + verify**

Run: `npx tsc --noEmit`
Expected: No errors.

If `npm run dev` is not running, start it: `npm run dev`

Visit `http://localhost:3000/programs/study-in-paris` — expected: renders today's chrome (Header, prototype, Footer, floating version switcher pill at bottom-center, floating comment toggle at bottom-left). Identical to before this task.

Visit `http://localhost:3000/programs/study-in-paris?embed=1` — expected: renders Header, prototype, Footer. **No** floating version switcher pill. **No** floating comment toggle.

Visit `http://localhost:3000/marketplace/partner?embed=1` — same: bare prototype.

- [ ] **Step 6: Commit**

Stop and ask the user to commit:

```
feat(canvas): add PrototypeShell with embed-mode branch
```

---

## Task 3: CanvasShell + CanvasFrame + CanvasToolbar — visual chrome (no comment integration yet)

**Why:** Build the canvas chrome around an iframe pointing at the embed URL. After this task, prototype URLs (without `?embed=1`) render as the canvas: white toolbar at top with prototype name on the left and viewport switcher in the center; iframe below sized per viewport. Comments are NOT yet wired through — that's Task 5. The existing comment layer continues to work (mounted inside the iframe via the legacy fallback in Task 2, until Task 5 splits it).

**Wait** — that's not quite right. With Task 2's `PrototypeShell`, when `?embed=1` is set, only `<Header />`, `<children>`, and `<Footer />` render — NO `CommentLayerWrapper`. So in Task 3 the iframe shows the prototype without comments. That's acceptable for Task 3; comments come back in Task 5.

**Files:**
- Create: `components/canvas/CanvasShell.tsx`
- Create: `components/canvas/CanvasToolbar.tsx`
- Create: `components/canvas/PrototypeIdent.tsx`
- Create: `components/canvas/ViewportSwitcher.tsx`
- Create: `components/canvas/CanvasFrame.tsx`
- Modify: `components/canvas/PrototypeShell.tsx`

- [ ] **Step 1: Create `PrototypeIdent.tsx`**

Create `components/canvas/PrototypeIdent.tsx`:

```tsx
"use client";

import { LayoutTemplate } from "lucide-react";
import { usePathname } from "next/navigation";
import { pageNameForPath } from "./page-name-registry";

export function PrototypeIdent() {
  const pathname = usePathname();
  const name = pageNameForPath(pathname);
  return (
    <div className="flex items-center gap-2 text-slate-700">
      <LayoutTemplate className="w-4 h-4 text-slate-500" strokeWidth={2} />
      <span className="text-sm font-semibold tracking-tight">{name}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create `ViewportSwitcher.tsx`**

Create `components/canvas/ViewportSwitcher.tsx`:

```tsx
"use client";

import { Smartphone, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useCanvasMode } from "./use-canvas-mode";

export function ViewportSwitcher() {
  const { viewport, setViewport } = useCanvasMode();
  const [showDesktop, setShowDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setShowDesktop(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="bg-slate-100 rounded-full p-1 flex gap-1" role="tablist" aria-label="Viewport">
      <button
        role="tab"
        aria-selected={viewport === "mobile"}
        onClick={() => setViewport("mobile")}
        className={[
          "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
          viewport === "mobile"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700",
        ].join(" ")}
      >
        <Smartphone className="w-3.5 h-3.5" />
        Mobile
      </button>
      {showDesktop && (
        <button
          role="tab"
          aria-selected={viewport === "desktop"}
          onClick={() => setViewport("desktop")}
          className={[
            "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
            viewport === "desktop"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          <Monitor className="w-3.5 h-3.5" />
          Desktop
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `CanvasToolbar.tsx`**

Create `components/canvas/CanvasToolbar.tsx`:

```tsx
"use client";

import { PrototypeIdent } from "./PrototypeIdent";
import { ViewportSwitcher } from "./ViewportSwitcher";

export function CanvasToolbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      <div className="flex-1 flex items-center">
        <PrototypeIdent />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <ViewportSwitcher />
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        {/* ToolbarVersionSwitcher mounts here in Task 4 */}
        {/* ToolbarCommentToggle mounts here in Task 5 */}
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create `CanvasFrame.tsx`**

Create `components/canvas/CanvasFrame.tsx`:

```tsx
"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCanvasMode } from "./use-canvas-mode";

export interface CanvasFrameHandle {
  iframe: HTMLIFrameElement | null;
  rect: DOMRect | null;
}

export const CanvasFrame = forwardRef<HTMLIFrameElement>(function CanvasFrame(_, ref) {
  const { viewport } = useCanvasMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build embed src from pathname + all params except `viewport` (parent-only).
  const embedSrc = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("viewport");
    params.set("embed", "1");
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  return (
    <div className="fixed inset-x-0 bottom-0 top-12 bg-slate-100 flex items-stretch justify-center overflow-hidden">
      {viewport === "mobile" ? (
        <div className="flex items-center justify-center w-full h-full p-4">
          <iframe
            ref={ref}
            src={embedSrc}
            title="Prototype preview"
            className="w-[390px] h-full bg-white border border-slate-200 rounded-lg shadow-sm"
          />
        </div>
      ) : (
        <iframe
          ref={ref}
          src={embedSrc}
          title="Prototype preview"
          className="w-full h-full bg-white"
        />
      )}
    </div>
  );
});
```

- [ ] **Step 5: Create `CanvasShell.tsx`**

Create `components/canvas/CanvasShell.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CanvasToolbar } from "./CanvasToolbar";
import { CanvasFrame } from "./CanvasFrame";

export function CanvasShell() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Real-mobile fallback: on devices below 768px, force ?viewport=mobile if not already set.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isRealMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isRealMobile) return;
    if (searchParams.get("viewport") === "mobile") return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewport", "mobile");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <>
      <CanvasToolbar />
      <CanvasFrame ref={iframeRef} />
      {/* CommentLayerProvider + CommentCanvasChrome mount here in Task 5 */}
    </>
  );
}
```

- [ ] **Step 6: Update `PrototypeShell.tsx` to use `CanvasShell` instead of legacy chrome**

In `components/canvas/PrototypeShell.tsx`, replace the legacy non-canvas branch with `<CanvasShell />`:

```tsx
"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { EmbedShell } from "./EmbedShell";
import { CanvasShell } from "./CanvasShell";

function ShellInner({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const isEmbed = params.get("embed") === "1";

  if (isEmbed) {
    return <EmbedShell>{children}</EmbedShell>;
  }

  // Note: in canvas mode, `children` are still rendered server-side (Next.js layout
  // contract) but covered by the iframe. Acceptable cost for staying in one layout.
  return (
    <>
      <div className="hidden">{children}</div>
      <CanvasShell />
    </>
  );
}

export function PrototypeShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
```

The `<div className="hidden">{children}</div>` keeps `children` in the React tree (so any data fetches the page does still run if Next.js relies on that) but invisible.

- [ ] **Step 7: TypeScript + visual verification**

Run: `npx tsc --noEmit`
Expected: No errors.

If `npm run dev` is not running, start it.

Visit `http://localhost:3000/programs/study-in-paris`:
- White toolbar at top, ~48px tall.
- Left: layout icon + "Program Detail".
- Center: viewport switcher pill with Mobile / Desktop, Desktop selected by default.
- Right: empty (Tasks 4 and 5 will fill it).
- Below toolbar: full-width iframe loading the prototype with `?embed=1`. Prototype renders normally inside.

Click **Mobile**: iframe resizes to 390px wide, centered, with a slate background visible on either side. `MobileStickyBar` becomes visible inside the iframe.

Click **Desktop**: iframe goes back to full-width.

Visit `http://localhost:3000/marketplace/partner`:
- Same canvas chrome.
- Iframe loads `/marketplace/partner?embed=1`.

On a viewport narrower than 768px (resize the browser): the toolbar's Desktop button is hidden; URL gets `?viewport=mobile` appended automatically.

- [ ] **Step 8: Commit**

Stop and ask the user to commit:

```
feat(canvas): add CanvasShell, toolbar, and viewport-switching iframe
```

---

## Task 4: ToolbarVersionSwitcher — relocate version switcher

**Why:** The right side of the toolbar is empty; the existing `DesignVersionSwitcher` still floats above the iframe (because the iframe loads `?embed=1` which has no chrome — but the parent's `CanvasShell` doesn't include it either, so it currently doesn't render at all). After this task, the version switcher lives in the toolbar's right slot, and the old floating component is deleted.

Wait — let me re-check. After Task 3, `PrototypeShell` returns `<CanvasShell />` for non-embed mode. `CanvasShell` does NOT include `VersionSwitcherWrapper`. So the version switcher is currently NOT rendered in canvas mode. That's a regression we need to fix in this task.

**Files:**
- Create: `components/canvas/ToolbarVersionSwitcher.tsx`
- Modify: `components/canvas/CanvasToolbar.tsx`
- Delete: `components/DesignVersionSwitcher.tsx`
- Delete: `app/programs/_components/VersionSwitcherWrapper.tsx`
- Delete: `app/marketplace/_components/VersionSwitcherWrapper.tsx`

- [ ] **Step 1: Create `ToolbarVersionSwitcher.tsx`**

Create `components/canvas/ToolbarVersionSwitcher.tsx`. It infers `pageId` from the pathname (programs detail → `program-detail`, marketplace partner → `marketplace-partner`). Reuses `useDesignVersion` from `lib/use-design-version.ts`.

```tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDesignVersion } from "@/lib/use-design-version";
import type { DesignVersion } from "@/lib/design-versions";

function pageIdForPath(pathname: string): string | null {
  if (/^\/programs\/[^/]+$/.test(pathname)) return "program-detail";
  if (pathname === "/marketplace/partner") return "marketplace-partner";
  return null;
}

export function ToolbarVersionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageId = pageIdForPath(pathname);

  // Hooks must run unconditionally — call useDesignVersion with a safe placeholder when there's no pageId.
  const { version, versions } = useDesignVersion(pageId ?? "__none__");

  if (!pageId || versions.length < 2) return null;

  function navigateTo(v: DesignVersion, isDefault: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (isDefault) {
      params.delete("v");
    } else {
      params.set("v", v.id);
    }
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ""));
  }

  const firstVersion = versions[0];

  return (
    <div className="bg-slate-100 rounded-full p-1 flex gap-1" role="tablist" aria-label="Design version">
      {versions.map((v) => {
        const isActive = v.id === version;
        const isDefault = v.id === firstVersion.id;
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => navigateTo(v, isDefault)}
            className={[
              "px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `CanvasToolbar.tsx`**

In `components/canvas/CanvasToolbar.tsx`, update the right slot:

```tsx
import { ToolbarVersionSwitcher } from "./ToolbarVersionSwitcher";
// ...

<div className="flex-1 flex items-center justify-end gap-2">
  <ToolbarVersionSwitcher />
  {/* ToolbarCommentToggle mounts here in Task 5 */}
</div>
```

- [ ] **Step 3: Delete the old version-switcher files**

Delete:
- `components/DesignVersionSwitcher.tsx`
- `app/programs/_components/VersionSwitcherWrapper.tsx`
- `app/marketplace/_components/VersionSwitcherWrapper.tsx`

Run: `grep -r "DesignVersionSwitcher\|VersionSwitcherWrapper" --include="*.ts" --include="*.tsx" .` from the project root.
Expected: no matches (no other code imports these).

- [ ] **Step 4: TypeScript + visual verification**

Run: `npx tsc --noEmit`
Expected: No errors.

Visit `http://localhost:3000/programs/study-in-paris`:
- Toolbar right slot shows the version pill: Quick Updates / Version 1.5 / Version 2 / Inquiry.
- Active version has white background; others are slate.
- Clicking a different version reloads the iframe at the new version (URL updates with `?v=...`).
- The iframe `src` for non-default versions includes `&embed=1&v=v1.5` etc.

Visit `http://localhost:3000/marketplace/partner`:
- Toolbar right slot shows: Version 1 / Version 2.

- [ ] **Step 5: Commit**

Stop and ask the user to commit:

```
feat(canvas): relocate version switcher into the canvas toolbar
```

---

## Task 5: Split CommentLayer into CommentPinLayer (iframe) + CommentCanvasChrome (canvas)

**Why:** Restore commenting in canvas mode by splitting the existing `CommentLayer` into its iframe-side and canvas-side halves, wired via `postMessage`.

**Files:**
- Create: `components/comments/CommentPinLayer.tsx`
- Create: `components/comments/CommentCanvasChrome.tsx`
- Create: `components/canvas/ToolbarCommentToggle.tsx`
- Modify: `components/canvas/CanvasShell.tsx` (mount provider + chrome)
- Modify: `components/canvas/EmbedShell.tsx` (mount pin layer)
- Modify: `components/canvas/CanvasToolbar.tsx` (add toggle to right slot)
- Delete: `components/comments/CommentLayer.tsx`
- Delete: `components/comments/CommentLayerWrapper.tsx`
- Delete: `components/comments/ModeToggle.tsx`

Read spec section "Comment layer cross-frame architecture" before starting.

- [ ] **Step 1: Create `CommentPinLayer.tsx`**

Create `components/comments/CommentPinLayer.tsx`. This is the iframe-side component.

Responsibilities:
- Use `useQuery(api.comments.listThreadsForPage, { pageKey })` to load threads.
- Render `<PinOverlay threads={threads} />`.
- Listen for clicks on `[data-comment-anchor]` only when `mode === "comment"` (mode is received from parent via `postMessage`).
- On a non-pin click in comment mode, post `{type: "pin-click", anchorId, relX, relY, clientX, clientY}` to parent.
- On a click on an existing pin, post `{type: "thread-open", threadId}` to parent. (Implementation note: pins themselves stop propagation and call `postToParent` directly — see existing `PinOverlay.tsx`. Modify it to accept an `onPinClick` callback.)
- Set `body.cursor = "crosshair"` and add `comment-mode` class to body when `mode === "comment"`.
- On mount, post `{type: "ready", pageKey}` to parent.
- Listen for parent → iframe messages and update local state (`mode`, `activeThread`).

Use the existing `computeRelativeCoords` from `components/comments/anchor-math.ts`. Use `isCanvasMessage` and `postToParent` from `components/canvas/cross-frame-protocol.ts`.

The component manages its own state — it does NOT use `CommentLayerProvider` (the provider is only mounted in the canvas chrome).

Skeleton:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { PAGE_ANCHOR_ID, computeRelativeCoords } from "./anchor-math";
import { PinOverlay } from "./PinOverlay";
import { useDevice } from "./use-device";
import type { CommentThread, CommentMode } from "./types";
import type { Id } from "@/convex/_generated/dataModel";
import {
  isCanvasMessage,
  postToParent,
  type ParentToIframe,
} from "@/components/canvas/cross-frame-protocol";

export function CommentPinLayer() {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const device = useDevice();
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;

  const [mode, setMode] = useState<CommentMode>("view");
  const [activeThreadId, setActiveThreadId] = useState<Id<"commentThreads"> | null>(null);

  const threadsRaw = useQuery(api.comments.listThreadsForPage, { pageKey });
  const threads: CommentThread[] = useMemo(
    () => (threadsRaw ?? []) as CommentThread[],
    [threadsRaw],
  );

  // Announce ready + pageKey changes to parent
  useEffect(() => {
    postToParent({ type: "ready", pageKey });
  }, [pageKey]);

  // Receive parent commands
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== window.parent) return;
      if (e.origin !== window.location.origin) return;
      if (!isCanvasMessage<ParentToIframe>(e.data)) return;
      const payload = e.data.payload;
      if (payload.type === "set-mode") setMode(payload.mode);
      else if (payload.type === "set-active-thread") setActiveThreadId(payload.threadId);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Comment-mode click capture
  useEffect(() => {
    if (mode !== "comment") return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-comment-ui]")) return;

      const anchorEl = target.closest<HTMLElement>("[data-comment-anchor]");
      const anchorId = anchorEl?.getAttribute("data-comment-anchor") ?? PAGE_ANCHOR_ID;
      const rect = anchorEl
        ? anchorEl.getBoundingClientRect()
        : document.body.getBoundingClientRect();
      const { relX, relY } = computeRelativeCoords(
        { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        e.clientX,
        e.clientY,
      );
      e.preventDefault();
      e.stopPropagation();
      postToParent({
        type: "pin-click",
        anchorId,
        relX,
        relY,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [mode]);

  // Cursor styling
  useEffect(() => {
    if (mode !== "comment") {
      document.body.style.cursor = "";
      document.body.classList.remove("comment-mode");
      return;
    }
    document.body.style.cursor = "crosshair";
    document.body.classList.add("comment-mode");
    return () => {
      document.body.style.cursor = "";
      document.body.classList.remove("comment-mode");
    };
  }, [mode]);

  return (
    <div data-comment-ui>
      <PinOverlay
        threads={threads}
        activeThreadId={activeThreadId}
        onPinClick={(threadId) => postToParent({ type: "thread-open", threadId })}
      />
    </div>
  );
}
```

If `PinOverlay` does not currently accept `onPinClick` and `activeThreadId` props (the existing component reads from `useCommentLayer`), update `PinOverlay.tsx` to accept them as optional props and use them when provided, falling back to the context only if neither is passed. This keeps the canvas-side composer/popover positioning correct.

Read `components/comments/PinOverlay.tsx` before this step. If it currently calls `setActiveThreadId` from context, switch its signature to `(props) => onPinClick(thread._id)` and have the parent pass the callback.

- [ ] **Step 2: Create `CommentCanvasChrome.tsx`**

Create `components/comments/CommentCanvasChrome.tsx`. This is the canvas-side component.

Responsibilities:
- Reads from `useCommentLayer` (which is mounted by `CanvasShell`).
- Sends `{type: "set-mode"}` to iframe whenever `mode` changes.
- Sends `{type: "set-active-thread"}` to iframe whenever `activeThreadId` changes.
- Listens for iframe → parent messages: `pin-click` opens `NewCommentComposer`; `thread-open` sets `activeThreadId` and renders `ThreadPopover`; `ready` is logged for diagnostics.
- Renders `CommentModeBanner`, `CommentsPanel`, `NewCommentComposer`, `ThreadPopover`. The composer and popover receive `clientX/clientY` translated from iframe-local to canvas-local using the `iframeRef`.
- The composer/popover position computation: `top = iframeRect.top + clientY`, `left = iframeRect.left + clientX`. Read `iframeRect` via `getBoundingClientRect()` on each render that uses position; or maintain it in state via `ResizeObserver`.

Skeleton:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useCommentLayer } from "./useCommentLayer";
import { CommentModeBanner } from "./CommentModeBanner";
import { CommentsPanel } from "./CommentsPanel";
import { NewCommentComposer } from "./NewCommentComposer";
import { ThreadPopover } from "./ThreadPopover";
import { useCanvasMode } from "@/components/canvas/use-canvas-mode";
import {
  isCanvasMessage,
  postToIframe,
  type IframeToParent,
} from "@/components/canvas/cross-frame-protocol";
import type { CommentThread } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

export function CommentCanvasChrome({
  iframeRef,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const { viewport } = useCanvasMode();
  const device = viewport === "mobile" ? "mobile" : "desktop";
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;

  const {
    mode,
    setMode,
    activeThreadId,
    setActiveThreadId,
    setActiveThreadCoords,
    draftPin,
    setDraftPin,
  } = useCommentLayer();

  const threadsRaw = useQuery(api.comments.listThreadsForPage, { pageKey });
  const threads: CommentThread[] = (threadsRaw ?? []) as CommentThread[];
  const activeThread = threads.find((t) => t._id === activeThreadId) ?? null;

  // Push mode changes to iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    postToIframe(iframeRef.current, { type: "set-mode", mode });
  }, [mode, iframeRef]);

  // Push active-thread changes to iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    postToIframe(iframeRef.current, {
      type: "set-active-thread",
      threadId: activeThreadId,
    });
  }, [activeThreadId, iframeRef]);

  // Receive iframe messages
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return;
      if (e.origin !== window.location.origin) return;
      if (!isCanvasMessage<IframeToParent>(e.data)) return;
      const p = e.data.payload;
      if (p.type === "pin-click") {
        const rect = iframeRef.current.getBoundingClientRect();
        setDraftPin({
          anchorId: p.anchorId,
          relX: p.relX,
          relY: p.relY,
          clientX: rect.left + p.clientX,
          clientY: rect.top + p.clientY,
        });
        setActiveThreadId(null);
      } else if (p.type === "thread-open") {
        const rect = iframeRef.current.getBoundingClientRect();
        setActiveThreadId(p.threadId);
        setActiveThreadCoords({
          clientX: rect.left + p.clientX,
          clientY: rect.top + p.clientY,
        });
        setDraftPin(null);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeRef, setActiveThreadId, setDraftPin]);

  return (
    <div data-comment-ui>
      <CommentModeBanner />
      {activeThread && !draftPin && <ThreadPopover thread={activeThread} />}
      {draftPin && <NewCommentComposer />}
      <CommentsPanel threads={threads} />
    </div>
  );
}
```

Note: `NewCommentComposer` and `ThreadPopover` already read `draftPin` and `activeThread` from context. Their position is set internally based on `clientX/clientY` from the draft/thread. This works because we translate to canvas coords before storing in `draftPin`.

For threads (existing pins), the `ThreadPopover` needs the pin's position. The pin's position depends on the iframe's current bounding rect AND the anchor's current rect inside the iframe. For Task 5, accept that the popover renders next to the pin's REPORTED position from `pin-click`. Iframe-scroll repositioning is a Task 6 concern.

Update `NewCommentComposer.tsx` and `ThreadPopover.tsx` if needed: their internal positioning uses `clientX/clientY` directly from `draftPin` / a thread. Since we now store canvas-relative coords in `draftPin.clientX/Y`, no change needed for the composer. For the popover, it currently positions itself based on the active thread's anchor — which is inside the iframe and not reachable from the parent. **Modify `ThreadPopover.tsx`** to accept an optional `clientX/clientY` prop pair from props, and read it from `useCommentLayer` if not provided.

To keep this task tractable: store the active thread's last-known click coords on the canvas-side `useCommentLayer` state. Add `activeThreadCoords: { clientX: number; clientY: number } | null` to the provider. Set it when receiving a `thread-open` message (use the same iframeRect translation as for `pin-click`, plus the click event's coords — which we don't have for `thread-open` today; the iframe's `PinOverlay.onPinClick` should pass `e.clientX/e.clientY` through).

`IframeToParent.thread-open` already carries `clientX, clientY` (defined in Task 1). `CommentPinLayer` passes them: `onPinClick={(threadId, clientX, clientY) => postToParent({type: "thread-open", threadId, clientX, clientY})}`. `PinOverlay` provides them from the click event. Update `useCommentLayer` (Task 5 Step 7) to track `activeThreadCoords` alongside `activeThreadId`.

This is the most complex step in the plan. Take it slow and verify after each change.

- [ ] **Step 3: Create `ToolbarCommentToggle.tsx`**

Create `components/canvas/ToolbarCommentToggle.tsx`:

```tsx
"use client";

import { MessageSquare, MousePointer2, PanelRight } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { useCommentLayer } from "@/components/comments/useCommentLayer";

export function ToolbarCommentToggle() {
  const { mode, setMode, panelOpen, setPanelOpen } = useCommentLayer();

  return (
    <Show when="signed-in">
      <div className="flex items-center gap-2">
        <div className="bg-slate-100 rounded-full p-1 flex gap-1" role="tablist" aria-label="Mode">
          <button
            role="tab"
            aria-selected={mode === "view"}
            onClick={() => setMode("view")}
            className={[
              "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              mode === "view"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            View
          </button>
          <button
            role="tab"
            aria-selected={mode === "comment"}
            onClick={() => setMode("comment")}
            className={[
              "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              mode === "comment"
                ? "bg-fern-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Comment
          </button>
        </div>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={[
            "p-1.5 rounded-full transition-colors cursor-pointer border",
            panelOpen
              ? "bg-cobalt-500 border-cobalt-500 text-white"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
          ].join(" ")}
          aria-label="Toggle comments panel"
          aria-pressed={panelOpen}
        >
          <PanelRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Show>
  );
}
```

No `scale-105` (per spec — drop the rule violation from the original `ModeToggle`).

- [ ] **Step 4: Mount provider + chrome in `CanvasShell.tsx`**

Update `components/canvas/CanvasShell.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CanvasToolbar } from "./CanvasToolbar";
import { CanvasFrame } from "./CanvasFrame";
import { CommentLayerProvider } from "@/components/comments/useCommentLayer";
import { CommentCanvasChrome } from "@/components/comments/CommentCanvasChrome";
import { useCanvasMode } from "./use-canvas-mode";

export function CanvasShell() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { viewport } = useCanvasMode();
  const device = viewport === "mobile" ? "mobile" : "desktop";
  const v = searchParams.get("v");
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isRealMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isRealMobile) return;
    if (searchParams.get("viewport") === "mobile") return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewport", "mobile");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <CommentLayerProvider pageKey={pageKey}>
      <CanvasToolbar />
      <CanvasFrame ref={iframeRef} />
      <CommentCanvasChrome iframeRef={iframeRef} />
    </CommentLayerProvider>
  );
}
```

- [ ] **Step 5: Mount `CommentPinLayer` in `EmbedShell.tsx`**

Update `components/canvas/EmbedShell.tsx`:

```tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CommentPinLayer } from "@/components/comments/CommentPinLayer";
import type { ReactNode } from "react";

export function EmbedShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CommentPinLayer />
    </>
  );
}
```

- [ ] **Step 6: Mount `ToolbarCommentToggle` in `CanvasToolbar.tsx`**

Update `components/canvas/CanvasToolbar.tsx`:

```tsx
import { ToolbarCommentToggle } from "./ToolbarCommentToggle";
// ...
<div className="flex-1 flex items-center justify-end gap-2">
  <ToolbarVersionSwitcher />
  <ToolbarCommentToggle />
</div>
```

- [ ] **Step 7: Update `useCommentLayer` to track `activeThreadCoords`**

In `components/comments/useCommentLayer.tsx`, add to the state interface:

```ts
activeThreadCoords: { clientX: number; clientY: number } | null;
setActiveThreadCoords: (coords: { clientX: number; clientY: number } | null) => void;
```

Add to the provider:

```tsx
const [activeThreadCoords, setActiveThreadCoords] = useState<
  { clientX: number; clientY: number } | null
>(null);
```

Include in `value`. Update `setMode` reset behavior so switching to view also clears `activeThreadCoords`.

Update `ThreadPopover.tsx` to read `activeThreadCoords` from `useCommentLayer` for positioning instead of computing from the anchor element (which doesn't exist in the parent DOM). If the existing implementation computes position from the thread's anchor, replace that with `activeThreadCoords` falling back to `(window.innerWidth/2, 100)` if null.

- [ ] **Step 8: Delete the old comment files**

Delete:
- `components/comments/CommentLayer.tsx`
- `components/comments/CommentLayerWrapper.tsx`
- `components/comments/ModeToggle.tsx`

Run: `grep -r "CommentLayer\b\|CommentLayerWrapper\|ModeToggle" --include="*.ts" --include="*.tsx" .` from project root.
Expected: matches only inside the still-existing `useCommentLayer.tsx` (the hook + provider, which remain), `CommentPinLayer.tsx`, `CommentCanvasChrome.tsx`, and `ToolbarCommentToggle.tsx`. No matches for the deleted file basenames.

- [ ] **Step 9: TypeScript + visual verification**

Run: `npx tsc --noEmit`
Expected: No errors.

Sign in via Clerk if not already signed in.

Visit `http://localhost:3000/programs/study-in-paris` (signed in):
- Toolbar shows version switcher + View/Comment + panel button (right side).
- Click **Comment**: cursor turns to crosshair INSIDE the iframe (verify by hovering over the prototype). The View/Comment toggle highlights "Comment" in fern green.
- Click on a section inside the prototype (e.g., the program hero): the new-comment composer appears in the canvas chrome at the click location.
- Submit a comment. Pin should appear inside the iframe at the clicked spot.
- Click the pin: the thread popover opens in the canvas chrome.
- Click the panel button: comments panel slides in from the right.
- Toggle viewport to Mobile: iframe resizes; existing pins for the new (mobile) pageKey appear (or the panel shows zero threads if you've only commented in desktop view).

- [ ] **Step 10: Commit**

Stop and ask the user to commit:

```
feat(canvas): split comment layer into iframe pins and canvas chrome
```

---

## Task 6: Pin-rect updates on iframe scroll

**Why:** When the user opens a thread popover or the new-comment composer, then scrolls inside the iframe, the active pin moves but the popover doesn't follow. Spec section "Composer/popover positioning" describes the fix.

**Files:**
- Modify: `components/comments/CommentPinLayer.tsx`
- Modify: `components/comments/CommentCanvasChrome.tsx`

- [ ] **Step 1: Send `pin-rect-update` from iframe on scroll**

In `CommentPinLayer.tsx`, when an active thread or draft is set (i.e., the parent has indicated something is open), listen for window scroll inside the iframe and post `{type: "pin-rect-update", threadId, rect}` with the active pin's current bounding rect. Throttle to ~16ms (60fps).

The active pin is identified by `activeThreadId` (received from parent) or by the iframe's own knowledge that a draft was just dropped. Track `lastDraftPinKey` locally so the iframe knows whether to send updates for "draft" or for a specific threadId.

```tsx
// Inside CommentPinLayer, add:
const [activeRectTracking, setActiveRectTracking] = useState<{
  threadId: string | "draft";
  anchorEl: HTMLElement | null;
} | null>(null);

// When activeThreadId changes, find the pin's anchor element via PinOverlay's data:
useEffect(() => {
  if (!activeThreadId) {
    setActiveRectTracking(null);
    return;
  }
  const thread = threads.find((t) => t._id === activeThreadId);
  if (!thread) return;
  const anchorEl = document.querySelector<HTMLElement>(
    `[data-comment-anchor="${thread.anchorId}"]`,
  );
  setActiveRectTracking({ threadId: activeThreadId, anchorEl });
}, [activeThreadId, threads]);

// Also set tracking when a draft pin is just sent. Listen for parent confirmation? Simpler: track locally on outgoing pin-click.

// Scroll handler:
useEffect(() => {
  if (!activeRectTracking) return;
  let raf = 0;
  function send() {
    raf = 0;
    if (!activeRectTracking) return;
    const el = activeRectTracking.anchorEl;
    const rect = el ? el.getBoundingClientRect() : null;
    postToParent({
      type: "pin-rect-update",
      threadId: activeRectTracking.threadId as any,
      rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null,
    });
  }
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(send);
  }
  window.addEventListener("scroll", schedule, true);
  return () => {
    window.removeEventListener("scroll", schedule, true);
    if (raf) cancelAnimationFrame(raf);
  };
}, [activeRectTracking]);
```

- [ ] **Step 2: Receive `pin-rect-update` on the canvas side**

In `CommentCanvasChrome.tsx`, add a handler for `pin-rect-update`:

```tsx
else if (p.type === "pin-rect-update") {
  if (p.rect == null) {
    // Pin's anchor no longer in DOM; hide popover
    setActiveThreadCoords(null);
    return;
  }
  const iframeRect = iframeRef.current.getBoundingClientRect();
  // Use the anchor's current center as the popover anchor coords
  const clientX = iframeRect.left + p.rect.left + p.rect.width / 2;
  const clientY = iframeRect.top + p.rect.top + p.rect.height / 2;
  setActiveThreadCoords({ clientX, clientY });
}
```

When `activeThreadCoords` is null and there's an active thread, hide the popover (or render it off-screen). When the user scrolls back and the pin re-enters viewport, the next `pin-rect-update` re-shows it.

The same logic applies to a draft pin — but the draft is shorter-lived so we can omit it for v1 (acceptable that scrolling while composing dismisses the composer; the user will re-click).

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

Visit a long prototype page in canvas mode. Click an existing pin to open its popover. Scroll the iframe. The popover should follow the pin.

If the popover doesn't follow smoothly or jitters, inspect the `requestAnimationFrame` throttling. If the popover doesn't hide when the pin scrolls out, verify the `rect == null` branch is reached (it isn't with `getBoundingClientRect` — it returns a rect even off-screen). Add an explicit visibility check: if the rect is fully outside the iframe's viewport (`top + height < 0 || top > iframeRect.height`), send `rect: null`.

- [ ] **Step 4: Commit**

Stop and ask the user to commit:

```
feat(canvas): track pin rects across iframe scroll for popover positioning
```

---

## Task 7: Final verification

**Files:** None modified.

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no NEW errors in `components/canvas/*` or `components/comments/*` files you created/modified. (Pre-existing errors in other files are not in scope.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds. If `predev` triggers Convex, you can fall back to `npx tsc --noEmit` plus `npx next build` separately.

- [ ] **Step 3: Inline-hex audit**

Run: `grep -nE "#[0-9a-fA-F]{3,8}" components/canvas/ components/comments/CommentPinLayer.tsx components/comments/CommentCanvasChrome.tsx || echo "no inline hex"`
Expected: `no inline hex`.

- [ ] **Step 4: Test pass**

Run: `npx vitest run`
Expected: all tests pass (the canvas tests added in Task 1 plus any pre-existing tests).

- [ ] **Step 5: Visual sanity — desktop**

In a desktop browser, sign in. Visit `http://localhost:3000/programs/study-in-paris`:
- Canvas with toolbar at top.
- Iframe full-width below toolbar.
- Toolbar: Program Detail (left) — Mobile/Desktop (center) — version pill + View/Comment + panel button (right).
- Comment a section, see pin appear, click pin to see thread.
- Switch versions; iframe reloads; pins for that version appear.

Visit `http://localhost:3000/marketplace/partner`:
- Same chrome; "Partner Marketplace" on the left.
- Two version options instead of four.

- [ ] **Step 6: Visual sanity — mobile viewport (simulator)**

Toggle viewport to Mobile. The iframe shrinks to 390px centered. `MobileStickyBar` now visible inside the iframe. `lg:hidden` is true at 390px so mobile layout renders.

- [ ] **Step 7: Visual sanity — real mobile**

Set Chrome DevTools device toolbar to iPhone 14 (390 x 844). Hard-reload `http://localhost:3000/programs/study-in-paris`:
- Canvas auto-redirects to `?viewport=mobile`.
- Toolbar's Desktop button is hidden.
- Iframe fills the screen at mobile width.

- [ ] **Step 8: Done**

No commit. Report: lint clean (in scope), build green, tests pass, all acceptance criteria from spec met. Note any issues for follow-up.

---

## Spec coverage check

- **Toolbar (top, ~48px, light)** → Tasks 3 (shell), 4 (version), 5 (comments)
- **Viewport switcher (Mobile/Desktop, real-mobile fallback)** → Task 3
- **URL contract (`?embed=1`, `?viewport=`)** → Tasks 1, 2, 3
- **PrototypeShell branching** → Task 2
- **EmbedShell** → Tasks 2 (skeleton), 5 (PinLayer mounted)
- **CanvasShell** → Tasks 3 (skeleton), 5 (provider + chrome mounted)
- **CanvasFrame iframe sizing** → Task 3
- **Comment pin layer (iframe-side)** → Task 5
- **Comment chrome (canvas-side)** → Task 5
- **postMessage protocol with origin checks** → Task 1 (types + helpers), Task 5 (wiring)
- **pageKey consistency across both halves** → Task 5 (CommentPinLayer derives from iframe `useDevice`; CommentCanvasChrome derives from `viewport` param — both produce identical keys)
- **`activeThreadCoords` state for popover positioning** → Task 5 Step 7
- **Pin-rect updates on iframe scroll** → Task 6
- **Removal of old version switcher** → Task 4
- **Removal of old comment chrome (`CommentLayer`, `CommentLayerWrapper`, `ModeToggle`)** → Task 5
- **Acceptance: no inline hex, brand tokens only** → Task 7
- **Acceptance: lint + build + tests** → Task 7

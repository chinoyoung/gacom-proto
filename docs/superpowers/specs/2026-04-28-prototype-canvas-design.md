# Prototype Canvas Design Spec

**Date:** 2026-04-28
**Scope:** All prototype routes (`/programs/*`, `/marketplace/*`)
**Audience:** Internal GoAbroad stakeholders reviewing prototypes

## Problem

Two control surfaces float over every prototype page today:

- **`DesignVersionSwitcher`** — pill bar, `fixed bottom-[130px] left-1/2 -translate-x-1/2 z-[60] sm:bottom-[74px]`. Magic pixel offsets dodge a `MobileStickyBar` that only renders below `lg:`. Already broken at the `sm:` breakpoint where it floats above nothing.
- **`ModeToggle`** (comment system) — pill, `fixed bottom-4 left-4 z-[60]`, with a `scale-105` transform when active that violates the "no effects" design rule.

Together with `CommentModeBanner` (top), `CommentsPanel` (right), and `MobileStickyBar` (bottom), the chrome is scattered across all four edges of the viewport. Reviewers can't tell what's "the prototype" and what's "the review tools." Stakeholders also can't preview a prototype at mobile dimensions without resizing their browser, and viewport-based media queries (`sm:`, `md:`, `lg:`) make CSS-only constrained-width containers misleading.

## Goals

1. Separate "the prototype" from "the review tools" so reviewers always know what they're evaluating.
2. Provide an accurate mobile preview — `MobileStickyBar` (which uses `lg:hidden`) actually appears in mobile mode.
3. Unify all review controls into a single toolbar with a consistent visual language.
4. Replace fragile fixed offsets with a layout that has explicit slots.
5. No regressions to the existing comment system — pins still anchor, threads still persist, panel still slides in.

## Non-Goals (out of scope)

- Saving canvas state per-user (last-used viewport, etc.).
- Multi-prototype side-by-side comparison.
- Real-time presence ("X is also reviewing").
- "Share screenshot with annotation" or any new commenting feature.
- Replacing the comment system; we are refactoring its mounting, not its behavior.
- Canvas mode for `/admin/*` routes — only prototype routes get the canvas.
- A "device frame" / phone-bezel decoration around the mobile iframe — we render a plain bordered rectangle, no skeuomorphic device chrome.

## Architecture

### Concept

Every prototype URL renders a **Canvas**: a fixed top toolbar (~48px) plus the prototype loaded inside an `<iframe>` at the chosen viewport width. The iframe is "the artifact." All review tools live in the canvas chrome — nothing floats over the prototype itself.

### URL contract

| URL form | What renders |
|---|---|
| `/programs/study-in-paris?v=v1.5&viewport=mobile` | Canvas: toolbar + iframe sized to 390px loading the same path with `&embed=1` appended. |
| `/programs/study-in-paris?v=v1.5&embed=1` | Embed mode: bare prototype (Header + content + Footer + `CommentPinLayer`). No canvas, no toolbar. |
| `/marketplace/partner?v=v2&viewport=desktop` | Canvas with full-width iframe. |

- `?embed=1` is the iframe-side flag. Set only by the canvas when constructing the iframe `src`.
- `?viewport=mobile` / `?viewport=desktop` is the canvas-side state. Default when absent: `desktop`.
- `?v=` (existing design version param) is owned by the prototype and passed through to the iframe URL.

### Routing strategy

The shared layout (`app/programs/layout.tsx`, `app/marketplace/layout.tsx`) becomes a thin client component that imports a `<PrototypeShell>` wrapper. `PrototypeShell` reads `?embed=` via `useSearchParams` and branches:

- `embed=1` → renders `<EmbedShell>{children}</EmbedShell>` — `Header` + children + `Footer` + `<CommentPinLayer />`. No canvas, no version switcher, no comment toggle UI.
- otherwise → renders `<CanvasShell>{children}</CanvasShell>` — toolbar + iframe + `<CommentCanvasChrome />`. The `{children}` are not actually rendered visually in canvas mode; they're rendered server-side but covered by the iframe (Next.js requires `children` to be returned from a layout). We accept this minor inefficiency as the cost of staying within a single layout.

Alternative considered: a separate `/embed/programs/[id]` route tree. Rejected because it duplicates routing and forces all prototype pages to live at two URLs.

The branch must be wrapped in `<Suspense>` because `useSearchParams` triggers it.

### Component layout (canvas mode)

```
<CanvasShell>                                       — fixed full-viewport, bg-slate-100
  <CommentLayerProvider pageKey={...}>              — wraps everything so toolbar + chrome share state
    <CanvasToolbar>                                 — fixed top-0, h-12, bg-white border-b border-slate-200
      <PrototypeIdent />                            — left: layout icon + prototype name
      <ViewportSwitcher />                          — center: Mobile / Desktop pill
      <ToolbarVersionSwitcher pageId={inferred} />  — right slot 1
      <ToolbarCommentToggle />                      — right slot 2 (mode + panel; uses useCommentLayer)
    </CanvasToolbar>

    <CanvasFrame>                                   — fills below toolbar; owns iframeRef + iframeRect
      <iframe src={embedSrc} />                     — sized per viewport mode
    </CanvasFrame>

    <CommentCanvasChrome iframeRef={...} />         — banner / panel / composer / popover; reads iframeRect for positioning
  </CommentLayerProvider>
</CanvasShell>
```

The `CommentLayerProvider` (existing, from `components/comments/useCommentLayer.tsx`) wraps the toolbar and the canvas chrome so `ToolbarCommentToggle` and `CommentCanvasChrome` share `mode`, `activeThreadId`, `draftPin`, and `panelOpen` state.

### Component layout (embed mode, inside iframe)

```
<EmbedShell>
  <Header />
  {children}                                        — the prototype page itself, unchanged
  <Footer />
  <CommentPinLayer pageKey={...} />                 — pins overlay + click capture; no chrome UI
</EmbedShell>
```

### Viewport sizing

| Viewport | Iframe `width` | Iframe `height` | Frame treatment |
|---|---|---|---|
| `mobile` | `390px` | `100%` of canvas frame | `border border-slate-200 rounded-lg overflow-hidden`, centered horizontally |
| `desktop` | `100%` | `100%` | no border, edge-to-edge |

The canvas frame area is `bg-slate-100` so the mobile iframe sits on a neutral surface.

### Real-mobile fallback

When the reviewer's actual device is below the `md:` breakpoint (`< 768px`), the canvas auto-switches to `viewport=mobile` on first load and the desktop option is hidden in the `ViewportSwitcher`. This avoids forced horizontal scroll on phones. Detection is via `window.matchMedia('(max-width: 767px)')` in `CanvasShell` on mount; the URL is updated with `?viewport=mobile` if not already set.

## Comment layer cross-frame architecture

The current `CommentLayer` mixes everything. We split it into two halves communicating via `postMessage`.

### Inside the iframe — `CommentPinLayer`

Responsibilities:
- Renders `PinOverlay` (the pin markers).
- Listens for clicks on `[data-comment-anchor]` and computes `{anchorId, relX, relY, clientX, clientY}` using the existing `computeRelativeCoords`.
- Sets `body.cursor = "crosshair"` and toggles the `comment-mode` body class while in comment mode.
- Subscribes to Convex `listThreadsForPage` query (Convex client is initialized inside the iframe via the existing `ConvexClientProvider` already in `app/layout.tsx`).
- Listens for parent `postMessage` to update local `mode` and `activeThreadId` state.
- Sends `postMessage` to parent on pin clicks and existing-pin clicks.

Does **not** render: mode toggle, banner, panel, composer, popover.

### In the canvas chrome — `CommentCanvasChrome`

Responsibilities:
- Renders `ModeToggle` (relocated, redesigned to match toolbar — see "Visual treatment" below), `CommentModeBanner`, `CommentsPanel`, `NewCommentComposer`, `ThreadPopover`.
- Owns `mode`, `activeThreadId`, `draftPin`, `panelOpen` state (replicates the existing `useCommentLayer` provider in the canvas).
- Writes to Convex (`createThread`, `addReply`, etc.) using its own Convex client.
- Subscribes to the same `listThreadsForPage` query so the panel/list shows up-to-date threads.
- Sends `postMessage` to iframe when mode or active thread changes.
- Receives `postMessage` from iframe with pin-click coords; opens `NewCommentComposer` positioned at the reported `clientX/clientY` plus the iframe's offset relative to the canvas.

### `pageKey` consistency

Today, `pageKey = pathname + (?v=value) + "::" + useDevice()`. Inside the iframe `useDevice()` reads `window.innerWidth` of the iframe — which IS the chosen viewport width. So `useDevice()` naturally returns `"mobile"` when the iframe is 390px wide and `"desktop"` otherwise. This is correct behavior with no change needed to `useDevice` itself.

For the canvas chrome to derive the **same** `pageKey`, `CommentCanvasChrome` reads the canvas's `?viewport=` param and maps it: `mobile → "mobile"`, `desktop → "desktop"`. Both halves produce identical `pageKey` strings.

When the viewport switcher toggles, the iframe re-loads at the new width, `useDevice` returns a new value, and `pageKey` changes — threads rescope automatically. Existing behavior preserved.

### postMessage protocol

A typed protocol in `components/canvas/cross-frame-protocol.ts`:

```ts
export type ParentToIframe =
  | { type: 'set-mode'; mode: 'view' | 'comment' }
  | { type: 'set-active-thread'; threadId: string | null }
  | { type: 'cancel-draft' };

export type IframeToParent =
  | { type: 'ready'; pageKey: string }
  | { type: 'pin-click'; anchorId: string; relX: number; relY: number; clientX: number; clientY: number }
  | { type: 'thread-open'; threadId: string }
  | { type: 'pin-rect-update'; threadId: string | 'draft'; rect: { left: number; top: number; width: number; height: number } | null };
```

- Origin check on every message: parent only accepts messages whose `event.source === iframeRef.current?.contentWindow`; iframe only accepts messages whose `event.source === window.parent` AND whose `event.origin` equals its own origin (defense against rogue parents).
- The parent uses the iframe's bounding rect to translate `clientX/clientY` from iframe-local to canvas-local before positioning the composer.

### Composer/popover positioning

Today these are positioned at `position: absolute` relative to the document. In the canvas, they live in the parent's DOM but need to appear at the right spot over the iframe.

- The parent maintains an `iframeRect` ref (updated via `ResizeObserver` on the iframe wrapper).
- `NewCommentComposer` and `ThreadPopover` receive props for `clientX/clientY` (in iframe coords) and translate to canvas coords as `clientX + iframeRect.left`, `clientY + iframeRect.top`.
- They render with `position: fixed` relative to the canvas viewport (since the toolbar is also fixed at top).

## Visual treatment

### Toolbar

- `fixed top-0 left-0 right-0 z-50 h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4`
- Left section: a `lucide-react` `LayoutTemplate` icon (16px, `text-slate-500`) + the prototype name in `text-sm font-semibold text-slate-700`. Prototype name comes from a small registry that maps `pathname` prefix to display name (`/programs` → "Program Detail", `/marketplace/partner` → "Partner Marketplace").
- Center section: `<ViewportSwitcher>` two-segment pill. `bg-slate-100 rounded-full p-1 flex gap-1`; segments are `px-3 py-1 text-xs font-semibold rounded-full`; active segment `bg-white text-slate-900 shadow-sm`, inactive `text-slate-500 hover:text-slate-700`.
- Right section: version switcher pill + comment toggle pill, separated by an 8px gap. Both reuse the same pill shape as the viewport switcher (`bg-slate-100 rounded-full p-1`) so the three controls share a visual system.

The toolbar palette is **light** (`bg-white` over slate borders) — different from the current floating dark-pill chrome — because it's persistent UI and dark fixed bars over white pages feel heavy in long review sessions. Light toolbar follows the project's "simple, clean" rule.

### Comment mode toggle (in toolbar)

The relocated `ModeToggle` drops `scale-105` (per the design-language rule). Active comment mode is signaled only by color (`bg-fern-500 text-white` on the Comment segment), not transform. Visually consistent with the viewport pill.

### Panel button (in toolbar)

A separate small pill button next to the comment toggle. `PanelRight` icon. Toggles `CommentsPanel` slide-in from the right (existing behavior).

### Canvas frame

- Below the toolbar: `bg-slate-100` to give visual separation from the white iframe content.
- Mobile mode: the iframe is centered, `w-[390px] h-full max-h-full`, with `border border-slate-200 rounded-lg` and a subtle `shadow-sm`. The slate background fills the rest of the canvas.
- Desktop mode: the iframe is `w-full h-full` with no border or shadow — edge-to-edge.

### Comment composer / thread popover

When rendered in the canvas, they keep their existing visual styles. They float over the iframe area, anchored to the pin coordinates translated from iframe-local to canvas-local. They never overlap the toolbar (clamped to `top >= toolbarHeight + 8px`).

## Data flow walkthroughs

### Walkthrough 1: Switching viewport

1. User clicks **Mobile** in `ViewportSwitcher`.
2. `ViewportSwitcher` calls `router.push(pathname + '?' + newSearchParams)` with `viewport=mobile` set.
3. `CanvasShell` re-renders; `CanvasFrame` reads `viewport` from the URL and re-sizes the iframe to `w-[390px]`.
4. The iframe's `src` does not change, so the iframe does not reload — it just resizes. (Implementation note: the `<iframe>` `src` is constructed once per `pathname + searchParams (excluding viewport)`.)
5. Inside the iframe, `useDevice()` resize listener fires; `pageKey` rescopes from `desktop` → `mobile`. The iframe's comment subscription re-queries threads for the new key.
6. The canvas's `CommentCanvasChrome` also derives the new `pageKey` from the new `viewport` param and re-queries threads — its panel updates in lockstep.

### Walkthrough 2: Switching design version

1. User clicks a different version in `ToolbarVersionSwitcher`.
2. The switcher updates `?v=` in the URL via `router.push`.
3. `CanvasFrame` notices the iframe `src` derives from `?v=` and re-builds the `src`. The iframe reloads with the new version of the prototype.
4. Inside the new iframe, `CommentPinLayer` posts `{type: 'ready', pageKey}` to parent on mount.
5. Both halves now scope to the new `pageKey` (which includes the new `v` value). Existing per-version comment scoping is preserved.

### Walkthrough 3: Dropping a new comment pin

1. User clicks **Comment** in the toolbar.
2. `CommentCanvasChrome` posts `{type: 'set-mode', mode: 'comment'}` to iframe.
3. Iframe's `CommentPinLayer` enables click capture, sets crosshair cursor.
4. User clicks on a `[data-comment-anchor]` element inside the prototype.
5. `CommentPinLayer` computes `{anchorId, relX, relY, clientX, clientY}`, posts `{type: 'pin-click', ...}` to parent.
6. `CommentCanvasChrome` translates `clientX/clientY` to canvas coords using `iframeRect`, opens `NewCommentComposer` at that position.
7. User submits → canvas calls existing `createThread` Convex mutation directly. No iframe involvement for the write.
8. Convex `listThreadsForPage` query fires reactively in BOTH halves; pin appears on both the iframe overlay and the canvas-side panel.

## Files affected

### New files

- `components/canvas/CanvasShell.tsx` — top-level chrome wrapper (client component).
- `components/canvas/CanvasToolbar.tsx` — the 48px fixed toolbar.
- `components/canvas/PrototypeIdent.tsx` — left-side prototype name + icon (uses a small `pathname → display name` registry).
- `components/canvas/ViewportSwitcher.tsx` — Mobile/Desktop two-segment pill.
- `components/canvas/ToolbarVersionSwitcher.tsx` — version pill rebuilt for the toolbar (lighter visual treatment matching the toolbar; reuses `useDesignVersion`).
- `components/canvas/ToolbarCommentToggle.tsx` — comment mode pill + panel button, matching toolbar visual system; consumes `useCommentLayer` from the canvas-side provider.
- `components/canvas/CanvasFrame.tsx` — iframe wrapper with viewport sizing and `iframeRect` ref.
- `components/canvas/EmbedShell.tsx` — minimal shell for embed mode (Header + children + Footer + `CommentPinLayer`).
- `components/canvas/PrototypeShell.tsx` — the client wrapper that branches on `?embed=` into either `<EmbedShell>` or `<CanvasShell>`.
- `components/canvas/use-canvas-mode.ts` — hook that reads `?embed=` and `?viewport=` from search params; provides `{ isEmbed, viewport, setViewport }`.
- `components/canvas/cross-frame-protocol.ts` — typed message types + send/receive helpers with origin checks.
- `components/canvas/page-name-registry.ts` — `pathname` prefix → display name lookup (e.g., `/programs` → "Program Detail", `/marketplace/partner` → "Partner Marketplace").
- `components/comments/CommentPinLayer.tsx` — iframe-side pins + click capture (extracted/refactored from `CommentLayer`).
- `components/comments/CommentCanvasChrome.tsx` — canvas-side comment UI (mode toggle proxy, banner, panel, composer, popover orchestration).

### Modified files

- `app/programs/layout.tsx` — replaces the body with `<PrototypeShell>{children}</PrototypeShell>`.
- `app/marketplace/layout.tsx` — same replacement.
- `components/comments/CommentLayer.tsx` — removed (replaced by the two new split components).
- `components/comments/CommentLayerWrapper.tsx` — removed (no longer mounted at the layout level; pin layer is mounted inside `EmbedShell`, chrome is mounted inside `CanvasShell`).
- `components/comments/ModeToggle.tsx` — removed (replaced by `ToolbarCommentToggle`).
- `components/comments/useCommentLayer.tsx` — kept; consumed by `CommentCanvasChrome`. The `CommentLayerProvider` mounts inside `CanvasShell` so canvas-side components can use it.

### Removed files

- `components/DesignVersionSwitcher.tsx` — replaced by `ToolbarVersionSwitcher`.
- `app/programs/_components/VersionSwitcherWrapper.tsx` — no longer needed; toolbar version switcher infers `pageId` from pathname.
- `app/marketplace/_components/VersionSwitcherWrapper.tsx` — same.

## Acceptance criteria

- Visiting `/programs/study-in-paris` renders the canvas: white toolbar at top, slate canvas area below, iframe loading the prototype.
- Toggling the viewport switcher to **Mobile** resizes the iframe to 390px wide, centered with a slate background visible on either side; `MobileStickyBar` becomes visible inside the iframe (because `lg:hidden` evaluates true at 390px).
- Toggling back to **Desktop** restores the full-width iframe; `MobileStickyBar` disappears.
- Toggling the version switcher reloads the iframe at the new version; comments rescope to the new `pageKey`.
- Entering comment mode + clicking on a `[data-comment-anchor]` element inside the iframe opens the new-comment composer in the canvas chrome at the correct position over the clicked element.
- Existing pins render inside the iframe; clicking one opens the thread popover in the canvas chrome.
- Comments panel slides in from the right (over the toolbar, but below `z-60` overlays); thread list is in sync with the iframe pins.
- No floating chrome remains: `DesignVersionSwitcher` is gone, `ModeToggle` is gone, no fixed `bottom-[Npx]` magic offsets in any prototype layout file.
- On a real mobile viewport (`< 768px`), the canvas auto-selects mobile viewport mode and the desktop toggle is hidden.
- All `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with zero errors.
- No inline hex colors. All color classes use brand tokens (`cobalt-*`, `slate-*`, `fern-*`, etc.) per `CLAUDE.md`.

## Risks and mitigations

- **iframe re-render thrash on viewport switch.** Mitigation: `<iframe>` `src` is constructed from `pathname + (?v= and ?embed=1)` only; `?viewport=` is read by the parent for sizing and never enters the `src`. So switching viewport resizes the iframe without reloading it.
- **postMessage origin mismatch in dev.** Mitigation: origin checks compare against `window.location.origin` of the iframe's host page, which matches in dev and prod since iframe and parent are same-origin.
- **Hydration flicker on `?embed=1`.** Mitigation: `PrototypeShell` is a client component wrapped in `<Suspense>` with a minimal fallback (just renders `{children}` bare). The fallback matches embed mode visually, so the worst case is a brief unstyled flash on canvas pages — acceptable for an internal review tool.
- **Convex client duplicated across frames.** Each frame opens its own websocket. For the small number of stakeholders using this tool concurrently, this is fine. Worth revisiting if presence/scale ever becomes an issue (out of scope here).
- **Comment pins anchored to elements that no longer exist when the version changes.** Already handled by the existing `pageKey` mechanism — switching version produces a new pageKey, so pins from version A don't appear on version B. No regression.
- **Popover/composer position drift when the iframe scrolls.** Pins live inside the iframe and scroll with content; the popover lives in the canvas parent. When the user scrolls inside the iframe, the popover would otherwise stay put while the pin moves. Mitigation: iframe debounces a `pin-rect-update` `postMessage` (60fps cap) on scroll while a popover/composer is open, sending the active pin's current bounding rect; parent updates popover position. When the active pin scrolls out of the iframe's viewport, the popover hides until the pin re-enters. Inactive pins do not generate scroll messages.

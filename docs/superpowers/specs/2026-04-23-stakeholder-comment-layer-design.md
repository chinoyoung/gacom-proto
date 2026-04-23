# Stakeholder Comment Layer — Design

**Date:** 2026-04-23
**Status:** Approved for planning

## Problem

The app shows stakeholders prototypes of program pages, often in multiple design variants (via the `?v=` design-versioning system). Today there's no in-product way for stakeholders to leave feedback on specific parts of a prototype — feedback happens out-of-band (Slack, calls, screenshots). We need a lightweight, in-page collaboration tool so stakeholders can drop pinned comments on any demo page and discuss them in threads, similar to Figma comments.

## Goals

- Signed-in users can drop pinned comments anywhere on a prototype page.
- Comments are threaded (replies supported) and can be resolved.
- Comments are anchored so they follow layout changes across viewport widths.
- Feedback is siloed per design version — comments on `?v=modern` do not appear on `?v=default`.
- Viewing comments works signed-out; writing requires sign-in (Clerk).
- Real-time — multiple stakeholders on the same page see each other's activity without refresh.

## Non-goals

- Presence avatars (who's currently viewing).
- `@mentions` and notifications (email/in-app).
- Rich text, attachments, reactions.
- Exporting threads.
- Migrating comments across design versions.
- Mobile-app support (mobile web only).

## User model

Identity comes from **Clerk** (already installed). Viewing is public; writing requires sign-in.

- A signed-out user sees existing pins and can open threads read-only ("Sign in to reply").
- A signed-in user can enter Comment Mode, drop pins, reply, and resolve.
- Delete permission:
  - A message can be deleted by its author or a superadmin.
  - A thread can be deleted by the thread creator (author of the first message) or a superadmin. Deleting a thread cascades to all its messages.
  - `superadmin` = `publicMetadata.role === "superadmin"`, matching the existing convention in `components/Header.tsx`.
- Resolve/reopen permission: any signed-in user. Rationale: this is collaborative review, not a bug tracker — anyone should be able to close out feedback once addressed.

## Scope of pages

The comment layer mounts in any layout that represents a prototype surface. Initial mount points:

- `app/programs/layout.tsx` (programs index + program detail pages, all design variants)
- `app/marketplace/layout.tsx` (marketplace)
- Any future prototype layout

It is **not** mounted in `app/admin/layout.tsx` (authoring surface, no stakeholder review there).

## Page-key & version binding

Comments are keyed by `pageKey = pathname + (searchParams.v ? "?v=" + searchParams.v : "")`.

- `/programs/study-in-paris` and `/programs/study-in-paris?v=modern` have separate threads.
- The `CommentLayer` reads `usePathname()` + `useSearchParams()` so switching design versions via the existing `DesignVersionSwitcher` reactively reloads the thread set.
- Query strings other than `v` are ignored for the purposes of `pageKey` (e.g. UTM params).

## Anchoring model (load-bearing)

Pins are stored relative to the nearest **anchored section**, not absolute page coordinates. This keeps pins stuck to their intended target across viewport resizes, design-version switches that reuse the same section components, and minor content edits.

### Marking anchors

Shared section components are wrapped once with a lightweight `<CommentAnchor id="...">`:

```tsx
<CommentAnchor id="hero"><ProgramHero .../></CommentAnchor>
<CommentAnchor id="overview"><ProgramOverview .../></CommentAnchor>
<CommentAnchor id="reviews"><ProgramReviews .../></CommentAnchor>
```

`CommentAnchor` renders a `<div data-comment-anchor="<id>">` wrapper with `position: relative`. No other styling. Each design version that reuses these section components inherits anchoring for free.

Anchor IDs are stable strings chosen per-section (e.g. `"hero"`, `"overview"`, `"pricing"`, `"reviews"`, `"faq"`). They are **not** globally unique — a page can have one anchor with id `"hero"`. Different pages can reuse the same id.

### Dropping a pin

On click in Comment Mode:

1. `nearestAnchor = e.target.closest('[data-comment-anchor]')`
2. If none found, `anchorId = "__page__"` and the anchor is `document.body`.
3. `rect = anchor.getBoundingClientRect()`
4. `relX = (e.clientX - rect.left) / rect.width`
5. `relY = (e.clientY - rect.top) / rect.height`
6. Open composer popover anchored to the click point; on submit, persist `(pageKey, anchorId, relX, relY, body)`.

### Rendering a pin

The `PinOverlay` component (fixed-positioned, high z-index):

1. Subscribes to the thread list for the current `pageKey`.
2. For each thread, looks up `document.querySelector('[data-comment-anchor="<id>"]')`.
3. Computes screen position as `rect.left + relX * rect.width`, same for Y.
4. Repositions pins on:
   - `ResizeObserver` firing on any anchored element,
   - `window` scroll/resize,
   - thread list changes.
5. If the anchor element isn't present in the DOM (e.g. hidden on mobile, or this design variant omits that section), the pin is hidden on canvas but shown in the Comments Panel with an "anchor missing on this view" badge.

## Data model

Two new Convex tables added to `convex/schema.ts`:

```ts
commentThreads: defineTable({
  pageKey: v.string(),
  anchorId: v.string(),
  relX: v.number(),
  relY: v.number(),
  status: v.union(v.literal("open"), v.literal("resolved")),
  createdBy: v.string(),               // Clerk userId
  createdByName: v.string(),           // snapshot
  createdByImage: v.optional(v.string()),
  resolvedBy: v.optional(v.string()),
  resolvedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_pageKey", ["pageKey"])
  .index("by_pageKey_status", ["pageKey", "status"]),

commentMessages: defineTable({
  threadId: v.id("commentThreads"),
  body: v.string(),
  authorId: v.string(),                // Clerk userId
  authorName: v.string(),              // snapshot
  authorImage: v.optional(v.string()),
  editedAt: v.optional(v.number()),
}).index("by_thread", ["threadId"]),
```

**Snapshotting rationale:** author name/image are copied onto each message at write time so historical comments don't change when a user updates their Clerk profile. Avatar URLs from Clerk may rotate; that's acceptable — worst case the avatar fails to load and we fall back to initials.

## Convex functions (`convex/comments.ts`)

- `listThreadsForPage({ pageKey })` — query. Returns all threads for `pageKey` plus their messages (oldest-first). Reactive. Public (no auth required).
- `createThread({ pageKey, anchorId, relX, relY, body })` — mutation. Requires auth. Creates thread + first message in one transaction. Returns `threadId`.
- `addMessage({ threadId, body })` — mutation. Requires auth.
- `resolveThread({ threadId })` / `reopenThread({ threadId })` — mutation. Requires auth (any signed-in user).
- `deleteMessage({ messageId })` — mutation. Author or superadmin only.
- `deleteThread({ threadId })` — mutation. Author or superadmin only. Cascades to messages.

Authorization uses `ctx.auth.getUserIdentity()`; superadmin is detected by checking `publicMetadata.role === "superadmin"` from the JWT claims.

## Clerk ↔ Convex bridge

One-time setup required:

1. Add `convex/auth.config.ts` declaring Clerk as the provider.
2. Update `components/ConvexClientProvider.tsx` to use `ConvexProviderWithClerk` from `convex/react-clerk`, wrapping inside the existing `ClerkProvider` in `app/layout.tsx`.
3. Configure a Clerk JWT template named `convex` in the Clerk dashboard (one-time, user does this step — it is not a code change).
4. Ensure the JWT template includes `publicMetadata` so Convex can read the superadmin role.

## Component structure

```
components/comments/
  CommentLayer.tsx            # Top-level wrapper; client component. Reads pageKey via usePathname + useSearchParams, wires provider. Mounted in each prototype layout via a thin client boundary wrapper (mirroring the VersionSwitcherWrapper pattern already used for DesignVersionSwitcher).
  CommentAnchor.tsx           # <div data-comment-anchor="..."> wrapper
  ModeToggle.tsx              # View / Comment pill; floating bottom-left (desktop), bottom-center above mobile sticky bar (mobile). DesignVersionSwitcher stays bottom-center on desktop.
  PinOverlay.tsx              # Positions all pins; handles ResizeObserver + scroll
  CommentPin.tsx              # Numbered bubble + avatar; open (cobalt-500) or resolved (slate-400)
  ThreadPopover.tsx           # Thread view + reply composer; anchored to a pin
  CommentsPanel.tsx           # Right-side slide-out; lists threads with Open/Resolved filter
  NewCommentComposer.tsx      # Draft-pin state before thread exists
  useCommentLayer.tsx         # Context hook: mode, activeThreadId, pageKey
```

## UX states & flows

### Mode toggle

- Two states: **View** (default) and **Comment**.
- Pill-shaped toggle, floating bottom-left on desktop (so it doesn't collide with `DesignVersionSwitcher` at bottom-center), and bottom-center above the mobile sticky bar on mobile (where the switcher also lives — stacked vertically).
- Hidden when signed-out.
- Pressing the toggle or `C` shortcut enters Comment Mode; `Esc` exits.

### View Mode (signed-in or signed-out)

- Existing pins render on canvas.
- Clicking a pin opens `ThreadPopover` showing the thread.
- Signed-out users see a read-only popover with a "Sign in to reply" CTA.

### Comment Mode (signed-in only)

- Cursor becomes a crosshair over the page body.
- Hovering an anchored section shows a faint outline so the user knows what they're targeting.
- Clicking in open area drops a **draft pin** and opens the composer.
- Submitting creates the thread.
- `Esc` cancels the draft and exits Comment Mode.
- Clicking an existing pin in Comment Mode opens its thread (does not drop a new pin).

### Thread popover

- Shows messages oldest-first with author avatar + name + relative timestamp.
- Reply input at the bottom (plaintext, `Cmd/Ctrl+Enter` to submit).
- Header actions: Resolve/Reopen; overflow menu for Delete (author/superadmin only).
- Positioned next to the pin on desktop; bottom sheet on mobile `<sm`.

### Comments panel

- Toggled from a button in the mode toggle cluster.
- Right-side slide-out on desktop (w-96), full-screen on mobile.
- Filter tabs: **Open** (default) / **Resolved** / **All**.
- Each thread item shows: first message preview (2-line clamp), author, timestamp, message count, status, anchor id badge.
- Clicking an item scrolls the pin into view and opens its popover.
- If a thread's anchor is missing in the current DOM, show an "anchor missing on this view" badge and disable scroll-to.

## Visual language

Follows the project's CLAUDE.md design rules:

- Standard Tailwind classes; no inline hex.
- Brand colors only: `cobalt-500` (open pin, primary buttons), `slate-400/500` (resolved pin, secondary text), `fern-500` (resolve confirmation), `roman-500` (destructive).
- `rounded-full` for pins, `rounded-xl` for popover and panel. No heavy shadows; a single `shadow-lg` maximum.
- Buttons are standard height, not oversized.
- No gradients.

## Mobile considerations

- Mode toggle stacks above the existing mobile sticky bar; z-index coordinated with `DesignVersionSwitcher`.
- `ThreadPopover` renders as a bottom sheet at `<sm`.
- `CommentsPanel` is full-screen at `<sm`.
- Tap targets are ≥ 44px.
- Comment Mode on touch uses tap-to-drop (no hover).

## Real-time behavior

- `listThreadsForPage` is a Convex query, so any mutation (new thread, reply, resolve) pushes updates to all subscribed clients automatically.
- New messages from other users animate in; new pins from other users fade in on canvas.
- No optimistic state is required for correctness, but the composer uses an optimistic placeholder to feel snappy; rollback shows an inline retry on mutation failure.

## Edge cases

- **Anchor not in DOM on this variant** → pin hidden on canvas, listed in panel with badge.
- **Window resize mid-session** → `ResizeObserver` repositions pins.
- **Very long threads** → panel items clamp; popover scrolls internally.
- **Concurrent edits** → last-write-wins on message edits (edits out of initial scope — see Non-goals).
- **Signed-out user clicks pin** → read-only popover with "Sign in to reply".
- **Page has zero anchored sections** → pins use `anchorId = "__page__"` relative to document body. Functional, less stable across widths.
- **Deleted thread** → cascades to messages in a single transaction.
- **Clerk JWT not yet configured** → mutations reject with "Unauthenticated"; UI surfaces a friendly error.

## Open questions (resolved during brainstorming)

- Anchoring: free-drop pins (Q1, answer C).
- Page scope: all prototype layouts, not admin (Q2, answer B).
- Version binding: per-version (Q3, answer A).
- Identity: Clerk (user confirmed Clerk is installed).
- Functionality level: threads + resolve (Q5, answer C).

## Risks & mitigations

- **Anchor IDs drift over time.** Mitigation: document anchor IDs in a short list in `CommentAnchor.tsx` comments and treat changes like DB migrations for the prototype — i.e. rare and deliberate.
- **ResizeObserver churn with many pins.** Mitigation: one observer per unique anchor, not per pin. Throttle recomputation via rAF.
- **Clerk JWT template setup is easy to forget.** Mitigation: plan includes explicit verification step; `ConvexProviderWithClerk` surfaces a clear error if missing.
- **Comment overlay catches clicks meant for underlying page.** Mitigation: overlay uses `pointer-events: none` by default; only the pins themselves (and the crosshair region in Comment Mode) capture pointer events.

## Success criteria

- A signed-in user can enter Comment Mode, drop a pin on the Hero of a program page, type a comment, and see it appear as a pin that other signed-in users viewing the same page see live.
- Replies work and are threaded under the pin.
- Resolving a thread grays out the pin on canvas and moves it to the Resolved tab in the panel.
- Switching design variants via `?v=` swaps the comment set cleanly.
- Switching viewport width moves pins to follow their anchored section.
- Signed-out users can view and read threads but cannot write.

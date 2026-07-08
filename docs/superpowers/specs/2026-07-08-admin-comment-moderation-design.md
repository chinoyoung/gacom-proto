# Admin Comment Moderation (Inline) — Design

**Date:** 2026-07-08
**Status:** Approved (pending spec review)

## Summary

Let a `superadmin` delete *any* stakeholder feedback comment — a whole thread or an
individual message — directly from the pin popover on prototype pages. Every delete
(own or others') gets a lightweight inline confirmation step.

"Comments" here means the Figma-style pinned feedback threads stakeholders leave on
prototype pages (`commentThreads` + `commentMessages`), rendered by
`components/comments/ThreadPopover.tsx`. This is **not** program reviews.

## Background / Current State

- **Backend already supports admin deletion.** `convex/comments.ts`:
  - `deleteThread` authorizes `thread.createdBy === identity.subject || isSuperadmin(identity)`.
  - `deleteMessage` authorizes `message.authorId === identity.subject || isSuperadmin(identity)`.
  - `isSuperadmin` checks `identity.publicMetadata?.role === "superadmin"`.
- **A superadmin role system already exists** (Clerk `publicMetadata.role`), managed at
  `/admin` (`app/admin/_actions.ts`, `app/admin/_components/UsersManager.tsx`).
- **The gap is purely UI.** In `ThreadPopover.tsx` the delete controls are gated on
  authorship only:
  - "Delete thread" renders only when `isAuthor` (currently ~line 190).
  - Per-message "Delete" renders only when `msg.authorId === currentUserId` (~line 230).
  - So a superadmin cannot delete other people's comments from the interface even though
    the server would allow it.
- **No confirmation today.** Clicking "Delete thread" deletes immediately.

## Goals

1. A superadmin can delete any comment thread and any individual message from the popover.
2. All deletes (own and others') require an inline confirmation click.
3. No change to server authorization — the server remains the security boundary.

## Non-Goals (YAGNI)

- No `/admin` management panel or bulk delete.
- No audit log of deletions.
- No comment editing.
- No change to who can *create*, *reply*, *resolve*, or *reopen*.

## Design

### 1. Client-side admin detection — `lib/use-is-superadmin.ts` (new)

A small reusable hook mirroring the existing `lib/use-design-version.ts` convention:

```ts
"use client";
import { useUser } from "@clerk/nextjs";

export function useIsSuperadmin(): boolean {
  const { user } = useUser();
  return user?.publicMetadata?.role === "superadmin";
}
```

Reads the same `publicMetadata.role` field the server already trusts
(`app/admin/_actions.ts`). Client-side gating is convenience/UX only; the server mutation
enforces the real check.

### 2. `ThreadPopover.tsx` gating changes (only component touched)

- Add `const isSuperadmin = useIsSuperadmin();`
- Introduce `const canDeleteThread = isAuthor || isSuperadmin;`
- **Delete thread** button: render when `canDeleteThread` (was `isAuthor`).
- **Delete message** button: render when `msg.authorId === currentUserId || isSuperadmin`
  (was author-only).

### 3. Inline confirmation on all deletes

No native `window.confirm()` and no new modal — keep the clean design language with an
inline two-step:

- **Thread delete:** clicking "Delete thread" in the actions menu swaps the row into a
  `Confirm delete? [Cancel] [Delete]` state. Only the second (Delete) click fires
  `deleteThread` and closes the popover. Cancel returns to the normal menu.
- **Message delete:** clicking a message's "Delete" swaps that inline link into a compact
  `Confirm? [Cancel] [Delete]` control. Only the confirm click fires `deleteMessage`.
- State is local to the popover component (e.g. `confirmingThreadDelete: boolean` and
  `confirmingMessageId: string | null`). Opening/closing the actions menu or switching
  target resets the pending confirm state so a stale confirm can't linger.

### 4. Backend

No changes. `deleteThread` / `deleteMessage` already authorize `author OR superadmin` and
enforce it server-side. UI gating is defense-in-depth, not the security boundary.

## Data Flow

1. Superadmin (signed in) opens a pin popover for a thread they did not author.
2. `useIsSuperadmin()` returns `true` → delete controls render.
3. Click Delete → local confirm state set → confirm click calls the existing Convex
   mutation → Convex re-checks `superadmin` server-side → row(s) deleted → live query
   updates the pin layer.

## Testing / Verification

- `npx tsc --noEmit` clean.
- Manual drive (per the `verify` approach):
  - Signed-in **superadmin** on another user's thread: delete controls appear; two-step
    confirm deletes the thread and each message.
  - Signed-in **non-admin, non-author**: no delete controls appear.
  - **Author** (non-admin): still sees delete controls for own content, now behind the
    confirm step.
  - Cancel on the confirm step aborts without deleting.

## Files

- `lib/use-is-superadmin.ts` — new hook.
- `components/comments/ThreadPopover.tsx` — gating + inline confirmation.

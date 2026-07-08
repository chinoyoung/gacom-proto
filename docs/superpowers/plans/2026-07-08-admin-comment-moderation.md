# Admin Comment Moderation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a `superadmin` delete any stakeholder comment (thread or individual message) from the pin popover, with an inline confirmation step on every delete.

**Architecture:** The Convex backend already authorizes `author OR superadmin` for `deleteThread`/`deleteMessage`. This change is UI-only: a small client hook exposes the superadmin role, and `ThreadPopover.tsx` uses it to (a) show delete controls to admins on any comment and (b) require a two-step inline confirmation before deleting.

**Tech Stack:** Next.js 16 App Router, React, TypeScript (strict), Clerk (`@clerk/nextjs`), Convex, Tailwind v4, Vitest.

## Global Constraints

- **No git commands.** Leave all changes in the working tree — do NOT run `git add`/`commit`/etc. (project rule). Each task ends at a verified checkpoint, not a commit.
- **No inline hex colors in className.** Use brand tokens (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`) and standard Tailwind classes.
- **Every clickable element gets `cursor-pointer`** (Tailwind v4 does not apply it to `<button>` by default).
- **Client gating is UX only** — the Convex mutation is the security boundary and must not be weakened.
- **The admin role string is exactly `"superadmin"`** — must match `convex/comments.ts` `isSuperadmin` and `app/admin/_actions.ts`.

---

### Task 1: Superadmin detection (pure helper + client hook)

**Files:**
- Create: `lib/is-superadmin.ts` (pure logic, no framework imports)
- Create: `lib/use-is-superadmin.ts` (client hook wrapping the pure logic)
- Test: `lib/is-superadmin.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `isSuperadminRole(role: unknown): boolean` — from `lib/is-superadmin.ts`
  - `useIsSuperadmin(): boolean` — from `lib/use-is-superadmin.ts`

Rationale for two files: the existing Vitest suite runs pure-logic tests with no jsdom/React harness. Keeping the role check in a Clerk-free module (`is-superadmin.ts`) makes it unit-testable without importing `@clerk/nextjs` into the test graph. The hook lives separately because it is a `"use client"` React hook.

- [ ] **Step 1: Write the failing test**

Create `lib/is-superadmin.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isSuperadminRole } from "./is-superadmin";

describe("isSuperadminRole", () => {
  it("returns true for the superadmin role", () => {
    expect(isSuperadminRole("superadmin")).toBe(true);
  });

  it("returns false for a non-admin role string", () => {
    expect(isSuperadminRole("user")).toBe(false);
    expect(isSuperadminRole("admin")).toBe(false);
  });

  it("returns false when role is missing or non-string", () => {
    expect(isSuperadminRole(undefined)).toBe(false);
    expect(isSuperadminRole(null)).toBe(false);
    expect(isSuperadminRole(42)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/is-superadmin.test.ts`
Expected: FAIL — cannot resolve `./is-superadmin` / `isSuperadminRole is not a function`.

- [ ] **Step 3: Implement the pure helper**

Create `lib/is-superadmin.ts`:

```ts
/** The Clerk publicMetadata role that grants prototype admin privileges. */
export const SUPERADMIN_ROLE = "superadmin";

/**
 * Pure check for the superadmin role. Framework-free so it can be unit-tested
 * without Clerk. Must match `isSuperadmin` in convex/comments.ts.
 */
export function isSuperadminRole(role: unknown): boolean {
  return role === SUPERADMIN_ROLE;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/is-superadmin.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Implement the client hook**

Create `lib/use-is-superadmin.ts`:

```ts
"use client";

import { useUser } from "@clerk/nextjs";
import { isSuperadminRole } from "./is-superadmin";

/**
 * Client-side convenience check for the superadmin role, read from Clerk
 * publicMetadata. UX gating only — Convex mutations re-check server-side.
 */
export function useIsSuperadmin(): boolean {
  const { user } = useUser();
  return isSuperadminRole(user?.publicMetadata?.role);
}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 7: Checkpoint (no commit)**

Leave changes in the working tree. Confirm `npm test` and `npx tsc --noEmit` both pass. Do not run git.

---

### Task 2: Admin delete gating + inline confirmation in ThreadPopover

**Files:**
- Modify: `components/comments/ThreadPopover.tsx`

**Interfaces:**
- Consumes: `useIsSuperadmin()` from `@/lib/use-is-superadmin` (Task 1).
- Produces: no new exports (internal component behavior only).

There is no component-test harness in this repo (Vitest runs pure-logic tests only, no jsdom/RTL), and adding one is out of scope. This task is verified by `tsc --noEmit` plus a manual drive checklist. All edits are in the single file `components/comments/ThreadPopover.tsx`.

- [ ] **Step 1: Import the hook**

Add this import alongside the other imports (e.g. directly after the existing `import type { CommentThread } from "./types";` line near the top of the file):

```tsx
import { useIsSuperadmin } from "@/lib/use-is-superadmin";
```

- [ ] **Step 2: Add confirmation state**

Find this line (currently ~line 42):

```tsx
  const [menuOpen, setMenuOpen] = useState(false);
```

Add immediately after it:

```tsx
  const [confirmingThreadDelete, setConfirmingThreadDelete] = useState(false);
  const [confirmingMessageId, setConfirmingMessageId] = useState<string | null>(null);
```

- [ ] **Step 3: Compute admin/permission flags**

Find these lines (currently ~lines 45-46):

```tsx
  const currentUserId = user?.id;
  const isAuthor = currentUserId === thread.createdBy;
```

Add immediately after them:

```tsx
  const isSuperadmin = useIsSuperadmin();
  const canDeleteThread = isAuthor || isSuperadmin;
```

- [ ] **Step 4: Reset the thread-delete confirm when the actions menu closes**

Find the actions-menu toggle button (currently ~lines 160-166):

```tsx
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                aria-label="Thread actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
```

Replace it with (resets the pending confirm whenever the menu is collapsed so a stale confirm can't linger):

```tsx
              <button
                onClick={() =>
                  setMenuOpen((v) => {
                    const next = !v;
                    if (!next) setConfirmingThreadDelete(false);
                    return next;
                  })
                }
                className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                aria-label="Thread actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
```

- [ ] **Step 5: Gate the thread-delete control on admin + add two-step confirm**

Find the current author-only, immediate-delete block (currently ~lines 190-201):

```tsx
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        deleteThread({ threadId: thread._id });
                        setActiveThreadId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-roman-500 hover:bg-slate-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete thread
                    </button>
                  )}
```

Replace it with:

```tsx
                  {canDeleteThread &&
                    (confirmingThreadDelete ? (
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <span className="text-xs text-slate-600">Delete thread?</span>
                        <button
                          onClick={() => setConfirmingThreadDelete(false)}
                          className="ml-auto text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setConfirmingThreadDelete(false);
                            setMenuOpen(false);
                            deleteThread({ threadId: thread._id });
                            setActiveThreadId(null);
                          }}
                          className="text-xs font-semibold text-roman-500 hover:text-roman-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingThreadDelete(true)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-roman-500 hover:bg-slate-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete thread
                      </button>
                    ))}
```

- [ ] **Step 6: Gate the message-delete control on admin + add two-step confirm**

Find the current author-only message delete block (currently ~lines 229-238):

```tsx
                  <Show when="signed-in">
                    {msg.authorId === currentUserId && (
                      <button
                        onClick={() => deleteMessage({ messageId: msg._id })}
                        className="ml-auto text-[10px] text-slate-400 hover:text-roman-500"
                      >
                        Delete
                      </button>
                    )}
                  </Show>
```

Replace it with:

```tsx
                  <Show when="signed-in">
                    {(msg.authorId === currentUserId || isSuperadmin) &&
                      (confirmingMessageId === msg._id ? (
                        <span className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => setConfirmingMessageId(null)}
                            className="text-[10px] text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setConfirmingMessageId(null);
                              deleteMessage({ messageId: msg._id });
                            }}
                            className="text-[10px] font-semibold text-roman-500 hover:text-roman-600 cursor-pointer"
                          >
                            Delete
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmingMessageId(msg._id)}
                          className="ml-auto text-[10px] text-slate-400 hover:text-roman-500 cursor-pointer"
                        >
                          Delete
                        </button>
                      ))}
                  </Show>
```

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors. (`msg._id` is a Convex `Id<"commentMessages">`, which is a branded string and assignable to the `string | null` confirm state — no cast needed.)

- [ ] **Step 8: Manual drive verification**

Start the app (`npm run dev`) and, on a page with existing comments:

1. **Signed-in superadmin, someone else's thread:** open the pin → actions menu shows "Delete thread"; clicking it shows "Delete thread? Cancel / Delete"; Cancel aborts; Delete removes the thread and closes the popover. Each message shows a "Delete" → "Cancel / Delete" confirm that removes just that message.
2. **Signed-in non-admin, non-author:** open someone else's pin → NO delete controls on the thread or messages (Resolve/Reopen still present).
3. **Author (non-admin):** own thread still deletable, now behind the confirm step.
4. **Signed-out:** no actions menu / reply form (unchanged; gated by `<Show when="signed-in">`).

Expected: all four behave as described.

- [ ] **Step 9: Checkpoint (no commit)**

Leave changes in the working tree. Confirm `npx tsc --noEmit` passes and the manual checklist is green. Do not run git.

---

## Self-Review

**Spec coverage:**
- Client-side admin detection (`lib/use-is-superadmin.ts`) → Task 1. ✓ (spec's single-file suggestion split into pure `is-superadmin.ts` + hook for testability; documented.)
- Delete-thread gating `isAuthor || isSuperadmin` → Task 2, Step 5. ✓
- Delete-message gating `author || isSuperadmin` → Task 2, Step 6. ✓
- Inline two-step confirm on all deletes → Task 2, Steps 5-6. ✓
- Backend unchanged → no task; noted in Global Constraints. ✓
- Verification (`tsc` + manual drive) → Task 1 Step 6, Task 2 Steps 7-8. ✓
- Non-goals (no /admin panel, bulk, audit, edit) → not implemented. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step shows complete code. ✓

**Type consistency:** `isSuperadminRole(role: unknown): boolean` and `useIsSuperadmin(): boolean` used consistently across tasks. `confirmingMessageId: string | null` compared against `msg._id` (branded string) — consistent. ✓

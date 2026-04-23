# Stakeholder Comment Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Figma-style commenting layer to prototype pages so signed-in stakeholders can drop pinned, threaded comments that follow layout changes and are scoped per design version.

**Architecture:** Pins are anchored to `data-comment-anchor` elements by percentage coordinates so they survive responsive layouts and design-version switches. Data lives in Convex (two new tables), identity comes from Clerk (via a new `ConvexProviderWithClerk` bridge). The layer mounts via a thin client wrapper in each prototype layout, mirrors the existing `VersionSwitcherWrapper` pattern, and reactively loads threads keyed by `pathname + ?v=`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Convex, Clerk, Vitest (new, added in Task 1).

**Spec:** `docs/superpowers/specs/2026-04-23-stakeholder-comment-layer-design.md`

**Operating notes:**
- Per the project's global CLAUDE.md, an agent executing this plan cannot run `git commit`/`push`/etc. When you reach a "Commit" step, **stop and ask the user to commit**. Do not batch work across commit boundaries.
- Design rules (from project CLAUDE.md): standard Tailwind, brand tokens only (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`, `slate-*`), no inline hex, mobile-first, no large buttons, no heavy shadows, no gradient overuse.

---

## File Structure

**New files:**
- `convex/auth.config.ts` — declares Clerk as JWT provider
- `convex/comments.ts` — queries + mutations
- `components/comments/types.ts` — shared TS types
- `components/comments/anchor-math.ts` — pure positioning functions
- `components/comments/anchor-math.test.ts` — unit tests for anchor math
- `components/comments/CommentAnchor.tsx` — anchor wrapper
- `components/comments/useCommentLayer.tsx` — context + hook
- `components/comments/CommentLayer.tsx` — orchestrator
- `components/comments/CommentLayerWrapper.tsx` — client boundary wrapper for layouts
- `components/comments/ModeToggle.tsx` — View/Comment pill
- `components/comments/CommentPin.tsx` — pin marker
- `components/comments/PinOverlay.tsx` — positions all pins
- `components/comments/NewCommentComposer.tsx` — draft pin composer
- `components/comments/ThreadPopover.tsx` — thread + reply UI
- `components/comments/CommentsPanel.tsx` — slide-out list
- `vitest.config.ts` — test config

**Modified files:**
- `package.json` — add test deps + script
- `convex/schema.ts` — add 2 tables
- `components/ConvexClientProvider.tsx` — use `ConvexProviderWithClerk`
- `app/layout.tsx` — wrap with Clerk auth so Convex provider can read the token
- `app/programs/layout.tsx` — mount `CommentLayerWrapper`
- `app/marketplace/layout.tsx` — mount `CommentLayerWrapper`
- `app/programs/[id]/_components/ProgramHero.tsx` — wrap root with `CommentAnchor`
- `app/programs/[id]/_components/ProgramOverview.tsx`
- `app/programs/[id]/_components/WhatsIncluded.tsx`
- `app/programs/[id]/_components/ProgramHighlights.tsx`
- `app/programs/[id]/_components/ProgramDetails.tsx`
- `app/programs/[id]/_components/QuickDetails.tsx`
- `app/programs/[id]/_components/ProgramReviews.tsx`
- `app/programs/[id]/_components/WhyChooseProgram.tsx`
- `app/programs/[id]/_components/RelatedPrograms.tsx`
- `app/programs/[id]/_components/ProgramArticles.tsx`

---

## Task 1: Set up Vitest for pure-function unit tests

**Why:** The anchoring math is the load-bearing piece of this feature — if it drifts, pins land on the wrong elements. We need TDD on the pure functions. Vitest is the lightest option that plays nicely with the existing TS config.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest @vitest/ui
```

Expected: `package.json` gains `vitest` and `@vitest/ui` under `devDependencies`.

- [ ] **Step 2: Add a `test` script to `package.json`**

In `package.json`, add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 4: Verify Vitest runs (no tests yet)**

Run: `npm test`

Expected: `No test files found, exiting with code 0` or equivalent. Exit code 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest for unit tests"
```

**STOP: ask the user to commit.**

---

## Task 2: Add anchor-math pure functions with TDD

**Why:** These are the functions that decide where pins live. Pure, deterministic, easy to test.

**Files:**
- Create: `components/comments/anchor-math.ts`
- Test: `components/comments/anchor-math.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `components/comments/anchor-math.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  computeRelativeCoords,
  computeScreenCoords,
  PAGE_ANCHOR_ID,
  type AnchorRect,
} from "./anchor-math";

describe("computeRelativeCoords", () => {
  it("returns 0,0 for clicks at the top-left of the anchor", () => {
    const rect: AnchorRect = { left: 100, top: 100, width: 400, height: 300 };
    expect(computeRelativeCoords(rect, 100, 100)).toEqual({ relX: 0, relY: 0 });
  });

  it("returns 1,1 for clicks at the bottom-right of the anchor", () => {
    const rect: AnchorRect = { left: 100, top: 100, width: 400, height: 300 };
    expect(computeRelativeCoords(rect, 500, 400)).toEqual({ relX: 1, relY: 1 });
  });

  it("returns 0.5,0.5 for clicks at the center of the anchor", () => {
    const rect: AnchorRect = { left: 0, top: 0, width: 200, height: 100 };
    expect(computeRelativeCoords(rect, 100, 50)).toEqual({ relX: 0.5, relY: 0.5 });
  });

  it("clamps negative relative coords to 0", () => {
    const rect: AnchorRect = { left: 100, top: 100, width: 100, height: 100 };
    expect(computeRelativeCoords(rect, 50, 50)).toEqual({ relX: 0, relY: 0 });
  });

  it("clamps relative coords >1 to 1", () => {
    const rect: AnchorRect = { left: 0, top: 0, width: 100, height: 100 };
    expect(computeRelativeCoords(rect, 500, 500)).toEqual({ relX: 1, relY: 1 });
  });

  it("handles zero-sized anchors by returning 0,0", () => {
    const rect: AnchorRect = { left: 50, top: 50, width: 0, height: 0 };
    expect(computeRelativeCoords(rect, 50, 50)).toEqual({ relX: 0, relY: 0 });
  });
});

describe("computeScreenCoords", () => {
  it("places a rel(0,0) pin at the anchor's top-left", () => {
    const rect: AnchorRect = { left: 200, top: 150, width: 400, height: 300 };
    expect(computeScreenCoords(rect, 0, 0)).toEqual({ x: 200, y: 150 });
  });

  it("places a rel(1,1) pin at the anchor's bottom-right", () => {
    const rect: AnchorRect = { left: 200, top: 150, width: 400, height: 300 };
    expect(computeScreenCoords(rect, 1, 1)).toEqual({ x: 600, y: 450 });
  });

  it("roundtrips: relative -> screen -> relative returns the original rel coords", () => {
    const rect: AnchorRect = { left: 50, top: 80, width: 300, height: 200 };
    const screen = computeScreenCoords(rect, 0.3, 0.7);
    const rel = computeRelativeCoords(rect, screen.x, screen.y);
    expect(rel.relX).toBeCloseTo(0.3);
    expect(rel.relY).toBeCloseTo(0.7);
  });
});

describe("PAGE_ANCHOR_ID", () => {
  it("is the sentinel string used when no section anchor is found", () => {
    expect(PAGE_ANCHOR_ID).toBe("__page__");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: test file fails to resolve `./anchor-math` — all tests fail.

- [ ] **Step 3: Write the implementation**

Create `components/comments/anchor-math.ts`:
```ts
export const PAGE_ANCHOR_ID = "__page__" as const;

export type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type RelativeCoords = { relX: number; relY: number };
export type ScreenCoords = { x: number; y: number };

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

export function computeRelativeCoords(
  rect: AnchorRect,
  clientX: number,
  clientY: number,
): RelativeCoords {
  if (rect.width === 0 || rect.height === 0) {
    return { relX: 0, relY: 0 };
  }
  return {
    relX: clamp01((clientX - rect.left) / rect.width),
    relY: clamp01((clientY - rect.top) / rect.height),
  };
}

export function computeScreenCoords(
  rect: AnchorRect,
  relX: number,
  relY: number,
): ScreenCoords {
  return {
    x: rect.left + relX * rect.width,
    y: rect.top + relY * rect.height,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`

Expected: all tests pass, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add components/comments/anchor-math.ts components/comments/anchor-math.test.ts
git commit -m "feat(comments): add anchor positioning math"
```

**STOP: ask the user to commit.**

---

## Task 3: Add Convex schema for commentThreads + commentMessages

**Files:**
- Modify: `convex/schema.ts`

- [ ] **Step 1: Add the tables**

In `convex/schema.ts`, add after the `reviews` table definition (before the final `});`):
```ts
  commentThreads: defineTable({
    pageKey: v.string(),
    anchorId: v.string(),
    relX: v.number(),
    relY: v.number(),
    status: v.union(v.literal("open"), v.literal("resolved")),
    createdBy: v.string(),
    createdByName: v.string(),
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
    authorId: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    editedAt: v.optional(v.number()),
  }).index("by_thread", ["threadId"]),
```

- [ ] **Step 2: Verify Convex accepts the schema**

Run: `npx convex dev --until-success` (or confirm the already-running `convex dev` terminal shows "Schema updated successfully").

Expected: no schema validation errors. Convex types are regenerated under `convex/_generated/`.

- [ ] **Step 3: Commit**

```bash
git add convex/schema.ts convex/_generated
git commit -m "feat(comments): add schema for commentThreads and commentMessages"
```

**STOP: ask the user to commit.**

---

## Task 4: Wire Clerk auth into Convex

**Why:** Convex mutations need `ctx.auth.getUserIdentity()` to return the signed-in user's Clerk ID. This requires a JWT template in Clerk named `convex` and a `convex/auth.config.ts`.

**Files:**
- Create: `convex/auth.config.ts`
- Modify: `components/ConvexClientProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `convex/auth.config.ts`**

```ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

- [ ] **Step 2: Document the Clerk dashboard setup**

The user must do this one-time step in the Clerk dashboard:
1. Go to **JWT Templates** → **New template** → **Convex**.
2. Name it `convex`.
3. Copy the **Issuer URL** (looks like `https://warm-tiger-42.clerk.accounts.dev`).
4. Add to `.env.local`: `CLERK_JWT_ISSUER_DOMAIN=<issuer URL>`.

Ask the user to confirm this is done before proceeding.

- [ ] **Step 3: Install the Convex/Clerk React bridge**

Run: `npm install convex @clerk/nextjs` (already installed — this just ensures peer-dep satisfaction for `ConvexProviderWithClerk`).

Then verify the helper is importable:
```bash
node -e "require('convex/react-clerk')" 2>&1 | head -1
```
Expected: no error (or a require-of-ESM warning, which is fine — we use it in a `"use client"` file).

- [ ] **Step 4: Update `components/ConvexClientProvider.tsx`**

Replace the entire file with:
```tsx
"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

- [ ] **Step 5: Confirm `app/layout.tsx` wraps Convex inside Clerk**

Open `app/layout.tsx`. The existing structure already wraps `ConvexClientProvider` inside `ClerkProvider` (Clerk at the root, Convex nested under it). No change needed — just verify the ordering is:
```
<ClerkProvider>
  <html>
    <body>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </body>
  </html>
</ClerkProvider>
```

If that's not the case, adjust so Clerk wraps Convex.

- [ ] **Step 6: Smoke-test auth from the client**

Add a temporary check in `app/page.tsx` (or any existing authenticated page):
```tsx
// TEMP — delete after verification
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
// ...then wherever:
const test = useQuery(api.comments.listThreadsForPage, { pageKey: "/" });
console.log("convex threads:", test);
```

Skip this if Task 5 has not been committed yet — we'll verify end-to-end in Task 15 instead. **Do not commit temporary test code.**

- [ ] **Step 7: Commit**

```bash
git add convex/auth.config.ts components/ConvexClientProvider.tsx
git commit -m "feat(auth): wire Clerk into Convex via JWT template"
```

**STOP: ask the user to commit.**

---

## Task 5: Implement Convex `comments.ts` functions

**Files:**
- Create: `convex/comments.ts`

- [ ] **Step 1: Create the file with all queries and mutations**

```ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function requireIdentity(ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity as {
    subject: string;
    name?: string;
    pictureUrl?: string;
    publicMetadata?: { role?: string };
  };
}

function isSuperadmin(identity: { publicMetadata?: { role?: string } }): boolean {
  return identity.publicMetadata?.role === "superadmin";
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listThreadsForPage = query({
  args: { pageKey: v.string() },
  handler: async (ctx, { pageKey }) => {
    const threads = await ctx.db
      .query("commentThreads")
      .withIndex("by_pageKey", (q) => q.eq("pageKey", pageKey))
      .collect();

    const threadsWithMessages = await Promise.all(
      threads.map(async (thread) => {
        const messages = await ctx.db
          .query("commentMessages")
          .withIndex("by_thread", (q) => q.eq("threadId", thread._id))
          .order("asc")
          .collect();
        return { ...thread, messages };
      }),
    );

    return threadsWithMessages.sort((a, b) => a._creationTime - b._creationTime);
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const createThread = mutation({
  args: {
    pageKey: v.string(),
    anchorId: v.string(),
    relX: v.number(),
    relY: v.number(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const now = Date.now();

    const threadId = await ctx.db.insert("commentThreads", {
      pageKey: args.pageKey,
      anchorId: args.anchorId,
      relX: args.relX,
      relY: args.relY,
      status: "open",
      createdBy: identity.subject,
      createdByName: identity.name ?? "Anonymous",
      createdByImage: identity.pictureUrl,
      updatedAt: now,
    });

    await ctx.db.insert("commentMessages", {
      threadId,
      body: args.body,
      authorId: identity.subject,
      authorName: identity.name ?? "Anonymous",
      authorImage: identity.pictureUrl,
    });

    return threadId;
  },
});

export const addMessage = mutation({
  args: {
    threadId: v.id("commentThreads"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);

    const messageId = await ctx.db.insert("commentMessages", {
      threadId: args.threadId,
      body: args.body,
      authorId: identity.subject,
      authorName: identity.name ?? "Anonymous",
      authorImage: identity.pictureUrl,
    });

    await ctx.db.patch(args.threadId, { updatedAt: Date.now() });
    return messageId;
  },
});

export const resolveThread = mutation({
  args: { threadId: v.id("commentThreads") },
  handler: async (ctx, { threadId }) => {
    const identity = await requireIdentity(ctx);
    await ctx.db.patch(threadId, {
      status: "resolved",
      resolvedBy: identity.subject,
      resolvedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const reopenThread = mutation({
  args: { threadId: v.id("commentThreads") },
  handler: async (ctx, { threadId }) => {
    await requireIdentity(ctx);
    await ctx.db.patch(threadId, {
      status: "open",
      resolvedBy: undefined,
      resolvedAt: undefined,
      updatedAt: Date.now(),
    });
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("commentMessages") },
  handler: async (ctx, { messageId }) => {
    const identity = await requireIdentity(ctx);
    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");
    if (message.authorId !== identity.subject && !isSuperadmin(identity)) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete(messageId);
  },
});

export const deleteThread = mutation({
  args: { threadId: v.id("commentThreads") },
  handler: async (ctx, { threadId }) => {
    const identity = await requireIdentity(ctx);
    const thread = await ctx.db.get(threadId);
    if (!thread) throw new Error("Thread not found");
    if (thread.createdBy !== identity.subject && !isSuperadmin(identity)) {
      throw new Error("Not authorized");
    }
    const messages = await ctx.db
      .query("commentMessages")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
    await ctx.db.delete(threadId);
  },
});

// Silence unused-import warning when Id is not referenced directly above.
export type _ThreadId = Id<"commentThreads">;
```

- [ ] **Step 2: Verify Convex compiles the file**

Check the running `convex dev` terminal. Expected: "Functions ready! (convex/comments.ts)". No type errors.

- [ ] **Step 3: Manual smoke test from the Convex dashboard**

In the Convex dashboard, run `comments:listThreadsForPage` with `pageKey: "/"`. Expected: `[]`.

Try `comments:createThread` unauthenticated. Expected: error `"Unauthenticated"`.

- [ ] **Step 4: Commit**

```bash
git add convex/comments.ts
git commit -m "feat(comments): add convex queries and mutations"
```

**STOP: ask the user to commit.**

---

## Task 6: Create shared types file

**Files:**
- Create: `components/comments/types.ts`

- [ ] **Step 1: Create the types**

```ts
import type { Id } from "@/convex/_generated/dataModel";

export type CommentMode = "view" | "comment";

export type CommentMessage = {
  _id: Id<"commentMessages">;
  _creationTime: number;
  threadId: Id<"commentThreads">;
  body: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  editedAt?: number;
};

export type CommentThread = {
  _id: Id<"commentThreads">;
  _creationTime: number;
  pageKey: string;
  anchorId: string;
  relX: number;
  relY: number;
  status: "open" | "resolved";
  createdBy: string;
  createdByName: string;
  createdByImage?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  updatedAt: number;
  messages: CommentMessage[];
};

export type DraftPin = {
  anchorId: string;
  relX: number;
  relY: number;
  // Absolute screen position captured at drop time, used only to anchor the
  // composer popover until the thread is persisted.
  clientX: number;
  clientY: number;
};
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/types.ts
git commit -m "feat(comments): add shared types"
```

**STOP: ask the user to commit.**

---

## Task 7: Create `CommentAnchor` wrapper

**Files:**
- Create: `components/comments/CommentAnchor.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ReactNode } from "react";

interface CommentAnchorProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function CommentAnchor({ id, children, className }: CommentAnchorProps) {
  return (
    <div data-comment-anchor={id} className={`relative ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/CommentAnchor.tsx
git commit -m "feat(comments): add CommentAnchor wrapper"
```

**STOP: ask the user to commit.**

---

## Task 8: Create `useCommentLayer` context + hook

**Files:**
- Create: `components/comments/useCommentLayer.tsx`

- [ ] **Step 1: Create the context**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Id } from "@/convex/_generated/dataModel";
import type { CommentMode, DraftPin } from "./types";

interface CommentLayerState {
  pageKey: string;
  mode: CommentMode;
  setMode: (mode: CommentMode) => void;
  activeThreadId: Id<"commentThreads"> | null;
  setActiveThreadId: (id: Id<"commentThreads"> | null) => void;
  draftPin: DraftPin | null;
  setDraftPin: (pin: DraftPin | null) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
}

const CommentLayerContext = createContext<CommentLayerState | null>(null);

export function CommentLayerProvider({
  pageKey,
  children,
}: {
  pageKey: string;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<CommentMode>("view");
  const [activeThreadId, setActiveThreadId] =
    useState<Id<"commentThreads"> | null>(null);
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const setModeWithReset = useCallback((next: CommentMode) => {
    setMode(next);
    if (next === "view") {
      setDraftPin(null);
    }
  }, []);

  const value = useMemo<CommentLayerState>(
    () => ({
      pageKey,
      mode,
      setMode: setModeWithReset,
      activeThreadId,
      setActiveThreadId,
      draftPin,
      setDraftPin,
      panelOpen,
      setPanelOpen,
    }),
    [pageKey, mode, setModeWithReset, activeThreadId, draftPin, panelOpen],
  );

  return (
    <CommentLayerContext.Provider value={value}>
      {children}
    </CommentLayerContext.Provider>
  );
}

export function useCommentLayer(): CommentLayerState {
  const ctx = useContext(CommentLayerContext);
  if (!ctx) {
    throw new Error("useCommentLayer must be used inside CommentLayerProvider");
  }
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/useCommentLayer.tsx
git commit -m "feat(comments): add useCommentLayer context"
```

**STOP: ask the user to commit.**

---

## Task 9: Create `ModeToggle`

**Files:**
- Create: `components/comments/ModeToggle.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { MessageSquare, MousePointer2, PanelRight } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";
import { useCommentLayer } from "./useCommentLayer";

export function ModeToggle() {
  const { mode, setMode, panelOpen, setPanelOpen } = useCommentLayer();

  return (
    <SignedIn>
      <div className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 sm:bottom-4 sm:left-4">
        <div className="bg-slate-900 shadow-lg rounded-full p-1.5 flex items-center gap-1">
          <button
            onClick={() => setMode("view")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer",
              mode === "view"
                ? "bg-cobalt-500 text-white"
                : "text-slate-300 hover:bg-slate-700",
            ].join(" ")}
            aria-pressed={mode === "view"}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => setMode("comment")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer",
              mode === "comment"
                ? "bg-cobalt-500 text-white"
                : "text-slate-300 hover:bg-slate-700",
            ].join(" ")}
            aria-pressed={mode === "comment"}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Comment
          </button>
        </div>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={[
            "p-2 rounded-full shadow-lg transition-colors cursor-pointer",
            panelOpen
              ? "bg-cobalt-500 text-white"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800",
          ].join(" ")}
          aria-label="Toggle comments panel"
          aria-pressed={panelOpen}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </SignedIn>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/ModeToggle.tsx
git commit -m "feat(comments): add ModeToggle"
```

**STOP: ask the user to commit.**

---

## Task 10: Create `CommentPin` marker

**Files:**
- Create: `components/comments/CommentPin.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import type { CommentThread } from "./types";

interface CommentPinProps {
  thread: CommentThread;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export function CommentPin({ thread, index, isActive, onClick }: CommentPinProps) {
  const isResolved = thread.status === "resolved";
  const bg = isResolved
    ? "bg-slate-400"
    : isActive
      ? "bg-cobalt-600"
      : "bg-cobalt-500";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={[
        "pointer-events-auto absolute -translate-x-1/2 -translate-y-full flex items-center justify-center w-7 h-7 rounded-full rounded-bl-none text-white text-xs font-bold shadow-md transition-transform hover:scale-110 cursor-pointer",
        bg,
      ].join(" ")}
      aria-label={`Open comment thread ${index + 1}`}
      title={thread.createdByName}
    >
      {index + 1}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/CommentPin.tsx
git commit -m "feat(comments): add CommentPin marker"
```

**STOP: ask the user to commit.**

---

## Task 11: Create `PinOverlay`

**Why:** Positions all pins absolutely using anchor `getBoundingClientRect()`. Repositions on resize/scroll so pins follow the page.

**Files:**
- Create: `components/comments/PinOverlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { PAGE_ANCHOR_ID, computeScreenCoords } from "./anchor-math";
import { CommentPin } from "./CommentPin";
import { useCommentLayer } from "./useCommentLayer";
import type { CommentThread } from "./types";

interface PinOverlayProps {
  threads: CommentThread[];
}

type PositionedPin = {
  thread: CommentThread;
  index: number;
  x: number;
  y: number;
  found: boolean;
};

function findAnchorRect(anchorId: string): DOMRect | null {
  if (anchorId === PAGE_ANCHOR_ID) {
    return document.body.getBoundingClientRect();
  }
  const el = document.querySelector<HTMLElement>(
    `[data-comment-anchor="${CSS.escape(anchorId)}"]`,
  );
  return el ? el.getBoundingClientRect() : null;
}

export function PinOverlay({ threads }: PinOverlayProps) {
  const { activeThreadId, setActiveThreadId } = useCommentLayer();
  const [tick, setTick] = useState(0);

  const uniqueAnchorIds = useMemo(
    () => Array.from(new Set(threads.map((t) => t.anchorId))),
    [threads],
  );

  useEffect(() => {
    const bump = () => setTick((n) => n + 1);

    const observers: ResizeObserver[] = [];
    for (const id of uniqueAnchorIds) {
      const selector =
        id === PAGE_ANCHOR_ID
          ? null
          : `[data-comment-anchor="${CSS.escape(id)}"]`;
      const el = selector
        ? document.querySelector<HTMLElement>(selector)
        : document.body;
      if (el) {
        const obs = new ResizeObserver(bump);
        obs.observe(el);
        observers.push(obs);
      }
    }

    window.addEventListener("scroll", bump, { passive: true, capture: true });
    window.addEventListener("resize", bump, { passive: true });

    return () => {
      for (const obs of observers) obs.disconnect();
      window.removeEventListener("scroll", bump, { capture: true });
      window.removeEventListener("resize", bump);
    };
  }, [uniqueAnchorIds]);

  const positioned: PositionedPin[] = threads.map((thread, index) => {
    const rect = findAnchorRect(thread.anchorId);
    if (!rect) return { thread, index, x: 0, y: 0, found: false };
    const { x, y } = computeScreenCoords(
      { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      thread.relX,
      thread.relY,
    );
    return { thread, index, x, y, found: true };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55]"
      aria-hidden="false"
      data-tick={tick}
    >
      {positioned
        .filter((p) => p.found)
        .map((p) => (
          <div
            key={p.thread._id}
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
            className="absolute top-0 left-0"
          >
            <CommentPin
              thread={p.thread}
              index={p.index}
              isActive={p.thread._id === activeThreadId}
              onClick={() => handlePinClick(p.thread._id, activeThreadId, setActiveThreadId)}
            />
          </div>
        ))}
    </div>
  );
}

function handlePinClick(
  id: Id<"commentThreads">,
  activeId: Id<"commentThreads"> | null,
  setActive: (id: Id<"commentThreads"> | null) => void,
) {
  setActive(id === activeId ? null : id);
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/PinOverlay.tsx
git commit -m "feat(comments): add PinOverlay"
```

**STOP: ask the user to commit.**

---

## Task 12: Create `NewCommentComposer`

**Why:** Captures the first message of a new thread. Floats next to the draft pin.

**Files:**
- Create: `components/comments/NewCommentComposer.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useCommentLayer } from "./useCommentLayer";

export function NewCommentComposer() {
  const { pageKey, draftPin, setDraftPin, setMode, setActiveThreadId } =
    useCommentLayer();
  const { user } = useUser();
  const createThread = useMutation(api.comments.createThread);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!draftPin) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !draftPin) return;
    setSubmitting(true);
    try {
      const threadId = await createThread({
        pageKey,
        anchorId: draftPin.anchorId,
        relX: draftPin.relX,
        relY: draftPin.relY,
        body: body.trim(),
      });
      setDraftPin(null);
      setBody("");
      setActiveThreadId(threadId);
      setMode("view");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="pointer-events-auto fixed z-[70]"
      style={{
        left: `${draftPin.clientX}px`,
        top: `${draftPin.clientY + 8}px`,
      }}
    >
      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 w-72"
      >
        <div className="flex items-center gap-2 mb-2">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-xs font-semibold text-slate-700">
            {user?.fullName ?? user?.username ?? "You"}
          </span>
        </div>
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment"
          rows={3}
          className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-cobalt-500 focus:outline-none resize-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraftPin(null);
            }
          }}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setDraftPin(null)}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!body.trim() || submitting}
            className="px-3 py-1 text-xs font-semibold text-white bg-cobalt-500 rounded-md hover:bg-cobalt-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting…" : "Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/NewCommentComposer.tsx
git commit -m "feat(comments): add NewCommentComposer"
```

**STOP: ask the user to commit.**

---

## Task 13: Create `ThreadPopover`

**Why:** Shows an existing thread with replies, resolve/reopen, and delete.

**Files:**
- Create: `components/comments/ThreadPopover.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { MoreHorizontal, Check, RotateCcw, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { PAGE_ANCHOR_ID, computeScreenCoords } from "./anchor-math";
import { useCommentLayer } from "./useCommentLayer";
import type { CommentThread } from "./types";

interface ThreadPopoverProps {
  thread: CommentThread;
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export function ThreadPopover({ thread }: ThreadPopoverProps) {
  const { setActiveThreadId } = useCommentLayer();
  const { user } = useUser();
  const addMessage = useMutation(api.comments.addMessage);
  const resolve = useMutation(api.comments.resolveThread);
  const reopen = useMutation(api.comments.reopenThread);
  const deleteThread = useMutation(api.comments.deleteThread);
  const deleteMessage = useMutation(api.comments.deleteMessage);

  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = user?.id;
  const isAuthor = currentUserId === thread.createdBy;

  const position = useMemo(() => {
    const selector =
      thread.anchorId === PAGE_ANCHOR_ID
        ? null
        : `[data-comment-anchor="${CSS.escape(thread.anchorId)}"]`;
    const el = selector
      ? document.querySelector<HTMLElement>(selector)
      : document.body;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const { x, y } = computeScreenCoords(
      { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      thread.relX,
      thread.relY,
    );
    return { x, y };
  }, [thread]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setActiveThreadId(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [setActiveThreadId]);

  if (!position) return null;

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      await addMessage({ threadId: thread._id, body: reply.trim() });
      setReply("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto fixed z-[70]"
      style={{ left: `${position.x}px`, top: `${position.y + 8}px` }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-80 max-h-[60vh] flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-600">
            {thread.status === "resolved" ? "Resolved" : "Open"}
          </span>
          <SignedIn>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                aria-label="Thread actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]">
                  {thread.status === "open" ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        resolve({ threadId: thread._id });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Check className="w-3.5 h-3.5 text-fern-500" /> Resolve
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        reopen({ threadId: thread._id });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reopen
                    </button>
                  )}
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
                </div>
              )}
            </div>
          </SignedIn>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
          {thread.messages.map((msg) => (
            <div key={msg._id} className="flex items-start gap-2">
              {msg.authorImage ? (
                <img
                  src={msg.authorImage}
                  alt=""
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600 flex-shrink-0">
                  {msg.authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {msg.authorName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatRelative(msg._creationTime)}
                  </span>
                  <SignedIn>
                    {msg.authorId === currentUserId && (
                      <button
                        onClick={() => deleteMessage({ messageId: msg._id })}
                        className="ml-auto text-[10px] text-slate-400 hover:text-roman-500"
                      >
                        Delete
                      </button>
                    )}
                  </SignedIn>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap break-words">
                  {msg.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <SignedIn>
          <form
            onSubmit={submitReply}
            className="border-t border-slate-100 p-2"
          >
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply"
              rows={2}
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-cobalt-500 focus:outline-none resize-none"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  submitReply(e as unknown as React.FormEvent);
                }
              }}
            />
            <div className="flex justify-end mt-1">
              <button
                type="submit"
                disabled={!reply.trim() || submitting}
                className="px-3 py-1 text-xs font-semibold text-white bg-cobalt-500 rounded-md hover:bg-cobalt-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </form>
        </SignedIn>
        <SignedOut>
          <div className="border-t border-slate-100 p-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sign in to reply</span>
            <SignInButton mode="modal">
              <button className="px-3 py-1 text-xs font-semibold text-cobalt-600 hover:text-cobalt-700">
                Sign in
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/ThreadPopover.tsx
git commit -m "feat(comments): add ThreadPopover"
```

**STOP: ask the user to commit.**

---

## Task 14: Create `CommentsPanel`

**Files:**
- Create: `components/comments/CommentsPanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { PAGE_ANCHOR_ID } from "./anchor-math";
import { useCommentLayer } from "./useCommentLayer";
import type { CommentThread } from "./types";

interface CommentsPanelProps {
  threads: CommentThread[];
}

type Filter = "open" | "resolved" | "all";

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

function anchorExists(anchorId: string): boolean {
  if (anchorId === PAGE_ANCHOR_ID) return true;
  return !!document.querySelector(
    `[data-comment-anchor="${CSS.escape(anchorId)}"]`,
  );
}

export function CommentsPanel({ threads }: CommentsPanelProps) {
  const { panelOpen, setPanelOpen, setActiveThreadId } = useCommentLayer();
  const [filter, setFilter] = useState<Filter>("open");

  const filtered = useMemo(() => {
    if (filter === "all") return threads;
    return threads.filter((t) => t.status === filter);
  }, [threads, filter]);

  if (!panelOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[65] w-full sm:w-96 bg-white shadow-lg border-l border-slate-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Comments</h2>
        <button
          onClick={() => setPanelOpen(false)}
          className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1 px-3 py-2 border-b border-slate-100">
        {(["open", "resolved", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer",
              filter === f
                ? "bg-cobalt-500 text-white"
                : "text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            {f === "open" ? "Open" : f === "resolved" ? "Resolved" : "All"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No comments {filter === "all" ? "yet" : `(${filter})`}.
          </div>
        ) : (
          filtered.map((thread) => {
            const first = thread.messages[0];
            const exists = anchorExists(thread.anchorId);
            return (
              <button
                key={thread._id}
                onClick={() => {
                  if (!exists) return;
                  setPanelOpen(false);
                  setActiveThreadId(thread._id);
                  const selector =
                    thread.anchorId === PAGE_ANCHOR_ID
                      ? null
                      : `[data-comment-anchor="${CSS.escape(thread.anchorId)}"]`;
                  const el = selector
                    ? document.querySelector<HTMLElement>(selector)
                    : document.body;
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                disabled={!exists}
                className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-900">
                    {thread.createdByName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatRelative(thread._creationTime)}
                  </span>
                  <span
                    className={[
                      "ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      thread.status === "resolved"
                        ? "bg-slate-100 text-slate-500"
                        : "bg-cobalt-50 text-cobalt-600",
                    ].join(" ")}
                  >
                    {thread.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2">
                  {first?.body ?? ""}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span>#{thread.anchorId}</span>
                  <span>·</span>
                  <span>{thread.messages.length} message{thread.messages.length === 1 ? "" : "s"}</span>
                  {!exists && (
                    <span className="ml-auto text-sun-500">
                      anchor missing on this view
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/CommentsPanel.tsx
git commit -m "feat(comments): add CommentsPanel"
```

**STOP: ask the user to commit.**

---

## Task 15: Create `CommentLayer` orchestrator + capture surface

**Why:** Ties everything together. Subscribes to threads for the current `pageKey`, renders the mode toggle, pin overlay, popovers, panel, and — in comment mode — a click-capture surface that drops new pins.

**Files:**
- Create: `components/comments/CommentLayer.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PAGE_ANCHOR_ID, computeRelativeCoords } from "./anchor-math";
import {
  CommentLayerProvider,
  useCommentLayer,
} from "./useCommentLayer";
import { ModeToggle } from "./ModeToggle";
import { PinOverlay } from "./PinOverlay";
import { ThreadPopover } from "./ThreadPopover";
import { NewCommentComposer } from "./NewCommentComposer";
import { CommentsPanel } from "./CommentsPanel";
import type { CommentThread } from "./types";

export function CommentLayer({ pageKey }: { pageKey: string }) {
  return (
    <CommentLayerProvider pageKey={pageKey}>
      <CommentLayerInner />
    </CommentLayerProvider>
  );
}

function CommentLayerInner() {
  const { pageKey, mode, setDraftPin, draftPin, activeThreadId } =
    useCommentLayer();
  const threadsRaw = useQuery(api.comments.listThreadsForPage, { pageKey });
  const threads: CommentThread[] = useMemo(
    () => (threadsRaw ?? []) as CommentThread[],
    [threadsRaw],
  );

  const activeThread = useMemo(
    () => threads.find((t) => t._id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );

  useEffect(() => {
    if (mode !== "comment") return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Skip clicks on the UI chrome (mode toggle, popovers, etc.)
      if (target.closest("[data-comment-ui]")) return;

      const anchorEl = target.closest<HTMLElement>("[data-comment-anchor]");
      const anchorId =
        anchorEl?.getAttribute("data-comment-anchor") ?? PAGE_ANCHOR_ID;
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
      setDraftPin({ anchorId, relX, relY, clientX: e.clientX, clientY: e.clientY });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [mode, setDraftPin]);

  useEffect(() => {
    if (mode !== "comment") {
      document.body.style.cursor = "";
      return;
    }
    document.body.style.cursor = "crosshair";
    return () => {
      document.body.style.cursor = "";
    };
  }, [mode]);

  return (
    <div data-comment-ui>
      <ModeToggle />
      <PinOverlay threads={threads} />
      {activeThread && !draftPin && <ThreadPopover thread={activeThread} />}
      {draftPin && <NewCommentComposer />}
      <CommentsPanel threads={threads} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/CommentLayer.tsx
git commit -m "feat(comments): add CommentLayer orchestrator"
```

**STOP: ask the user to commit.**

---

## Task 16: Create `CommentLayerWrapper` (client boundary for layouts)

**Why:** Matches the existing `VersionSwitcherWrapper` pattern. Computes `pageKey` from `pathname + ?v=` inside a `Suspense` boundary (required because `useSearchParams` forces client-side rendering).

**Files:**
- Create: `components/comments/CommentLayerWrapper.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CommentLayer } from "./CommentLayer";

function Inner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const pageKey = pathname + (v ? `?v=${v}` : "");
  return <CommentLayer pageKey={pageKey} />;
}

export function CommentLayerWrapper() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/comments/CommentLayerWrapper.tsx
git commit -m "feat(comments): add CommentLayerWrapper client boundary"
```

**STOP: ask the user to commit.**

---

## Task 17: Mount in prototype layouts

**Files:**
- Modify: `app/programs/layout.tsx`
- Modify: `app/marketplace/layout.tsx`

- [ ] **Step 1: Mount in `app/programs/layout.tsx`**

Current content:
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VersionSwitcherWrapper } from "./_components/VersionSwitcherWrapper";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <VersionSwitcherWrapper />
    </>
  );
}
```

Replace with:
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { VersionSwitcherWrapper } from "./_components/VersionSwitcherWrapper";
import { CommentLayerWrapper } from "@/components/comments/CommentLayerWrapper";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <VersionSwitcherWrapper />
      <CommentLayerWrapper />
    </>
  );
}
```

- [ ] **Step 2: Mount in `app/marketplace/layout.tsx`**

Open `app/marketplace/layout.tsx` and add `import { CommentLayerWrapper } from "@/components/comments/CommentLayerWrapper";` to the imports, and render `<CommentLayerWrapper />` as the last child of the returned layout (before closing fragment), mirroring the programs layout.

- [ ] **Step 3: Commit**

```bash
git add app/programs/layout.tsx app/marketplace/layout.tsx
git commit -m "feat(comments): mount CommentLayerWrapper in prototype layouts"
```

**STOP: ask the user to commit.**

---

## Task 18: Wrap program section components with `CommentAnchor`

**Why:** Every section becomes a stable anchor target. Pins on the Hero of the Default design survive a switch to `?v=modern` if Modern also uses `ProgramHero`.

**Files:** modify each of the following.

The pattern for every file: import `CommentAnchor`, wrap the top-level returned element with `<CommentAnchor id="<id>"> ... </CommentAnchor>`. Use the anchor IDs listed below.

Anchor ID mapping:
- `ProgramHero.tsx` → `hero`
- `ProgramOverview.tsx` → `overview`
- `QuickDetails.tsx` → `quick-details`
- `WhatsIncluded.tsx` → `whats-included`
- `ProgramHighlights.tsx` → `highlights`
- `ProgramDetails.tsx` → `details`
- `WhyChooseProgram.tsx` → `why-choose`
- `ProgramReviews.tsx` → `reviews`
- `ProgramArticles.tsx` → `articles`
- `RelatedPrograms.tsx` → `related`

- [ ] **Step 1: Wrap `ProgramHero.tsx`**

Open `app/programs/[id]/_components/ProgramHero.tsx`. Add to imports:
```tsx
import { CommentAnchor } from "@/components/comments/CommentAnchor";
```
Wrap the component's outermost returned JSX element (the top-level `<section>` or `<div>`) with `<CommentAnchor id="hero">...</CommentAnchor>`.

Example transformation:
```tsx
return (
  <CommentAnchor id="hero">
    <section className="..."> ... </section>
  </CommentAnchor>
);
```

- [ ] **Step 2: Wrap `ProgramOverview.tsx` with id `overview`**

- [ ] **Step 3: Wrap `QuickDetails.tsx` with id `quick-details`**

- [ ] **Step 4: Wrap `WhatsIncluded.tsx` with id `whats-included`**

- [ ] **Step 5: Wrap `ProgramHighlights.tsx` with id `highlights`**

- [ ] **Step 6: Wrap `ProgramDetails.tsx` with id `details`**

- [ ] **Step 7: Wrap `WhyChooseProgram.tsx` with id `why-choose`**

- [ ] **Step 8: Wrap `ProgramReviews.tsx` with id `reviews`**

- [ ] **Step 9: Wrap `ProgramArticles.tsx` with id `articles`**

- [ ] **Step 10: Wrap `RelatedPrograms.tsx` with id `related`**

For each step 2–10, the transformation is identical: add the import, wrap the top-level returned JSX with `<CommentAnchor id="<id>">...</CommentAnchor>`.

- [ ] **Step 11: Run the build to catch import/typing errors**

Run: `npm run build`

Expected: build completes with no TypeScript errors. If a wrap breaks a sticky/absolute child (because `CommentAnchor` adds `position: relative`), investigate that section specifically — in most cases the extra wrapper is a no-op.

- [ ] **Step 12: Commit**

```bash
git add app/programs/[id]/_components
git commit -m "feat(comments): wrap program sections with CommentAnchor"
```

**STOP: ask the user to commit.**

---

## Task 19: End-to-end manual verification

**Why:** UI + real-time + auth integration can't be fully caught by unit tests. Walk the happy path and edge cases manually before closing.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

Open `http://localhost:3000/programs/<a-published-slug>` in a browser.

- [ ] **Step 2: Signed-out view**

Expected:
- Mode toggle is hidden.
- Pins from any previous comments render (if any exist).
- Clicking a pin opens a read-only popover with "Sign in to reply".

- [ ] **Step 3: Sign in**

Sign in via the header. Expected: mode toggle appears bottom-left.

- [ ] **Step 4: Drop a pin in Comment Mode**

- Click **Comment** in the toggle. Cursor becomes crosshair.
- Click on the Hero. A composer popover appears next to the click.
- Type "Hero feels cramped at this width." and submit.
- Expected: pin appears on the Hero; mode returns to View; the new thread opens automatically.

- [ ] **Step 5: Reply**

- Click the pin. Popover opens.
- Type a reply and submit (or Cmd/Ctrl+Enter).
- Expected: reply appears in thread.

- [ ] **Step 6: Resolve**

- Open the pin's overflow menu → Resolve.
- Expected: pin turns slate-colored; panel shows the thread only under "Resolved".

- [ ] **Step 7: Reopen**

- Overflow menu → Reopen.
- Expected: pin turns cobalt again.

- [ ] **Step 8: Delete (author only)**

- Overflow menu → Delete thread.
- Expected: pin disappears; thread removed from panel.

- [ ] **Step 9: Design version binding**

- Navigate to `/programs/<slug>?v=<other-version>`.
- Expected: threads from the default view do NOT appear. Create a new pin here, then return to the default — they stay separated.

- [ ] **Step 10: Responsive / anchor follow**

- With a thread visible, resize the browser from 1440px to 768px.
- Expected: pin stays anchored to its section; relative position within the section is preserved.

- [ ] **Step 11: Mobile**

- Switch DevTools to a mobile viewport.
- Expected: toggle reachable at bottom; composer and popover are usable; panel opens full-screen.

- [ ] **Step 12: Multi-user live update**

- Open the same URL in a second browser with a second Clerk user.
- Add a comment from browser B.
- Expected: browser A sees the new pin appear without refresh.

- [ ] **Step 13: Missing anchor on a variant**

- If a design version omits one of the anchors (e.g. `related`), create a thread there on the default, then switch to the variant.
- Expected: pin hidden on canvas; visible in panel with "anchor missing on this view" badge.

- [ ] **Step 14: Commit any small fixes discovered**

If any of the steps above required a tweak, commit each tweak individually with a focused message. Otherwise, nothing to commit.

---

## Self-review notes

- Spec coverage: tasks 3 (schema), 5 (functions), 4 (auth) cover data/auth. Tasks 6–16 cover every component listed in the spec. Task 17 covers the mount scope (programs + marketplace). Task 18 covers anchors. Task 19 covers the UX flows, mobile, real-time, and edge cases listed in the spec's "Edge cases" section.
- Type consistency: `CommentThread` / `CommentMessage` in `types.ts` match the Convex schema exactly and are reused by every consumer. `DraftPin` is local to the draft state and independent of Convex types.
- Placeholder scan: no "TBD", "TODO", or vague instructions. Each step shows exact code or an exact command + expected outcome.

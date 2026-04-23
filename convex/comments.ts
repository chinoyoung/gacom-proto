import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

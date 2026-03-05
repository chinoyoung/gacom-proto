import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").order("desc").collect();
  },
});

export const listReviewsByProgram = query({
  args: {
    programId: v.id("programs"),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { programId, status }) => {
    if (status) {
      return await ctx.db
        .query("reviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", programId).eq("status", status)
        )
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("reviews")
      .withIndex("by_program", (q) => q.eq("programId", programId))
      .order("desc")
      .collect();
  },
});

export const getReview = query({
  args: { id: v.id("reviews") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const createReview = mutation({
  args: {
    programId: v.id("programs"),
    reviewerName: v.string(),
    reviewerCountry: v.string(),
    date: v.string(),
    reviewTitle: v.string(),
    body: v.string(),
    overallRating: v.number(),
    academicsRating: v.number(),
    livingSituationRating: v.number(),
    culturalImmersionRating: v.number(),
    programAdministrationRating: v.number(),
    healthAndSafetyRating: v.number(),
    communityRating: v.number(),
    photo: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const updateReview = mutation({
  args: {
    id: v.id("reviews"),
    programId: v.optional(v.id("programs")),
    reviewerName: v.optional(v.string()),
    reviewerCountry: v.optional(v.string()),
    date: v.optional(v.string()),
    reviewTitle: v.optional(v.string()),
    body: v.optional(v.string()),
    overallRating: v.optional(v.number()),
    academicsRating: v.optional(v.number()),
    livingSituationRating: v.optional(v.number()),
    culturalImmersionRating: v.optional(v.number()),
    programAdministrationRating: v.optional(v.number()),
    healthAndSafetyRating: v.optional(v.number()),
    communityRating: v.optional(v.number()),
    photo: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { id, ...fields }) => {
    // Remove undefined values before patching
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const deleteReview = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

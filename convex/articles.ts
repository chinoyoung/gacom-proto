import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listArticles = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("articles").order("desc").collect();
    },
});

export const getArticle = query({
    args: { id: v.id("articles") },
    handler: async (ctx, { id }) => {
        return await ctx.db.get(id);
    },
});

export const createArticle = mutation({
    args: {
        title: v.string(),
        author: v.string(),
        publishDate: v.string(),
        tags: v.array(v.string()),
        coverImage: v.optional(v.string()),
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("articles", args);
    },
});

export const updateArticle = mutation({
    args: {
        id: v.id("articles"),
        title: v.optional(v.string()),
        author: v.optional(v.string()),
        publishDate: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        coverImage: v.optional(v.string()),
        slug: v.optional(v.string()),
    },
    handler: async (ctx, { id, ...fields }) => {
        const patch = Object.fromEntries(
            Object.entries(fields).filter(([, v]) => v !== undefined)
        );
        await ctx.db.patch(id, patch);
    },
});

export const deleteArticle = mutation({
    args: { id: v.id("articles") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
    },
});

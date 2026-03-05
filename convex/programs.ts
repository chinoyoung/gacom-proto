import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Slug helper ─────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const getProgram = query({
  args: { id: v.id("programs") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("programs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const listPrograms = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return await ctx.db
        .query("programs")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("programs").order("desc").collect();
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const createProgram = mutation({
  args: {
    title: v.string(),
    provider: v.string(),
    hostInstitution: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("programs", {
      title: args.title,
      provider: args.provider,
      hostInstitution: args.hostInstitution,
      slug: args.slug ?? generateSlug(args.title),
      status: "draft",
      // Location (required fields with defaults)
      city: "",
      country: "",
      terms: [],
      // Eligibility
      educationLevels: [],
      eligibleNationalities: [],
      // Details
      description: "",
      whatsIncluded: [],
      subjectAreas: [],
      highlights: [],
      // Media
      photos: [],
    });
  },
});

export const updateProgram = mutation({
  args: {
    id: v.id("programs"),
    // Basic Info
    title: v.optional(v.string()),
    provider: v.optional(v.string()),
    hostInstitution: v.optional(v.string()),
    slug: v.optional(v.string()),
    // Location & Terms
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    terms: v.optional(v.array(v.string())),
    duration: v.optional(v.string()),
    // Eligibility
    educationLevels: v.optional(v.array(v.string())),
    eligibleNationalities: v.optional(v.array(v.string())),
    ageRequirement: v.optional(v.string()),
    // Program Details
    description: v.optional(v.string()),
    whatsIncluded: v.optional(v.array(v.string())),
    subjectAreas: v.optional(v.array(v.string())),
    highlights: v.optional(v.array(v.string())),
    // Pricing & Contact
    cost: v.optional(v.string()),
    applicationDeadline: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    applyUrl: v.optional(v.string()),
    // Additional Quick Details
    housingType: v.optional(v.string()),
    languageOfInstruction: v.optional(v.string()),
    creditsAvailable: v.optional(v.string()),
    // Media
    providerLogo: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    // Status
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

export const deleteProgram = mutation({
  args: { id: v.id("programs") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

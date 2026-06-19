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
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("programs", {
      title: args.title,
      provider: args.provider,
      hostInstitution: args.hostInstitution,
      slug: args.slug ?? generateSlug(args.title),
      createdBy: args.createdBy,
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
    // Expanded Pricing
    startingPrice: v.optional(v.number()),
    isFree: v.optional(v.boolean()),
    costVariations: v.optional(v.array(v.object({ label: v.string(), price: v.number() }))),
    paymentTerms: v.optional(v.array(v.string())),
    refundPolicy: v.optional(v.string()),
    refundPolicyUrl: v.optional(v.string()),
    depositFee: v.optional(v.number()),
    // Listing Details
    exclusions: v.optional(v.array(v.string())),
    optionalInclusions: v.optional(v.array(v.string())),
    programTags: v.optional(v.array(v.string())),
    yearFounded: v.optional(v.number()),
    // AI Review Summary
    aiSummary: v.optional(
      v.object({
        text: v.string(),
        generatedAt: v.number(),
        reviewCount: v.number(),
      })
    ),
    // Cached topic tags
    topicTags: v.optional(
      v.array(v.object({ label: v.string(), count: v.number() }))
    ),
  },
  handler: async (ctx, { id, ...fields }) => {
    // Remove undefined values before patching
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
    return id;
  },
});

export const deleteProgram = mutation({
  args: { id: v.id("programs") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ─── One-time Admin Utilities ─────────────────────────────────────────────────

export const trimHighlights = mutation({
  args: {},
  handler: async (ctx) => {
    const programs = await ctx.db.query("programs").collect();
    let updated = 0;

    for (const program of programs) {
      if (program.highlights && program.highlights.length > 5) {
        await ctx.db.patch(program._id, {
          highlights: program.highlights.slice(0, 5),
        });
        updated++;
      }
    }

    return { updated, total: programs.length };
  },
});

// ─── AI Summary ────────────────────────────────────────────────────────────

export const setAiSummary = mutation({
  args: {
    programId: v.id("programs"),
    text: v.string(),
  },
  handler: async (ctx, { programId, text }) => {
    const publishedReviews = await ctx.db
      .query("reviews")
      .withIndex("by_program_status", (q) =>
        q.eq("programId", programId).eq("status", "published")
      )
      .collect();

    const now = Date.now();
    await ctx.db.patch(programId, {
      aiSummary: {
        text,
        generatedAt: now,
        reviewCount: publishedReviews.length,
      },
      updatedAt: now,
    });
    return programId;
  },
});

// One-time: seed hand-written AI summaries onto demo programs.
// Tailored text for the Barcelona demo program; a themes-based generic
// paragraph for any other published program that has >= 3 published reviews.
export const seedAiSummaries = mutation({
  args: {},
  handler: async (ctx) => {
    const BARCELONA =
      "Students consistently highlight the immersive language environment and welcoming host families, with cultural immersion and community rated highest. Most found the program administration responsive and the academics well-structured, though a few noted the living situation varies by neighborhood and the early pace can feel intense. The recurring theme across reviews is strong personal growth and lasting friendships, with many recommending a full semester for the richest experience.";

    const GENERIC =
      "Across reviews, past participants most often praise the supportive staff and the cultural immersion, with day-to-day support and community rated highly. Several mention the living situation and onboarding pace as the main things to plan for. The common thread is meaningful personal growth, and most reviewers say they'd recommend the program to a friend.";

    const programs = await ctx.db
      .query("programs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const now = Date.now();
    let updated = 0;
    for (const program of programs) {
      const reviews = await ctx.db
        .query("reviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", program._id).eq("status", "published")
        )
        .collect();

      const isBarcelona = /barcelona/i.test(program.title);
      if (!isBarcelona && reviews.length < 3) continue;

      await ctx.db.patch(program._id, {
        aiSummary: {
          text: isBarcelona ? BARCELONA : GENERIC,
          generatedAt: now,
          reviewCount: reviews.length,
        },
        updatedAt: now,
      });
      updated++;
    }
    return { updated, total: programs.length };
  },
});

// One-time: seed a dedicated rich demo program for the v6 "many fields"
// Program Details prototype. Idempotent — upserts by slug "global-internship-demo".
// Run with: npx convex run programs:seedRichDemo
export const seedRichDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "global-internship-demo";
    const now = Date.now();

    const data = {
      title: "Global Internship Experience",
      provider: "Global Internship Programs",
      slug,
      status: "published" as const,
      city: "Gold Coast",
      country: "Australia",
      terms: [
        "Year Round",
        "Summer",
        "Winter",
        "Short Term",
        "Spring",
        "Fall",
        "1-3 Months",
        "3-6 Months",
        "1 Year",
      ],
      duration: "1-12 months",
      educationLevels: [
        "High school graduate",
        "Some college, no degree",
        "Associate degree",
        "Currently enrolled undergraduate",
        "Bachelor's degree",
        "Recent graduate",
        "Graduate student",
        "Working professional",
      ],
      eligibleNationalities: [
        "American",
        "Canadian",
        "British",
        "Australian",
        "Irish",
        "New Zealander",
        "South African",
        "German",
        "French",
        "Singaporean",
      ],
      ageRequirement: "18-30",
      description:
        "Launch your career abroad with a fully supported international internship placement tailored to your field of study. Work alongside professionals at a host company, build a global network, and develop skills that set you apart.\n\nEvery placement is backed by in-country staff who handle logistics, housing, and day-to-day support so you can focus on the experience. Cultural excursions, workshops, and community events round out your time abroad.\n\nWhether you have a few weeks or a full year, flexible terms and a wide range of fields make it easy to find a placement that fits your goals.",
      whatsIncluded: [
        "Tuition & Fees",
        "Accommodation / Housing for Program Duration",
        "All Program Activity Costs",
        "Medical / Accident Insurance",
        "Airport Pickup",
        "Orientation Program",
        "24/7 In-Country Support",
        "Welcome & Farewell Events",
        "Local Transportation Pass",
        "Cultural Excursions",
      ],
      subjectAreas: [
        "Accounting",
        "African Studies",
        "Agriculture",
        "Anthropology",
        "Architecture",
        "Art History",
        "Biology",
        "Business Administration",
        "Chemistry",
        "Communications",
        "Computer Science",
        "Economics",
        "Education",
        "Engineering",
        "Environmental Science",
        "Finance",
        "Graphic Design",
        "History",
        "International Relations",
        "Journalism",
        "Law",
        "Marketing",
        "Mathematics",
        "Nursing",
        "Political Science",
        "Psychology",
        "Public Health",
        "Sociology",
      ],
      highlights: [
        "Hands-on placement with a host company",
        "Mentorship from industry professionals",
        "Cultural immersion and guided excursions",
        "Career development workshops",
      ],
      cost: "$4,500",
      applicationDeadline: "August 15, 2026",
      housingType: "Apartment/Flat",
      languageOfInstruction: "English",
      creditsAvailable: "Up to 12 credits",
      photos: [],
      updatedAt: now,
    };

    const existing = await ctx.db
      .query("programs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return { action: "updated", id: existing._id, slug };
    }
    const id = await ctx.db.insert("programs", data);
    return { action: "created", id, slug };
  },
});

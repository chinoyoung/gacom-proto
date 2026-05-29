import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  programs: defineTable({
    // Basic Info
    title: v.string(),
    provider: v.string(),
    slug: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),

    // Location & Terms
    city: v.string(),
    country: v.string(),
    terms: v.array(v.string()), // ["fall", "spring", "summer", "academic_year"]
    duration: v.optional(v.string()),

    // Eligibility
    educationLevels: v.array(v.string()), // ["freshman","sophomore","junior","senior","graduate"]
    eligibleNationalities: v.array(v.string()),
    ageRequirement: v.optional(v.string()),

    // Program Details
    description: v.string(),
    whatsIncluded: v.array(v.string()),
    subjectAreas: v.array(v.string()),

    // Features & Activities
    highlights: v.array(v.string()),

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
    hostInstitution: v.optional(v.string()),

    // Media (URL strings for prototype)
    providerLogo: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    photos: v.array(v.string()),

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

    // Timestamps
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_country", ["country"])
    .index("by_slug", ["slug"]),

  articles: defineTable({
    title: v.string(),
    author: v.string(),
    publishDate: v.string(), // ISO string or relative for now
    tags: v.array(v.string()),
    coverImage: v.optional(v.string()),
    slug: v.string(),
    createdBy: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  reviews: defineTable({
    programId: v.id("programs"),
    reviewerName: v.string(),
    reviewerCountry: v.string(),
    date: v.string(), // e.g. "February 04, 2025"
    reviewTitle: v.string(),
    body: v.string(),
    overallRating: v.number(), // 1–5
    // Category ratings (each 1–5)
    academicsRating: v.number(),
    livingSituationRating: v.number(),
    culturalImmersionRating: v.number(),
    programAdministrationRating: v.number(),
    healthAndSafetyRating: v.number(),
    communityRating: v.number(),
    photo: v.optional(v.string()), // reviewer/experience photo URL
    status: v.union(v.literal("draft"), v.literal("published")),
    createdBy: v.optional(v.string()),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
  })
    .index("by_program", ["programId"])
    .index("by_status", ["status"])
    .index("by_program_status", ["programId", "status"]),

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
});

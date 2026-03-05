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

    // Timestamps
    updatedAt: v.optional(v.number()),
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
  }).index("by_slug", ["slug"]),

  reviews: defineTable({
    programId: v.id("programs"),
    reviewerName: v.string(),
    reviewerCountry: v.string(),
    date: v.string(), // e.g. "February 04, 2025"
    reviewTitle: v.string(),
    body: v.string(),
    overallRating: v.number(), // 1–10
    // Category ratings (each 1–10)
    academicsRating: v.number(),
    livingSituationRating: v.number(),
    culturalImmersionRating: v.number(),
    programAdministrationRating: v.number(),
    healthAndSafetyRating: v.number(),
    communityRating: v.number(),
    photo: v.optional(v.string()), // reviewer/experience photo URL
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_program", ["programId"])
    .index("by_status", ["status"])
    .index("by_program_status", ["programId", "status"]),
});

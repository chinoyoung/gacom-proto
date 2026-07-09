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
      createdBy: "AI Anthropic",
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

// One-time: seed 6 additional published demo programs covering a variety
// of program types (teaching, conservation, culinary, internship, language).
// Idempotent — skips any program whose slug already exists.
// Run with: npx convex run programs:seedMorePrograms
export const seedMorePrograms = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const demoPrograms = [
      {
        slug: "teach-english-in-vietnam",
        title: "Teach English in Vietnam",
        provider: "Bridge Education Group",
        city: "Hanoi",
        country: "Vietnam",
        terms: ["Summer", "Fall", "Spring", "Year Round"],
        duration: "1-6 months",
        educationLevels: [
          "Bachelor's degree",
          "Recent graduate",
          "Working professional",
        ],
        eligibleNationalities: ["American", "Canadian", "British", "Australian", "Irish"],
        description:
          "Get TEFL-certified and step into a classroom in Hanoi, teaching English to eager students of all ages. You'll receive hands-on training, a supportive local staff team, and a placement matched to your experience level. Beyond the classroom, explore Vietnam's street food, karst landscapes, and vibrant city life.",
        whatsIncluded: [
          "TEFL Certification Course",
          "Teaching Placement",
          "Airport Pickup",
          "Orientation Program",
          "Housing Assistance",
          "24/7 In-Country Support",
          "Vietnamese Language Basics",
        ],
        subjectAreas: ["Education", "TESOL", "Linguistics"],
        highlights: [
          "TEFL certification included",
          "Guaranteed teaching placement",
          "Weekend trips to Ha Long Bay and Sapa",
          "Ongoing mentorship from local staff",
          "Vibrant expat and local teacher community",
        ],
        cost: "$1,800",
        applicationDeadline: "Rolling admissions",
        housingType: "Homestay or Shared Apartment",
        languageOfInstruction: "English",
        creditsAvailable: undefined,
        hostInstitution: "Bridge Education Group Vietnam",
        programTags: ["Teaching", "TEFL", "Southeast Asia"],
      },
      {
        slug: "marine-conservation-costa-rica",
        title: "Marine Conservation Expedition in Costa Rica",
        provider: "EcoVolunteer Network",
        city: "Puerto Viejo",
        country: "Costa Rica",
        terms: ["Summer", "Fall", "Spring", "Winter"],
        duration: "2-8 weeks",
        educationLevels: [
          "Currently enrolled undergraduate",
          "Bachelor's degree",
          "Graduate student",
        ],
        eligibleNationalities: ["American", "Canadian", "British", "German", "Dutch"],
        description:
          "Join a hands-on sea turtle and coral reef conservation project on Costa Rica's Caribbean coast. Work alongside marine biologists on nesting surveys, reef health monitoring, and community education initiatives. Evenings and weekends leave plenty of time to explore rainforest trails and laid-back beach towns.",
        whatsIncluded: [
          "Field Research Training",
          "Accommodation / Housing for Program Duration",
          "All Meals",
          "Snorkeling Equipment",
          "Airport Pickup",
          "24/7 In-Country Support",
          "Certificate of Completion",
        ],
        subjectAreas: ["Marine Biology", "Environmental Science"],
        highlights: [
          "Hands-on sea turtle nesting surveys",
          "Coral reef health monitoring dives",
          "Small cohort with dedicated field scientists",
          "Beachfront volunteer housing",
        ],
        cost: "$2,400",
        applicationDeadline: "6 weeks before start date",
        housingType: "Shared Volunteer House",
        languageOfInstruction: "English",
        creditsAvailable: "Up to 4 credits",
        hostInstitution: "EcoVolunteer Network Costa Rica",
        programTags: ["Conservation", "Marine Biology", "Volunteer"],
      },
      {
        slug: "culinary-arts-immersion-florence",
        title: "Culinary Arts Immersion in Florence",
        provider: "Tuscan Culinary Institute",
        city: "Florence",
        country: "Italy",
        terms: ["Fall", "Spring", "Summer"],
        duration: "4-12 weeks",
        educationLevels: [
          "High school graduate",
          "Currently enrolled undergraduate",
          "Bachelor's degree",
          "Working professional",
        ],
        eligibleNationalities: ["American", "Canadian", "British", "Australian", "New Zealander"],
        description:
          "Train in a professional Tuscan kitchen while living in the heart of Florence. Daily hands-on classes cover pasta-making, regional sauces, pastry, and wine pairing, taught by working Italian chefs. Weekly market visits and day trips to Tuscan farms connect every dish back to its ingredients.",
        whatsIncluded: [
          "Daily Hands-On Cooking Classes",
          "Accommodation / Housing for Program Duration",
          "Market and Vineyard Excursions",
          "Chef's Uniform and Tools",
          "Orientation Program",
          "Certificate of Completion",
        ],
        subjectAreas: ["Culinary Arts", "Hospitality"],
        highlights: [
          "Small class sizes with professional chefs",
          "Weekly Tuscan market and vineyard trips",
          "Historic city-center kitchen classroom",
          "Wine pairing and tasting workshops",
          "Final showcase dinner for family and friends",
        ],
        cost: "$5,200",
        applicationDeadline: "8 weeks before start date",
        housingType: "Shared Apartment",
        languageOfInstruction: "English & Italian",
        creditsAvailable: "Up to 6 credits",
        hostInstitution: "Tuscan Culinary Institute",
        programTags: ["Culinary", "Hospitality", "Europe"],
      },
      {
        slug: "wildlife-conservation-south-africa",
        title: "Wildlife Conservation in South Africa",
        provider: "Savanna Field School",
        city: "Cape Town",
        country: "South Africa",
        terms: ["Summer", "Winter", "Year Round"],
        duration: "2-10 weeks",
        educationLevels: [
          "Currently enrolled undergraduate",
          "Bachelor's degree",
          "Graduate student",
          "Working professional",
        ],
        eligibleNationalities: ["American", "Canadian", "British", "German", "South African"],
        description:
          "Work alongside wildlife researchers on big-game monitoring, habitat restoration, and anti-poaching survey work across reserves near Cape Town. Days combine game drives and fieldwork with lectures on African ecology and conservation policy. No prior field experience is required.",
        whatsIncluded: [
          "Field Research Training",
          "Accommodation / Housing for Program Duration",
          "All Meals",
          "Game Drive Vehicle Access",
          "Airport Pickup",
          "24/7 In-Country Support",
        ],
        subjectAreas: ["Zoology", "Environmental Science", "Conservation"],
        highlights: [
          "Daily game drives with wildlife researchers",
          "Hands-on habitat restoration projects",
          "Anti-poaching survey field experience",
          "Lectures on African conservation policy",
        ],
        cost: "$3,100",
        applicationDeadline: "6 weeks before start date",
        housingType: "Field Camp / Lodge",
        languageOfInstruction: "English",
        creditsAvailable: "Up to 5 credits",
        hostInstitution: "Savanna Field School",
        programTags: ["Conservation", "Wildlife", "Africa"],
      },
      {
        slug: "software-engineering-internship-berlin",
        title: "Software Engineering Internship in Berlin",
        provider: "EuroTech Interns",
        city: "Berlin",
        country: "Germany",
        terms: ["Summer", "Fall", "Spring", "Year Round"],
        duration: "8-24 weeks",
        educationLevels: [
          "Currently enrolled undergraduate",
          "Bachelor's degree",
          "Recent graduate",
          "Graduate student",
        ],
        eligibleNationalities: ["American", "Canadian", "British", "Irish", "Indian"],
        description:
          "Land a placement at a Berlin tech startup or scale-up and build real production features alongside experienced engineers. EuroTech Interns handles visa paperwork, housing, and matches you to a role based on your stack and interests. Weekly meetups connect you with other international interns across the city.",
        whatsIncluded: [
          "Internship Placement Matching",
          "Visa Sponsorship Support",
          "Accommodation Assistance",
          "Orientation Program",
          "Weekly Intern Meetups",
          "24/7 In-Country Support",
        ],
        subjectAreas: ["Computer Science", "Engineering"],
        highlights: [
          "Real production work at startups and scale-ups",
          "Visa and relocation support included",
          "Weekly meetups with international intern network",
          "Mentorship from senior engineers",
          "Access to Berlin's startup and tech events",
        ],
        cost: "$1,200",
        applicationDeadline: "Rolling admissions",
        housingType: "Shared Apartment",
        languageOfInstruction: "English",
        creditsAvailable: "Up to 12 credits",
        hostInstitution: "EuroTech Interns",
        programTags: ["Internship", "Technology", "Europe"],
      },
      {
        slug: "japanese-language-culture-tokyo",
        title: "Japanese Language & Culture in Tokyo",
        provider: "Nihongo Institute",
        city: "Tokyo",
        country: "Japan",
        terms: ["Fall", "Spring", "Summer", "1 Year"],
        duration: "8 weeks - 1 year",
        educationLevels: [
          "High school graduate",
          "Currently enrolled undergraduate",
          "Bachelor's degree",
          "Working professional",
        ],
        eligibleNationalities: ["American", "Canadian", "British", "Australian", "Singaporean"],
        description:
          "Intensive Japanese language instruction paired with weekly cultural workshops in calligraphy, tea ceremony, and cooking. Small class sizes and placement testing ensure you're grouped with students at your level, from complete beginners to advanced speakers. Homestay placements offer daily immersion beyond the classroom.",
        whatsIncluded: [
          "Intensive Language Coursework",
          "Placement Testing",
          "Weekly Cultural Workshops",
          "Homestay Accommodation",
          "Orientation Program",
          "Airport Pickup",
          "Certificate of Completion",
        ],
        subjectAreas: ["Japanese", "Asian Studies"],
        highlights: [
          "Small classes grouped by proficiency level",
          "Weekly tea ceremony and calligraphy workshops",
          "Homestay immersion with a local family",
          "Optional university credit transfer",
        ],
        cost: "$4,000",
        applicationDeadline: "10 weeks before start date",
        housingType: "Homestay",
        languageOfInstruction: "Japanese & English",
        creditsAvailable: "Up to 8 credits",
        hostInstitution: "Nihongo Institute",
        programTags: ["Language", "Culture", "Asia"],
      },
    ];

    let inserted = 0;
    for (const { slug, ...rest } of demoPrograms) {
      const existing = await ctx.db
        .query("programs")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (existing) continue;

      await ctx.db.insert("programs", {
        ...rest,
        slug,
        status: "published",
        createdBy: "AI Anthropic",
        coverImage: `https://picsum.photos/seed/${slug}/800/400`,
        photos: [],
        updatedAt: now,
      });
      inserted++;
    }

    return { inserted, total: demoPrograms.length };
  },
});

// One-time: label seeded/generated programs (those with no author) as AI-created.
// Run with: npx convex run programs:backfillGeneratedAuthor
export const backfillGeneratedAuthor = mutation({
  args: {},
  handler: async (ctx) => {
    const programs = await ctx.db.query("programs").collect();
    let updated = 0;
    for (const p of programs) {
      if (!p.createdBy) {
        await ctx.db.patch(p._id, { createdBy: "AI Anthropic" });
        updated++;
      }
    }
    return { updated };
  },
});

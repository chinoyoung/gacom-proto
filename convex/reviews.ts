import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
    createdBy: v.optional(v.string()),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    helpfulCount: v.optional(v.number()),
    highlight: v.optional(v.string()),
    advice: v.optional(v.string()),
    identityTags: v.optional(v.array(v.string())),
    media: v.optional(v.array(v.string())),
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
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    helpfulCount: v.optional(v.number()),
    highlight: v.optional(v.string()),
    advice: v.optional(v.string()),
    identityTags: v.optional(v.array(v.string())),
    media: v.optional(v.array(v.string())),
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

// ─── New: Helpful votes & stats ──────────────────────────────────────────────

// Note: no dedup — relies on UI to prevent double votes
export const markHelpful = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, { reviewId }) => {
    const review = await ctx.db.get(reviewId);
    if (!review) throw new Error("Review not found");
    await ctx.db.patch(reviewId, {
      helpfulCount: (review.helpfulCount ?? 0) + 1,
    });
  },
});

// ─── Bulk Seeding ────────────────────────────────────────────────────────────

export const seedMockReviews = mutation({
  args: {
    programId: v.id("programs"),
  },
  handler: async (ctx, { programId }) => {
    // Static mock data pools (mirrors AIGenerateButton's "review" case)
    const names = [
      "Sophia Williams", "Marcus Chen", "Aisha Patel", "James Okafor",
      "Elena Russo", "Priya Sharma", "Lena Müller", "Tomás Rivera",
      "Amara Diallo", "Yuki Tanaka", "Fatima Al-Hassan", "Carlos Mendez",
      "Zoe Bergström", "David Osei", "Mei-Lin Wu",
    ];
    const countries = [
      "United States", "Canada", "United Kingdom", "Australia", "Germany",
      "India", "Brazil", "Mexico", "France", "Japan", "Sweden", "Ghana", "Taiwan",
    ];
    const destinations = ["Thailand", "Spain", "Japan", "Italy", "South Korea", "France", "Argentina"];
    const highlights = [
      "The language learning curve was steep but incredibly rewarding — I gained more fluency in two months than in two years of classes.",
      "The host family experience was the highlight; they treated me like one of their own from day one.",
      "Weekend excursions organized by the program were genuinely world-class — unforgettable memories.",
      "The academic rigor surprised me in the best way; professors were deeply invested in every student's growth.",
      "The friendships I built with fellow students from across the globe have lasted long beyond the program.",
      "Every challenge — from navigating public transit to ordering food — became a confidence-building moment.",
      "The local food scene was a revelation — I came back knowing how to cook three new dishes.",
      "The staff support throughout the program was exceptional — every concern was resolved within 24 hours.",
    ];
    const advices = [
      "Bring an open mind and be ready to step outside your comfort zone every single day — that's where the growth happens.",
      "Lean into the language learning process even when it feels slow; locals genuinely appreciate every small effort.",
      "Don't over-schedule yourself — leave room for spontaneous exploration and unexpected friendships.",
      "Connect with your host family or local roommates early; they'll show you the city tourists never see.",
      "Budget for unexpected experiences — the best memories often cost a little extra but are worth every penny.",
      "Take the optional excursions even when you're tired; you'll regret skipping them far more than attending.",
      "Pack light — you'll accumulate far more than you arrive with, and markets abroad are wonderful.",
      "Reach out to the staff support team early if anything feels off — they are genuinely there to help.",
    ];
    const allIdentityTagSets: string[][] = [
      [],
      ["Solo traveler"],
      ["First-timer"],
      ["Solo traveler", "First-timer"],
      ["BIPOC"],
      ["Women solo"],
      ["BIPOC", "First-timer"],
      ["Women solo", "Solo traveler"],
      [],
      ["First-timer"],
      [],
      ["BIPOC", "Women solo"],
      [],
    ];
    const photoSeeds = [
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=600",
    ];
    // Rating distribution: mostly 4–5 with a couple of 2–3 outliers
    // Indices 0-1 get low ratings; rest get 4–5
    const overallRatings = [2, 3, 4, 4, 4, 5, 5, 5, 4, 5, 4, 5, 4, 5, 4];
    // helpfulCount: mostly 0–10, two standouts at 18 and 23
    const helpfulCounts = [0, 1, 0, 3, 5, 2, 23, 0, 4, 18, 1, 0, 7, 2, 0];

    const bodies = [
      "I'll be honest — the program administration let me down in the first week. Orientation was disorganised and my housing assignment was a last-minute change. The academics and the city itself eventually won me over, but the rocky start dampened the experience.",
      "The living situation was not what was advertised. My apartment had maintenance issues that took two weeks to resolve. The cultural programming was great, but the logistical shortcomings are hard to ignore when writing this review.",
      "A genuinely transformative semester. The coursework was intellectually demanding and the professors were outstanding. The staff support was also excellent — any concern I raised was addressed the same day. I came back with a broader perspective and lasting friendships — I'd recommend this program without hesitation.",
      "The program exceeded every expectation. The cultural immersion opportunities felt organic rather than forced, and the community of students was warm and diverse. The language learning component was woven into everyday life in ways that actually stuck. I grew more in four months than in any single year of college.",
      "I was nervous about going abroad alone, but the cohort made it feel like family within the first week. The excursions were thoughtfully planned and the academic support was always available. Truly a highlight of my undergraduate years.",
      "Outstanding in every dimension. The language learning opportunities, the housing, the academic partnerships — all executed at a high level. I returned home with career clarity I didn't expect to gain from a study abroad program.",
      "One of the most well-run programs I've heard of. Every logistical detail was handled seamlessly, which freed me to focus entirely on learning and exploring. The staff support was proactive and warm — they genuinely cared about each student's experience.",
      "The cultural immersion component was the best part. Living with a host family gave me an insider view of daily life that no classroom could replicate. The academics were solid too — rigorous and directly relevant to my major.",
      "Solid overall, though the housing placement lottery felt a bit arbitrary. Students in homestays had a richer community experience than those in apartments. That said, the program's excursions and academic quality more than compensated.",
      "Absolutely incredible. The combination of excellent instruction, rich cultural immersion programming, and attentive staff support made every week feel meaningful. I've recommended this program to five friends and would go back myself if I could.",
      "A good program that delivers on its core promise. Some of the elective modules could be updated, but the language learning resources and cultural activities were first-rate. The staff were responsive and clearly experienced.",
      "This program changed the way I see the world. The immersive language environment, the welcoming host family, and the thoughtfully curated excursions — everything worked together to create something truly special.",
      "Very well organised and genuinely enriching. The academic schedule left enough time for independent exploration, which I valued greatly. A few administrative hiccups along the way, but nothing that overshadowed the overall quality.",
      "The best decision I made during my undergraduate years. I arrived uncertain and left with confidence, deep friendships, and a much clearer sense of who I am. The staff support throughout was consistently excellent, and the program's community-building approach really works.",
      "Exceptional program with a supportive staff and a vibrant student community. The cultural activities felt authentic rather than touristy, and the academic workload was challenging in all the right ways.",
    ];

    // Spread dates across ~18 months for variety
    const baseDates = [
      "March 15, 2025", "April 02, 2025", "May 10, 2025", "June 22, 2025",
      "July 08, 2025", "August 14, 2025", "September 03, 2025", "October 19, 2025",
      "November 05, 2025", "December 01, 2025", "January 12, 2026", "February 28, 2026",
      "March 07, 2026", "April 17, 2026", "May 02, 2026",
    ];

    // Delete any previously seeded mock reviews for this program before inserting
    const existingMockReviews = await ctx.db
      .query("reviews")
      .withIndex("by_program", (q) => q.eq("programId", programId))
      .collect();
    for (const r of existingMockReviews) {
      if (r.createdBy === "mock-seed") {
        await ctx.db.delete(r._id);
      }
    }

    const count = 15; // seed exactly 15 reviews
    const seededIds: Id<"reviews">[] = [];

    for (let i = 0; i < count; i++) {
      const dest = destinations[i % destinations.length];
      const overall = overallRatings[i];
      // Category ratings: each category gets its own variation offset so they differ per-category
      const clamp = (n: number) => Math.min(5, Math.max(1, n));
      // Category offsets: [0]=academics, [1]=living, [2]=cultural, [3]=admin, [4]=health, [5]=community
      const categoryOffsets = [1, -1, 0, -1, 1, 0];
      const catRating = (catIdx: number) =>
        clamp(overall + categoryOffsets[(i + catIdx) % categoryOffsets.length]);

      const mediaCount = i % 5 === 0 ? 2 : i % 7 === 0 ? 3 : i % 4 === 0 ? 1 : 0;

      const id = await ctx.db.insert("reviews", {
        programId,
        reviewerName: names[i % names.length],
        reviewerCountry: countries[i % countries.length],
        date: baseDates[i],
        reviewTitle:
          overall <= 3
            ? `Decent program, but some rough edges — ${dest}`
            : `An unforgettable experience in ${dest}`,
        body: bodies[i],
        overallRating: overall,
        academicsRating: catRating(0),
        livingSituationRating: catRating(1),
        culturalImmersionRating: catRating(2),
        programAdministrationRating: catRating(3),
        healthAndSafetyRating: catRating(4),
        communityRating: catRating(5),
        status: "published",
        createdBy: "mock-seed",
        helpfulCount: helpfulCounts[i],
        highlight: overall >= 4 ? highlights[i % highlights.length] : undefined,
        advice: advices[i % advices.length],
        identityTags: allIdentityTagSets[i % allIdentityTagSets.length],
        media: photoSeeds.slice(0, mediaCount),
      });
      seededIds.push(id);
    }

    // Set aiSummary and topicTags on the program
    const now = Date.now();
    await ctx.db.patch(programId, {
      aiSummary: {
        text: "Across reviews, past participants most often praise the cultural immersion and the quality of on-the-ground support from program staff. Academics draw strong marks for structure and faculty engagement, while a handful of reviewers note the pace of the first week can feel intense for first-timers. The living situation receives generally positive scores — students in homestays rate community highest, while those in apartments valued the independence. A small number of reviews flag logistical hiccups early in the program that were resolved within days. The recurring theme is genuine personal growth: most participants say they returned home with broader perspectives, lasting friendships, and a stronger sense of self.",
        generatedAt: now,
        reviewCount: count,
      },
      topicTags: [
        { label: "Cultural Immersion", count: 12 },
        { label: "Academics", count: 10 },
        { label: "Staff Support", count: 9 },
        { label: "Housing", count: 8 },
        { label: "Language Learning", count: 8 },
        { label: "Community", count: 7 },
        { label: "Food", count: 6 },
        { label: "Excursions", count: 5 },
      ],
      updatedAt: now,
    });

    return { seeded: seededIds.length, programId };
  },
});

export const getReviewStats = query({
  args: { programId: v.id("programs") },
  handler: async (ctx, { programId }) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_program_status", (q) =>
        q.eq("programId", programId).eq("status", "published")
      )
      .collect();

    const total = reviews.length;

    if (total === 0) {
      return {
        total: 0,
        avg: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        categoryAverages: {
          academicsRating: null,
          livingSituationRating: null,
          culturalImmersionRating: null,
          programAdministrationRating: null,
          healthAndSafetyRating: null,
          communityRating: null,
        },
      };
    }

    // Overall average — same rounding as page.tsx (2 decimal places)
    const avg =
      Math.round(
        (reviews.reduce((sum, r) => sum + r.overallRating, 0) / total) * 100
      ) / 100;

    // Star distribution bucketed by Math.round clamped to 1–5
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    for (const r of reviews) {
      const bucket = Math.min(5, Math.max(1, Math.round(r.overallRating))) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      distribution[bucket]++;
    }

    // Category averages — only average reviews that have the field present
    const categoryFields = [
      "academicsRating",
      "livingSituationRating",
      "culturalImmersionRating",
      "programAdministrationRating",
      "healthAndSafetyRating",
      "communityRating",
    ] as const;

    type CategoryField = (typeof categoryFields)[number];

    const categoryAverages = Object.fromEntries(
      categoryFields.map((field) => {
        const values = reviews
          .map((r) => r[field])
          .filter((val): val is number => typeof val === "number");
        const avg =
          values.length > 0
            ? Math.round(
                (values.reduce((sum, val) => sum + val, 0) / values.length) *
                  100
              ) / 100
            : null;
        return [field, avg];
      })
    ) as Record<CategoryField, number | null>;

    return { total, avg, distribution, categoryAverages };
  },
});

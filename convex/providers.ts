import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateSlug } from "./programs";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listProviders = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return await ctx.db
        .query("providers")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("providers").order("desc").collect();
  },
});

export const getProviderBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("providers")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const listProgramsByProvider = query({
  args: {
    providerName: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { providerName, status }) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_provider", (q) => q.eq("provider", providerName))
      .collect();
    if (status) return programs.filter((p) => p.status === status);
    return programs;
  },
});

// Returns published reviews across all of a provider's programs, each annotated
// with the program title/slug it belongs to (reviews span multiple programs here).
export const listReviewsByProvider = query({
  args: { providerName: v.string() },
  handler: async (ctx, { providerName }) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_provider", (q) => q.eq("provider", providerName))
      .collect();

    const out = [];
    for (const program of programs) {
      const reviews = await ctx.db
        .query("reviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", program._id).eq("status", "published")
        )
        .collect();
      for (const r of reviews) {
        out.push({ ...r, programTitle: program.title, programSlug: program.slug });
      }
    }
    return out;
  },
});

// ─── One-time seed ─────────────────────────────────────────────────────────────

type SeedNarrative = {
  tagline: string;
  about: string;
  whyChoosePoints: string[];
  headquarters: string;
  yearFounded: number;
};

const NARRATIVES: Record<string, SeedNarrative> = {
  "WorldBridge Study Abroad": {
    tagline: "Immersive semesters and faculty-led programs across Europe and beyond.",
    about:
      "WorldBridge Study Abroad partners with leading universities to deliver immersive, academically rigorous semesters abroad. For over a decade we've helped students combine credit-bearing coursework with deep cultural immersion, supported end to end by on-the-ground staff.",
    whyChoosePoints: [
      "University-partnered, credit-transferable coursework",
      "On-site support staff in every host city",
      "Curated homestays and cultural excursions",
      "Dedicated pre-departure and re-entry advising",
    ],
    headquarters: "Boston, USA",
    yearFounded: 2014,
  },
  Expanish: {
    tagline: "Spanish-language immersion and internships in Latin America and Spain.",
    about:
      "Expanish specializes in Spanish-language immersion, study, and internship programs. With small class sizes and partner employers across the region, students build real-world fluency and professional experience in the heart of Spanish-speaking cities.",
    whyChoosePoints: [
      "Accredited Spanish-language instruction",
      "Vetted internship placements",
      "Small cohorts for faster fluency",
      "Housing and arrival support included",
    ],
    headquarters: "Buenos Aires, Argentina",
    yearFounded: 2009,
  },
  "GoAbroad Education Partners": {
    tagline: "Flexible global immersion semesters for the curious traveler.",
    about:
      "GoAbroad Education Partners designs flexible immersion semesters that blend academics, community engagement, and travel. Programs are built to be accessible and customizable, with a focus on meaningful, responsible travel.",
    whyChoosePoints: [
      "Flexible, customizable itineraries",
      "Community-engaged learning",
      "Transparent, all-inclusive pricing",
      "Global alumni network",
    ],
    headquarters: "Denver, USA",
    yearFounded: 2016,
  },
};

const DEFAULT_NARRATIVE: SeedNarrative = {
  tagline: "Meaningful study abroad programs for every kind of traveler.",
  about:
    "This provider offers a range of study abroad programs focused on academic quality, cultural immersion, and student support from application through return.",
  whyChoosePoints: [
    "Academically rigorous, credit-bearing programs",
    "Dedicated student support",
    "Strong cultural immersion focus",
    "Trusted by students worldwide",
  ],
  headquarters: "—",
  yearFounded: 2015,
};

const SAMPLE_AWARDS = [
  { name: "Top Rated Provider", result: "Notable Mention", year: "2025" },
  { name: "Innovative Student Video", result: "Winner", year: "2025" },
  { name: "Innovation in Sustainability", result: "Winner", year: "2024" },
  { name: "ISEP Accredited Provider", result: "Accredited", year: "Since 2018" },
  { name: "NAFSA", result: "Member", year: "Since 2016" },
  { name: "The Forum on Education Abroad", result: "Member" },
];

const SAMPLE_SOCIAL = [
  { platform: "Instagram", url: "https://instagram.com" },
  { platform: "Facebook", url: "https://facebook.com" },
  { platform: "LinkedIn", url: "https://linkedin.com" },
  { platform: "YouTube", url: "https://youtube.com" },
];

function providerFaqs(name: string) {
  return [
    {
      question: `Why should I choose a ${name} program over another provider?`,
      answer: `${name} combines academically rigorous, credit-bearing coursework with strong on-site support and cultural immersion — backed by years of experience and thousands of past participants.`,
    },
    {
      question: `Where does ${name} operate programs?`,
      answer: `${name} runs programs across multiple destinations. Browse the programs grid above to see current offerings and locations.`,
    },
    {
      question: "When do I have to apply by?",
      answer:
        "Application deadlines vary by program and term. Each program page lists its specific deadline — check the program you're interested in for exact dates.",
    },
    {
      question: "Is financial aid or scholarships available?",
      answer:
        "Many programs are eligible for financial aid and provider scholarships. Reach out through the inquiry form below and the team will share options for your situation.",
    },
  ];
}

export const seedProviders = mutation({
  args: {},
  handler: async (ctx) => {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const names = Array.from(new Set(programs.map((p) => p.provider))).filter(
      Boolean
    );

    let created = 0;
    for (const name of names) {
      const slug = generateSlug(name);
      const existing = await ctx.db
        .query("providers")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (existing) continue;

      const theirPrograms = programs.filter((p) => p.provider === name);
      const logo = theirPrograms.find((p) => p.providerLogo)?.providerLogo;
      const website = theirPrograms.find((p) => p.applyUrl)?.applyUrl;
      const photos = Array.from(
        new Set(theirPrograms.flatMap((p) => p.photos ?? []))
      ).slice(0, 8);
      const coverImage =
        theirPrograms.find((p) => p.coverImage)?.coverImage ?? photos[0];
      const narrative = NARRATIVES[name] ?? DEFAULT_NARRATIVE;

      await ctx.db.insert("providers", {
        name,
        slug,
        logo,
        coverImage,
        tagline: narrative.tagline,
        about: narrative.about,
        whyChoosePoints: narrative.whyChoosePoints,
        headquarters: narrative.headquarters,
        yearFounded: narrative.yearFounded,
        website,
        socialLinks: SAMPLE_SOCIAL,
        photos,
        awards: SAMPLE_AWARDS,
        faqs: providerFaqs(name),
        status: "published",
      });
      created++;
    }
    return { created, total: names.length };
  },
});

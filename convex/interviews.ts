import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listInterviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("interviews").order("desc").collect();
  },
});

export const listInterviewsByProgram = query({
  args: {
    programId: v.id("programs"),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, { programId, status }) => {
    if (status) {
      return await ctx.db
        .query("interviews")
        .withIndex("by_program_status", (q) =>
          q.eq("programId", programId).eq("status", status)
        )
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("interviews")
      .withIndex("by_program", (q) => q.eq("programId", programId))
      .order("desc")
      .collect();
  },
});

export const getInterview = query({
  args: { id: v.id("interviews") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

export const createInterview = mutation({
  args: {
    programId: v.id("programs"),
    name: v.string(),
    role: v.union(v.literal("Alumni"), v.literal("Staff")),
    year: v.string(),
    bio: v.string(),
    quote: v.string(),
    photo: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("interviews", args);
  },
});

export const updateInterview = mutation({
  args: {
    id: v.id("interviews"),
    programId: v.optional(v.id("programs")),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("Alumni"), v.literal("Staff"))),
    year: v.optional(v.string()),
    bio: v.optional(v.string()),
    quote: v.optional(v.string()),
    photo: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    createdBy: v.optional(v.string()),
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

export const deleteInterview = mutation({
  args: { id: v.id("interviews") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ─── Bulk Seeding ────────────────────────────────────────────────────────────

// The 3 original placeholder interviews (verbatim from the former
// V1InterviewsSection hardcoded array), seeded as published for one program.
export const seedMockInterviews = mutation({
  args: { programId: v.id("programs") },
  handler: async (ctx, { programId }) => {
    const samples: {
      name: string;
      role: "Alumni" | "Staff";
      year: string;
      bio: string;
      quote: string;
      photo?: string;
    }[] = [
      {
        name: "Kristianna Williams",
        role: "Alumni",
        year: "2017",
        bio: "Kristianna is from Dayton, Ohio, and she is a senior Sports Science major at Wright State University. Kristianna loves coaching middle school track an...",
        quote:
          "I wanted to get out of my comfort zone and see another culture firsthand. Growing up in a small town in Ohio, I'd never really traveled outside the country, so studying abroad felt like the perfect chance to push myself. From the moment I landed I was immersed in a completely new way of life — the food, the language, the everyday rhythms — and it stretched me in ways I never expected. By the end, I'd made friends from all over the world and come back with a confidence I didn't have before.",
        photo: "/images/interview1.webp",
      },
      {
        name: "Marissa Baglione",
        role: "Alumni",
        year: "2016",
        bio: "Marissa Baglione is a senior studying communications and media studies in Boston. She just recently landed an internship with Hill Holliday in their M...",
        quote:
          "Studying abroad in college has been at the top of my to-do list since high school. I have a love of travel and discovering new places, so that's definitely what inspired me to apply. What I didn't expect was how much the program would shape my career — interning with a local agency while I was abroad gave me real-world experience I could never have gotten in a classroom. Balancing work, classes, and exploring a new city taught me how to adapt quickly, and I came home with a portfolio and a network that opened doors the moment I got back.",
      },
      {
        name: "Daniel Ortega",
        role: "Staff",
        year: "2019",
        bio: "Daniel is a program coordinator based in Barcelona who has supported hundreds of students through their study abroad journey over the past six years...",
        quote:
          "Seeing students grow in confidence over a single semester is the most rewarding part of what I do. Many of them arrive nervous and unsure, sometimes traveling on their own for the very first time, and within weeks they're navigating the city, ordering in a new language, and making friends from around the world. My job is to make sure the logistics never get in the way of that growth — from housing and safety to helping them settle in. By the time they leave, they're not just better students, they're more independent, more curious people, and that's what keeps me doing this year after year.",
      },
    ];

    for (const s of samples) {
      await ctx.db.insert("interviews", {
        programId,
        name: s.name,
        role: s.role,
        year: s.year,
        bio: s.bio,
        quote: s.quote,
        photo: s.photo,
        status: "published",
      });
    }
    return samples.length;
  },
});

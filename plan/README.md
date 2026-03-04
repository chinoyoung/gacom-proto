# GoAbroad Program Listing Prototype — Implementation Plan

## Overview

Build a study abroad program listing prototype inspired by GoAbroad.com, with:
1. **Multi-step Create Listing form** — admin-facing, saves to Convex
2. **Program Detail Page** — public-facing, mirrors GoAbroad layout
3. **Programs Index Page** — browse/list all programs

---

## Reference Page

**URL:** https://www.goabroad.com/providers/cisabroad/programs/semester-in-florence-19745
**Screenshot:** `program.png` (provided by user)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Convex |
| File Uploads | Convex File Storage (for photos) |

---

## Phase 1 — Convex Setup

### 1.1 Install & Configure Convex

```bash
npm install convex
npx convex dev  # initializes convex/ folder and links to dashboard
```

### 1.2 Database Schema (`convex/schema.ts`)

```ts
programs: defineTable({
  // Basic Info
  title: v.string(),
  provider: v.string(),
  tagline: v.optional(v.string()),
  slug: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("published")),

  // Location & Terms
  city: v.string(),
  country: v.string(),
  terms: v.array(v.string()),       // ["fall", "spring", "summer", "academic_year"]
  duration: v.optional(v.string()), // e.g. "1 semester", "4 months"

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

  // Media
  coverImage: v.optional(v.string()),  // Convex storage ID or URL
  photos: v.array(v.string()),         // Convex storage IDs or URLs
})
.index("by_status", ["status"])
.index("by_country", ["country"])
```

### 1.3 Convex Mutations & Queries

```
convex/
  schema.ts
  programs.ts   ← createProgram, updateProgram, getProgram, listPrograms
```

---

## Phase 2 — Create Listing (Multi-Step Form)

**Route:** `/admin/create-listing`

### Step Structure

| Step | Title | Fields |
|---|---|---|
| 1 | Basic Info | Title, Provider, Tagline, Host Institution |
| 2 | Location & Terms | City, Country, Terms (multi-select), Duration |
| 3 | Eligibility | Education Levels, Eligible Nationalities, Age Requirement |
| 4 | Program Details | Description (rich text), What's Included (tag input) |
| 5 | Subject Areas & Features | Subject Areas (tag input), Program Highlights |
| 6 | Pricing & Contact | Cost, Application Deadline, Contact Email, Phone, Apply URL |
| 7 | Media | Cover Image upload, Photo gallery upload |
| 8 | Review & Publish | Summary of all fields, Save as Draft or Publish |

### Form UX

- **Progress bar** at the top showing current step (e.g. "Step 2 of 8")
- **Next / Back** navigation, no full page refresh
- **Auto-save to Convex** on each step completion (saves as `draft`)
- **Validation** per step before advancing
- Final step allows **Publish** (sets `status: "published"`)

### File Structure

```
app/
  admin/
    create-listing/
      page.tsx                 ← shell with step state management
      _components/
        StepProgress.tsx       ← progress bar + step labels
        Step1BasicInfo.tsx
        Step2Location.tsx
        Step3Eligibility.tsx
        Step4ProgramDetails.tsx
        Step5SubjectsFeatures.tsx
        Step6PricingContact.tsx
        Step7Media.tsx
        Step8Review.tsx
        FormNavigation.tsx     ← Back/Next/Save buttons
```

---

## Phase 3 — Program Detail Page (Public)

**Route:** `/programs/[id]`

### Page Layout (mirrors GoAbroad)

```
┌─────────────────────────────────────────────────────────┐
│  HERO — Cover image + Program title + Provider          │
│  Breadcrumb: Programs / City / Program Title            │
├────────────────────────────────┬────────────────────────┤
│  MAIN CONTENT                  │  SIDEBAR               │
│                                │                        │
│  ▸ Overview / Description      │  ┌──────────────────┐  │
│  ▸ What's Included             │  │  Quick Details   │  │
│  ▸ Subject Areas               │  │  • Location      │  │
│  ▸ Program Highlights          │  │  • Terms         │  │
│  ▸ Photo Gallery               │  │  • Cost          │  │
│                                │  │  • Edu Levels    │  │
│                                │  │  • Nationalities │  │
│                                │  │  • Housing       │  │
│                                │  │  • Language      │  │
│                                │  │  • Credits       │  │
│                                │  └──────────────────┘  │
│                                │  ┌──────────────────┐  │
│                                │  │  Apply / Inquire │  │
│                                │  │  CTA Buttons     │  │
│                                │  └──────────────────┘  │
└────────────────────────────────┴────────────────────────┘
```

### File Structure

```
app/
  programs/
    page.tsx             ← Programs index (list all published)
    [id]/
      page.tsx           ← Program detail (server component, fetches from Convex)
      _components/
        ProgramHero.tsx
        QuickDetails.tsx
        ProgramOverview.tsx
        WhatsIncluded.tsx
        SubjectAreas.tsx
        ProgramHighlights.tsx
        PhotoGallery.tsx
        ApplyCTA.tsx
```

---

## Phase 4 — Navigation & Home Page Update

- Update `app/page.tsx` to include links to:
  - `/admin/create-listing` — Create a new program listing
  - `/programs` — Browse all programs
- Add minimal nav header component

---

## Implementation Order

```
[ ] Phase 1: Convex setup (schema + mutations/queries)
[ ] Phase 2: Create Listing multi-step form
[ ] Phase 3: Program Detail page
[ ] Phase 4: Programs index + Home page
```

---

## Key Design Decisions

### Why Convex?
- Real-time reactive queries (programs list auto-updates)
- Built-in file storage for photo uploads
- No separate backend needed — mutations run server-side

### Form State Strategy
- Store partial form state in **React state** (in `page.tsx`)
- On each step's "Next", mutate Convex with accumulated data
- On step 1 completion, create the program doc and store the returned `id`
- Subsequent steps call `updateProgram` with the stored `id`
- Prevents data loss if user navigates away mid-form

### Rendering Strategy (Vercel best practices)
- Program detail page: **Server Component** fetching directly from Convex
- Create listing form: **Client Component** (interactive multi-step)
- Programs index: **Server Component** with streaming via Suspense

### Performance
- `Promise.all()` for parallel data fetches
- `next/dynamic` for heavy form components (rich text editor)
- Direct imports, no barrel files

---

## Suggested File Upload Flow

1. User selects images in Step 7
2. On "Next", upload via `convex.storage.generateUploadUrl()` → get storage IDs
3. Store storage IDs in program doc
4. On detail page, resolve storage IDs to URLs via `useQuery(api.programs.getPhotoUrls, { ids })`

---

## Estimated Scope

| Phase | Complexity |
|---|---|
| Convex setup | Low |
| Multi-step form | Medium-High |
| Program detail page | Medium |
| Index + nav | Low |

---

*Plan created: 2026-03-04*

# Listing Page Improvements — Product Plan

## Overview

Improvements to the program listing page (and supporting admin form) across three
areas: conversion, trust, and data quality. Ordered by priority within each tier.

---

## Tier 1 — High Impact, Do First

### 1. Structured Price Field
**Status:** Not started
**Scope:** Schema · Admin form · Frontend display

Replace the free-text `cost` string with a proper numeric price field.

Schema changes:
- `startingPriceUsd: v.optional(v.number())` — required for published listings
- `isFree: v.boolean()` — replaces "free" text entry
- Keep `cost` string for migration / legacy display

Display changes:
- Hero and QuickDetails show **"Starting at $X,XXX"**
- If `isFree: true` → display **"No Upfront Fees"**
- Enables price sorting/filtering in search later

Admin form changes:
- Step 6: replace Cost text input with number field (USD)
- Add "This program has no upfront fees" checkbox
- Mark as required before publishing

---

### 2. Starting Price + Rating in the Hero
**Status:** Not started
**Scope:** ProgramHero.tsx only

Move two highest-intent signals into the hero key facts strip:
- **Starting price** — "From $X,XXX" pulled from `startingPriceUsd`
- **Overall rating** — currently static (8.41 / 103 reviews); wire to real review aggregate

If no reviews exist → show nothing (no "0 reviews" placeholder).

---

### 3. Inquiry Form
**Status:** Not started
**Scope:** New component · QuickDetails sidebar · Modal fallback on mobile

The "Inquire Here" button currently does nothing. This is a dead CTA on a high-intent page.

Implementation:
- Sidebar: inline form below QuickDetails on desktop
  - Fields: Name, Email, Message (optional), Send button
- Mobile: modal triggered by the sticky bar "Send Inquiry" button
- On submit: Convex mutation → `inquiries` table (new) or email via a serverless function
- No auth required — low friction

Schema addition:
```
inquiries: defineTable({
  programId: v.id("programs"),
  name: v.string(),
  email: v.string(),
  message: v.optional(v.string()),
  submittedAt: v.number(),
})
```

---

### 4. Exclusions Field
**Status:** Not started
**Scope:** Schema · Admin form · Frontend display

Add `whatsExcluded: v.array(v.string())` alongside `whatsIncluded`.

Display: a second list in the "What's Included" section with a red/roman
X icon, or a two-column layout (Included | Not Included).

---

## Tier 2 — Good, Scope Carefully

### 5. Payment Terms
**Status:** Not started
**Scope:** Schema · Admin form (Step 6) · QuickDetails display

Structured checkboxes — predefined options, multi-select:

| Value | Display Label |
|---|---|
| `payment_plan` | Payment Plan Available |
| `scholarship` | Scholarships Available |
| `upfront_deposit` | Upfront Deposit Required |
| `full_payment` | Full Payment Upfront |
| `stipend` | Stipend / Compensation Included |

Schema: `paymentTerms: v.array(v.string())`

Display: tag-style badges in QuickDetails.

---

### 6. Refund Policy
**Status:** Not started
**Scope:** Schema · Admin form (Step 6) · QuickDetails display

Two fields:
- `refundPolicyType: v.optional(v.union(...))` — select from: `full`, `partial`, `no_refund`, `case_by_case`, `see_link`
- `refundPolicyUrl: v.optional(v.string())` — shown when type is `see_link`

Display: one line in QuickDetails with optional external link.

---

### 7. Application Deposit / Fee
**Status:** Not started
**Scope:** Schema · Admin form (Step 6) · Frontend display

Fields:
- `applicationFeeUsd: v.optional(v.number())`
- `applicationFeeWaived: v.optional(v.boolean())`

Display: in QuickDetails alongside cost. "No application fee" when waived.

---

### 8. Pros & Cons in Reviews
**Status:** Not started
**Scope:** Schema (reviews table) · Review submission form · ReviewCard display

Add to the `reviews` table:
- `pros: v.optional(v.array(v.string()))` — up to 3 bullet points
- `cons: v.optional(v.array(v.string()))` — up to 3 bullet points

Display: expandable section inside ReviewCard, below the body text.

---

### 9. Program Tags
**Status:** Not started
**Scope:** Schema · Admin form · Frontend display + future filtering

Predefined taxonomy — multi-select:

```
LGBTQI+ Friendly · Sustainability Focus · Faith-Based · Family Friendly
Wheelchair Accessible · Women-Only · Beginner Friendly · Competitive Admission
Financial Aid Available · Part-Time Option · Remote Option
```

Schema: `programTags: v.optional(v.array(v.string()))`

Display: small tag badges near the subject areas section on the listing page.
Useful for filtering/search later.

---

## Tier 3 — Conditional (Needs Groundwork)

### 10. Salary & Compensation
**Status:** Blocked on `programType` field
**Scope:** Schema · Admin form · Frontend (conditional)

Only relevant for: Teaching Abroad, Jobs Abroad, Internship Abroad.

**Prerequisite:** Add `programType` field to programs schema first.

Once available:
- `compensationIncluded: v.optional(v.boolean())`
- `startingHourlyRateUsd: v.optional(v.number())`
- `compensationNotes: v.optional(v.string())`

Display: featured badge in hero — *"This program includes compensation"* —
and details row in QuickDetails.

---

### 11. Program Type Field
**Status:** Not started — blocks items 10
**Scope:** Schema · Admin form (Step 1) · All display logic

```
programType: v.union(
  v.literal("study_abroad"),
  v.literal("volunteer_abroad"),
  v.literal("intern_abroad"),
  v.literal("teach_abroad"),
  v.literal("gap_year"),
  v.literal("language_school"),
  // ...
)
```

Required field. Unlocks conditional form sections and display logic.

---

### 12. Years in Operation / Company Profile
**Status:** Blocked on Provider/Company model
**Scope:** New `providers` table · Admin UI · Listing display

Currently provider info is a string field on the program. A proper provider
profile is needed before "Years in Operation" can be surfaced reliably.

Future schema:
```
providers: defineTable({
  name: v.string(),
  foundedYear: v.optional(v.number()),
  // ...
})
```

---

## Dropped / Reconsidered

| Suggestion | Decision | Reason |
|---|---|---|
| "X travelers viewing this listing" popup | **Drop** | Dark pattern. Erodes trust with educated users. |
| Provider Inquiry Form on Provider Page | **Later** | Provider pages don't exist yet. |
| Scholarship Listing integration | **Later** | Separate feature, own scope. |
| Future form integration from client site | **Later** | Too speculative to design around now. |

---

## Age Requirement Display Fix
**Status:** Quick fix — no schema change needed
**Scope:** QuickDetails.tsx only

Currently shows "Varies" even when actual values exist.
Logic: if `ageRequirement` is set and not "all", display the value.
If empty or "all" → display "All Ages".

---

## Already Done

| Item | Status |
|---|---|
| Last Updated Date | Done — `updatedAt` field, displayed in QuickDetails footer |
| "If no reviews, don't display 0" | Done — empty state already implemented |

---

## Schema Change Summary

All changes that require a Convex schema update:

| Field | Table | Type | Priority |
|---|---|---|---|
| `startingPriceUsd` | programs | `v.optional(v.number())` | Tier 1 |
| `isFree` | programs | `v.optional(v.boolean())` | Tier 1 |
| `whatsExcluded` | programs | `v.optional(v.array(v.string()))` | Tier 1 |
| `paymentTerms` | programs | `v.optional(v.array(v.string()))` | Tier 2 |
| `refundPolicyType` | programs | `v.optional(v.string())` | Tier 2 |
| `refundPolicyUrl` | programs | `v.optional(v.string())` | Tier 2 |
| `applicationFeeUsd` | programs | `v.optional(v.number())` | Tier 2 |
| `applicationFeeWaived` | programs | `v.optional(v.boolean())` | Tier 2 |
| `programTags` | programs | `v.optional(v.array(v.string()))` | Tier 2 |
| `pros` | reviews | `v.optional(v.array(v.string()))` | Tier 2 |
| `cons` | reviews | `v.optional(v.array(v.string()))` | Tier 2 |
| `compensationIncluded` | programs | `v.optional(v.boolean())` | Tier 3 |
| `startingHourlyRateUsd` | programs | `v.optional(v.number())` | Tier 3 |
| `programType` | programs | `v.string()` | Tier 3 |
| `inquiries` | new table | see above | Tier 1 |

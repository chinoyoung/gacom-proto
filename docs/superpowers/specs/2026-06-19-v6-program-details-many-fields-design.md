# Design: v6 Program Details — "Many Fields" Demo

> Date: 2026-06-19
> Addresses PO feedback item #4 (`docs/po-feedback-program-detail.md`): "For the Program Details, can you confirm how it will display sections with lots of options? For example, the Fields section."
> Scope: v6 program detail prototype only. No schema changes.

## Goal

Demonstrate, in the **v6** program detail prototype, how the Program Details section behaves when a listing has many options per category (e.g. 20+ subject Fields). Reference: GoAbroad's category-card layout with inline "Show all" expanders.

## Approach (decisions made during brainstorming)

- **Structure:** category-card grid (like the reference screenshot), replacing v6's current flat single-value grid.
- **Overflow interaction:** inline "Show all ⌄" — show the first 4 items per multi-value card, expand in place, "Show less ⌃" to collapse.
- **Demo data:** a dedicated seeded program (not an existing one), created via a Convex mutation.
- **Non-model categories** (Locations, Accommodation Options, Application Procedures — not multi-value in the schema): rendered as **static demo cards** with hardcoded sample values, clearly prototype-only.

## Components

### 1. `app/programs/[id]/_versions/v6/V6ProgramDetails.tsx` (new)

Client component (`"use client"` — per-card expand state). Renders a responsive category-card grid:
`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.

**Card kinds:**

- **Multi-value cards** (data-driven, with overflow):
  | Card title | Source field |
  |---|---|
  | Fields & Subjects | `program.subjectAreas` |
  | Eligible Nationalities | `program.eligibleNationalities` |
  | Program Cost Includes | `program.whatsIncluded` |
  | Available Terms | `program.terms` |
  | Education Levels | `program.educationLevels` |

- **Multi-value cards** (static demo, hardcoded — match screenshot breadth):
  | Card title | Sample values |
  |---|---|
  | Locations | Gold Coast, Australia · San Jose, Costa Rica · London, England · Dublin, Ireland · Barcelona, Spain · Tokyo, Japan |
  | Accommodation Options | Apartment/Flat · Dormitory · Home-stays · Shared Housing · Private Studio |
  | Application Procedures | Online Application · Interview · Reference Letter · Resume/CV |

- **Single-value cards** (compact): Location (`city, country`), Age Requirement (`ageRequirement`), Program Length (`duration`), Language (`languageOfInstruction`), Next Deadline (`applicationDeadline` → red, else "Rolling Admissions"), Housing (`housingType`).

**Sub-component `ExpandableList`:** receives `items: string[]`. Shows first 4; if `items.length > 4`, renders a "Show all (N) ⌄" / "Show less ⌃" toggle (cobalt link + chevron) that reveals/collapses the remainder in place. ≤4 items → no toggle.

**Styling:** card = `bg-slate-50 border border-slate-200 rounded-md p-5`; icon in `text-cobalt-500`; title bold `text-zinc-900`; list items `text-[15px] text-slate-700 leading-snug`; toggle `text-sm font-semibold text-cobalt-500 hover:text-cobalt-600`. Brand tokens only, no inline hex, standard Tailwind. Icons from `lucide-react`. Mobile-first (single column on small screens).

### 2. `app/programs/[id]/_versions/v6/Reviews2026DetailPage.tsx` (edit)

In the `#details` section (currently `<ProgramDetails program={program} />`), swap to `<V6ProgramDetails program={program} />`. Add the import; remove the now-unused shared `ProgramDetails` import if nothing else uses it. No other v6 sections change. v5 and the shared `_components/ProgramDetails.tsx` are untouched.

### 3. `convex/programs.ts` (new mutation `seedRichDemo`)

Idempotent seed: look up `programs` by slug `global-internship-demo` (via `by_slug` index). If it exists, `patch` it with the rich data; otherwise `insert`. Sets `status: "published"` and populates all schema-required fields plus long arrays:

- `subjectAreas`: ~26 subjects (Accounting → Sociology)
- `eligibleNationalities`: ~10
- `educationLevels`: ~8
- `whatsIncluded`: ~10
- `terms`: ~9 (Year Round, Summer, Winter, Short Term, Spring, Fall, 1-3 Months, 3-6 Months, 1 Year)
- plus `title`, `provider`, `city`/`country`, `duration`, `ageRequirement`, `housingType`, `languageOfInstruction`, `applicationDeadline`, `cost`, `description`, `highlights`, `photos`, etc.

Run once: `npx convex run programs:seedRichDemo`. Demo URL: `/programs/global-internship-demo?v=v6`.

## Out of scope / non-goals

- No schema changes (no multi-location, multi-accommodation, or application-procedure fields added — handled via static demo cards instead).
- No changes to v1–v5 or the shared `ProgramDetails` component.
- Not wiring the static-card values to the data model (they are prototype illustration only).

## Verification

- `npx tsc --noEmit` clean.
- After running the seed, `/programs/global-internship-demo?v=v6` shows the category-card grid; Fields/Subjects and Cost Includes cards show "Show all" and expand/collapse correctly; ≤4-item cards show no toggle; layout collapses to one column on mobile.

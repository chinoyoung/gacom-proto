# Basic Inquiry Section — Program Detail (v1)

**Date:** 2026-07-10
**Status:** Approved by Chino (chat)

## Problem

The program detail page has two stepper-style forms (the 5-step apply section `#apply` and the one-question-per-step wizard `#apply-guided`), but no classic single-page inquiry form. Stakeholders need to compare a standard "everything on one page" inquiry form against the stepper approaches.

## Design

New component `app/programs/[id]/_versions/v1/V1InquireSection.tsx`, mounted in `V1DetailPage.tsx` as `<section id="inquire">` directly after the `#apply-guided` section, with the same section chrome (`w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 scroll-mt-36`).

### Layout

- Heading block matching the apply section: eyebrow "Inquire" (cobalt, uppercase tracking-widest), h2 "Inquire about this program", one-line slate subtext.
- Desktop: two-column grid `lg:grid-cols-[340px_1fr]` — reused `SummaryCard` (imported from `V1ApplySection`) left, white bordered form card (`bg-white rounded-xl border border-slate-200 p-6 md:p-8`) right. Single column on mobile (summary card hidden on mobile, matching the apply section's behavior).

### Form fields (single page, no steps)

1. First name / Last name — side by side on sm+ (reuse `TextInput` from `V1ApplySection`).
2. Email (required, format-validated) and Phone (optional) — `TextInput`.
3. Preferred start month — native select reusing the exported `MONTHS` list; optional.
4. Message — textarea, label "Your message", placeholder like "What would you like to know about this program?"; required.
5. Terms checkbox — same markup/copy as the apply form ("I accept the Terms and Conditions" linking to /terms); required.
6. Submit button — "Send inquiry", cobalt-500 primary button matching existing form buttons.

### Behavior

- Validation on submit, matching stepper patterns: required first/last name, valid email, message, terms. Inline `text-roman-600` error text, `border-roman-500` on invalid inputs, errors clear on change.
- On valid submit: replace the form card content with a success state (fern check icon circle, "Inquiry sent" heading, "Thanks {firstName} — {provider} will get back to you shortly about {program title}.", and a "Send another inquiry" outline button that resets the form).
- Prototype only — no backend call.

### Constraints

- Reuse `TextInput`, `SummaryCard`, `MONTHS` from `V1ApplySection`; match its input/button/error classes exactly.
- Standard Tailwind, brand tokens (cobalt/fern/roman), no inline hex, mobile-first.
- No changes to the modal, `#apply`, or `#apply-guided` sections.

## Out of scope

- Wiring inquiries to Convex or email.
- Replacing the modal's stepper with this form.

---

# Revision 2 — Step-by-Step Inquiry (approved 2026-07-10)

The single-page form is replaced by a 3-step flow modeled on GoAbroad's production inquiry wizard (timing → question → about you). Same section shell: heading block, SummaryCard left, form card right, success state at the end.

## Steps

1. **"When do you want to travel?"** — SelectableGroup-style option cards (single choice, required):
   "In the next 6 months" / "In the next 6-12 months" / "In the next 12-24 months" / "In more than 2 years".
   Below the cards: a checkbox "I want to choose a specific month" that, when checked, reveals the preferred-start-month native select (MONTHS, optional).
2. **"What questions do you have for {provider}?"** — the message textarea (required, ~6 rows) with a live character count under it (right-aligned, small slate text).
3. **"Tell us about yourself."** — first/last name side by side, email (required + regex), phone (optional), terms checkbox (required), and the "Send inquiry" primary submit button.

## Chrome & behavior

- Progress indicator: same visual pattern as V1ApplySection's Stepper — numbered/checked nodes with labels "When", "Your question", "About you" on sm+, compact "Step X of 3" progress bar on mobile. Fern for complete/current, matching the apply stepper.
- Navigation: Back (outline) / Next (cobalt primary) per step; step 3 uses "Send inquiry" instead of Next. Per-step validation on Next with the existing inline error styling (text-roman-600, border-roman-500), errors clear on change.
- Success state unchanged (fern check, "Inquiry sent", personalized copy, "Send another inquiry" reset to step 1 with cleared state).
- Reuse from V1ApplySection where practical (TextInput, SummaryCard, MONTHS); the option cards may reuse or mirror SelectableGroup's classes.
- Modal, #apply, #apply-guided untouched.

## Revision 2a — Step 1 "Or" semantics (approved 2026-07-10)

The travel-window cards and the specific-date choice are mutually exclusive alternatives:

- Selecting one of the 4 window cards unchecks/clears the specific-range option.
- Checking "I want to choose a specific date range" deselects any chosen window card and reveals TWO selects side by side: "Start month" and "End month" (both from MONTHS).
- A subtle "or" divider sits between the cards and the checkbox.
- Validation for Next on step 1: either a window card is selected, OR the checkbox is checked and BOTH start and end month are chosen. Error messaging reflects whichever path is active.

## Revision 2b — Step 3 field parity with production (approved 2026-07-10)

Step 3 "Tell us about yourself." expands to match GoAbroad's production inquiry form:

1. First / Last name (required, side by side)
2. Email (required + regex)
3. "Where are you from?" — country select, required (static COUNTRIES list, ends with "Other")
4. Phone number (optional)
5. "When is your birthday?" — Month / Day / Year selects in one row, all required (single combined error)
6. "What level of education have you completed?" — select, required (High school or less → Master's degree or higher)
7. "Are you a current student?" — Yes/No radios, required
8. Consent checkbox with production copy (GoAbroad Terms of Service + Privacy/Cookie Policy + marketing consent), required
9. Muted "This site is protected by Google reCAPTCHA." note under the footer (decorative)

## Revision 2c — Highlighted section band (approved 2026-07-10)

The inquire section is wrapped in a full-bleed `bg-slate-50` band (`py-16`, `mt-20` on the wrapper) in `V1DetailPage.tsx`; the content stays in the `max-w-7xl` container. `bg-slate-50` follows BRANDING.md's tinted-section pattern (note: `cobalt-50` is a saturated blue in this theme, not a light tint — not suitable for section backgrounds).

## Revision 2d — Birthday date picker (approved 2026-07-10)

The Month/Day/Year select trio is replaced with a custom calendar picker:

- Trigger: a single input-styled button (calendar icon + "Select your birthday" placeholder, or the formatted chosen date e.g. "March 12, 1998"), matching the input height/border styles; border-roman-500 when invalid.
- Popover: react-day-picker v9 `mode="single"` in the same popover shell as `components/DateRangePicker.tsx` (white card, border-slate-200, rounded-xl, shadow-lg; closes on outside click / Escape / selection). Cobalt theming comes from the existing `--rdp-*` vars in globals.css.
- Birthday-specific navigation: `captionLayout="dropdown"` with `startMonth`/`endMonth` bounding the years 1940–2013, `defaultMonth` Jan 2000, so decades are reachable in two clicks.
- State: single `birthday` ISO string replaces birthMonth/birthDay/birthYear. Validation: required, error "Please select your birthday".

## Revision 2e — Summary card removed (approved 2026-07-10)

The SummaryCard column is removed from the inquiry section. The form card is the sole content, constrained to `max-w-4xl`, left-aligned with the section heading.

## Revision 2f — Layout & step merge (approved 2026-07-10)

- The form card is full width within the max-w-7xl container (max-w-4xl cap removed).
- Steps 1 and 2 are merged: the wizard is now 2 steps — "Your inquiry" (travel timing block + question textarea) and "About you" (personal details). Step-1 validation is the union of the former two steps' rules.

## Revision 2g — Step 1 two-column layout (approved 2026-07-10)

Step 1's two blocks sit side by side on desktop (`lg:grid-cols-2`, `items-start`): travel-window block left, question textarea right (rows=8 for balance). Single column on mobile, travel block first.

## Revision 2h — Errors only on submit attempt (approved 2026-07-10)

Validation errors must not persist across step navigation. Reproduced defect: failing submit on step 2, then Back→Next, re-displayed the step-2 errors without a new attempt. Fix: clear the `errors` state on every step change (both Next-advance and Back), so an error only displays as the direct result of a submit/advance attempt on the current step.

## Revision 2i — Move education & student to step 1 (approved 2026-07-10)

"What level of education have you completed?" and "Are you a current student?" move from step 2 ("About you") to step 1 ("Your inquiry"). In step 1 they sit as a full-width row below the two-column timing/question grid, separated by a top border (`pt-6 border-t border-slate-100`), themselves in a `sm:grid-cols-2` row. Their required-field validation moves from validateStep2 to validateStep1.

## Revision 2j — Step 1 rebalanced layout (approved 2026-07-10)

Fixes lower-left dead space and imbalance. Step 1 two-column grid becomes items-stretch:
- Left column (space-y-6): all structured inputs stacked — travel-timing block, then education-level select, then current-student radios.
- Right column (flex flex-col): the question block; the textarea grows (flex-1, min height) to fill the column height so both columns match.

## Revision 2k — Travel-window cards as one row of squares (approved 2026-07-10)

The 4 travel-window cards become a single row of square tiles: grid `grid-cols-2 sm:grid-cols-4` (one row from sm up; 2×2 on the smallest phones), each card `aspect-square` with centered text (flex items-center justify-center). Selected/unselected color states and focus ring unchanged.

---

# Revision 3 — Split into a 4-step wizard (approved 2026-07-14)

The 2-step wizard is reworked into a 4-step wizard so no single step is overloaded. Revision 2f had merged timing + question and moved education/student onto the same first step (2i, 2j), leaving step 1 packing five distinct asks. This revision spreads that content across four topic-focused steps. Only `V1InquireSection.tsx` changes — the `bg-slate-50` band and the mounting in `V1DetailPage.tsx` (Revision 2c) are untouched.

## Steps

`STEP_LABELS = ["Timing", "Your question", "Background", "About you"]` (4 nodes).

1. **"When do you want to travel?"** — the travel-window square cards (Revision 2k), the "or" divider, and the specific-date-range checkbox that reveals Start month / End month selects (Revision 2a semantics: cards and date-range are mutually exclusive).
2. **"What questions do you have for {program.provider}?"** — the message textarea with the live character count beneath it (right-aligned small slate text). Single column, full width of the card.
3. **"Tell us about your background."** — the education-level select and the current-student Yes/No radios, in a `sm:grid-cols-2` row.
4. **"Tell us about yourself."** — unchanged from the current step 2: first/last name (side by side), email, "Where are you from?" country select, phone, birthday picker, and the consent checkbox. "Send inquiry" submit + the reCAPTCHA note.

## Validation (per step, on Next / submit)

- **Step 1:** a travel-window card is selected, OR the date-range checkbox is checked and BOTH start and end month are chosen (existing `validateStep1` timing logic, minus the message/education/student rules).
- **Step 2:** `message` is non-empty (trimmed).
- **Step 3:** `educationLevel` selected AND `currentStudent` chosen.
- **Step 4:** first name, last name, valid email, `whereFrom`, `birthday`, and `termsAccepted` (existing `validateStep2` rules).

The former `validateStep1` / `validateStep2` split becomes four functions (or one `validateStep(n)` switch). `handleNext` advances 1→2→3→4 validating the current step; submit fires only on step 4.

## Chrome & behavior (unchanged)

- Same `InquireStepper` visual, now driven by 4 labels; `NavFooter` Back/Next with "Send inquiry" on the last step; mobile "Step X of 4" progress bar.
- Errors cleared on every step change (Revision 2h) — must still hold across all four steps.
- Success state and "Send another inquiry" reset (to step 1, cleared state) unchanged.
- Single-column layout per step; the Revision 2g/2j two-column timing+question grid is removed since those are now separate steps.

## Out of scope

- Any change to the modal, `#apply`, `#apply-guided`, or the section band / mounting.
- Backend wiring.

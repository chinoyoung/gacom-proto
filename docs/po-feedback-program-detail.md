# PO Feedback — Program Detail Page

> Source: Product Owner review of the program detail page prototype.
> Captured: 2026-06-18. Status: triage / not yet implemented.

This doc records the PO's feedback and maps each item to the relevant code so it can be turned into work items. Items are grouped into **edits** (actionable changes) and **content questions** (need a decision on how data is generated/populated).

---

## Minor edits

### 1. "Starting price" → relabel as "Program Costs"
- **Ask:** Rename the "Starting price" label to **Program Costs**.
- **Where:** Cost is surfaced in `app/programs/[id]/_components/WhyChooseProgram.tsx` (`formatCost`) and the metrics/quick-detail areas. Audit all places the cost label appears so the rename is consistent across the default design and any version variants.
- **Status:** Open.

### 2. Reduce white space after CTAs and the "bar of metrics"
- **Ask:** Tighten the vertical spacing below the CTA buttons and below the metrics bar.
- **Where:** `WhyChooseProgram.tsx` and the page composition in `DefaultDetailPage.tsx` (section spacing / margins).
- **Status:** Open.

### 3. Show more of the program description by default
- **Ask:** Display roughly **double** the current character count of the description before truncating / "read more".
- **Where:** `app/programs/[id]/_components/ProgramOverview.tsx`. (Currently renders the full description split on double newlines — confirm where the default truncation lives and double the visible threshold.)
- **Status:** Open.

### 4. Confirm how Program Details displays sections with many options (e.g. Fields)
- **Question:** How will the **Fields** (subject areas) section render when there are a lot of options?
- **Where:** `app/programs/[id]/_components/ProgramDetails.tsx` — `subjectAreas` and similar list-valued fields.
- **Answer / proposal:** Document the overflow behavior — e.g. wrap as chips/tags with a "+N more" expander, or cap visible count with a toggle. Decide and confirm with PO.
- **Status:** Needs decision.

### 5. Inquiry form must include our current fields
- **Ask:** Make sure the inquiry form includes the **current fields we already collect**.
- **Action:** List the existing inquiry/lead fields and reconcile against the prototype form so none are dropped.
- **Status:** Open.

### 6. Where does the "Ask for help" CTA go? To the provider?
- **Question:** Destination/recipient of the "Ask for help" CTA.
- **Answer / proposal:** Confirm whether this routes to the **provider**, to GoAbroad support, or opens the inquiry form. Document the intended recipient and the delivery channel (email/inbox).
- **Status:** Needs decision.

---

## Content questions

### 7. "Why Students Choose This Program" — how is it generated?
- **Question:** How is this section populated?
- **Where:** `app/programs/[id]/_components/WhyChooseProgram.tsx`.
- **Answer / proposal:** Define the source: manually authored by provider, derived from existing fields (rating, cost, credits, highlights), or AI-generated from the listing content. Document the rule.
- **Status:** Needs decision.

### 8. "Next Deadline" — how is it populated?
- **Question:** How is the next deadline value sourced?
- **Where:** `ProgramDetails.tsx` (`applicationDeadline`, falls back to "Rolling Admissions").
- **Answer / proposal:** Confirm whether it comes from a single `applicationDeadline` field, a list of term deadlines (pick the next upcoming), or rolling admissions. Document the logic.
- **Status:** Needs decision.

### 9. Will FAQs be auto-generated from the content?
- **Question:** Are FAQs auto-generated based on listing content?
- **Answer / proposal:** Decide between provider-authored FAQs, a template seeded from existing fields, or AI-generated from the listing. Document the approach.
- **Status:** Needs decision.

---

## Next steps
- Confirm decisions for items 4, 6, 7, 8, 9 with the PO.
- Once decisions land, break edits (1–3, 5) into implementation tasks.

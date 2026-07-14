# Inquiry 4-Step Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 2-step `V1InquireSection` inquiry wizard into a 4-step wizard (Timing → Your question → Background → About you) so no single step is overloaded.

**Architecture:** Single-file refactor of `app/programs/[id]/_versions/v1/V1InquireSection.tsx`. The existing `InquireStepper`, `NavFooter`, `BirthdayPicker`, state shape, success state, and reset logic are reused unchanged. Only the step count, per-step validation split, `handleNext` advancement, and the render blocks change. No other file changes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, lucide-react, react-day-picker.

## Global Constraints

- Only `app/programs/[id]/_versions/v1/V1InquireSection.tsx` may change. Do NOT touch `V1DetailPage.tsx`, the modal, `#apply`, `#apply-guided`, or the `bg-slate-50` section band.
- Standard Tailwind classes; brand tokens only (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`); no inline hex in `className`.
- Mobile-first — the stepper's mobile "Step X of N" bar and single-column layouts must work.
- Reuse `TextInput`, `MONTHS` from `./V1ApplySection` (already imported); keep input/button/error classes exactly as they are today.
- Do NOT run any state-changing git command (no commit/branch/etc.) — the repo owner runs git themselves. Where this plan's TDD template would commit, stop instead and report completion for review.

---

### Task 1: Rework `V1InquireSection` into a 4-step wizard

**Files:**
- Modify: `app/programs/[id]/_versions/v1/V1InquireSection.tsx`

**Interfaces:**
- Consumes (unchanged, already in file): `InquireState`, `InquireErrors`, `EMPTY_STATE`, `TRAVEL_WINDOWS`, `COUNTRIES`, `EDUCATION_LEVELS`, `InquireStepper`, `NavFooter`, `BirthdayPicker`, `handleChange`, `handleSelectTravelWindow`, `handleToggleDateRange`, `handleReset`, `TextInput`, `MONTHS`.
- Produces: no exported-interface change — `V1InquireSection({ program }: { program: Program })` default export keeps its signature.

- [ ] **Step 1: Update `STEP_LABELS` to four steps**

Replace:

```tsx
const STEP_LABELS = ["Your inquiry", "About you"];
```

with:

```tsx
const STEP_LABELS = ["Timing", "Your question", "Background", "About you"];
```

The existing `InquireStepper` and the mobile "Step {currentStep} of {STEP_LABELS.length}" bar are already driven by `STEP_LABELS.length`, so they now render 4 nodes automatically. No stepper markup change needed.

- [ ] **Step 2: Replace the two validators with four per-step validators**

Delete the current `validateStep1` and `validateStep2` functions entirely and replace with the four below. Note the timing logic moves verbatim from the old `validateStep1`; education/student get their own validator; the message gets its own; the personal-details rules move verbatim from the old `validateStep2`.

```tsx
function validateStep1(): boolean {
  // Timing: a window card OR a complete specific date range.
  const next: InquireErrors = { ...errors };
  let ok = true;

  next.travelWindow = undefined;
  next.startMonth = undefined;
  next.endMonth = undefined;

  if (state.travelWindow) {
    // Window card selected — valid.
  } else if (state.wantsSpecificMonth) {
    if (!state.startMonth) {
      next.startMonth = "Please select a start month";
      ok = false;
    }
    if (!state.endMonth) {
      next.endMonth = "Please select an end month";
      ok = false;
    }
  } else {
    next.travelWindow = "Please select a travel window or choose a date range";
    ok = false;
  }

  setErrors(next);
  return ok;
}

function validateStep2(): boolean {
  // Your question.
  if (!state.message.trim()) {
    setErrors({ message: "Please add a message" });
    return false;
  }
  setErrors({});
  return true;
}

function validateStep3(): boolean {
  // Background.
  const next: InquireErrors = {};
  if (!state.educationLevel) next.educationLevel = "Please select your education level";
  if (!state.currentStudent) next.currentStudent = "Please select an option";
  setErrors(next);
  return Object.keys(next).length === 0;
}

function validateStep4(): boolean {
  // About you.
  const next: InquireErrors = {};
  if (!state.firstName.trim()) next.firstName = "First name is required";
  if (!state.lastName.trim()) next.lastName = "Last name is required";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim());
  if (!state.email.trim() || !emailValid) next.email = "Valid email is required";
  if (!state.whereFrom) next.whereFrom = "Please select where you're from";
  if (!state.birthday) next.birthday = "Please select your birthday";
  if (!state.termsAccepted) next.terms = "You must accept the terms";
  setErrors(next);
  return Object.keys(next).length === 0;
}
```

- [ ] **Step 3: Update `handleNext` to advance through 4 steps**

Replace the current `handleNext`:

```tsx
function handleNext() {
  if (currentStep === 1 && validateStep1()) {
    setErrors({});
    setCurrentStep(2);
  }
}
```

with:

```tsx
function handleNext() {
  const validators = [validateStep1, validateStep2, validateStep3];
  const validate = validators[currentStep - 1];
  if (validate && validate()) {
    setErrors({});
    setCurrentStep((s) => Math.min(4, s + 1));
  }
}
```

(`handleBack` already does `Math.max(1, s - 1)` and clears errors — leave it unchanged. It now works across all 4 steps.)

- [ ] **Step 4: Update `handleSubmit` to fire on step 4**

Replace:

```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (currentStep !== 2) return;
  if (validateStep2()) setSubmitted(true);
}
```

with:

```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (currentStep !== 4) return;
  if (validateStep4()) setSubmitted(true);
}
```

- [ ] **Step 5: Rework the render — split the current step 1 into three single-column steps**

Replace the entire `{currentStep === 1 && ( ... )}` block (the two-column grid containing travel timing, education, current-student, and the message textarea) AND the `{currentStep === 2 && ( ... )}` block with the four blocks below. The "About you" block (step 4) is the current step-2 markup verbatim with only its guard changed.

Step 1 — Timing (single column: travel-window cards + "or" + date-range toggle only):

```tsx
{currentStep === 1 && (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-neutral-800 mb-4">When do you want to travel?</h3>
    <fieldset aria-invalid={!!errors.travelWindow || undefined}>
      <div
        className={[
          "grid grid-cols-2 sm:grid-cols-4 gap-2 transition-opacity",
          state.wantsSpecificMonth ? "opacity-60" : "",
        ].join(" ")}
      >
        {TRAVEL_WINDOWS.map((opt) => {
          const isSelected = state.travelWindow === opt;
          const inputId = `${uid}-travelWindow-${opt.replace(/\s+/g, "-")}`;
          return (
            <label
              key={opt}
              htmlFor={inputId}
              className={[
                "aspect-square flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-colors text-sm text-center",
                "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cobalt-500",
                isSelected
                  ? "border-fern-500 bg-fern-500 text-white font-semibold"
                  : "border-slate-200 text-slate-600 hover:border-slate-300",
              ].join(" ")}
            >
              <input
                type="radio"
                id={inputId}
                name={`${uid}-travelWindow`}
                value={opt}
                checked={isSelected}
                onChange={() => handleSelectTravelWindow(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
      {errors.travelWindow && (
        <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.travelWindow}</p>
      )}
    </fieldset>

    <div className="flex items-center gap-3 my-4" aria-hidden>
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>

    <div>
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={state.wantsSpecificMonth}
          onChange={(e) => handleToggleDateRange(e.target.checked)}
          className="w-4 h-4 rounded border border-slate-300 shrink-0 cursor-pointer accent-cobalt-500"
        />
        <span className="text-sm text-slate-600">I want to choose a specific date range</span>
      </label>

      {state.wantsSpecificMonth && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
          <div>
            <label htmlFor={startMonthId} className="block text-sm font-semibold text-neutral-800 mb-2.5">
              Start month
            </label>
            <select
              id={startMonthId}
              value={state.startMonth}
              onChange={(e) => handleChange("startMonth", e.target.value)}
              className={[
                "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 appearance-none cursor-pointer",
                errors.startMonth ? "border-roman-500" : "border-slate-300",
              ].join(" ")}
            >
              <option value="">Select a month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.startMonth && (
              <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.startMonth}</p>
            )}
          </div>

          <div>
            <label htmlFor={endMonthId} className="block text-sm font-semibold text-neutral-800 mb-2.5">
              End month
            </label>
            <select
              id={endMonthId}
              value={state.endMonth}
              onChange={(e) => handleChange("endMonth", e.target.value)}
              className={[
                "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 appearance-none cursor-pointer",
                errors.endMonth ? "border-roman-500" : "border-slate-300",
              ].join(" ")}
            >
              <option value="">Select a month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.endMonth && (
              <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.endMonth}</p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
)}
```

Step 2 — Your question (message textarea, single column, full width):

```tsx
{currentStep === 2 && (
  <div className="flex flex-col">
    <h3 className="text-lg font-bold text-neutral-800 mb-4">
      What questions do you have for {program.provider}?
    </h3>
    <textarea
      id={messageId}
      rows={8}
      value={state.message}
      onChange={(e) => handleChange("message", e.target.value)}
      placeholder="What would you like to know about this program?"
      aria-invalid={!!errors.message}
      aria-describedby={errors.message ? `${messageId}-error` : undefined}
      className={[
        "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 resize-none min-h-[200px]",
        errors.message ? "border-roman-500" : "border-slate-300",
      ].join(" ")}
    />
    <div className="flex items-center justify-between mt-1.5">
      <div>
        {errors.message && (
          <p id={`${messageId}-error`} className="text-xs text-roman-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <span className="text-xs text-slate-500">{state.message.length} characters</span>
    </div>
  </div>
)}
```

Step 3 — Background (education + current student, `sm:grid-cols-2`):

```tsx
{currentStep === 3 && (
  <div>
    <h3 className="text-lg font-bold text-neutral-800 mb-4">Tell us about your background.</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label htmlFor={educationId} className="block text-sm font-semibold text-neutral-800 mb-2.5">
          What level of education have you completed?
        </label>
        <select
          id={educationId}
          value={state.educationLevel}
          onChange={(e) => handleChange("educationLevel", e.target.value)}
          aria-invalid={!!errors.educationLevel}
          className={[
            "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 appearance-none cursor-pointer",
            errors.educationLevel ? "border-roman-500" : "border-slate-300",
          ].join(" ")}
        >
          <option value="" disabled>Choose one</option>
          {EDUCATION_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
        {errors.educationLevel && (
          <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.educationLevel}</p>
        )}
      </div>

      <div>
        <span className="block text-sm font-semibold text-neutral-800 mb-2.5">
          Are you a current student?
        </span>
        <div className="flex items-center gap-6 h-11">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${uid}-currentStudent`}
              value="yes"
              checked={state.currentStudent === "yes"}
              onChange={() => handleChange("currentStudent", "yes")}
              className="accent-cobalt-500"
            />
            <span className="text-sm text-slate-600">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${uid}-currentStudent`}
              value="no"
              checked={state.currentStudent === "no"}
              onChange={() => handleChange("currentStudent", "no")}
              className="accent-cobalt-500"
            />
            <span className="text-sm text-slate-600">No</span>
          </label>
        </div>
        {errors.currentStudent && (
          <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.currentStudent}</p>
        )}
      </div>
    </div>
  </div>
)}
```

Step 4 — About you (rename the current `{currentStep === 2 && ...}` guard to `=== 4`; markup otherwise unchanged — first/last name, email, where-from, phone, birthday, terms). Change only the opening guard:

```tsx
{currentStep === 4 && (
  <div>
    <h3 className="text-lg font-bold text-neutral-800 mb-4">Tell us about yourself.</h3>
    {/* ...existing name/email/whereFrom/phone/birthday/terms markup, unchanged... */}
  </div>
)}
```

- [ ] **Step 6: Update the `NavFooter` and reCAPTCHA note guards to step 4**

The `NavFooter` `isLastStep` prop and the reCAPTCHA note currently test `currentStep === 2`. Update both to `4`:

```tsx
<NavFooter
  showBack={currentStep > 1}
  onBack={handleBack}
  isLastStep={currentStep === 4}
  onContinue={handleNext}
/>

{currentStep === 4 && (
  <p className="text-xs text-slate-400 text-center mt-4">
    This site is protected by Google reCAPTCHA.
  </p>
)}
```

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `V1InquireSection.tsx`. (Pre-existing errors elsewhere, if any, are out of scope — confirm none are in this file.)

- [ ] **Step 8: Lint the file**

Run: `npx eslint "app/programs/[id]/_versions/v1/V1InquireSection.tsx"`
Expected: no errors.

- [ ] **Step 9: Stop for review — do NOT commit**

Per Global Constraints, do not run git. Report that Task 1 is complete and the file typechecks and lints, and hand back for review.

---

### Task 2: Verify the wizard end-to-end in the browser

**Files:** none (verification only).

- [ ] **Step 1: Build succeeds**

Run: `npm run build`
Expected: build completes with no errors related to `V1InquireSection`.

- [ ] **Step 2: Drive the flow in the running app**

Start the app (`npm run dev`) and open a program detail page on the v1 version with the inquire section (`/programs/<id>?v=v1`, scroll to `#inquire`). Confirm:
- Stepper shows 4 nodes: Timing → Your question → Background → About you (desktop); "Step 1 of 4" bar on mobile width.
- Step 1: cannot advance with nothing chosen (travel-window error shows); selecting a card advances; the date-range checkbox reveals Start/End month and is mutually exclusive with the cards.
- Step 2: cannot advance with an empty message; typing advances; character count updates live.
- Step 3: cannot advance without both education level and current-student; both chosen advances.
- Step 4: "Send inquiry" button present; submit blocked until name/email/country/birthday/terms valid; success state renders with personalized copy; "Send another inquiry" resets to step 1 with cleared fields.
- Back from any step clears errors (no stale error re-displays after Back→Next without a new attempt).

- [ ] **Step 3: Report results**

Summarize what was verified (with the screenshot saved under `docs/screenshots/` if one was taken) and hand back for review. Do not commit.

---

## Self-Review

**Spec coverage (Revision 3):**
- 4 steps with those labels → Task 1 Step 1 + Step 5. ✓
- Step content mapping (timing / message+char-count / education+student / personal) → Task 1 Step 5. ✓
- Per-step validation split → Task 1 Step 2. ✓
- `handleNext` 1→2→3→4, submit on step 4 → Task 1 Steps 3–4. ✓
- Errors cleared on every step change (2h) → preserved via unchanged `handleBack` + `setErrors({})` in `handleNext`; verified in Task 2 Step 2. ✓
- Success/reset unchanged → step-4 block + existing `handleReset` untouched. ✓
- Two-column timing+question grid removed → Task 1 Step 5 (steps 1 and 2 are single-column). ✓
- Only `V1InquireSection.tsx` changes → Global Constraints + Task 1 Files. ✓

**Placeholder scan:** No TBD/TODO; all code blocks are complete and copyable. ✓

**Type consistency:** `validateStep1..4` names match their use in `handleNext`/`handleSubmit`; `InquireErrors` fields (`travelWindow`, `startMonth`, `endMonth`, `message`, `educationLevel`, `currentStudent`, `firstName`, `lastName`, `email`, `whereFrom`, `birthday`, `terms`) all exist in the current type. `handleChange`, `handleSelectTravelWindow`, `handleToggleDateRange` signatures unchanged. ✓

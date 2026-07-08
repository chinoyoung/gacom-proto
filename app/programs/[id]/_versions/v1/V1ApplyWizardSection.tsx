"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Program } from "../../_components/types";
import {
  SELF_DESCRIPTIONS,
  INSPIRATIONS,
  START_PERIODS,
  VOLUNTEERED_BEFORE,
  TRIP_SUCCESS,
  AGE_GROUPS,
  MONTHS,
  DURATIONS,
  SummaryCard,
  TextInput,
} from "./V1ApplySection";
import type { Step4State, Step4Errors } from "./V1ApplySection";

// ─── Types ────────────────────────────────────────────────────────────────────

// All question answers live in this shape
type Step1State = {
  selfDescription: string;
  inspiration: string;
  startPeriod: string;
  startMonth: string;
  duration: string;
  volunteeredBefore: string;
  tripSuccess: string;
  ageGroup: string;
};

// ─── Question definitions ─────────────────────────────────────────────────────

interface CardQuestion {
  key: keyof Step1State;
  question: string;
  options: string[];
  /** grid class for the options — passed straight to className */
  gridCols: string;
}

const QUESTIONS: CardQuestion[] = [
  {
    key: "selfDescription",
    question: "How would you best describe yourself?",
    options: SELF_DESCRIPTIONS,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
  {
    key: "ageGroup",
    question: "Please select your age group:",
    options: AGE_GROUPS,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
  {
    key: "volunteeredBefore",
    question: "Have you volunteered before?",
    options: VOLUNTEERED_BEFORE,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
  {
    key: "inspiration",
    question: "What inspired you to choose this program?",
    options: INSPIRATIONS,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
  {
    key: "tripSuccess",
    question: "What would make this trip a success?",
    options: TRIP_SUCCESS,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
  {
    key: "startPeriod",
    question: "Select your preferred start period:",
    options: START_PERIODS,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
  {
    key: "startMonth",
    question: "Select your preferred start month:",
    options: MONTHS,
    gridCols: "grid-cols-2 sm:grid-cols-3",
  },
  {
    key: "duration",
    question: "How long would you like to volunteer?",
    options: DURATIONS,
    gridCols: "grid-cols-1 sm:grid-cols-2",
  },
];

// Steps: 1–8 = questions, 9 = details, 10 = done
const TOTAL_STEPS = 10;
const QUESTION_COUNT = QUESTIONS.length; // 8

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ currentStep }: { currentStep: number }) {
  const isDetails = currentStep === TOTAL_STEPS - 1;
  const isDone = currentStep === TOTAL_STEPS;

  let label: string;
  if (isDone) {
    label = "All done";
  } else if (isDetails) {
    label = "Your details";
  } else {
    label = `Question ${currentStep} of ${QUESTION_COUNT}`;
  }

  const pct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-cobalt-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs text-slate-400 tabular-nums">
          {currentStep} / {TOTAL_STEPS}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-fern-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

// ─── Card question step ───────────────────────────────────────────────────────
// Handles both former radio and former select questions as clickable cards.
// No Continue button — selecting an option auto-advances after 160 ms.

interface CardStepProps {
  question: CardQuestion;
  value: string;
  onSelect: (v: string) => void;
  onBack?: () => void;
}

function CardStep({ question, value, onSelect, onBack }: CardStepProps) {
  return (
    <div className="flex flex-1 flex-col">
      <fieldset className="flex flex-1 flex-col">
        <legend className="text-xl md:text-2xl font-bold text-neutral-800 mb-6">
          {question.question}
        </legend>
        <div className={`grid ${question.gridCols} gap-3 flex-1 auto-rows-fr`}>
          {question.options.map((opt) => {
            const isSelected = value === opt;
            const inputId = `wiz-${question.key}-${opt.replace(/\s+/g, "-")}`;
            return (
              <label
                key={opt}
                htmlFor={inputId}
                className={[
                  "flex items-center justify-center px-4 py-4 rounded-lg border text-sm cursor-pointer transition-colors text-center",
                  "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cobalt-500",
                  isSelected
                    ? "border-fern-500 bg-fern-500 text-white font-semibold"
                    : "border-slate-200 text-slate-600 hover:border-slate-300",
                ].join(" ")}
              >
                <input
                  type="radio"
                  id={inputId}
                  name={`wiz-${question.key}`}
                  value={opt}
                  checked={isSelected}
                  onChange={() => onSelect(opt)}
                  className="sr-only"
                />
                {opt}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Footer — always rendered (Back hidden on step 1) so the content height stays constant across steps */}
      <div className="flex mt-auto pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          aria-hidden={!onBack}
          tabIndex={onBack ? undefined : -1}
          className={[
            "border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500",
            onBack ? "" : "invisible pointer-events-none",
          ].join(" ")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ─── Details step ─────────────────────────────────────────────────────────────

interface DetailsStepProps {
  state: Step4State;
  errors: Step4Errors;
  onChange: (key: keyof Step4State, value: string | boolean) => void;
  onContinue: () => void;
  onBack: () => void;
}

function DetailsStep({ state, errors, onChange, onContinue, onBack }: DetailsStepProps) {
  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-neutral-800 mb-6">
        Almost there — just a few details.
      </h3>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            id="wiz-firstName"
            label="First name"
            value={state.firstName}
            error={errors.firstName}
            placeholder="Jane"
            onChange={(v) => onChange("firstName", v)}
          />
          <TextInput
            id="wiz-lastName"
            label="Last name"
            value={state.lastName}
            error={errors.lastName}
            placeholder="Doe"
            onChange={(v) => onChange("lastName", v)}
          />
        </div>

        <TextInput
          id="wiz-phone"
          label="Phone number"
          type="tel"
          value={state.phone}
          error={errors.phone}
          placeholder="+1 (555) 000-0000"
          onChange={(v) => onChange("phone", v)}
        />

        <TextInput
          id="wiz-email"
          label="Email"
          type="email"
          value={state.email}
          error={errors.email}
          placeholder="jane@example.com"
          onChange={(v) => onChange("email", v)}
        />

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.termsAccepted}
              onChange={(e) => onChange("termsAccepted", e.target.checked)}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? "wiz-terms-error" : undefined}
              className={[
                "mt-0.5 w-4 h-4 rounded border shrink-0 cursor-pointer accent-cobalt-500",
                errors.terms ? "border-roman-500" : "border-slate-300",
              ].join(" ")}
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              I accept the{" "}
              <a
                href="/terms"
                className="text-cobalt-600 underline underline-offset-2 hover:text-cobalt-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>
            </span>
          </label>
          {errors.terms && (
            <p id="wiz-terms-error" className="text-xs text-roman-600 mt-1 ml-7" role="alert">
              {errors.terms}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Done step ────────────────────────────────────────────────────────────────

interface DoneStepProps {
  firstName: string;
  program: Program;
  onReset: () => void;
}

function DoneStep({ firstName, program, onReset }: DoneStepProps) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-fern-500/10 flex items-center justify-center mb-6">
        <Check className="w-8 h-8 text-fern-600" strokeWidth={2.5} />
      </div>

      <h3 className="text-2xl font-bold text-neutral-800 mb-3">Application received</h3>

      <p className="text-base leading-relaxed text-slate-600 max-w-sm">
        Thanks,{" "}
        <span className="font-semibold text-neutral-800">{firstName || "traveler"}</span> —
        your application for{" "}
        <span className="font-semibold text-neutral-800">{program.title}</span> has been
        received. The{" "}
        <span className="font-semibold text-neutral-800">{program.provider}</span> team will
        be in touch shortly.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
      >
        Back to program details
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function V1ApplyWizardSection({ program }: { program: Program }) {
  const [currentStep, setCurrentStep] = useState(1);

  const [step1, setStep1] = useState<Step1State>({
    selfDescription: "",
    inspiration: "",
    startPeriod: "",
    startMonth: "",
    duration: "",
    volunteeredBefore: "",
    tripSuccess: "",
    ageGroup: "",
  });

  const [step4, setStep4] = useState<Step4State>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    termsAccepted: false,
  });

  const [step4Errors, setStep4Errors] = useState<Step4Errors>({});

  // ── Auto-advance: set answer then move after 160 ms ──────────────────────────

  function handleOptionSelect(key: keyof Step1State, value: string) {
    setStep1((prev) => ({ ...prev, [key]: value }));
    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, 160);
    // Clean up if the component unmounts before the timeout fires
    return timer;
  }

  // ── Details change ───────────────────────────────────────────────────────────

  function handleDetailsChange(key: keyof Step4State, value: string | boolean) {
    setStep4((prev) => ({ ...prev, [key]: value }));
    if (key === "termsAccepted") {
      setStep4Errors((prev) => ({ ...prev, terms: undefined }));
    } else if (key in step4Errors) {
      setStep4Errors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  // ── Validate details step ────────────────────────────────────────────────────

  function validateDetails(): boolean {
    const errors: Step4Errors = {};
    if (!step4.firstName.trim()) errors.firstName = "First name is required";
    if (!step4.lastName.trim()) errors.lastName = "Last name is required";
    if (!step4.phone.trim()) errors.phone = "Phone number is required";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step4.email.trim());
    if (!step4.email.trim() || !emailValid) errors.email = "Valid email is required";
    if (!step4.termsAccepted) errors.terms = "You must accept the terms";
    setStep4Errors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Continue handler (details step only) ─────────────────────────────────────

  function handleDetailsContinue() {
    if (validateDetails()) {
      setCurrentStep(TOTAL_STEPS);
    }
  }

  // ── Back handler ─────────────────────────────────────────────────────────────

  function handleBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  // ── Reset ────────────────────────────────────────────────────────────────────

  function handleReset() {
    const el = document.getElementById("apply-guided");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      setCurrentStep(1);
      setStep1({
        selfDescription: "",
        inspiration: "",
        startPeriod: "",
        startMonth: "",
        duration: "",
        volunteeredBefore: "",
        tripSuccess: "",
        ageGroup: "",
      });
      setStep4({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        termsAccepted: false,
      });
      setStep4Errors({});
    }, 500);
  }

  // ── Render step content ──────────────────────────────────────────────────────

  function renderStepContent() {
    if (currentStep <= QUESTION_COUNT) {
      const q = QUESTIONS[currentStep - 1];
      const isFirst = currentStep === 1;
      return (
        <CardStep
          question={q}
          value={step1[q.key]}
          onSelect={(v) => handleOptionSelect(q.key, v)}
          onBack={isFirst ? undefined : handleBack}
        />
      );
    }

    if (currentStep === TOTAL_STEPS - 1) {
      return (
        <DetailsStep
          state={step4}
          errors={step4Errors}
          onChange={handleDetailsChange}
          onContinue={handleDetailsContinue}
          onBack={handleBack}
        />
      );
    }

    // Done
    return (
      <DoneStep
        firstName={step4.firstName}
        program={program}
        onReset={handleReset}
      />
    );
  }

  const isDone = currentStep === TOTAL_STEPS;

  return (
    <section aria-labelledby="apply-guided-heading" id="apply-guided">
      {/* Heading block */}
      <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
        Apply Now
      </p>
      <h2
        id="apply-guided-heading"
        className="text-3xl font-bold tracking-tight text-neutral-800 mb-2"
      >
        Apply step by step
      </h2>
      <p className="text-base leading-relaxed text-slate-600 mb-10">
        Answer a few quick questions, one at a time.
      </p>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-start lg:items-stretch">
        {/* LEFT — Step card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col">
          {!isDone && <ProgressBar currentStep={currentStep} />}
          <div className="flex flex-1 flex-col">{renderStepContent()}</div>
        </div>

        {/* RIGHT — Program summary card (sticky on lg+, hidden on mobile) */}
        <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <SummaryCard program={program} />
        </div>
      </div>
    </section>
  );
}

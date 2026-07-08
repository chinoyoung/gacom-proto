"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Check, MapPin, CalendarDays, DollarSign, Building2 } from "lucide-react";
import type { Program } from "../../_components/types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Props {
  program: Program;
  variant?: "page" | "modal";
}

export interface Step1State {
  selfDescription: string;
  inspiration: string;
  startPeriod: string;
  startMonth: string;
  duration: string;
  volunteeredBefore: string;
  tripSuccess: string;
  ageGroup: string;
}

export interface Step4State {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
}

export interface Step4Errors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  terms?: string;
}

type Step1Errors = Partial<Record<keyof Step1State, string>>;

// ─── Constants ───────────────────────────────────────────────────────────────

const STEP_LABELS = ["About you", "Your goals", "Timing", "Your details", "Done"];

export const SELF_DESCRIPTIONS = ["Purpose Driven", "Curious Explorer", "People Person", "Growth Seeker"];
export const INSPIRATIONS = ["Meet People", "Build Skills", "Help Others", "See the World"];
export const START_PERIODS = ["Jan - Mar", "Apr - Jun", "Jul - Sep", "Oct - Dec"];
export const VOLUNTEERED_BEFORE = ["Yes, Locally", "Yes, Abroad", "Yes, Both", "First Time"];
export const TRIP_SUCCESS = ["Making Impact", "Career Growth", "Adventure & Fun", "New Friendships"];
export const AGE_GROUPS = ["Under 18", "18 - 35", "36 - 65", "66+"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DURATIONS = ["1–2 weeks", "3–4 weeks", "1–2 months", "3–6 months", "6+ months"];

// ─── Stepper ─────────────────────────────────────────────────────────────────

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <>
      {/* Desktop stepper — 5 labelled nodes */}
      <div className="hidden sm:flex items-center gap-0 mb-8" aria-label="Application steps">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isComplete = currentStep > step;
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors border-2",
                    isComplete
                      ? "bg-fern-500 border-fern-500 text-white"
                      : isCurrent
                        ? "bg-white border-fern-500 text-fern-600"
                        : "bg-slate-100 border-transparent text-slate-400",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    step
                  )}
                </span>
                <span
                  className={[
                    "text-xs font-semibold whitespace-nowrap",
                    isCurrent ? "text-fern-600" : isComplete ? "text-fern-700" : "text-slate-400",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={[
                    "flex-1 h-px mx-3 mb-5 transition-colors",
                    currentStep > step ? "bg-fern-500" : "bg-slate-200",
                  ].join(" ")}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile compact stepper */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-cobalt-600 uppercase tracking-wider">
            Step {currentStep} of {STEP_LABELS.length}
          </span>
          <span className="text-xs text-slate-500">{STEP_LABELS[currentStep - 1]}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cobalt-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
            aria-hidden
          />
        </div>
      </div>
    </>
  );
}

// ─── SelectableGroup ─────────────────────────────────────────────────────────

interface SelectableGroupProps {
  legend: string;
  name: string;
  idPrefix: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  gridCols?: string;
  error?: string;
}

function SelectableGroup({
  legend,
  name,
  idPrefix,
  options,
  value,
  onChange,
  gridCols = "grid-cols-2 sm:grid-cols-4",
  error,
}: SelectableGroupProps) {
  const groupName = `${idPrefix}-${name}`;
  return (
    <fieldset aria-invalid={!!error || undefined}>
      <legend className="text-sm font-semibold text-neutral-800 mb-2.5">{legend}</legend>
      <div className={`grid ${gridCols} gap-2`}>
        {options.map((opt) => {
          const isSelected = value === opt;
          const inputId = `${groupName}-${opt.replace(/\s+/g, "-")}`;
          return (
            <label
              key={opt}
              htmlFor={inputId}
              className={[
                "px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm text-center",
                "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cobalt-500",
                isSelected
                  ? "border-fern-500 bg-fern-500 text-white font-semibold"
                  : "border-slate-200 text-slate-600 hover:border-slate-300",
              ].join(" ")}
            >
              <input
                type="radio"
                id={inputId}
                name={groupName}
                value={opt}
                checked={isSelected}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-roman-600 mt-1.5" role="alert">{error}</p>
      )}
    </fieldset>
  );
}

// ─── NavFooter ───────────────────────────────────────────────────────────────

interface NavFooterProps {
  showBack: boolean;
  onBack?: () => void;
  onContinue: () => void;
}

function NavFooter({ showBack, onBack, onContinue }: NavFooterProps) {
  return (
    <div
      className={[
        "flex mt-8 pt-6 border-t border-slate-100",
        showBack ? "items-center justify-between" : "justify-end",
      ].join(" ")}
    >
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onContinue}
        className="bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
      >
        Continue
      </button>
    </div>
  );
}

// ─── SummaryCard ─────────────────────────────────────────────────────────────

export function SummaryCard({ program }: { program: Program }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 h-full flex flex-col">
      {/* Cover image */}
      {program.coverImage && (
        <div className="w-full flex-1 min-h-0 rounded-lg overflow-hidden mb-5 max-h-40">
          <img
            src={program.coverImage}
            alt={`${program.title} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title + provider */}
      <h3 className="text-base font-semibold text-neutral-800 leading-snug mb-1.5">
        {program.title}
      </h3>
      <div className="flex items-center gap-2 mb-5">
        {program.providerLogo && (
          <span className="shrink-0 w-8 h-8 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
            <img
              src={program.providerLogo}
              alt={`${program.provider} logo`}
              className="w-full h-full object-contain p-0.5"
            />
          </span>
        )}
        <p className="text-sm text-slate-500">Provided by: {program.provider}</p>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-cobalt-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-cobalt-500" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</p>
            <p className="text-sm font-bold text-neutral-800 mt-0.5 leading-snug">
              {program.city}, {program.country}
            </p>
          </div>
        </div>

        {program.cost && (
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-cobalt-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <DollarSign className="w-4 h-4 text-cobalt-500" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cost</p>
              <p className="text-sm font-bold text-neutral-800 mt-0.5 leading-snug">{program.cost}</p>
            </div>
          </div>
        )}

        {program.terms.length > 0 && (
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-cobalt-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarDays className="w-4 h-4 text-cobalt-500" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Availability</p>
              <p className="text-sm font-bold text-neutral-800 mt-0.5 leading-snug">
                {program.terms
                  .map((t) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
                  .join(", ")}
              </p>
            </div>
          </div>
        )}

        {program.hostInstitution && (
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-cobalt-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4 text-cobalt-500" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Host Institution</p>
              <p className="text-sm font-bold text-neutral-800 mt-0.5 leading-snug">
                {program.hostInstitution}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 1 — About you ───────────────────────────────────────────────────────

interface PreferenceStepProps {
  state: Step1State;
  errors: Step1Errors;
  onChange: (key: keyof Step1State, value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  hideNav?: boolean;
  idPrefix: string;
}

function StepAboutYou({ state, errors, onChange, onContinue, hideNav, idPrefix }: PreferenceStepProps) {
  return (
    <div>
      <div className="space-y-6">
        <SelectableGroup
          legend="How would you best describe yourself?"
          name="selfDescription"
          idPrefix={idPrefix}
          options={SELF_DESCRIPTIONS}
          value={state.selfDescription}
          onChange={(v) => onChange("selfDescription", v)}
          error={errors.selfDescription}
        />

        <SelectableGroup
          legend="Please select your age group:"
          name="ageGroup"
          idPrefix={idPrefix}
          options={AGE_GROUPS}
          value={state.ageGroup}
          onChange={(v) => onChange("ageGroup", v)}
          gridCols="grid-cols-2 sm:grid-cols-4"
          error={errors.ageGroup}
        />

        <SelectableGroup
          legend="Have you volunteered before?"
          name="volunteeredBefore"
          idPrefix={idPrefix}
          options={VOLUNTEERED_BEFORE}
          value={state.volunteeredBefore}
          onChange={(v) => onChange("volunteeredBefore", v)}
          error={errors.volunteeredBefore}
        />
      </div>

      {!hideNav && <NavFooter showBack={false} onContinue={onContinue} />}
    </div>
  );
}

// ─── Step 2 — Your goals ──────────────────────────────────────────────────────

function StepYourGoals({ state, errors, onChange, onContinue, onBack, hideNav, idPrefix }: PreferenceStepProps) {
  return (
    <div>
      <div className="space-y-6">
        <SelectableGroup
          legend="What inspired you to choose this program?"
          name="inspiration"
          idPrefix={idPrefix}
          options={INSPIRATIONS}
          value={state.inspiration}
          onChange={(v) => onChange("inspiration", v)}
          error={errors.inspiration}
        />

        <SelectableGroup
          legend="What would make this trip a success?"
          name="tripSuccess"
          idPrefix={idPrefix}
          options={TRIP_SUCCESS}
          value={state.tripSuccess}
          onChange={(v) => onChange("tripSuccess", v)}
          error={errors.tripSuccess}
        />
      </div>

      {!hideNav && <NavFooter showBack onBack={onBack} onContinue={onContinue} />}
    </div>
  );
}

// ─── Step 3 — Timing ─────────────────────────────────────────────────────────

function StepTiming({ state, errors, onChange, onContinue, onBack, hideNav, idPrefix }: PreferenceStepProps) {
  return (
    <div>
      <div className="space-y-6">
        <SelectableGroup
          legend="Select your preferred start period:"
          name="startPeriod"
          idPrefix={idPrefix}
          options={START_PERIODS}
          value={state.startPeriod}
          onChange={(v) => onChange("startPeriod", v)}
          error={errors.startPeriod}
        />

        {/* Start month — native select */}
        <div>
          <label
            htmlFor="startMonth"
            className="block text-sm font-semibold text-neutral-800 mb-2.5"
          >
            Select your preferred start month:
          </label>
          <select
            id="startMonth"
            value={state.startMonth}
            onChange={(e) => onChange("startMonth", e.target.value)}
            aria-invalid={!!errors.startMonth || undefined}
            className={[
              "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 appearance-none cursor-pointer",
              errors.startMonth ? "border-roman-500" : "border-slate-300",
            ].join(" ")}
          >
            <option value="" disabled>Select a month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.startMonth && (
            <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.startMonth}</p>
          )}
        </div>

        {/* Duration — native select */}
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-semibold text-neutral-800 mb-2.5"
          >
            How long would you like to volunteer?
          </label>
          <select
            id="duration"
            value={state.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            aria-invalid={!!errors.duration || undefined}
            className={[
              "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 appearance-none cursor-pointer",
              errors.duration ? "border-roman-500" : "border-slate-300",
            ].join(" ")}
          >
            <option value="" disabled>Select duration</option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.duration && (
            <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.duration}</p>
          )}
        </div>
      </div>

      {!hideNav && <NavFooter showBack onBack={onBack} onContinue={onContinue} />}
    </div>
  );
}

// ─── Step 4 — Your details ────────────────────────────────────────────────────

interface Step4Props {
  state: Step4State;
  errors: Step4Errors;
  onChange: (key: keyof Step4State, value: string | boolean) => void;
  onContinue: () => void;
  onBack: () => void;
  hideNav?: boolean;
  idPrefix: string;
}

export function TextInput({
  id,
  label,
  type = "text",
  value,
  error,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-800 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500",
          error ? "border-roman-500" : "border-slate-300",
        ].join(" ")}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-roman-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function StepYourDetails({ state, errors, onChange, onContinue, onBack, hideNav, idPrefix }: Step4Props) {
  const termsErrorId = `${idPrefix}-terms-error`;
  return (
    <div>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            id={`${idPrefix}-firstName`}
            label="First name"
            value={state.firstName}
            error={errors.firstName}
            placeholder="Jane"
            onChange={(v) => onChange("firstName", v)}
          />
          <TextInput
            id={`${idPrefix}-lastName`}
            label="Last name"
            value={state.lastName}
            error={errors.lastName}
            placeholder="Doe"
            onChange={(v) => onChange("lastName", v)}
          />
        </div>

        <TextInput
          id={`${idPrefix}-phone`}
          label="Phone number"
          type="tel"
          value={state.phone}
          error={errors.phone}
          placeholder="+1 (555) 000-0000"
          onChange={(v) => onChange("phone", v)}
        />

        <TextInput
          id={`${idPrefix}-email`}
          label="Email"
          type="email"
          value={state.email}
          error={errors.email}
          placeholder="jane@example.com"
          onChange={(v) => onChange("email", v)}
        />

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={state.termsAccepted}
              onChange={(e) => onChange("termsAccepted", e.target.checked)}
              aria-invalid={!!errors.terms}
              aria-describedby={errors.terms ? termsErrorId : undefined}
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
            <p id={termsErrorId} className="text-xs text-roman-600 mt-1 ml-7" role="alert">
              {errors.terms}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      {!hideNav && (
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
      )}
    </div>
  );
}

// ─── Step 5 — Confirmation ────────────────────────────────────────────────────

interface Step5Props {
  firstName: string;
  program: Program;
  onReset: () => void;
}

function StepDone({ firstName, program, onReset }: Step5Props) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-fern-500/10 flex items-center justify-center mb-6">
        <Check className="w-8 h-8 text-fern-600" strokeWidth={2.5} />
      </div>

      <h3 className="text-2xl font-bold text-neutral-800 mb-3">Application received</h3>

      <p className="text-base leading-relaxed text-slate-600 max-w-sm">
        Thanks, <span className="font-semibold text-neutral-800">{firstName || "traveler"}</span> —
        your application for{" "}
        <span className="font-semibold text-neutral-800">{program.title}</span> has been received.
        The <span className="font-semibold text-neutral-800">{program.provider}</span> team will
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function V1ApplySection({ program, variant = "page" }: Props) {
  const headingId = "apply-heading";
  const isModal = variant === "modal";
  const uid = useId();

  const fieldsRef = useRef<HTMLDivElement>(null);
  // In modal mode, reserve the tallest step's fields height so the footer stays put.
  const [fieldsMinHeight, setFieldsMinHeight] = useState(0);

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
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});

  function validatePreferenceStep(fields: (keyof Step1State)[]): boolean {
    const next: Step1Errors = { ...step1Errors };
    let ok = true;
    for (const f of fields) {
      if (!step1[f]) { next[f] = "Please select an option"; ok = false; }
      else { next[f] = undefined; }
    }
    setStep1Errors(next);
    return ok;
  }

  function handleStep1Change(key: keyof Step1State, value: string) {
    setStep1((prev) => ({ ...prev, [key]: value }));
    setStep1Errors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function handleStep4Change(key: keyof Step4State, value: string | boolean) {
    setStep4((prev) => ({ ...prev, [key]: value }));
    // Clear error on change — the terms checkbox field is "termsAccepted" in state
    // but the error is stored under "terms", so map it explicitly.
    if (key === "termsAccepted") {
      setStep4Errors((prev) => ({ ...prev, terms: undefined }));
    } else if (key in step4Errors) {
      setStep4Errors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validateStep4(): boolean {
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

  function handleStep4Continue() {
    if (validateStep4()) {
      setCurrentStep(5);
    }
  }

  function handleReset() {
    // Scroll to the section top and reset to step 1
    const el = document.getElementById("apply");
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
      setStep1Errors({});
    }, 500);
  }

  useEffect(() => {
    const el = fieldsRef.current;
    if (!el) return;
    const update = () => setFieldsMinHeight((prev) => Math.max(prev, el.offsetHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function modalContinue() {
    if (currentStep === 1) {
      if (validatePreferenceStep(["selfDescription", "ageGroup", "volunteeredBefore"])) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validatePreferenceStep(["inspiration", "tripSuccess"])) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validatePreferenceStep(["startPeriod", "startMonth", "duration"])) setCurrentStep(4);
    } else if (currentStep === 4) {
      handleStep4Continue();
    }
  }

  return (
    <section {...(isModal ? { "aria-label": "Start your application" } : { "aria-labelledby": headingId })}>
      {!isModal && (
        <>
          {/* Heading block */}
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
            Apply Now
          </p>
          <h2
            id={headingId}
            className="text-3xl font-bold tracking-tight text-neutral-800 mb-2"
          >
            Start your application
          </h2>
          <p className="text-base leading-relaxed text-slate-600 mb-10">
            Tell us a little about yourself and we&rsquo;ll connect you with the right program team.
          </p>
        </>
      )}

      {/* Two-column layout */}
      <div className={`grid grid-cols-1 ${isModal ? "" : "lg:grid-cols-[340px_1fr]"} gap-8 items-start`}>
        {/* Step card (right on lg) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 lg:order-2">
          <Stepper currentStep={currentStep} />

          <div style={fieldsMinHeight ? { minHeight: `${fieldsMinHeight}px` } : undefined}>
            <div ref={fieldsRef}>
              {currentStep === 1 && (
                <StepAboutYou
                  state={step1}
                  errors={step1Errors}
                  onChange={handleStep1Change}
                  hideNav
                  idPrefix={uid}
                  onContinue={() => {
                    if (validatePreferenceStep(["selfDescription", "ageGroup", "volunteeredBefore"])) setCurrentStep(2);
                  }}
                />
              )}

              {currentStep === 2 && (
                <StepYourGoals
                  state={step1}
                  errors={step1Errors}
                  onChange={handleStep1Change}
                  hideNav
                  idPrefix={uid}
                  onContinue={() => {
                    if (validatePreferenceStep(["inspiration", "tripSuccess"])) setCurrentStep(3);
                  }}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <StepTiming
                  state={step1}
                  errors={step1Errors}
                  onChange={handleStep1Change}
                  hideNav
                  idPrefix={uid}
                  onContinue={() => {
                    if (validatePreferenceStep(["startPeriod", "startMonth", "duration"])) setCurrentStep(4);
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <StepYourDetails
                  state={step4}
                  errors={step4Errors}
                  onChange={handleStep4Change}
                  hideNav
                  idPrefix={uid}
                  onContinue={handleStep4Continue}
                  onBack={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 5 && (
                <StepDone
                  firstName={step4.firstName}
                  program={program}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>

          {currentStep < 5 && (
            <NavFooter
              showBack={currentStep > 1}
              onBack={() => setCurrentStep((s) => s - 1)}
              onContinue={modalContinue}
            />
          )}
        </div>

        {!isModal && (
          <div className="hidden lg:block lg:self-stretch order-last lg:order-1">
            {/* Program summary card — stretches to match the form height */}
            <SummaryCard program={program} />
          </div>
        )}
      </div>
    </section>
  );
}

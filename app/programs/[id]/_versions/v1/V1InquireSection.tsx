"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Program } from "../../_components/types";
import { TextInput, MONTHS } from "./V1ApplySection";

// ─── Date helpers ───────────────────────────────────────────────────────────

function parseISODate(s: string): Date {
  return new Date(s + "T00:00:00");
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatBirthday(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface InquireState {
  travelWindow: string;
  wantsSpecificMonth: boolean;
  startMonth: string;
  endMonth: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  termsAccepted: boolean;
  whereFrom: string;
  birthday: string; // ISO YYYY-MM-DD
  educationLevel: string;
  currentStudent: string; // "" | "yes" | "no"
}

type InquireErrors = Partial<Record<keyof InquireState, string>> & { terms?: string; birthday?: string };

const EMPTY_STATE: InquireState = {
  travelWindow: "",
  wantsSpecificMonth: false,
  startMonth: "",
  endMonth: "",
  message: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  termsAccepted: false,
  whereFrom: "",
  birthday: "",
  educationLevel: "",
  currentStudent: "",
};

const TRAVEL_WINDOWS = [
  "In the next 6 months",
  "In the next 6-12 months",
  "In the next 12-24 months",
  "In more than 2 years",
];

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
  "Netherlands", "Sweden", "Norway", "Denmark", "Ireland", "New Zealand", "Japan",
  "South Korea", "Brazil", "Mexico", "Argentina", "Colombia", "India", "Singapore",
  "Spain", "Italy", "Portugal", "Philippines", "South Africa", "Other",
];

const EDUCATION_LEVELS = [
  "High school or less",
  "Some college",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree or higher",
];

const STEP_LABELS = ["Timing", "Your question", "Background", "About you"];

// ─── Stepper (local 4-step version, mirrors V1ApplySection's Stepper) ───────

function InquireStepper({ currentStep }: { currentStep: number }) {
  return (
    <>
      <div className="hidden sm:flex items-center gap-0 mb-8" aria-label="Inquiry steps">
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
                  {isComplete ? <Check className="w-4 h-4" strokeWidth={3} /> : step}
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

// ─── NavFooter ───────────────────────────────────────────────────────────────

function NavFooter({
  showBack,
  onBack,
  isLastStep,
  onContinue,
}: {
  showBack: boolean;
  onBack?: () => void;
  isLastStep: boolean;
  onContinue?: () => void;
}) {
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
      {isLastStep ? (
        <button
          key="submit"
          type="submit"
          className="bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Send inquiry
        </button>
      ) : (
        <button
          key="next"
          type="button"
          onClick={onContinue}
          className="bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Next
        </button>
      )}
    </div>
  );
}

// ─── BirthdayPicker ──────────────────────────────────────────────────────────

function BirthdayPicker({
  value,
  error,
  onChange,
}: {
  value: string; // ISO YYYY-MM-DD, or "" if unset
  error?: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const selectedDate = value ? parseISODate(value) : undefined;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={!!error}
        className={[
          "h-11 w-full rounded-lg border bg-white px-3 text-sm text-left flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500",
          error ? "border-roman-500" : "border-slate-300",
        ].join(" ")}
      >
        <CalendarIcon className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
        <span className={selectedDate ? "text-neutral-800" : "text-slate-400"}>
          {selectedDate ? formatBirthday(selectedDate) : "Select your birthday"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose your birthday"
          className="esim-datepicker-popover absolute left-0 top-full mt-2 z-30 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-max max-w-[calc(100vw-2rem)]"
        >
          <DayPicker
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(1940, 0)}
            endMonth={new Date(2013, 11)}
            defaultMonth={selectedDate ?? new Date(2000, 0)}
            selected={selectedDate}
            onSelect={(d) => {
              if (d) {
                onChange(toISODate(d));
                setOpen(false);
              }
            }}
            showOutsideDays
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function V1InquireSection({ program }: { program: Program }) {
  const headingId = "inquire-heading";
  const uid = useId();

  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<InquireState>(EMPTY_STATE);
  const [errors, setErrors] = useState<InquireErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(key: keyof InquireState, value: string | boolean) {
    setState((prev) => ({ ...prev, [key]: value }));
    if (key === "termsAccepted") {
      setErrors((prev) => (prev.terms ? { ...prev, terms: undefined } : prev));
    } else if (key === "birthday") {
      setErrors((prev) => (prev.birthday ? { ...prev, birthday: undefined } : prev));
    } else if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  // Selecting a travel-window card and the "specific date range" checkbox are
  // mutually exclusive — choosing one clears the other.
  function handleSelectTravelWindow(opt: string) {
    setState((prev) => ({
      ...prev,
      travelWindow: opt,
      wantsSpecificMonth: false,
      startMonth: "",
      endMonth: "",
    }));
    setErrors((prev) => ({ ...prev, travelWindow: undefined, startMonth: undefined, endMonth: undefined }));
  }

  function handleToggleDateRange(checked: boolean) {
    setState((prev) => ({
      ...prev,
      wantsSpecificMonth: checked,
      travelWindow: checked ? "" : prev.travelWindow,
    }));
    if (checked) {
      setErrors((prev) => ({ ...prev, travelWindow: undefined }));
    }
  }

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

  function handleNext() {
    const validators = [validateStep1, validateStep2, validateStep3];
    const validate = validators[currentStep - 1];
    if (validate && validate()) {
      setErrors({});
      setCurrentStep((s) => Math.min(4, s + 1));
    }
  }

  function handleBack() {
    setErrors({});
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (currentStep !== 4) return;
    if (validateStep4()) setSubmitted(true);
  }

  function handleReset() {
    setState(EMPTY_STATE);
    setErrors({});
    setCurrentStep(1);
    setSubmitted(false);
  }

  const messageId = `${uid}-message`;
  const termsErrorId = `${uid}-terms-error`;
  const startMonthId = `${uid}-startMonth`;
  const endMonthId = `${uid}-endMonth`;
  const whereFromId = `${uid}-whereFrom`;
  const educationId = `${uid}-education`;

  return (
    <section aria-labelledby={headingId}>
      <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">Inquire</p>
      <h2 id={headingId} className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">
        Inquire about this program
      </h2>
      <p className="text-base leading-relaxed text-slate-600 mb-10">
        Have a question? Send us a message and the program team will get back to you.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-8 px-4">
              <div className="w-16 h-16 rounded-full bg-fern-500/10 flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-fern-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-3">Inquiry sent</h3>
              <p className="text-base leading-relaxed text-slate-600 max-w-sm">
                Thanks, <span className="font-semibold text-neutral-800">{state.firstName || "there"}</span> —{" "}
                <span className="font-semibold text-neutral-800">{program.provider}</span> will get back
                to you shortly about{" "}
                <span className="font-semibold text-neutral-800">{program.title}</span>.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-8 border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <InquireStepper currentStep={currentStep} />

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
                              "flex items-center justify-center px-3 py-5 min-h-[64px] rounded-lg border cursor-pointer transition-colors text-sm text-center",
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

              {currentStep === 4 && (
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Tell us about yourself.</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <TextInput
                        id={`${uid}-firstName`}
                        label="First name"
                        value={state.firstName}
                        error={errors.firstName}
                        placeholder="Jane"
                        onChange={(v) => handleChange("firstName", v)}
                      />
                      <TextInput
                        id={`${uid}-lastName`}
                        label="Last name"
                        value={state.lastName}
                        error={errors.lastName}
                        placeholder="Doe"
                        onChange={(v) => handleChange("lastName", v)}
                      />
                    </div>

                    <TextInput
                      id={`${uid}-email`}
                      label="Email"
                      type="email"
                      value={state.email}
                      error={errors.email}
                      placeholder="jane@example.com"
                      onChange={(v) => handleChange("email", v)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor={whereFromId} className="block text-sm font-semibold text-neutral-800 mb-2.5">
                          Where are you from?
                        </label>
                        <select
                          id={whereFromId}
                          value={state.whereFrom}
                          onChange={(e) => handleChange("whereFrom", e.target.value)}
                          aria-invalid={!!errors.whereFrom}
                          className={[
                            "h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 appearance-none cursor-pointer",
                            errors.whereFrom ? "border-roman-500" : "border-slate-300",
                          ].join(" ")}
                        >
                          <option value="" disabled>Choose one</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {errors.whereFrom && (
                          <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.whereFrom}</p>
                        )}
                      </div>

                      <TextInput
                        id={`${uid}-phone`}
                        label="Phone number"
                        type="tel"
                        value={state.phone}
                        placeholder="+1 (555) 000-0000"
                        onChange={(v) => handleChange("phone", v)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-800 mb-2.5">
                        When is your birthday?
                      </label>
                      <BirthdayPicker
                        value={state.birthday}
                        error={errors.birthday}
                        onChange={(v) => handleChange("birthday", v)}
                      />
                      {errors.birthday && (
                        <p className="text-xs text-roman-600 mt-1.5" role="alert">{errors.birthday}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={state.termsAccepted}
                          onChange={(e) => handleChange("termsAccepted", e.target.checked)}
                          aria-invalid={!!errors.terms}
                          aria-describedby={errors.terms ? termsErrorId : undefined}
                          className={[
                            "mt-0.5 w-4 h-4 rounded border shrink-0 cursor-pointer accent-cobalt-500",
                            errors.terms ? "border-roman-500" : "border-slate-300",
                          ].join(" ")}
                        />
                        <span className="text-sm text-slate-600 leading-relaxed">
                          By submitting this form, I agree to GoAbroad&rsquo;s{" "}
                          <a
                            href="/terms"
                            className="text-cobalt-600 underline underline-offset-2 hover:text-cobalt-700 font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Terms of Service
                          </a>{" "}
                          and acknowledge GoAbroad&rsquo;s{" "}
                          <a
                            href="/privacy"
                            className="text-cobalt-600 underline underline-offset-2 hover:text-cobalt-700 font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy and Cookie Policy
                          </a>
                          . I understand and consent to receiving marketing messages from GoAbroad and its third
                          party partners/affiliates as a result of sharing my personal data through this form.
                        </span>
                      </label>
                      {errors.terms && (
                        <p id={termsErrorId} className="text-xs text-roman-600 mt-1 ml-7" role="alert">
                          {errors.terms}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
            </form>
          )}
      </div>
    </section>
  );
}

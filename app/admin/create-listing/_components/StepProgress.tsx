"use client";

interface StepProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  formData?: any;
}

const STEPS = [
  { number: 1, label: "Basic Info" },
  { number: 2, label: "Location & Terms" },
  { number: 3, label: "Eligibility" },
  { number: 4, label: "Program Details" },
  { number: 5, label: "Subjects & Features" },
  { number: 6, label: "Pricing & Contact" },
  { number: 7, label: "Media" },
  { number: 8, label: "Review & Publish" },
];

export default function StepProgress({ currentStep, onStepClick, formData }: StepProgressProps) {
  const isStepFulfilled = (stepNumber: number) => {
    if (!formData) return false;
    switch (stepNumber) {
      case 1:
        return !!(formData.title && formData.provider);
      case 2:
        return !!(formData.city && formData.country && formData.terms?.length > 0);
      case 3:
        return !!(formData.educationLevels?.length > 0 && formData.eligibleNationalities?.length > 0);
      case 4:
        return !!formData.description;
      case 5:
        return !!(formData.subjectAreas?.length > 0);
      case 6:
        return !!(formData.cost || formData.applyUrl);
      case 7:
        return !!formData.coverImage;
      case 8:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isFulfilled = isStepFulfilled(step.number);
          const isClickable = onStepClick && (isCompleted || isFulfilled || step.number === 1);

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Circle + label */}
              <button
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={[
                  "flex flex-col items-center focus:outline-none transition-opacity",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors shadow-sm",
                    isCompleted
                      ? "border-cobalt-500 bg-cobalt-500 text-white"
                      : isActive
                        ? "border-cobalt-500 bg-white text-cobalt-500"
                        : isFulfilled
                          ? "border-green-500 bg-white text-green-500"
                          : "border-gray-300 bg-white text-gray-400",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={[
                    "mt-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap",
                    isActive || isCompleted ? "text-cobalt-500" : isFulfilled ? "text-green-600" : "text-gray-400",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={[
                    "h-0.5 flex-1 mx-2 mt-[-16px] transition-colors",
                    isCompleted ? "bg-cobalt-500" : isStepFulfilled(step.number) ? "bg-green-500" : "bg-gray-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: compact progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-cobalt-500 tracking-tight">
            Step {currentStep}: {STEPS[currentStep - 1].label}
          </span>
          <span className="text-sm font-bold text-gray-400">
            {Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-200">
          <div
            className="h-full bg-cobalt-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

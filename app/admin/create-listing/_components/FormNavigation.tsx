"use client";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isSubmitting: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
  isSubmitting,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isSecondToLast = currentStep === totalSteps - 1;

  if (isLastStep) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className={[
          "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          isFirstStep
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
        ].join(" ")}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      <div className="flex items-center gap-3">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Draft
          </button>
        )}

        {onPublish && (
          <button
            type="button"
            onClick={onPublish}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Publish
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-cobalt-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-cobalt-600 focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              {isSecondToLast ? "Review" : "Next"}
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

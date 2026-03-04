"use client";
import AIGenerateButton from "./AIGenerateButton";

interface Step2Data {
  city: string;
  country: string;
  terms: string[];
  duration: string;
}

interface Step2LocationProps {
  data: Step2Data;
  onChange: (data: Partial<Step2Data>) => void;
  formData: any;
}

const TERM_OPTIONS = [
  { value: "fall", label: "Fall" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "academic_year", label: "Academic Year" },
  { value: "year_round", label: "Year-Round" },
];

export default function Step2Location({ data, onChange, formData }: Step2LocationProps) {
  const toggleTerm = (value: string) => {
    const updated = data.terms.includes(value)
      ? data.terms.filter((t) => t !== value)
      : [...data.terms, value];
    onChange({ terms: updated });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Location &amp; Terms</h2>
        <p className="mt-1 text-sm text-gray-500">
          Where is the program located and when does it run?
        </p>
      </div>

      <AIGenerateButton
        step={2}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-4">
        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            type="text"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g. Rome"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country <span className="text-red-500">*</span>
          </label>
          <input
            id="country"
            type="text"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="e.g. Italy"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            required
          />
        </div>

        {/* Terms Available */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">
              Terms Available <span className="text-red-500">*</span>
            </legend>
            <p className="mt-0.5 text-xs text-gray-500">
              Select all terms when the program is offered.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TERM_OPTIONS.map((option) => {
                const isChecked = data.terms.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={[
                      "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors",
                      isChecked
                        ? "border-cobalt-500 bg-cobalt-50/10 text-cobalt-600"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTerm(option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-cobalt-500 focus:ring-cobalt-500"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Duration */}
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="duration"
            type="text"
            value={data.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
            placeholder="e.g. 1 semester, 4 months, 6 weeks"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>
      </div>
    </div>
  );
}

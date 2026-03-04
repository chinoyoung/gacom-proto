"use client";

import TagInput from "./TagInput";
import AIGenerateButton from "./AIGenerateButton";

interface Step3Data {
  educationLevels: string[];
  eligibleNationalities: string[];
  ageRequirement: string;
}

interface Step3EligibilityProps {
  data: Step3Data;
  onChange: (data: Partial<Step3Data>) => void;
  formData: any;
}

const EDUCATION_LEVELS = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
];

export default function Step3Eligibility({ data, onChange, formData }: Step3EligibilityProps) {
  const toggleLevel = (value: string) => {
    const updated = data.educationLevels.includes(value)
      ? data.educationLevels.filter((l) => l !== value)
      : [...data.educationLevels, value];
    onChange({ educationLevels: updated });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Eligibility</h2>
        <p className="mt-1 text-sm text-gray-500">
          Who is this program designed for?
        </p>
      </div>

      <AIGenerateButton
        step={3}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-4">
        {/* Education Levels */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">
              Education Levels
            </legend>
            <p className="mt-0.5 text-xs text-gray-500">
              Select all student levels eligible to apply.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EDUCATION_LEVELS.map((level) => {
                const isChecked = data.educationLevels.includes(level.value);
                return (
                  <label
                    key={level.value}
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
                      onChange={() => toggleLevel(level.value)}
                      className="h-4 w-4 rounded border-gray-300 text-cobalt-500 focus:ring-cobalt-500"
                    />
                    <span className="font-medium">{level.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Eligible Nationalities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Eligible Nationalities{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            Leave empty if open to all nationalities.
          </p>
          <div className="mt-1">
            <TagInput
              tags={data.eligibleNationalities}
              onChange={(tags) => onChange({ eligibleNationalities: tags })}
              placeholder="Type a nationality and press Enter (e.g. US, UK, Canadian)"
            />
          </div>
        </div>

        {/* Age Requirement */}
        <div>
          <label
            htmlFor="ageRequirement"
            className="block text-sm font-medium text-gray-700"
          >
            Age Requirement{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="ageRequirement"
            type="text"
            value={data.ageRequirement}
            onChange={(e) => onChange({ ageRequirement: e.target.value })}
            placeholder="e.g. 18+ years old, 17-30"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>
      </div>
    </div>
  );
}

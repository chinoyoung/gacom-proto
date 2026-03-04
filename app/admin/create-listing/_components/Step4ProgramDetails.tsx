"use client";

import TagInput from "./TagInput";
import AIGenerateButton from "./AIGenerateButton";

interface Step4Data {
  description: string;
  whatsIncluded: string[];
}

interface Step4ProgramDetailsProps {
  data: Step4Data;
  onChange: (data: Partial<Step4Data>) => void;
  formData: any;
}

export default function Step4ProgramDetails({ data, onChange, formData }: Step4ProgramDetailsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Program Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Describe the program and what students will experience.
        </p>
      </div>

      <AIGenerateButton
        step={4}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-4">
        {/* Program Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Program Description <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            Provide a detailed overview of the program, its goals, and what makes it unique.
          </p>
          <textarea
            id="description"
            rows={6}
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe the program in detail: academic content, cultural experiences, living arrangements, activities, and what students can expect..."
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500 resize-y"
            required
          />
          <p className="mt-1 text-xs text-gray-400 text-right">
            {data.description.length} characters
          </p>
        </div>

        {/* What's Included */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            What&apos;s Included{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            List items included in the program fee (e.g. housing, meals, excursions).
          </p>
          <div className="mt-1">
            <TagInput
              tags={data.whatsIncluded}
              onChange={(tags) => onChange({ whatsIncluded: tags })}
              placeholder="e.g. Housing, Airport pickup, Cultural excursions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

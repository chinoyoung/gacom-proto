"use client";

import TagInput from "./TagInput";
import AIGenerateButton from "./AIGenerateButton";

interface Step5Data {
  subjectAreas: string[];
  highlights: string[];
}

interface Step5SubjectsFeaturesProps {
  data: Step5Data;
  onChange: (data: Partial<Step5Data>) => void;
  formData: any;
}

const SUBJECT_SUGGESTIONS = [
  "Arts",
  "Business",
  "Engineering",
  "History",
  "Humanities",
  "International Business",
  "Italian Language",
  "Political Science",
  "Social Work",
];

export default function Step5SubjectsFeatures({ data, onChange, formData }: Step5SubjectsFeaturesProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Subjects &amp; Features</h2>
        <p className="mt-1 text-sm text-gray-500">
          What academic subjects are covered and what makes this program stand out?
        </p>
      </div>

      <AIGenerateButton
        step={5}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-4">
        {/* Subject Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Areas{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            Add the academic disciplines this program covers. Select from suggestions or type your own.
          </p>
          <div className="mt-1">
            <TagInput
              tags={data.subjectAreas}
              onChange={(tags) => onChange({ subjectAreas: tags })}
              placeholder="Type or select a subject area..."
              suggestions={SUBJECT_SUGGESTIONS}
            />
          </div>
          {/* Quick-add suggestion pills */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUBJECT_SUGGESTIONS.filter((s) => !data.subjectAreas.includes(s)).map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    onChange({ subjectAreas: [...data.subjectAreas, suggestion] })
                  }
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:border-cobalt-300 hover:bg-cobalt-50/10 hover:text-cobalt-600 transition-colors"
                >
                  + {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        {/* Program Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Program Highlights{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            Key bullet points that make this program appealing. These will be featured prominently.
          </p>
          <div className="mt-1">
            <TagInput
              tags={data.highlights}
              onChange={(tags) => onChange({ highlights: tags })}
              placeholder="e.g. Small class sizes, Weekly field trips..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

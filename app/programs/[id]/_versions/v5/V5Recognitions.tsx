import { Award } from "lucide-react";

const PLACEHOLDER_RECOGNITIONS = [
  { name: "Forbes Best Study Abroad", year: "2024" },
  { name: "GoAbroad Innovation Award", year: "2023" },
  { name: "ISEP Accredited Provider", year: "Since 2018" },
];

export default function V5Recognitions() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by this provider
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLACEHOLDER_RECOGNITIONS.map((r) => (
          <div
            key={r.name}
            className="bg-white border border-slate-200 rounded-md p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-md bg-sun-500/10 text-sun-500 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-bold text-slate-900 leading-snug">{r.name}</span>
              <span className="text-xs text-slate-500">{r.year}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 italic mt-4">
        Sample recognitions shown — provider-specific data coming soon.
      </p>
    </div>
  );
}

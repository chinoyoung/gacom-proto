"use client";

import { Award } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderRecognitions({ provider }: { provider: Provider }) {
  const awards = provider.awards ?? [];
  if (awards.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by {provider.name}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {awards.map((a, i) => (
          <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4">
            <div className="w-9 h-9 rounded-md bg-sun-500/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-sun-500" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{a.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {a.result}{a.year ? ` · ${a.year}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

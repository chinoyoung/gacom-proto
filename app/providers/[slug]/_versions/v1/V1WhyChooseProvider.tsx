"use client";

import { CheckCircle2 } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1WhyChooseProvider({ provider }: { provider: Provider }) {
  const points = provider.whyChoosePoints ?? [];
  if (points.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Why choose {provider.name}</h2>
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-fern-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[15px] text-slate-700 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

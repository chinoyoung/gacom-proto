import { CheckCircle2 } from "lucide-react";
import type { Program } from "../../_components/types";

export default function V5Highlights({ program }: { program: Program }) {
  if (!program.highlights.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Program Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {program.highlights.map((highlight, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-md p-4">
            <CheckCircle2 className="text-fern-500 w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm text-slate-700">{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

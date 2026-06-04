import { Trophy, Award, Sprout, ShieldCheck, BadgeCheck, Landmark, type LucideIcon } from "lucide-react";
import type { ProviderAward } from "../../_components/types";

const ICON_CYCLE: LucideIcon[] = [Trophy, Award, Sprout, ShieldCheck, BadgeCheck, Landmark];

function resultStyle(result: string): string {
  const r = result.toLowerCase();
  if (r === "winner") return "bg-fern-500/10 text-fern-700";
  if (r === "finalist") return "bg-slate-100 text-slate-600";
  if (r === "notable mention") return "bg-sun-500/10 text-sun-700";
  return "bg-cobalt-500/10 text-cobalt-600"; // member / accredited / other
}

export default function V1ProviderAwards({ awards }: { awards: ProviderAward[] }) {
  if (awards.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Awards & Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by this provider
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {awards.map((award, i) => {
          const Icon = ICON_CYCLE[i % ICON_CYCLE.length];
          return (
            <div
              key={`${award.name}-${i}`}
              className="aspect-square bg-white border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="w-11 h-11 rounded-full bg-sun-500/10 text-sun-500 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {award.name}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${resultStyle(award.result)}`}
              >
                {award.result}
              </span>
              {award.year && (
                <span className="text-[11px] text-slate-500">{award.year}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

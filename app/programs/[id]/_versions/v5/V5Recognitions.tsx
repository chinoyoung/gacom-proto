import {
  Trophy,
  Award,
  Sprout,
  ShieldCheck,
  BadgeCheck,
  Landmark,
  type LucideIcon,
} from "lucide-react";

type Result = "Winner" | "Finalist" | "Notable Mention" | "Member" | "Accredited";

const RESULT_STYLES: Record<Result, string> = {
  Winner: "bg-fern-500/10 text-fern-700",
  Finalist: "bg-slate-100 text-slate-600",
  "Notable Mention": "bg-sun-500/10 text-sun-700",
  Member: "bg-cobalt-500/10 text-cobalt-600",
  Accredited: "bg-cobalt-500/10 text-cobalt-600",
};

const RECOGNITIONS: {
  name: string;
  result: Result;
  year?: string;
  icon: LucideIcon;
}[] = [
  { name: "Top Rated Provider", result: "Notable Mention", year: "2025", icon: Trophy },
  { name: "Innovative Student Video", result: "Winner", year: "2025", icon: Award },
  { name: "Innovation in Sustainability", result: "Winner", year: "2024", icon: Sprout },
  { name: "ISEP Accredited Provider", result: "Accredited", year: "Since 2018", icon: ShieldCheck },
  { name: "NAFSA", result: "Member", year: "Since 2016", icon: BadgeCheck },
  { name: "The Forum on Education Abroad", result: "Member", icon: Landmark },
];

export default function V5Recognitions() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by this provider
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {RECOGNITIONS.map(({ name, result, year, icon: Icon }) => (
          <div
            key={name}
            className="aspect-square bg-white border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center text-center gap-2"
          >
            <div className="w-11 h-11 rounded-full bg-sun-500/10 text-sun-500 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
              {name}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${RESULT_STYLES[result]}`}
            >
              {result}
            </span>
            {year && <span className="text-[11px] text-slate-500">{year}</span>}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 italic mt-4">
        Sample recognitions shown — provider-specific data coming soon.
      </p>
    </div>
  );
}

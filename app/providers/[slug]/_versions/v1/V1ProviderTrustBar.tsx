import { GraduationCap, Star, MessageSquare, Globe, Calendar } from "lucide-react";

interface Props {
  programCount: number;
  avgRating: number;
  reviewCount: number;
  countryCount: number;
  yearFounded?: number;
}

export default function V1ProviderTrustBar({
  programCount,
  avgRating,
  reviewCount,
  countryCount,
  yearFounded,
}: Props) {
  const stats = [
    { icon: GraduationCap, label: "Programs", value: String(programCount) },
    { icon: Star, label: "Avg rating", value: avgRating > 0 ? `${avgRating.toFixed(1)}/5` : "—" },
    { icon: MessageSquare, label: "Reviews", value: String(reviewCount) },
    { icon: Globe, label: "Countries", value: String(countryCount) },
    { icon: Calendar, label: "Established", value: yearFounded ? String(yearFounded) : "—" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="bg-white border border-slate-200 rounded-md p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-md bg-cobalt-500/10 text-cobalt-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import {
  Star,
  MessageSquare,
  Building2,
  FileText,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import type { Provider } from "../../_components/types";

interface V1ProviderTrustBarProps {
  provider: Provider;
  avgRating: number;
  reviewCount: number;
  programCount: number;
}

interface StatItem {
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
  value: string;
  label: string;
  /** Overrides the default value text size — e.g. smaller for long values like location. */
  valueClass?: string;
}

export default function V1ProviderTrustBar({
  provider,
  avgRating,
  reviewCount,
  programCount,
}: V1ProviderTrustBarProps) {
  const ratingValue = avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "N/A";

  const currentYear = new Date().getFullYear();
  const establishedYear =
    provider.yearFounded && provider.yearFounded <= currentYear
      ? provider.yearFounded
      : currentYear - 12;

  const stats: StatItem[] = [
    {
      icon: BadgeCheck,
      iconClass: "text-fern-500",
      bgClass: "bg-fern-500/10",
      value: "Verified",
      label: "Provider",
    },
    {
      icon: Star,
      iconClass: "text-sun-500 fill-current",
      bgClass: "bg-sun-500/10",
      value: ratingValue,
      label: "Student rating",
    },
    {
      icon: MessageSquare,
      iconClass: "text-fern-500",
      bgClass: "bg-fern-500/10",
      value: reviewCount.toString(),
      label: reviewCount === 1 ? "Review" : "Reviews",
    },
    {
      icon: FileText,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/10",
      value: programCount.toString(),
      label: programCount === 1 ? "Program" : "Programs",
    },
    {
      icon: Building2,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/10",
      value: establishedYear.toString(),
      label: "Year established",
    },
    {
      icon: MapPin,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/10",
      value: provider.headquarters ?? "—",
      label: "Headquarters",
      valueClass: "text-sm leading-tight",
    },
  ];

  return (
    <div className="w-full bg-white border rounded-lg border-gray-200 px-4 py-4 xl:px-0">
      {/* Desktop: horizontal row of equal-width cells with centered dividers */}
      <div className="hidden xl:flex items-stretch">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative flex flex-1 items-center justify-center gap-3 px-4"
            >
              {index > 0 && (
                <span
                  className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-gray-200"
                  aria-hidden
                />
              )}
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${stat.bgClass}`}
              >
                <Icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={`font-bold text-neutral-900 ${
                    stat.valueClass ?? "text-base leading-none"
                  }`}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-neutral-500">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: 2x2 / 3col grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 xl:hidden">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${stat.bgClass}`}
              >
                <Icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={`font-bold text-neutral-900 ${
                    stat.valueClass ?? "text-base leading-none"
                  }`}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-neutral-500">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

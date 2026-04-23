"use client";

import {
  DollarSign,
  Star,
  MessageSquare,
  Award,
  FileText,
  BadgeCheck,
} from "lucide-react";
import type { Program } from "../../_components/types";

interface TrustBarProps {
  program: Program;
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
}

export default function TrustBar({
  program,
  avgRating,
  reviewCount,
  programCount,
}: TrustBarProps) {
  const ratingValue = avgRating > 0 ? `${avgRating.toFixed(1)} / 10` : "N/A";
  const priceValue =
    program.startingPrice != null
      ? `$${program.startingPrice.toLocaleString()}`
      : program.cost ?? "Contact";

  const currentYear = new Date().getFullYear();
  const years =
    program.yearFounded && program.yearFounded <= currentYear
      ? currentYear - program.yearFounded
      : 12;

  const stats: StatItem[] = [
    {
      icon: DollarSign,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/10",
      value: priceValue,
      label: "Starting price",
    },
    {
      icon: BadgeCheck,
      iconClass: "text-fern-500",
      bgClass: "bg-fern-500/10",
      value: "Verified",
      label: "Provider",
    },
    {
      icon: Star,
      iconClass: "text-sun-500",
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
      icon: Award,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/10",
      value: `${years} ${years === 1 ? "yr" : "yrs"}`,
      label: "In service",
    },
  ];

  return (
    <div className="w-full border rounded-lg border-gray-200 py-4">
      {/* Desktop: horizontal row with dividers */}
      <div className="hidden sm:flex items-center justify-around">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${stat.bgClass}`}
                >
                  <Icon className={`w-5 h-5 ${stat.iconClass}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-neutral-900 leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs text-neutral-500">{stat.label}</span>
                </div>
              </div>
              {index < stats.length - 1 && (
                <div className="w-px h-10 bg-gray-200 ml-8" aria-hidden />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: 2x2 grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:hidden">
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
                <span className="text-base font-bold text-neutral-900 leading-none">
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

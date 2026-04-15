"use client";

import { DollarSign, Star, GraduationCap, ThumbsUp } from "lucide-react";
import type { Program } from "../../_components/types";

interface TrustBarProps {
  program: Program;
  avgRating: number;
}

interface StatItem {
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
  value: string;
  label: string;
}

export default function TrustBar({ program, avgRating }: TrustBarProps) {
  const ratingValue =
    avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "N/A";

  const stats: StatItem[] = [
    {
      icon: DollarSign,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/5",
      value: program.cost ?? "Contact",
      label: "Starting price",
    },
    {
      icon: Star,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/5",
      value: ratingValue,
      label: "Student rating",
    },
    {
      icon: GraduationCap,
      iconClass: "text-cobalt-500",
      bgClass: "bg-cobalt-500/5",
      value: program.creditsAvailable ?? "Varies",
      label: "Transferable",
    },
    {
      icon: ThumbsUp,
      iconClass: "text-green-600",
      bgClass: "bg-green-600/5",
      value: "95%",
      label: "Would recommend",
    },
  ];

  return (
    <div className="w-full bg-white border-t border-b border-zinc-200 py-4">
      {/* Desktop layout: horizontal row with dividers */}
      <div className="hidden sm:flex items-center justify-around max-w-7xl mx-auto px-4 sm:px-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center">
              {/* Stat item */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bgClass}`}
                >
                  <Icon
                    className={`w-5 h-5 ${stat.iconClass}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-zinc-900 leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[13px] text-zinc-500">{stat.label}</span>
                </div>
              </div>

              {/* Vertical divider — between items only */}
              {index < stats.length - 1 && (
                <div
                  className="w-px h-10 bg-zinc-200 ml-8"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile layout: 2x2 grid, no dividers */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:hidden px-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bgClass}`}
              >
                <Icon
                  className={`w-5 h-5 ${stat.iconClass}`}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-zinc-900 leading-none">
                  {stat.value}
                </span>
                <span className="text-[13px] text-zinc-500">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

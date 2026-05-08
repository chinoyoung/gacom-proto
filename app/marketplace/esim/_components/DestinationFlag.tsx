"use client";

import { CircleFlag } from "react-circle-flags";
import { Globe, Landmark, Mountain, TreePalm, type LucideIcon } from "lucide-react";
import type { Destination, RegionIconKey } from "../_data/destinations";

const REGION_ICONS: Record<RegionIconKey, LucideIcon> = {
  globe: Globe,
  mountain: Mountain,
  palm: TreePalm,
  landmark: Landmark,
};

const SIZE_CLASSES = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-9 h-9 md:w-12 md:h-12",
} as const;

const ICON_SIZE_CLASSES = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-5 h-5 md:w-6 md:h-6",
} as const;

type Size = keyof typeof SIZE_CLASSES;

interface DestinationFlagProps {
  destination: Pick<Destination, "name" | "countryCode" | "regionIcon">;
  size?: Size;
  className?: string;
}

export function DestinationFlag({ destination, size = "md", className = "" }: DestinationFlagProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (destination.countryCode) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-100 ${sizeClass} ${className}`}
        aria-hidden="true"
      >
        <CircleFlag
          countryCode={destination.countryCode}
          alt={`${destination.name} flag`}
          className="w-full h-full object-cover"
        />
      </span>
    );
  }

  const Icon = REGION_ICONS[destination.regionIcon ?? "globe"];
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full bg-cobalt-50/15 text-cobalt-500 ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      <Icon className={ICON_SIZE_CLASSES[size]} strokeWidth={2} />
    </span>
  );
}

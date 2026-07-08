"use client";

import { Star } from "lucide-react";

// ── Shared star renderer used by V1ReviewSummary and V1ReviewCard ─────────────
//
// Props:
//   rating     — numeric value 0–5 (integers or decimals)
//   size       — "sm" | "md" | "lg", controls icon dimensions
//   fractional — when true renders half-star fill for non-integer ratings
//                (used in the summary card); when false each star is fully
//                filled or empty based on rounded integer (used in review cards)

interface V1StarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  fractional?: boolean;
}

const SIZE_CLASS: Record<"sm" | "md" | "lg", string> = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export default function V1Stars({ rating, size = "md", fractional = false }: V1StarsProps) {
  const sizeClass = SIZE_CLASS[size];

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={fractional ? undefined : `${Math.round(rating)} out of 5 stars`}
      aria-hidden={fractional ? true : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        if (fractional) {
          const fill = Math.min(1, Math.max(0, rating - (star - 1)));

          // Fully filled
          if (fill >= 0.75) {
            return (
              <Star key={star} className={`${sizeClass} text-sun-500 fill-current`} />
            );
          }

          // Half-filled: clipped overlay using Tailwind w-1/2
          if (fill >= 0.25) {
            return (
              <span key={star} className={`relative inline-block ${sizeClass}`}>
                {/* Empty shell */}
                <Star className={`${sizeClass} text-slate-200 fill-current`} />
                {/* Filled half — w-1/2 clips to left half */}
                <span className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={`${sizeClass} text-sun-500 fill-current`} />
                </span>
              </span>
            );
          }

          // Empty
          return (
            <Star key={star} className={`${sizeClass} text-slate-200 fill-current`} />
          );
        }

        // Non-fractional: whole-number comparison
        return (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(rating) ? "text-sun-500 fill-current" : "text-slate-200 fill-current"
            }`}
          />
        );
      })}
    </div>
  );
}

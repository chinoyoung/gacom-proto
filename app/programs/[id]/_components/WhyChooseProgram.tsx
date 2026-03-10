"use client";

import { Star } from "lucide-react";
import { Program } from "./types";

interface WhyChooseProgramProps {
  program: Program;
  avgRating: number;
  totalReviews: number;
}

function formatCost(cost?: string): string {
  if (!cost) return "Contact Us";
  const trimmed = cost.trim();
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

function formatCredits(creditsAvailable?: string): string {
  if (!creditsAvailable) return "Varies";
  return creditsAvailable;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-2xl font-bold text-slate-800">
        {rating.toFixed(1)}
        <span className="text-base font-semibold text-slate-400">/10</span>
      </p>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const starValue = star * 2;
          const filled = rating >= starValue;
          const half = !filled && rating >= starValue - 1;
          return (
            <Star
              key={star}
              size={14}
              className={filled || half ? "text-sun-500" : "text-slate-300"}
              fill={filled ? "currentColor" : half ? "currentColor" : "none"}
              strokeWidth={filled || half ? 0 : 1.5}
              style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function WhyChooseProgram({
  program,
  avgRating,
}: WhyChooseProgramProps) {
  const cost = formatCost(program.cost);
  const credits = formatCredits(program.creditsAvailable);

  return (
    <section className="bg-slate-50 rounded-xl p-6 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Why Students Choose This Program
        </h2>
        <p className="text-sm text-slate-500">
          Join thousands of students who have transformed their academic and
          personal lives in {program.city}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Starting Price */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-5 text-center">
          <p className="text-xs text-slate-500 mb-1">Starting Price / Semester</p>
          <p className="text-2xl font-bold text-cobalt-500">{cost}</p>
        </div>

        {/* Student Rating */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-5 text-center">
          <p className="text-xs text-slate-500 mb-1">Student Rating</p>
          <RatingStars rating={avgRating} />
        </div>

        {/* Transferable Credits */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-5 text-center">
          <p className="text-xs text-slate-500 mb-1">Transferable Credits</p>
          <p className="text-2xl font-bold text-slate-800">{credits}</p>
        </div>

        {/* Would Recommend */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-5 text-center">
          <p className="text-xs text-slate-500 mb-1">Would Recommend</p>
          <p className="text-2xl font-bold text-slate-800">95%</p>
        </div>
      </div>
    </section>
  );
}

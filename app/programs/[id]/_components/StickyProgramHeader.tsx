"use client";

import { Heart, ArrowRight } from "lucide-react";
import type { Program } from "./types";

const STICKY_RATING = 8.41;
const STICKY_REVIEW_COUNT = 103;

export default function StickyProgramHeader({
  program,
  visible,
  saved,
  onToggleSave,
}: {
  program: Program;
  visible: boolean;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={[
        "hidden lg:block",
        "fixed top-0 left-0 right-0 z-50",
        "bg-white border-b border-slate-200 shadow-sm",
        "transition-transform duration-200",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">
        {/* Left: logo + title + rating */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {program.providerLogo && (
            <div className="shrink-0 w-8 h-8 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
              <img
                src={program.providerLogo}
                alt={`${program.provider} logo`}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          )}

          <p className="font-semibold text-slate-900 text-sm truncate">
            {program.title}
          </p>

          <span className="shrink-0 flex items-center gap-1 text-xs text-sun-700 font-medium">
            <span className="text-sun-500" aria-hidden="true">★</span>
            {STICKY_RATING}
            <span className="text-slate-500 font-normal">· {STICKY_REVIEW_COUNT} reviews</span>
          </span>
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="inline-flex justify-center items-center px-5 py-2 border border-cobalt-500 text-cobalt-500 font-semibold text-sm rounded-lg hover:bg-cobalt-500/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
          >
            Inquire Here
          </button>

          {program.applyUrl ? (
            <a
              href={program.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
            >
              Visit Website
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex justify-center items-center gap-2 px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
            >
              Visit Website
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSave}
            className={`inline-flex justify-center items-center px-3 py-2 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2 ${saved
              ? "bg-roman-50 border-roman-300 text-roman-500"
              : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            aria-label={saved ? "Unsave program" : "Save program"}
          >
            <Heart
              className={`w-4 h-4 ${saved ? "text-roman-500" : ""}`}
              fill={saved ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { Program } from "./types";

interface ProgramHighlightsProps {
  program: Program;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="w-5 h-5 flex-shrink-0"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 10.5l3 3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProgramHighlights({ program }: ProgramHighlightsProps) {
  if (program.highlights.length === 0) return null;

  return (
    <section aria-labelledby="highlights-heading">
      <h2 id="highlights-heading" className="text-2xl font-bold text-slate-900 mb-6">
        Program Highlights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {program.highlights.map((highlight, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cobalt-600/10 text-cobalt-700 shrink-0">
              <CheckIcon />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {highlight}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

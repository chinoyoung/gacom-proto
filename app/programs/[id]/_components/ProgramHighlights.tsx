"use client";

import type { Program } from "./types";

interface ProgramHighlightsProps {
  program: Program;
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="w-4 h-4 flex-shrink-0"
    >
      <path d="M10 1.5l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.77l-4.77 2.44.91-5.32L2.27 7.12l5.34-.78L10 1.5z" />
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

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {program.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-2 py-1">
            <span className="text-sun-500 mt-0.5">
              <StarIcon />
            </span>
            <span className="text-sm text-slate-700 leading-snug">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import type { Program } from "./types";

interface ProgramHighlightsProps {
  program: Program;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="w-4 h-4 flex-shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M5 8.5l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
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
      <h2 id="highlights-heading" className="text-2xl font-bold text-slate-900 mb-5">
        Program Highlights
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {program.highlights.map((highlight, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 bg-[#F7F9FC] rounded-lg px-4 py-3 border border-[#E5E9F0] border-l-[3px] border-l-cobalt-500 shadow-sm"
          >
            <span className="text-cobalt-500">
              <CheckIcon />
            </span>
            <span className="text-sm text-slate-700 leading-relaxed font-medium">{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

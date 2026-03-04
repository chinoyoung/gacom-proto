"use client";

import type { Program } from "./types";

interface ProgramHighlightsProps {
  program: Program;
}

export default function ProgramHighlights({ program }: ProgramHighlightsProps) {
  if (program.highlights.length === 0) return null;

  return (
    <section aria-labelledby="highlights-heading">
      <h2
        id="highlights-heading"
        className="text-xl font-bold text-slate-900 border-l-[3px] border-cobalt-500 pl-3 mb-5"
      >
        Program Highlights
      </h2>

      <ul className="space-y-2.5">
        {program.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {/* Blue bullet dot */}
            <span
              className="flex-shrink-0 w-2 h-2 rounded-full bg-cobalt-500 mt-2"
              aria-hidden="true"
            />
            <span className="text-slate-700 text-sm leading-relaxed">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

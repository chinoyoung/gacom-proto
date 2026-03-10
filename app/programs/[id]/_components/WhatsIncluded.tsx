"use client";

import type { Program } from "./types";

interface WhatsIncludedProps {
  program: Program;
}

export default function WhatsIncluded({ program }: WhatsIncludedProps) {
  if (program.whatsIncluded.length === 0) return null;

  return (
    <section aria-labelledby="included-heading">
      <h2
        id="included-heading"
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        What&apos;s Included
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {program.whatsIncluded.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <svg
              className="w-4 h-4 flex-shrink-0 text-fern-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="9" strokeWidth="1.5" />
              <path
                d="M6 10.5l3 3 5-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-slate-700 leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

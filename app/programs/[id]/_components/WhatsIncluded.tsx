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
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full bg-fern-200 flex items-center justify-center mt-0.5"
              aria-hidden="true"
            >
              <svg
                className="w-3 h-3 text-fern-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 12 12"
              >
                <path
                  d="M2 6l3 3 5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm text-slate-700 leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

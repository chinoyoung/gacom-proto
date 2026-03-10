"use client";

import type { Program } from "./types";

interface ProgramOverviewProps {
  program: Program;
}

export default function ProgramOverview({ program }: ProgramOverviewProps) {
  // Split description on double newlines for paragraph rendering
  const paragraphs = program.description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section aria-labelledby="overview-heading">
      <h2
        id="overview-heading"
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        Program Overview
      </h2>

      {paragraphs.length > 0 ? (
        <div className="space-y-4">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="text-slate-700 leading-relaxed text-base break-words">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic">No description provided yet.</p>
      )}

    </section>
  );
}

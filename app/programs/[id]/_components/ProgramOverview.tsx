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
        className="text-xl font-bold text-slate-900 border-l-[3px] border-cobalt-500 pl-3 mb-5"
      >
        Program Overview
      </h2>

      {paragraphs.length > 0 ? (
        <div className="space-y-4">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="text-slate-700 leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic">No description provided yet.</p>
      )}

      {program.hostInstitution && (
        <div className="mt-5 flex items-start gap-2.5 bg-cobalt-500/[0.07] border border-cobalt-300/30 rounded-lg p-4">
          <svg
            className="w-5 h-5 text-cobalt-500 shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wider mb-0.5">
              Host Institution
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {program.hostInstitution}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import type { Program } from "./types";

interface SubjectAreasProps {
  program: Program;
}

export default function SubjectAreas({ program }: SubjectAreasProps) {
  if (program.subjectAreas.length === 0) return null;

  return (
    <section aria-labelledby="subjects-heading">
      <h2
        id="subjects-heading"
        className="text-xl font-bold text-slate-900 border-l-[3px] border-cobalt-500 pl-3 mb-5"
      >
        Subject Areas
      </h2>

      <div className="flex flex-wrap gap-2">
        {program.subjectAreas.map((subject, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-cobalt-700 border border-slate-200 rounded-full text-sm font-medium hover:bg-cobalt-500/[0.1] hover:border-cobalt-300/50 transition-colors"
          >
            {subject}
          </span>
        ))}
      </div>
    </section>
  );
}

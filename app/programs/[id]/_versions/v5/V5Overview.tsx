"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Program } from "../../_components/types";

// Number of paragraphs shown before the "Read More" fold.
const PREVIEW_PARAGRAPHS = 2;

export default function V5Overview({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false);

  const paragraphs = program.description
    ? program.description.split(/\n\n+/).filter(Boolean)
    : [];
  const isLong = paragraphs.length > PREVIEW_PARAGRAPHS;

  const visibleParagraphs =
    !isLong || expanded ? paragraphs : paragraphs.slice(0, PREVIEW_PARAGRAPHS);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Program Overview</h2>
      <div className="mt-4 flex flex-col gap-2">
        {visibleParagraphs.map((para, i) => (
          <p key={i} className="text-[15px] text-slate-700 leading-relaxed">
            {para}
          </p>
        ))}
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex mt-2 font-bold items-center gap-1 text-sm text-cobalt-500 cursor-pointer hover:text-cobalt-600 transition-colors self-start"
          >
            {expanded ? "Read Less" : "Read More"}
            <ChevronRight
              className={`${expanded ? "-rotate-90" : "rotate-90"} transform w-3.5 h-3.5 transition-transform`}
            />
          </button>
        )}
      </div>
    </div>
  );
}

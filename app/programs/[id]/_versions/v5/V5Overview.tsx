"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Program } from "../../_components/types";

export default function V5Overview({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false);

  const paragraphs = program.description
    ? program.description.split(/\n\n+/).filter(Boolean)
    : [];
  const firstParagraph = paragraphs[0] ?? "";
  const remainingParagraphs = paragraphs.slice(1).join("\n\n");
  const isLong = paragraphs.length > 1;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Program Overview</h2>
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-[15px] text-slate-700 leading-relaxed">{firstParagraph}</p>
        {isLong && (
          <>
            {expanded && (
              <p className="text-[15px] text-slate-700 leading-relaxed">{remainingParagraphs}</p>
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex mt-2 font-bold items-center gap-1 text-sm text-cobalt-500 cursor-pointer hover:text-cobalt-600 transition-colors self-start"
            >
              {expanded ? "Read Less" : "Read More"}
              <ChevronRight
                className={`${expanded ? "-rotate-90" : "rotate-90"} transform w-3.5 h-3.5 transition-transform`}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

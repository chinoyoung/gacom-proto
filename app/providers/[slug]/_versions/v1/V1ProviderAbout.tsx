"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Provider } from "../../_components/types";

const PREVIEW_PARAGRAPHS = 2;

export default function V1ProviderAbout({ provider }: { provider: Provider }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = provider.about ? provider.about.split(/\n\n+/).filter(Boolean) : [];
  if (paragraphs.length === 0) return null;

  const isLong = paragraphs.length > PREVIEW_PARAGRAPHS;
  const visible = !isLong || expanded ? paragraphs : paragraphs.slice(0, PREVIEW_PARAGRAPHS);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">About {provider.name}</h2>
      <div className="mt-4 flex flex-col gap-2">
        {visible.map((para, i) => (
          <p key={i} className="text-[15px] text-slate-700 leading-relaxed">{para}</p>
        ))}
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex mt-2 font-bold items-center gap-1 text-sm text-cobalt-500 cursor-pointer hover:text-cobalt-600 transition-colors self-start"
          >
            {expanded ? "Read Less" : "Read More"}
            <ChevronRight className={`${expanded ? "-rotate-90" : "rotate-90"} transform w-3.5 h-3.5 transition-transform`} />
          </button>
        )}
      </div>
    </div>
  );
}

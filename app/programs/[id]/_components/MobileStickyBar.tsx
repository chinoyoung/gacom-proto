"use client";

import { ArrowRight } from "lucide-react";
import type { Program } from "./types";

export default function MobileStickyBar({ program, onInquire }: { program: Program; onInquire?: () => void }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex gap-3 shadow-lg">
      <button
        type="button"
        className="flex-1 px-4 py-2.5 border border-cobalt-500 text-cobalt-500 font-semibold text-sm rounded-lg hover:bg-cobalt-500/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        onClick={onInquire}
      >
        Inquire Here
      </button>
      {program.applyUrl ? (
        <a
          href={program.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
        >
          Visit Website
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2 cursor-pointer"
        >
          Visit Website
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

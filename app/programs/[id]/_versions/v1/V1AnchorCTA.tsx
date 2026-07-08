"use client";

import { ArrowDown } from "lucide-react";

export default function V1AnchorCTA() {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="bg-cobalt-500/5 border border-cobalt-500/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">Ready to dive deeper into this program?</p>
        <p className="text-xs text-slate-500 mt-0.5">Jump to the full breakdown of dates, costs, eligibility, and more.</p>
      </div>
      <a
        href="#details"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-4 h-10 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors whitespace-nowrap"
      >
        See program details <ArrowDown className="w-4 h-4" />
      </a>
    </div>
  );
}

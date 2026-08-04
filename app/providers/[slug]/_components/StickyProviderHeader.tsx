"use client";

import { CircleCheck, ExternalLink, Star } from "lucide-react";
import type { Provider } from "./types";

export default function StickyProviderHeader({
  provider,
  visible,
  avgRating,
  onInquire,
}: {
  provider: Provider;
  visible: boolean;
  avgRating?: number;
  onInquire: () => void;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={[
        "hidden lg:block",
        "fixed top-0 left-0 right-0 z-50",
        "bg-white border-b border-slate-200 shadow-sm",
        "transition-transform duration-200",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">
        {/* Left: logo + title + rating */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {provider.logo && (
            <div className="shrink-0 w-8 h-8 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          )}

          <p className="font-semibold text-slate-900 text-sm truncate">
            {provider.name}
          </p>

          {avgRating != null && avgRating > 0 && (
            <span className="flex items-center gap-2 text-base font-bold">
              <Star className="w-4 h-4 text-sun-500 fill-current" aria-hidden="true" />
              {avgRating.toFixed(1)}
            </span>
          )}

          <span className="hidden shrink-0 items-center gap-1 text-xs font-bold text-slate-700 sm:flex">
            <CircleCheck className="w-3.5 h-3.5 text-fern-500" aria-hidden="true" />
            Verified
          </span>
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 rounded-md px-5 text-center font-bold text-white transition-colors bg-roman-500 hover:bg-roman-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roman-500 focus-visible:ring-offset-2"
            >
              Visit Website
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            onClick={onInquire}
            className="inline-flex items-center justify-center h-10 rounded-md px-5 text-center font-bold text-white transition-colors bg-cobalt-500 hover:bg-cobalt-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
          >
            Contact Provider
          </button>
        </div>
      </div>
    </div>
  );
}

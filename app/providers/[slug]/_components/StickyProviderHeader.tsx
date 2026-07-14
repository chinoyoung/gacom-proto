"use client";

import { ArrowRight, Star } from "lucide-react";
import type { Provider } from "./types";

export default function StickyProviderHeader({
  provider,
  visible,
  avgRating,
  reviewCount,
  onInquire,
}: {
  provider: Provider;
  visible: boolean;
  avgRating?: number;
  reviewCount?: number;
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

          {avgRating != null && reviewCount != null && avgRating > 0 && (
            <span className="shrink-0 flex items-center gap-1.5 text-xs font-medium flex-wrap">
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      avgRating >= star ? "text-sun-500 fill-current" : "text-slate-300"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="text-sun-700">{avgRating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">· {reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
            </span>
          )}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onInquire}
            className="inline-flex justify-center items-center px-5 py-2 border border-cobalt-500 text-cobalt-500 font-semibold text-sm rounded-md hover:bg-cobalt-500/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
          >
            Inquire Here
          </button>

          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 px-5 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-md hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
            >
              Visit Website
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

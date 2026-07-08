"use client";
import { useState } from "react";
import { Star, Heart, BadgeCheck, ExternalLink, ImageOff } from "lucide-react";

interface V2ProgramCardProps {
  title: string;
  providerName: string;
  rating: number;
  reviewsCount: number;
  description: string;
  verified?: boolean;
  featured?: boolean;
}

export default function V2ProgramCard({
  title,
  providerName,
  rating,
  reviewsCount,
  description,
  verified,
  featured,
}: V2ProgramCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="relative flex flex-col rounded-md border bg-white">
      {/* Save Button - top right */}
      <div className="absolute right-2 top-2 z-10">
        <button
          aria-label={saved ? "Unsave program" : "Save program"}
          onClick={() => setSaved(!saved)}
          className="p-1 transition-transform active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          <Heart
            className={`h-6 w-6 drop-shadow-lg ${saved ? "fill-current text-red-500" : "text-neutral-400"}`}
          />
        </button>
      </div>

      {/* Featured Badge - top left */}
      {featured && (
        <div className="bg-sun-500 absolute left-2 top-2 z-10 flex items-center gap-2 rounded-md px-2.5 py-1.5">
          <span className="text-xs font-bold text-white">Featured</span>
        </div>
      )}

      {/* Placeholder Image Area */}
      <div className="relative h-[150px] w-full rounded-t-md bg-slate-100 flex items-center justify-center">
        <ImageOff className="h-10 w-10 text-slate-300" aria-hidden="true" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-center rounded-b-md p-2 lg:p-4">
        <div className="flex flex-col gap-2">
          {/* Rating row */}
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="text-sun-500">{rating}</span>
            <Star className="h-4 w-4 text-sun-500 fill-current" aria-hidden="true" />
            <span className="font-normal">{reviewsCount} reviews</span>
          </div>

          {/* Provider name + verified + placeholder logo */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="line-clamp-2 text-xs">{providerName}</p>
                {verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-fern-500 shrink-0" aria-hidden="true" />
                )}
              </div>
            </div>
            {/* Placeholder logo box */}
            <div className="rounded-md border bg-white p-px shrink-0">
              <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                <ImageOff className="h-5 w-5 text-slate-300" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Title */}
          <a
            href="#"
            className="hover:text-cobalt-500 line-clamp-2 text-xs font-bold transition-colors duration-300 ease-in-out md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
          >
            {title}
          </a>

          {/* Description */}
          <p className="line-clamp-3 mb-2 text-xs md:text-sm text-slate-600">{description}</p>
        </div>
      </div>

      {/* Footer CTA buttons */}
      <div className="mt-auto flex flex-col gap-2 p-4 lg:flex-row lg:gap-4">
        <a
          href="#"
          className="bg-cobalt-500 hover:bg-cobalt-600 flex h-11 w-full items-center justify-center rounded-md px-4 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          <span>Visit Website</span>
          <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href="#"
          className="border border-cobalt-500 text-cobalt-500 hover:border-cobalt-700 hover:text-cobalt-700 flex h-11 w-full items-center justify-center rounded-md px-5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          View Program
        </a>
      </div>
    </div>
  );
}

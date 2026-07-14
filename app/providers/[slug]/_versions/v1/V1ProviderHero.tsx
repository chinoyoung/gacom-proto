"use client";

import Link from "next/link";
import { Building2, Star, Heart, ArrowRight } from "lucide-react";
import type { Provider } from "../../_components/types";

interface V1ProviderHeroProps {
  provider: Provider;
  avgRating: number;
  reviewCount: number;
  saved: boolean;
  onToggleSave: () => void;
  onInquire: () => void;
  programCount: number;
}

export default function V1ProviderHero({
  provider,
  avgRating,
  reviewCount,
  saved,
  onToggleSave,
  onInquire,
  programCount,
}: V1ProviderHeroProps) {
  const photos = provider.photos ?? [];
  const hasEnoughPhotos = photos.length >= 5;
  const hasSomePhotos = photos.length > 0 && !hasEnoughPhotos;
  const coverOnly = !photos.length && !!provider.coverImage;
  const hasRightMedia = hasEnoughPhotos || hasSomePhotos || coverOnly;

  return (
    <div className="bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-6 pb-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/providers"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link href="/providers" className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded">
                Providers
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium truncate max-w-60" aria-current="page">
              {provider.name}
            </li>
          </ol>
        </nav>

        {/* Hero content */}
        <div className="mt-6 flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left */}
          <div className={`${hasRightMedia ? "flex-1 min-w-0" : "flex-1"} flex flex-col lg:justify-center lg:min-h-[20rem]`}>
            {/* Top group */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-slate-900 leading-[1.15] tracking-tight">
                {provider.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                {provider.logo && (
                  <div className="h-16 w-16 border border-slate-200 rounded-md overflow-hidden shrink-0 bg-white flex items-center justify-center">
                    <img
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
              </div>

              {provider.tagline && (
                <p className="text-[15px] text-slate-600 mt-1 max-w-2xl">
                  {provider.tagline}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
                {avgRating > 0 && (
                  <>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-sun-500 fill-current" />
                      <span className="font-bold text-slate-900 text-base">{avgRating.toFixed(1)}</span>
                    </span>
                    <span className="text-slate-400">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
                    <span className="text-slate-300">•</span>
                  </>
                )}
                {provider.headquarters && (
                  <>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {provider.headquarters}
                    </span>
                    <span className="text-slate-300">•</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  {programCount} {programCount === 1 ? "program" : "programs"}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onInquire}
                className="inline-flex items-center h-10 px-5 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors cursor-pointer"
              >
                Inquire Here
              </button>
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-white border border-cobalt-500 text-cobalt-500 text-sm font-semibold rounded-md hover:bg-cobalt-500/5 transition-colors"
                >
                  Visit Website
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
              <button
                type="button"
                onClick={onToggleSave}
                aria-label={saved ? "Unsave provider" : "Save provider"}
                className={`h-10 w-10 flex items-center justify-center border rounded-md transition-colors cursor-pointer ${
                  saved
                    ? "bg-roman-50 border-roman-300 text-roman-500"
                    : "bg-white border-slate-300 text-slate-500 hover:border-slate-400"
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={saved ? "currentColor" : "none"}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          {/* Right: media (above the title on mobile) */}
          {hasRightMedia && (
            <div className="w-full lg:w-[560px] shrink-0 order-first lg:order-none">
              {hasEnoughPhotos && (
                <>
                  <div
                    className="w-full h-[300px] rounded-md overflow-hidden cursor-pointer"
                    onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <img
                      src={provider.coverImage ?? photos[0]}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              )}

              {hasSomePhotos && (
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src={provider.coverImage ?? photos[0]}
                    alt={provider.name}
                    className="w-full h-[300px] object-cover"
                  />
                  <a
                    href="#gallery"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-md hover:bg-black/75 transition-colors"
                  >
                    +{photos.length} photos
                  </a>
                </div>
              )}

              {coverOnly && (
                <img
                  src={provider.coverImage!}
                  alt={provider.name}
                  className="w-full h-[300px] object-cover rounded-md"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

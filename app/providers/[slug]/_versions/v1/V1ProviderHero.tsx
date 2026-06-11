"use client";

import Link from "next/link";
import { Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import type { Provider } from "../../_components/types";

interface Props {
  provider: Provider;
  avgRating: number;
  reviewCount: number;
}

export default function V1ProviderHero({ provider, avgRating, reviewCount }: Props) {
  return (
    <div className="bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-6 pb-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-cobalt-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>
              <Link href="/providers" className="hover:text-cobalt-600 transition-colors">
                Providers
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium truncate max-w-60" aria-current="page">
              {provider.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-24 w-24 sm:h-28 sm:w-28 border border-slate-200 rounded-md overflow-hidden shrink-0 bg-white flex items-center justify-center">
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="w-full h-full object-contain p-2.5"
              />
            ) : (
              <span className="text-3xl font-bold text-slate-400">
                {provider.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-slate-900 leading-[1.15] tracking-tight">
              {provider.name}
            </h1>
            {provider.tagline && (
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">{provider.tagline}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              {avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-sun-500 fill-current" />
                  <span className="font-bold text-slate-900 text-base">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </span>
              )}
              {provider.headquarters && provider.headquarters !== "—" && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {provider.headquarters}
                </span>
              )}
              {provider.yearFounded && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Est. {provider.yearFounded}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="#inquiry"
              className="inline-flex items-center h-10 px-5 bg-white border border-cobalt-500 text-cobalt-500 text-sm font-semibold rounded-md hover:bg-cobalt-500/5 transition-colors"
            >
              Inquire
            </a>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-5 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors"
              >
                Visit Website
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

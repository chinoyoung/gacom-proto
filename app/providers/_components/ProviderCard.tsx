"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Provider } from "../[slug]/_components/types";

export default function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-sm font-bold text-slate-400">
                {provider.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {provider.name}
            </h2>
            {provider.headquarters && provider.headquarters !== "—" && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {provider.headquarters}
              </p>
            )}
          </div>
        </div>

        {provider.tagline && (
          <p className="text-sm text-slate-600 mt-3 line-clamp-2">
            {provider.tagline}
          </p>
        )}

        <div className="flex-1" />

        <Link
          href={`/providers/${provider.slug}`}
          className="mt-4 block w-full text-center px-4 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors"
        >
          View Provider
        </Link>
      </div>
    </article>
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Provider } from "./[slug]/_components/types";
import ProviderCard from "./_components/ProviderCard";

export default function ProvidersIndexPage() {
  const providers = useQuery(api.providers.listProviders, { status: "published" }) as
    | Provider[]
    | undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse Providers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore study abroad providers and their programs.
        </p>
      </header>

      {providers === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 bg-slate-100 border border-slate-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <p className="text-sm text-slate-500 py-12 text-center">
          No providers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <ProviderCard key={p._id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}

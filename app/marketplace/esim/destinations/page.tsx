import { Suspense } from "react";
import Link from "next/link";
import {
  countryDestinations,
  destinations,
  regionDestinations,
} from "../_data/destinations";
import EsimDestinationSearch from "../_components/EsimDestinationSearch";
import AllDestinationsTabs from "../_components/AllDestinationsTabs";

export const metadata = {
  title: "All eSIM Destinations | GoAbroad",
  description:
    "Browse every country and region where you can use a GoAbroad travel eSIM. Compare data plans, regional bundles, and global coverage.",
};

export default function AllEsimDestinationsPage() {
  return (
    <main className="text-neutral-800">
      <section className="bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
          <nav aria-label="Breadcrumb" className="pt-6 pb-2">
            <Link
              href="/marketplace/esim"
              className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to eSIM
            </Link>
            <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                >
                  Marketplace
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li>
                <Link
                  href="/marketplace/esim"
                  className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                >
                  eSIM
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li className="text-slate-700 font-medium" aria-current="page">
                All Destinations
              </li>
            </ol>
          </nav>

          <div className="py-10 md:py-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
              Travel eSIM
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-4">
              All eSIM Destinations
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
              Browse every country and region we cover. Pick a single country or grab a regional plan for multi-country trips.
            </p>
            <EsimDestinationSearch />
            <p className="mt-5 text-sm text-slate-500">
              {destinations.length} plans · {regionDestinations.length} regional, {countryDestinations.length} countries
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
          <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
            <AllDestinationsTabs />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

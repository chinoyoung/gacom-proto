"use client";

import Link from "next/link";
import EsimDestinationSearch from "../../_components/EsimDestinationSearch";

export default function V1EsimHero() {
  return (
    <section className="bg-slate-100 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          <Link
            href="/"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
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
            <li className="text-slate-700 font-medium" aria-current="page">
              eSIM
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 py-10 md:py-12 md:pr-12 flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-4">
              Travel eSIM
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight max-w-3xl mb-5">
              Stay Connected Worldwide. Travel with an eSIM.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed mb-10">
              Get instant mobile data in 200+ countries. No physical SIM, no roaming fees, no hassle. Activate in minutes and travel with confidence.
            </p>
            <EsimDestinationSearch />
          </div>
          <div className="w-full md:w-[45%] md:self-stretch shrink-0 pb-6 md:py-8">
            <img
              src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80"
              alt="A traveler using a smartphone with a travel eSIM abroad"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

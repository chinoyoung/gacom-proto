"use client";

import Link from "next/link";
import InsuranceQuoteForm from "../../_components/InsuranceQuoteForm";

export default function V1InsuranceHero() {
  return (
    <section id="hero" className="bg-slate-100 relative z-10 scroll-mt-36">
      <div className="max-w-7xl mx-auto px-6">
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
              Insurance
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10 py-10 md:py-16">
          <div className="md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-4">
              Travel Insurance
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight max-w-xl mb-5">
              Get Travel Insurance you can rely on.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Find dependable coverage for any trip.
            </p>
          </div>
          <div className="w-full md:w-[48%] lg:w-[44%] md:max-w-lg lg:max-w-xl shrink-0">
            <h2 className="sr-only">Get an insurance quote in seconds</h2>
            <InsuranceQuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function OrigEsimHero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          <Link
            href="/"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li>
              <Link href="/" className="hover:text-cobalt-600 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li>Marketplace</li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium" aria-current="page">
              Travel eSIM
            </li>
          </ol>
        </nav>

        <div className="py-12 md:py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight max-w-3xl mb-5">
            Stay Connected Worldwide.
            <br />
            Travel with an eSIM.
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
            Get instant mobile data in 200+ countries. No physical SIM, no roaming fees, no hassle. Activate in minutes and travel with confidence.
          </p>

          <form
            className="w-full max-w-xl"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by country or destination"
                aria-label="Search by country or destination"
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-full bg-white text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:border-cobalt-500 transition-colors"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

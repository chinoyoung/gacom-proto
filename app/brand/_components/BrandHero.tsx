"use client";

import Link from "next/link";

export default function BrandHero() {
  return (
    <section className="bg-slate-100 overflow-hidden">
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
            <li className="text-slate-700 font-medium" aria-current="page">
              Brand Guidelines
            </li>
          </ol>
        </nav>

        <div className="py-10 md:py-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight max-w-3xl mb-5">
            GoAbroad Brand Guidelines
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed mb-10">
            A living reference for color, typography, components, and spacing. Everything in one place so every prototype speaks the same visual language.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="#components"
              className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors w-full sm:w-auto text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              View Components
            </a>
            <a
              href="/BRANDING.md"
              className="inline-flex items-center justify-center border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 transition-colors w-full sm:w-auto text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              Read the Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

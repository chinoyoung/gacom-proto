"use client";

import Link from "next/link";
import { AFFILIATE_DEMO } from "../v1/constants";

export default function V2Hero() {
  return (
    <section className="bg-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <nav aria-label="Breadcrumb" className="pt-6 pb-2">
          {/* Mobile: simple back link */}
          <Link
            href="/"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          {/* Desktop: full breadcrumb trail */}
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
            <li>Marketplace</li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-slate-700 font-medium" aria-current="page">
              Partner
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 py-10 md:py-8">
          {/* Left: text content */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight max-w-3xl mb-5">
              Become a Marketplace Partner
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed mb-10">
              Connect your organization or audience with trusted travel essentials and services. Earn commissions, offer real value, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors w-full sm:w-auto text-center text-sm"
              >
                Become an Affiliate
              </a>
              <a
                href={AFFILIATE_DEMO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white border border-slate-200 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors w-full sm:w-auto text-center text-sm"
              >
                Book a Demo
              </a>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="w-full md:w-[45%] shrink-0 flex items-center justify-center">
            <img
              src="/illustrations/partnership.svg"
              alt="Two people shaking hands as business partners"
              className="w-full max-w-xs md:max-w-none h-auto max-h-[320px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

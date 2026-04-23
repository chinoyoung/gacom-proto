"use client";

import Link from "next/link";
import { AFFILIATE_DEMO } from "./constants";

export default function V1Hero() {
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

        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 py-10 md:py-12 md:pr-12 flex flex-col items-center md:items-start text-center md:text-left">
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
                className="inline-flex items-center justify-center border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 transition-colors w-full sm:w-auto text-center text-sm"
              >
                Book a Demo
              </a>
            </div>
          </div>
          <div className="w-full md:w-[45%] md:self-stretch shrink-0 pb-6 md:py-8">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
              alt="Two travelers looking at a phone together while exploring abroad"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

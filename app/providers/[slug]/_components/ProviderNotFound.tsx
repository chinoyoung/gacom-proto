"use client";

import Link from "next/link";

export default function ProviderNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Provider Not Found</h1>
      <p className="text-slate-600 mb-6">
        The provider you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/providers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500">
        Browse all providers
      </Link>
    </div>
  );
}

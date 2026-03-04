"use client";

import type { Program } from "./types";

interface ApplyCTAProps {
  program: Program;
}

const STATIC_RATING = 8.41;
const STATIC_REVIEW_COUNT = 103;

export default function ApplyCTA({ program }: ApplyCTAProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-cobalt-500 px-5 py-4">
        <p className="text-xs font-semibold text-cobalt-100 uppercase tracking-wide mb-0.5">
          {program.provider}
        </p>
        <h2 className="text-base font-bold text-white leading-snug line-clamp-2">
          {program.title}
        </h2>
      </div>

      <div className="p-5 space-y-3">
        {/* Rating trust signal */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-sun-500/10 text-sun-700 text-xs font-bold px-2 py-1 rounded-md">
            <span>★</span>
            <span>{STATIC_RATING}</span>
          </div>
          <span className="text-xs text-slate-500">
            {STATIC_REVIEW_COUNT} verified reviews
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-fern-700 font-semibold">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        </div>

        {/* Deadline urgency — show prominently if set */}
        {program.applicationDeadline && (
          <div className="flex items-center gap-2 bg-roman-500/[0.08] border border-roman-300/40 rounded-lg px-3 py-2.5">
            <svg
              className="w-4 h-4 text-roman-500 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-roman-700 leading-tight">
              <span className="font-bold">Application deadline:</span>{" "}
              {program.applicationDeadline}
            </p>
          </div>
        )}

        {/* Primary CTA */}
        {program.applyUrl ? (
          <a
            href={program.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2"
          >
            Apply Now
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        ) : (
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-cobalt-500 text-white font-bold text-sm rounded-lg hover:bg-cobalt-600 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            Apply Now
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        )}

        {/* Secondary CTA */}
        <button
          type="button"
          className="w-full px-4 py-2.5 border-2 border-cobalt-500 text-cobalt-600 font-semibold text-sm rounded-lg hover:bg-cobalt-500/[0.07] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          Send Inquiry
        </button>

        {/* Visit website link */}
        {program.applyUrl && (
          <a
            href={program.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full text-xs text-slate-500 hover:text-cobalt-600 transition-colors py-1"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Visit provider website
          </a>
        )}
      </div>

      {/* Contact info */}
      {(program.contactEmail || program.contactPhone) && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Contact {program.provider}
          </p>
          {program.contactEmail && (
            <a
              href={`mailto:${program.contactEmail}`}
              className="flex items-center gap-2 text-sm text-cobalt-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {program.contactEmail}
            </a>
          )}
          {program.contactPhone && (
            <a
              href={`tel:${program.contactPhone}`}
              className="flex items-center gap-2 text-sm text-cobalt-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {program.contactPhone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

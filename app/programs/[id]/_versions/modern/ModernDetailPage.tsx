"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Star, Check, ExternalLink } from "lucide-react";

import { Program } from "../../_components/types";
import ModernHero from "./ModernHero";
import ProgramReviews from "../../_components/ProgramReviews";
import ProgramArticles from "../../_components/ProgramArticles";
import RelatedPrograms from "../../_components/RelatedPrograms";

interface ModernDetailPageProps {
  program: Program;
  reviews: any[] | undefined;
  avgRating: number;
}

export default function ModernDetailPage({
  program,
  reviews,
  avgRating,
}: ModernDetailPageProps) {
  const [saved, setSaved] = useState(false);

  const descriptionParagraphs = program.description
    ? program.description.split(/\n\n+/).filter(Boolean)
    : [];

  const programDetails: { label: string; value: string }[] = [
    program.city && program.country
      ? { label: "Location", value: `${program.city}, ${program.country}` }
      : null,
    program.duration
      ? { label: "Duration", value: program.duration }
      : null,
    program.terms.length > 0
      ? { label: "Terms", value: program.terms.join(", ") }
      : null,
    program.educationLevels.length > 0
      ? { label: "Education Levels", value: program.educationLevels.join(", ") }
      : null,
    program.housingType
      ? { label: "Housing", value: program.housingType }
      : null,
    program.languageOfInstruction
      ? { label: "Language", value: program.languageOfInstruction }
      : null,
    program.cost
      ? { label: "Cost", value: program.cost }
      : null,
    program.creditsAvailable
      ? { label: "Credits", value: program.creditsAvailable }
      : null,
    program.applicationDeadline
      ? { label: "Deadline", value: program.applicationDeadline }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* Full-bleed hero */}
      <ModernHero program={program} />

      {/* Breadcrumbs — below the hero facts bar */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2"
      >
        {/* Mobile: simple back link */}
        <Link
          href="/programs"
          className="sm:hidden inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Programs
        </Link>

        {/* Desktop: full breadcrumb trail */}
        <ol className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 flex-wrap">
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
              href="/programs"
              className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              Programs
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li>
            <Link
              href={`/programs?city=${encodeURIComponent(program.city)}`}
              className="hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
            >
              {program.city}
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li
            className="text-slate-600 font-medium truncate max-w-60"
            aria-current="page"
          >
            {program.title}
          </li>
        </ol>
      </nav>

      {/* CTA Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Left: program title — desktop only */}
          <p className="hidden sm:block text-lg font-semibold text-slate-900 truncate min-w-0 flex-1">
            {program.title}
          </p>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Inquire button */}
            <button
              type="button"
              className="border border-cobalt-500 text-cobalt-500 text-sm font-semibold px-5 py-2 rounded-lg hover:bg-cobalt-500/5 transition-colors"
            >
              Inquire Here
            </button>

            {/* Visit Website button */}
            {program.applyUrl ? (
              <a
                href={program.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cobalt-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-cobalt-600 inline-flex items-center gap-2 transition-colors"
              >
                Visit Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                className="bg-cobalt-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-cobalt-600 inline-flex items-center gap-2 transition-colors"
              >
                Visit Website
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Save button */}
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              aria-label={saved ? "Unsave program" : "Save program"}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-roman-500 hover:border-roman-200 transition-colors"
            >
              <Heart
                className="w-4 h-4"
                fill={saved ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      <main className="pb-24 lg:pb-0">
        {/* Overview section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            About This Program
          </h2>
          {descriptionParagraphs.length > 0 ? (
            <div className="space-y-4">
              {descriptionParagraphs.map((para, index) => (
                <p key={index} className="text-base text-slate-700 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base text-slate-400 italic">
              No description provided yet.
            </p>
          )}
        </section>

        {/* Highlights section */}
        {program.highlights.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Program Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {program.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-3"
                >
                  <Star className="w-4 h-4 text-sun-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700">{highlight}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* What's Included section */}
        {program.whatsIncluded.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              What's Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {program.whatsIncluded.map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <span className="w-5 h-5 rounded-full bg-fern-50 text-fern-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Program Details band */}
        {programDetails.length > 0 && (
          <div className="bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Program Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {programDetails.map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <ProgramReviews programId={program._id} />
        </section>

        {/* Why Choose section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Why Students Choose {program.title}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                Starting Price
              </p>
              <p className="text-2xl font-bold text-cobalt-500">
                {program.cost ?? "—"}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                Student Rating
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {avgRating > 0 ? `${avgRating}/10` : "—"}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                Credits
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {program.creditsAvailable ?? "—"}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                Would Recommend
              </p>
              <p className="text-2xl font-bold text-slate-800">95%</p>
            </div>
          </div>
        </section>

        {/* Articles section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <ProgramArticles />
        </section>

        {/* Related Programs section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24 lg:pb-12">
          <RelatedPrograms
            currentProgramId={program._id}
            subjectAreas={program.subjectAreas ?? []}
          />
        </section>
      </main>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex gap-3 shadow-lg">
        <button
          type="button"
          className="flex-1 border border-cobalt-500 text-cobalt-500 text-sm font-semibold px-5 py-2 rounded-lg hover:bg-cobalt-500/5 transition-colors"
        >
          Inquire Here
        </button>
        {program.applyUrl ? (
          <a
            href={program.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-cobalt-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-cobalt-600 inline-flex items-center justify-center gap-2 transition-colors"
          >
            Visit Website
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <button
            type="button"
            className="flex-1 bg-cobalt-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-cobalt-600 inline-flex items-center justify-center gap-2 transition-colors"
          >
            Visit Website
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
}

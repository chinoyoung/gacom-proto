"use client";

import { useState } from "react";
import {
  Zap,
  CheckCircle,
  MapPin,
  CalendarCheck,
  ShieldAlert,
  UserCheck,
  DollarSign,
  BookOpen,
  ArrowDown,
  ChevronRight,
  X,
} from "lucide-react";
import type { Program } from "../../_components/types";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

function formatUpdatedAt(updatedAt: number | undefined): string {
  if (!updatedAt) return "Recently updated";
  return new Date(updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function resolveAgeRequirement(ageRequirement: string | undefined): string {
  if (!ageRequirement) return "Contact provider";
  const normalized = ageRequirement.trim().toLowerCase();
  if (normalized === "all ages" || normalized === "all_ages") return "All Ages";
  return ageRequirement;
}

const EXCLUSION_PLACEHOLDERS = [
  "Airfare to and from your home country",
  "Travel insurance (recommended, not required)",
  "Personal expenses and spending money",
  "Visa application fees",
  "Optional weekend excursions",
];

export function DescriptionSection({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const paragraphs = program.description
    ? program.description.split(/\n\n+/).filter(Boolean)
    : [];
  const firstParagraph = paragraphs[0] ?? "";
  const remainingParagraphs = paragraphs.slice(1).join("\n\n");
  const isLong = paragraphs.length > 1;

  const displayedSubjects = showAllSubjects
    ? program.subjectAreas
    : program.subjectAreas.slice(0, 4);

  const optionalSet = new Set(program.optionalInclusions ?? []);
  const hasExclusions =
    program.exclusions != null && program.exclusions.length > 0;

  // Resolve starting price display for Quick Details
  let startingPriceDisplay: React.ReactNode;
  if (program.isFree) {
    startingPriceDisplay = (
      <span className="text-fern-500 font-medium">No Upfront Fees</span>
    );
  } else if (program.startingPrice != null) {
    startingPriceDisplay = formatPrice(program.startingPrice);
  } else {
    startingPriceDisplay = "$2,500";
  }

  return (
    <section className="flex flex-col lg:flex-row px-4 xl:px-0 py-4 gap-6">
      {/* Left column */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed text-neutral-700">
            {firstParagraph}
          </p>
          {isLong && (
            <>
              {expanded && (
                <p className="text-sm leading-relaxed text-neutral-700">
                  {remainingParagraphs}
                </p>
              )}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex mt-2 font-bold items-center gap-1 text-sm cursor-pointer"
              >
                {expanded ? "Read Less" : "Read More"}
                <ChevronRight
                  className={`${
                    expanded ? "-rotate-90" : ""
                  } transform w-3 h-3`}
                />
              </button>
            </>
          )}
        </div>

        {/* Program Highlights card */}
        {program.highlights.length > 0 && (
          <div className="bg-slate-50 border border-gray-200 rounded-md flex flex-col gap-2 md:gap-4 p-4">
            <h3 className="font-bold text-lg">Program Highlights</h3>
            <div className="flex flex-col gap-2 md:gap-4 text-sm">
              {program.highlights.map((h, i) => (
                <p key={i} className="flex gap-2 items-start">
                  <Zap className="shrink-0 w-4 h-4 mt-0.5 text-cobalt-500" />
                  {h}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* What's Included + Exclusions side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {program.whatsIncluded.length > 0 && (
            <div className="bg-slate-50 border border-gray-200 rounded-md flex flex-col gap-2 md:gap-4 p-4">
              <h3 className="font-bold text-lg">What&apos;s Included</h3>
              <div className="flex flex-col gap-2 md:gap-4 text-sm">
                {program.whatsIncluded.map((item, i) => (
                  <p key={i} className="flex gap-2 items-start">
                    <CheckCircle className="shrink-0 w-4 h-4 mt-0.5 text-fern-500" />
                    <span>
                      {item}
                      {optionalSet.has(item) && (
                        <span className="ml-1.5 text-xs text-slate-500">
                          (Optional)
                        </span>
                      )}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-gray-200 rounded-md flex flex-col gap-2 md:gap-4 p-4">
            <h3 className="font-bold text-lg">Exclusions</h3>
            <div className="flex flex-col gap-2 md:gap-4 text-sm">
              {hasExclusions
                ? program.exclusions!.map((item, i) => (
                    <p key={i} className="flex gap-2 items-start">
                      <X className="shrink-0 w-4 h-4 mt-0.5 text-roman-500" />
                      {item}
                    </p>
                  ))
                : EXCLUSION_PLACEHOLDERS.map((item, i) => (
                    <p key={i} className="flex gap-2 items-start">
                      <X className="shrink-0 w-4 h-4 mt-0.5 text-roman-500" />
                      {item}
                    </p>
                  ))}
            </div>
          </div>
        </div>

      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4 lg:w-[400px] w-full shrink-0">
        {/* Quick Details card */}
        <div className="flex flex-col gap-4 w-full shrink-0 bg-slate-50 rounded-md p-4 overflow-clip border border-gray-200">
          <h3 className="text-xl font-bold">Quick Details</h3>

          {/* Location */}
          <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
            <div>
              <p className="font-bold">Location</p>
              <p>
                {program.city}, {program.country}
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
            <CalendarCheck className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
            <div>
              <p className="font-bold">Availability</p>
              {program.terms.length > 0 && (
                <p>{program.terms.join(", ")}</p>
              )}
              {program.duration && <p>{program.duration}</p>}
            </div>
          </div>

          {/* Starting Price */}
          <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
            <DollarSign className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
            <div>
              <p className="font-bold">Starting Price</p>
              <p>{startingPriceDisplay}</p>
            </div>
          </div>

          {/* Age Requirement */}
          <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
            <div>
              <p className="font-bold">Age Requirement</p>
              <p>{resolveAgeRequirement(program.ageRequirement)}</p>
            </div>
          </div>

          {/* Types & Subjects */}
          {program.subjectAreas.length > 0 && (
            <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
              <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
              <div>
                <p className="font-bold">Types &amp; Subjects</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {displayedSubjects.map((s, i) => (
                    <span
                      key={i}
                      className="bg-slate-200 text-xs px-2 py-0.5 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {program.subjectAreas.length > 4 && (
                  <button
                    onClick={() => setShowAllSubjects((v) => !v)}
                    className="text-xs text-cobalt-500 font-bold mt-1 cursor-pointer"
                  >
                    {showAllSubjects
                      ? "Show less"
                      : `+${program.subjectAreas.length - 4} more`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Guidelines */}
          {program.eligibleNationalities.length > 0 && (
            <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
              <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
              <div>
                <p className="font-bold">Guidelines</p>
                <p>{program.eligibleNationalities.join(", ")}</p>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
            <CalendarCheck className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
            <div>
              <p className="font-bold">Last Updated</p>
              <p className="text-slate-500">{formatUpdatedAt(program.updatedAt)}</p>
            </div>
          </div>

          {/* See all details link */}
          <a
            href="#details"
            className="font-bold text-sm border border-gray-200 rounded-md bg-white py-2.5 justify-center flex gap-2 items-center"
          >
            See all program details
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>

    </section>
  );
}

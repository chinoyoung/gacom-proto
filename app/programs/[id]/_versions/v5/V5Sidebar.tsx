"use client";

import { useState } from "react";
import {
  MapPin,
  CalendarCheck,
  DollarSign,
  ShieldAlert,
  BookOpen,
  UserCheck,
  Clock,
} from "lucide-react";
import type { Program } from "../../_components/types";

export default function V5Sidebar({ program }: { program: Program }) {
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const priceValue =
    program.startingPrice != null
      ? `$${program.startingPrice.toLocaleString()}`
      : program.cost ?? "Contact Provider";

  const availability = [
    program.terms?.length ? program.terms.join(", ") : null,
    program.duration ?? null,
  ]
    .filter(Boolean)
    .join(" · ");

  const displayedSubjects = showAllSubjects
    ? program.subjectAreas
    : program.subjectAreas.slice(0, 4);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900">Quick Details</h3>

      {/* Location */}
      <div className="flex items-start gap-2.5">
        <MapPin className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</span>
          <span className="text-sm text-slate-900">{program.city}, {program.country}</span>
        </div>
      </div>

      {/* Availability */}
      {availability && (
        <div className="flex items-start gap-2.5">
          <CalendarCheck className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Availability</span>
            <span className="text-sm text-slate-900">{availability}</span>
          </div>
        </div>
      )}

      {/* Starting Price */}
      <div className="flex items-start gap-2.5">
        <DollarSign className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Program Costs</span>
          <span className="text-sm text-slate-900">{priceValue}</span>
        </div>
      </div>

      {/* Age Requirement */}
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Age</span>
          <span className="text-sm text-slate-900">{program.ageRequirement ?? "Varies"}</span>
        </div>
      </div>

      {/* Types & Subjects */}
      {program.subjectAreas.length > 0 && (
        <div className="flex items-start gap-2.5">
          <BookOpen className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Types &amp; Subjects</span>
            <div className="flex flex-wrap gap-1">
              {displayedSubjects.map((s, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md">
                  {s}
                </span>
              ))}
            </div>
            {program.subjectAreas.length > 4 && (
              <button
                onClick={() => setShowAllSubjects((v) => !v)}
                className="text-xs text-cobalt-500 font-bold mt-0.5 cursor-pointer self-start"
              >
                {showAllSubjects ? "Show less" : `+${program.subjectAreas.length - 4} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nationalities */}
      {program.eligibleNationalities.length > 0 && (
        <div className="flex items-start gap-2.5">
          <UserCheck className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nationalities</span>
            <span className="text-sm text-slate-900">{program.eligibleNationalities.join(", ")}</span>
          </div>
        </div>
      )}

      {/* Inquire link */}
      <a
        href="#inquiry-form"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("[data-inquiry-form]")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="block text-center text-sm font-semibold border border-slate-300 rounded-md py-2.5 hover:bg-slate-50 transition-colors text-slate-700 mt-2"
      >
        Inquire about this program
      </a>

      {/* Updated date */}
      {program.updatedAt && (
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Clock className="w-3 h-3" />
          Updated{" "}
          {new Date(program.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}

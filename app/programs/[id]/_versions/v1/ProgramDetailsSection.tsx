"use client";

import { useState } from "react";
import {
  MapPin,
  BookOpen,
  CalendarCheck,
  ShieldAlert,
  UserCheck,
  DollarSign,
} from "lucide-react";
import type { Program } from "../../_components/types";

export function ProgramDetailsSection({ program }: { program: Program }) {
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const displayedSubjects = showAllSubjects
    ? program.subjectAreas
    : program.subjectAreas.slice(0, 4);

  return (
    <section className="flex flex-col px-4 xl:px-0 gap-2">
      <div>
        <h2 className="flex items-center text-2xl font-bold gap-2">
          Program Details
        </h2>
        <p className="text-sm">
          Learn all the nitty gritty details you need to know
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 border-b border-gray-200 pb-4">
        {/* Locations */}
        <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <MapPin className="shrink-0 w-4 h-4" />
            <p className="font-bold text-sm lg:text-base">Locations</p>
          </div>
          <p className="text-sm ml-2">
            {program.city},{" "}
            <strong>{program.country}</strong>
          </p>
        </div>

        {/* Types & Subjects */}
        {program.subjectAreas.length > 0 && (
          <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
            <div className="flex gap-2 items-center">
              <BookOpen className="shrink-0 w-4 h-4" />
              <p className="font-bold text-sm lg:text-base">
                Types &amp; Subjects
              </p>
            </div>
            <div className="text-sm ml-2">
              <div className="flex flex-wrap gap-1">
                {displayedSubjects.map((s, i) => (
                  <span key={i} className="text-sm">
                    {i > 0 ? ", " : ""}
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
                    : `Show all (${program.subjectAreas.length})`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <CalendarCheck className="shrink-0 w-4 h-4" />
            <p className="font-bold text-sm lg:text-base">Availability</p>
          </div>
          <div className="text-sm ml-2">
            {program.terms.length > 0 && <p>{program.terms.join(", ")}</p>}
            {program.duration && <p>{program.duration}</p>}
          </div>
        </div>

        {/* Age Requirement */}
        <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <ShieldAlert className="shrink-0 w-4 h-4" />
            <p className="font-bold text-sm lg:text-base">Age Requirement</p>
          </div>
          <p className="text-sm ml-2">{program.ageRequirement ?? "Varies"}</p>
        </div>

        {/* Guidelines */}
        {program.eligibleNationalities.length > 0 && (
          <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
            <div className="flex gap-2 items-center">
              <UserCheck className="shrink-0 w-4 h-4" />
              <p className="font-bold text-sm lg:text-base">Guidelines</p>
            </div>
            <p className="text-sm ml-2">
              {program.eligibleNationalities.join(", ")}
            </p>
          </div>
        )}

        {/* Cost */}
        <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
          <div className="flex gap-2 items-center">
            <DollarSign className="shrink-0 w-4 h-4" />
            <p className="font-bold text-sm lg:text-base">Cost per week</p>
          </div>
          <p className="text-sm ml-2">{program.cost ?? "Contact Provider"}</p>
        </div>
      </div>
    </section>
  );
}

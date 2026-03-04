"use client";

import { useState } from "react";
import type { Program } from "./types";

interface QuickDetailsProps {
  program: Program;
}

// ─── Icon components ──────────────────────────────────────────────────────────

function MapPinIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
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
  );
}

function DollarIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg
      className="w-4 h-4 text-cobalt-500 shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path
        fillRule="evenodd"
        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-2.5 py-3 border-b border-slate-100 last:border-0">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="text-sm text-slate-800 leading-snug">{value}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuickDetails({ program }: QuickDetailsProps) {
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const SUBJECT_PREVIEW_COUNT = 3;
  const visibleSubjects = showAllSubjects
    ? program.subjectAreas
    : program.subjectAreas.slice(0, SUBJECT_PREVIEW_COUNT);
  const hasMoreSubjects =
    program.subjectAreas.length > SUBJECT_PREVIEW_COUNT;

  const yearsOffered =
    program.terms.length === 4 ||
    program.terms.map((t) => t.toLowerCase()).includes("year round")
      ? "Year Round"
      : program.terms.map((t) => capitalizeFirst(t)).join(", ");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
      <div className="px-5 py-4 bg-cobalt-500">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Quick Details</h2>
      </div>

      <div className="px-5">
        <DetailRow
          icon={<MapPinIcon />}
          label="Location"
          value={`${program.city}, ${program.country}`}
        />

        <DetailRow
          icon={<CalendarIcon />}
          label="Terms Available"
          value={
            program.terms.length > 0
              ? program.terms.map((t) => capitalizeFirst(t)).join(", ")
              : "Contact Provider"
          }
        />

        <DetailRow
          icon={<ClockIcon />}
          label="Years Offered"
          value={yearsOffered || "Contact Provider"}
        />

        <DetailRow
          icon={<DollarIcon />}
          label="Cost"
          value={program.cost ?? "Contact Provider for Cost Details"}
        />

        <DetailRow
          icon={<GraduationCapIcon />}
          label="Education Levels"
          value={
            program.educationLevels.length > 0
              ? program.educationLevels
                  .map((l) => capitalizeFirst(l))
                  .join(", ")
              : "Open to All"
          }
        />

        <DetailRow
          icon={<BookIcon />}
          label="Types & Subjects"
          value={
            program.subjectAreas.length > 0 ? (
              <span>
                {visibleSubjects.join(", ")}
                {hasMoreSubjects && !showAllSubjects && (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => setShowAllSubjects(true)}
                      className="text-cobalt-500 hover:underline font-medium cursor-pointer"
                    >
                      Show all
                    </button>
                  </>
                )}
                {showAllSubjects && hasMoreSubjects && (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => setShowAllSubjects(false)}
                      className="text-cobalt-500 hover:underline font-medium cursor-pointer"
                    >
                      Show less
                    </button>
                  </>
                )}
              </span>
            ) : (
              "Not specified"
            )
          }
        />

        <DetailRow
          icon={<GlobeIcon />}
          label="Eligible Nationalities"
          value={
            program.eligibleNationalities.length > 0
              ? program.eligibleNationalities.join(", ")
              : "All nationalities welcome"
          }
        />

        <DetailRow
          icon={<HomeIcon />}
          label="Housing"
          value={program.housingType ?? "Varies"}
        />

        <DetailRow
          icon={<ChatIcon />}
          label="Language of Instruction"
          value={program.languageOfInstruction ?? "English"}
        />

        <DetailRow
          icon={<CertificateIcon />}
          label="Credits Available"
          value={program.creditsAvailable ?? "Varies"}
        />
      </div>
    </div>
  );
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

"use client";

import { useState } from "react";
import type { Program } from "./types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function MapPinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function ClipboardListIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
}

function AcademicCapIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEM_LIMIT = 3;

// ─── Expandable list ─────────────────────────────────────────────────────────

function ExpandableList({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > ITEM_LIMIT;
  const visible = expanded ? items : items.slice(0, ITEM_LIMIT);

  return (
    <div className="flex flex-col gap-1">
      {visible.map((item) => (
        <span key={item} className="text-sm text-slate-700">
          {item}
        </span>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start mt-1 text-xs font-semibold text-cobalt-600 hover:text-cobalt-700 transition-colors focus-visible:outline-none"
        >
          {expanded ? "Show less ↑" : "Show all ↓"}
        </button>
      )}
    </div>
  );
}

// ─── Detail card ─────────────────────────────────────────────────────────────

function DetailCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-bold text-slate-900">{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProgramDetails({ program }: { program: Program }) {
  const hasLocation = program.city || program.country;
  const hasSubjects = program.subjectAreas?.length > 0;
  const hasAvailability = program.terms?.length > 0 || program.duration;
  const hasWhatsIncluded = program.whatsIncluded?.length > 0;

  // These cards always render with fallback text
  const alwaysShow = true;

  const hasAnyContent =
    hasLocation ||
    hasSubjects ||
    hasAvailability ||
    hasWhatsIncluded ||
    alwaysShow;

  if (!hasAnyContent) return null;

  return (
    <section aria-labelledby="program-details-heading">
      <div className="mb-6">
        <h2
          id="program-details-heading"
          className="text-2xl font-bold text-slate-900"
        >
          Program Details
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Learn all the nitty gritty details you need to know
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location */}
        {hasLocation && (
          <DetailCard icon={<MapPinIcon />} title="Location">
            <p className="text-sm text-slate-700">
              {[program.city, program.country].filter(Boolean).join(", ")}
            </p>
          </DetailCard>
        )}

        {/* Subjects & Courses */}
        {hasSubjects && (
          <DetailCard icon={<DocumentIcon />} title="Subjects & Courses">
            <ExpandableList items={program.subjectAreas} />
          </DetailCard>
        )}

        {/* Availability */}
        {hasAvailability && (
          <DetailCard icon={<CalendarIcon />} title="Availability">
            <div className="flex flex-col gap-2">
              {program.terms?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Terms
                  </p>
                  <ExpandableList items={program.terms} />
                </div>
              )}
              {program.duration && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Duration
                  </p>
                  <p className="text-sm text-slate-700">{program.duration}</p>
                </div>
              )}
            </div>
          </DetailCard>
        )}

        {/* Age Requirement — always shown */}
        <DetailCard icon={<ShieldIcon />} title="Age Requirement">
          <p className="text-sm text-slate-700">
            {program.ageRequirement ?? "Age Requirement Varies"}
          </p>
        </DetailCard>

        {/* Guidelines — always shown */}
        <DetailCard icon={<CompassIcon />} title="Guidelines">
          {program.eligibleNationalities?.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Nationalities
              </p>
              <ExpandableList items={program.eligibleNationalities} />
            </div>
          ) : (
            <p className="text-sm text-slate-700">Open to All</p>
          )}
        </DetailCard>

        {/* Cost — always shown */}
        <DetailCard icon={<DollarIcon />} title="Cost">
          {program.cost ? (
            <p className="text-sm text-slate-700">{program.cost}</p>
          ) : (
            <p className="text-sm text-cobalt-600">
              Contact Provider for Cost Details
            </p>
          )}
        </DetailCard>

        {/* What's Included */}
        {hasWhatsIncluded && (
          <DetailCard icon={<ClipboardListIcon />} title="What's Included">
            <ExpandableList items={program.whatsIncluded} />
          </DetailCard>
        )}

        {/* Accommodation — always shown */}
        <DetailCard icon={<HomeIcon />} title="Accommodation">
          <p className="text-sm text-slate-700">
            {program.housingType ?? "Varies"}
          </p>
        </DetailCard>

        {/* Qualifications & Experience — always shown */}
        <DetailCard
          icon={<AcademicCapIcon />}
          title="Qualifications & Experience"
        >
          {program.educationLevels?.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Accepted Education Levels
              </p>
              <ExpandableList items={program.educationLevels} />
            </div>
          ) : (
            <p className="text-sm text-slate-700">Open to All</p>
          )}
        </DetailCard>
      </div>
    </section>
  );
}

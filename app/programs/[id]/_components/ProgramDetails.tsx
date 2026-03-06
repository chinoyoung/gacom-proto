"use client";

import { useState } from "react";
import type { Program } from "./types";

// ─── Show More row (for long lists) ──────────────────────────────────────────

const LIST_LIMIT = 5;

function DetailRow({
  label,
  items,
  urgent,
}: {
  label: string;
  items: string[];
  urgent?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > LIST_LIMIT;
  const visible = expanded ? items : items.slice(0, LIST_LIMIT);

  return (
    <div className="flex gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <dt className="w-40 shrink-0 text-xs font-medium text-slate-400 leading-5 pt-px">
        {label}
      </dt>
      <dd className={["text-sm leading-5 flex-1", urgent ? "text-roman-700 font-medium" : "text-slate-700"].join(" ")}>
        {items.length === 1 ? (
          items[0]
        ) : (
          <span className="flex flex-col gap-0.5">
            {visible.map((item) => (
              <span key={item}>{item}</span>
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="self-start mt-1 text-xs font-medium text-cobalt-600 hover:text-cobalt-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400 rounded"
              >
                {expanded ? "Show less" : `+${items.length - LIST_LIMIT} more`}
              </button>
            )}
          </span>
        )}
      </dd>
    </div>
  );
}

// ─── Group ────────────────────────────────────────────────────────────────────

function DetailGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <dl>{children}</dl>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProgramDetails({ program }: { program: Program }) {
  const hasAnyContent =
    program.terms?.length > 0 ||
    program.duration ||
    program.educationLevels?.length > 0 ||
    program.eligibleNationalities?.length > 0 ||
    program.ageRequirement ||
    program.cost ||
    program.whatsIncluded?.length > 0 ||
    program.subjectAreas?.length > 0 ||
    program.housingType ||
    program.languageOfInstruction ||
    program.creditsAvailable ||
    program.applicationDeadline;

  if (!hasAnyContent) return null;

  return (
    <section aria-labelledby="program-details-heading">
      <h2
        id="program-details-heading"
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        Program Details
      </h2>

      <div className="border border-slate-200 px-5 py-5 flex flex-col divide-y divide-slate-100 gap-5">

        {/* ── Logistics ── */}
        <DetailGroup label="Logistics">
          <DetailRow
            label="Location"
            items={[[program.city, program.country].filter(Boolean).join(", ")]}
          />
          {program.terms?.length > 0 && (
            <DetailRow label="Availability" items={program.terms} />
          )}
          {program.duration && (
            <DetailRow label="Duration" items={[program.duration]} />
          )}
        </DetailGroup>

        {/* ── Eligibility ── */}
        {(program.educationLevels?.length > 0 ||
          program.eligibleNationalities?.length > 0 ||
          program.ageRequirement) && (
          <DetailGroup label="Eligibility">
            {program.educationLevels?.length > 0 && (
              <DetailRow label="Education levels" items={program.educationLevels} />
            )}
            {program.eligibleNationalities?.length > 0 && (
              <DetailRow label="Nationalities" items={program.eligibleNationalities} />
            )}
            {program.ageRequirement && (
              <DetailRow label="Age requirement" items={[program.ageRequirement]} />
            )}
          </DetailGroup>
        )}

        {/* ── Cost & Inclusions ── */}
        {(program.cost || program.whatsIncluded?.length > 0) && (
          <DetailGroup label="Cost & inclusions">
            {program.cost && (
              <DetailRow label="Cost" items={[program.cost]} />
            )}
            {program.whatsIncluded?.length > 0 && (
              <DetailRow label="Includes" items={program.whatsIncluded} />
            )}
          </DetailGroup>
        )}

        {/* ── Academic ── */}
        {(program.subjectAreas?.length > 0 ||
          program.housingType ||
          program.languageOfInstruction ||
          program.creditsAvailable ||
          program.applicationDeadline) && (
          <DetailGroup label="Academic">
            {program.subjectAreas?.length > 0 && (
              <DetailRow label="Subjects" items={program.subjectAreas} />
            )}
            {program.housingType && (
              <DetailRow label="Housing" items={[program.housingType]} />
            )}
            {program.languageOfInstruction && (
              <DetailRow label="Language" items={[program.languageOfInstruction]} />
            )}
            {program.creditsAvailable && (
              <DetailRow label="Credits" items={[program.creditsAvailable]} />
            )}
            {program.applicationDeadline && (
              <DetailRow label="Deadline" items={[program.applicationDeadline]} urgent />
            )}
          </DetailGroup>
        )}

      </div>
    </section>
  );
}

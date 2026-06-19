"use client";

import { useState } from "react";
import {
  MapPin,
  BookOpen,
  Calendar,
  Globe,
  GraduationCap,
  Home,
  FileText,
  ShieldCheck,
  Clock3,
  Languages,
  AlarmClock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Program } from "../../_components/types";
import { CommentAnchor } from "@/components/comments/CommentAnchor";

const PREVIEW_COUNT = 4;

function ExpandableList({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = items.length > PREVIEW_COUNT;
  const visible = expanded || !isLong ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col gap-1">
      <ul className="flex flex-col gap-1">
        {visible.map((item, i) => (
          <li key={i} className="text-[15px] text-slate-700 leading-snug">
            {item}
          </li>
        ))}
      </ul>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 inline-flex items-center gap-1 self-start text-sm font-semibold text-cobalt-500 hover:text-cobalt-600 transition-colors cursor-pointer"
        >
          {expanded ? "Show less" : `Show all (${items.length})`}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

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
    <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="shrink-0 text-cobalt-500">{icon}</span>
        <h3 className="text-[15px] font-bold text-zinc-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SingleValue({ value }: { value: React.ReactNode }) {
  return <p className="text-[15px] text-slate-700 leading-snug">{value}</p>;
}

// Static demo values for categories not present in the data model (prototype only).
const DEMO_LOCATIONS = [
  "Gold Coast, Australia",
  "San Jose, Costa Rica",
  "London, England",
  "Dublin, Ireland",
  "Barcelona, Spain",
  "Tokyo, Japan",
];
const DEMO_ACCOMMODATION = [
  "Apartment/Flat",
  "Dormitory",
  "Home-stays",
  "Shared Housing",
  "Private Studio",
];
const DEMO_APPLICATION = [
  "Online Application",
  "Interview",
  "Reference Letter",
  "Resume/CV",
];

export default function V6ProgramDetails({ program }: { program: Program }) {
  const iconSize = 18;

  return (
    <CommentAnchor id="details">
      <section aria-labelledby="program-details-heading">
        <h2
          id="program-details-heading"
          className="text-2xl font-semibold text-zinc-900 tracking-[-0.5px]"
        >
          Program Details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Learn all the nitty gritty details you need to know
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Locations (static demo) */}
          <DetailCard icon={<MapPin size={iconSize} aria-hidden="true" />} title="Locations">
            <ExpandableList items={DEMO_LOCATIONS} />
          </DetailCard>

          {/* Fields & Subjects */}
          <DetailCard icon={<BookOpen size={iconSize} aria-hidden="true" />} title="Fields & Subjects">
            {program.subjectAreas.length > 0 ? (
              <ExpandableList items={program.subjectAreas} />
            ) : (
              <SingleValue value="Contact program" />
            )}
          </DetailCard>

          {/* Available Terms */}
          <DetailCard icon={<Calendar size={iconSize} aria-hidden="true" />} title="Available Terms">
            {program.terms.length > 0 ? (
              <ExpandableList items={program.terms} />
            ) : (
              <SingleValue value="Contact program" />
            )}
          </DetailCard>

          {/* Eligible Nationalities */}
          <DetailCard icon={<Globe size={iconSize} aria-hidden="true" />} title="Eligible Nationalities">
            {program.eligibleNationalities.length > 0 ? (
              <ExpandableList items={program.eligibleNationalities} />
            ) : (
              <SingleValue value="All nationalities welcome" />
            )}
          </DetailCard>

          {/* Education Levels */}
          <DetailCard icon={<GraduationCap size={iconSize} aria-hidden="true" />} title="Education Levels">
            {program.educationLevels.length > 0 ? (
              <ExpandableList items={program.educationLevels} />
            ) : (
              <SingleValue value="Contact program" />
            )}
          </DetailCard>

          {/* Accommodation Options (static demo) */}
          <DetailCard icon={<Home size={iconSize} aria-hidden="true" />} title="Accommodation Options">
            <ExpandableList items={DEMO_ACCOMMODATION} />
          </DetailCard>

          {/* Application Procedures (static demo) */}
          <DetailCard icon={<FileText size={iconSize} aria-hidden="true" />} title="Application Procedures">
            <ExpandableList items={DEMO_APPLICATION} />
          </DetailCard>

          {/* Age Requirement */}
          <DetailCard icon={<ShieldCheck size={iconSize} aria-hidden="true" />} title="Age Requirement">
            <SingleValue value={program.ageRequirement || "18+"} />
          </DetailCard>

          {/* Program Length */}
          <DetailCard icon={<Clock3 size={iconSize} aria-hidden="true" />} title="Program Length">
            <SingleValue value={program.duration || "Semester"} />
          </DetailCard>

          {/* Language */}
          <DetailCard icon={<Languages size={iconSize} aria-hidden="true" />} title="Language">
            <SingleValue value={program.languageOfInstruction || "English"} />
          </DetailCard>

          {/* Housing */}
          <DetailCard icon={<Home size={iconSize} aria-hidden="true" />} title="Housing">
            <SingleValue value={program.housingType || "Contact for details"} />
          </DetailCard>

          {/* Next Deadline */}
          <DetailCard icon={<AlarmClock size={iconSize} aria-hidden="true" />} title="Next Deadline">
            <SingleValue
              value={
                program.applicationDeadline ? (
                  <span className="text-red-600 font-semibold">
                    {program.applicationDeadline}
                  </span>
                ) : (
                  "Rolling Admissions"
                )
              }
            />
          </DetailCard>
        </div>
      </section>
    </CommentAnchor>
  );
}

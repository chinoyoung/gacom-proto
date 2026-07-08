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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Program } from "../../_components/types";
import { CommentAnchor } from "@/components/comments/CommentAnchor";

const PREVIEW_COUNT = 4;
const CARD_BOX = "bg-slate-50 border border-slate-200 rounded-md p-5";

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="shrink-0 text-cobalt-500">{icon}</span>
      <h3 className="text-[15px] font-bold text-zinc-900">{title}</h3>
    </div>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, i) => (
        <li key={i} className="text-[15px] text-slate-700 leading-snug">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ToggleButton({
  expanded,
  count,
  onClick,
}: {
  expanded: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1 self-start text-sm font-semibold text-cobalt-500 hover:text-cobalt-600 transition-colors cursor-pointer"
    >
      {expanded ? "Show less" : `Show all (${count})`}
      {expanded ? (
        <ChevronUp className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// List card. When the list is long, "Show all" expands into an absolutely
// positioned overlay so the surrounding grid never reflows.
function ListCard({
  icon,
  title,
  items,
  emptyValue = "Contact program",
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  emptyValue?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = items.length > PREVIEW_COUNT;

  if (items.length === 0) {
    return (
      <div className={`${CARD_BOX} h-full`}>
        <CardHeader icon={icon} title={title} />
        <p className="text-[15px] text-slate-700 leading-snug">{emptyValue}</p>
      </div>
    );
  }

  // Short enough to fit — plain card, no expansion.
  if (!isLong) {
    return (
      <div className={`${CARD_BOX} h-full`}>
        <CardHeader icon={icon} title={title} />
        <ItemList items={items} />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Placeholder reserves the collapsed height so the grid never reflows. */}
      <div
        aria-hidden={expanded}
        className={`${CARD_BOX} h-full ${expanded ? "invisible" : ""}`}
      >
        <CardHeader icon={icon} title={title} />
        <ItemList items={items.slice(0, PREVIEW_COUNT)} />
        <ToggleButton
          expanded={false}
          count={items.length}
          onClick={() => setExpanded(true)}
        />
      </div>

      {/* Expanded overlay — grows over the card below while keeping its position. */}
      {expanded && (
        <div className="absolute inset-x-0 top-0 z-20">
          <div className={`${CARD_BOX} shadow-xl ring-1 ring-slate-200`}>
            <CardHeader icon={icon} title={title} />
            <ItemList items={items} />
            <ToggleButton
              expanded
              count={items.length}
              onClick={() => setExpanded(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ValueCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${CARD_BOX} h-full`}>
      <CardHeader icon={icon} title={title} />
      <p className="text-[15px] text-slate-700 leading-snug">{children}</p>
    </div>
  );
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

export default function V1ProgramDetails({ program }: { program: Program }) {
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
          <ListCard
            icon={<MapPin size={iconSize} aria-hidden="true" />}
            title="Locations"
            items={DEMO_LOCATIONS}
          />
          <ListCard
            icon={<BookOpen size={iconSize} aria-hidden="true" />}
            title="Fields & Subjects"
            items={program.subjectAreas}
          />
          <ListCard
            icon={<Calendar size={iconSize} aria-hidden="true" />}
            title="Available Terms"
            items={program.terms}
          />
          <ListCard
            icon={<Globe size={iconSize} aria-hidden="true" />}
            title="Eligible Nationalities"
            items={program.eligibleNationalities}
            emptyValue="All nationalities welcome"
          />
          <ListCard
            icon={<GraduationCap size={iconSize} aria-hidden="true" />}
            title="Education Levels"
            items={program.educationLevels}
          />
          <ListCard
            icon={<Home size={iconSize} aria-hidden="true" />}
            title="Accommodation Options"
            items={DEMO_ACCOMMODATION}
          />
          <ListCard
            icon={<FileText size={iconSize} aria-hidden="true" />}
            title="Application Procedures"
            items={DEMO_APPLICATION}
          />
          <ValueCard
            icon={<ShieldCheck size={iconSize} aria-hidden="true" />}
            title="Age Requirement"
          >
            {program.ageRequirement || "18+"}
          </ValueCard>
          <ValueCard
            icon={<Clock3 size={iconSize} aria-hidden="true" />}
            title="Program Length"
          >
            {program.duration || "Semester"}
          </ValueCard>
          <ValueCard
            icon={<Languages size={iconSize} aria-hidden="true" />}
            title="Language"
          >
            {program.languageOfInstruction || "English"}
          </ValueCard>
          <ValueCard
            icon={<Home size={iconSize} aria-hidden="true" />}
            title="Housing"
          >
            {program.housingType || "Contact for details"}
          </ValueCard>

        </div>
      </section>
    </CommentAnchor>
  );
}

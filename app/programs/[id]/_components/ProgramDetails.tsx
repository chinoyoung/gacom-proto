import {
  MapPin,
  GraduationCap,
  House,
  Calendar,
  Clock3,
  Languages,
  AlarmClock,
  BookOpen,
  Award,
  ArrowRight,
} from "lucide-react";
import type { Program } from "./types";
import { CommentAnchor } from "@/components/comments/CommentAnchor";

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-md px-4 py-4">
      <div className="shrink-0 text-cobalt-500 mt-1">{icon}</div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          {label}
        </span>
        <span className="text-[15px] text-zinc-900 font-medium leading-snug">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function ProgramDetails({ program }: { program: Program }) {
  const includesValue =
    program.whatsIncluded && program.whatsIncluded.length > 0
      ? program.whatsIncluded.slice(0, 3).join(", ")
      : "Tuition";

  const deadlineValue = program.applicationDeadline ? (
    <span className="text-red-600 font-semibold">
      {program.applicationDeadline}
    </span>
  ) : (
    "Rolling Admissions"
  );

  const detailItems: DetailItemProps[] = [
    {
      icon: <MapPin size={20} aria-hidden="true" />,
      label: "Location",
      value: `${program.city}, ${program.country}`,
    },
    {
      icon: <GraduationCap size={20} aria-hidden="true" />,
      label: "Program Type",
      value: "Study Abroad",
    },
    {
      icon: <House size={20} aria-hidden="true" />,
      label: "Housing",
      value: program.housingType || "Contact for details",
    },
    {
      icon: <Calendar size={20} aria-hidden="true" />,
      label: "Available Terms",
      value: program.terms.join(", "),
    },
    {
      icon: <Clock3 size={20} aria-hidden="true" />,
      label: "Program Length",
      value: program.duration || "Semester",
    },
    {
      icon: <Languages size={20} aria-hidden="true" />,
      label: "Language",
      value: program.languageOfInstruction || "English",
    },
    {
      icon: <AlarmClock size={20} aria-hidden="true" />,
      label: "Next Deadline",
      value: deadlineValue,
    },
    {
      icon: <BookOpen size={20} aria-hidden="true" />,
      label: "Credit Transfer",
      value: program.creditsAvailable || "Contact program",
    },
    {
      icon: <Award size={20} aria-hidden="true" />,
      label: "Acceptance Rate",
      value: "82% of applicants",
    },
  ];

  return (
    <CommentAnchor id="details">
      <section aria-labelledby="program-details-heading">
      {/* Section title */}
      <h2
        id="program-details-heading"
        className="text-2xl font-semibold text-zinc-900 tracking-[-0.5px] mb-8"
      >
        Program Details
      </h2>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
        {detailItems.map((item) => (
          <DetailItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
    </CommentAnchor>
  );
}

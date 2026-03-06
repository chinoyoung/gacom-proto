"use client";

import type { Program } from "./types";

interface QuickDetailsProps {
  program: Program;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUpdatedAt(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

// ─── Icon components ──────────────────────────────────────────────────────────

function MapPinIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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

function GraduationCapIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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

function CurrencyIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-cobalt-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 text-cobalt-500"
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

// ─── Grid cell ────────────────────────────────────────────────────────────────

interface GridCellProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  /** Span full row width when content is wider (e.g. Location) */
  fullWidth?: boolean;
}

function GridCell({ icon, label, value, fullWidth = false }: GridCellProps) {
  return (
    <div
      className={`bg-white px-4 py-3.5 flex flex-col gap-1.5 min-w-0${fullWidth ? " col-span-2" : ""}`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 leading-none">
          {label}
        </span>
      </div>
      <div className="text-sm text-slate-800 font-medium leading-snug min-w-0">
        {value}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuickDetails({ program }: QuickDetailsProps) {
  // Terms: show as comma-separated capitalised list
  const termsDisplay =
    program.terms.length > 0
      ? program.terms.map((t) => capitalizeFirst(t)).join(", ")
      : "Contact Provider";

  // Education levels
  const educationDisplay =
    program.educationLevels.length > 0
      ? program.educationLevels.map((l) => capitalizeFirst(l)).join(", ")
      : "Open to All";

  // Nationalities — show first 4 + "& X more" when the list is long
  const MAX_NATIONALITIES = 4;
  const nats = program.eligibleNationalities;
  const nationalitiesDisplay =
    nats.length === 0
      ? "Open to All"
      : nats.length <= MAX_NATIONALITIES
        ? nats.join(", ")
        : `${nats.slice(0, MAX_NATIONALITIES).join(", ")} & ${nats.length - MAX_NATIONALITIES} more`;

  // Build the ordered list of cells, conditionally including optional rows
  type CellDef = GridCellProps;

  const cells: CellDef[] = [
    {
      icon: <MapPinIcon />,
      label: "Location",
      value: `${program.city}, ${program.country}`,
      fullWidth: true,
    },
    {
      icon: <CalendarIcon />,
      label: "Terms",
      value: termsDisplay,
      fullWidth: true,
    },
    ...(program.duration
      ? [
          {
            icon: <ClockIcon />,
            label: "Duration",
            value: program.duration,
          } satisfies CellDef,
        ]
      : []),
    ...(program.cost
      ? [
          {
            icon: <CurrencyIcon />,
            label: "Cost",
            value: program.cost,
          } satisfies CellDef,
        ]
      : []),
    {
      icon: <GraduationCapIcon />,
      label: "Education",
      value: educationDisplay,
      fullWidth: true,
    },
    {
      icon: <GlobeIcon />,
      label: "Nationalities",
      value: (
        <span title={nats.length > 0 ? nats.join(", ") : undefined}>
          {nationalitiesDisplay}
        </span>
      ),
      fullWidth: true,
    },
    {
      icon: <HomeIcon />,
      label: "Housing",
      value: program.housingType ? capitalizeFirst(program.housingType) : "Varies",
      fullWidth: true,
    },
    {
      icon: <ChatIcon />,
      label: "Language",
      value: program.languageOfInstruction
        ? capitalizeFirst(program.languageOfInstruction)
        : "English",
      fullWidth: true,
    },
    ...(program.creditsAvailable
      ? [
          {
            icon: <CertificateIcon />,
            label: "Credits",
            value: program.creditsAvailable,
            fullWidth: true,
          } satisfies CellDef,
        ]
      : []),
    ...(program.applicationDeadline
      ? [
          {
            icon: <CalendarIcon />,
            label: "Deadline",
            value: (
              <span className="text-roman-700">{program.applicationDeadline}</span>
            ),
            fullWidth: true,
          } satisfies CellDef,
        ]
      : []),
  ];

  // Auto-expand the last cell to full width if it would otherwise be orphaned
  const halfWidthCount = cells.filter((c) => !c.fullWidth).length;
  const processedCells = cells.map((cell, i) => {
    if (i === cells.length - 1 && !cell.fullWidth && halfWidthCount % 2 !== 0) {
      return { ...cell, fullWidth: true };
    }
    return cell;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6 self-start">
      {/* Header */}
      <div className="px-5 py-4 bg-cobalt-500">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
          Quick Details
        </h2>
      </div>

      {/* 2-column grid — gaps are filled with the slate-100 background, giving the appearance of divider lines */}
      <div className="grid grid-cols-2 gap-px bg-slate-100">
        {processedCells.map((cell) => (
          <GridCell key={cell.label} {...cell} />
        ))}
      </div>

      {/* Apply CTA */}
      <div className="px-4 py-4 border-t border-slate-100 space-y-2">
        {program.applyUrl ? (
          <a
            href={program.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 text-sm font-semibold text-center text-white bg-cobalt-500 hover:bg-cobalt-600 rounded-lg transition-colors"
          >
            Apply Now
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-2.5 text-sm font-semibold text-white bg-cobalt-500 opacity-50 cursor-not-allowed rounded-lg"
          >
            Apply Now
          </button>
        )}
        <button
          type="button"
          className="w-full py-2.5 text-sm font-semibold text-cobalt-600 border border-cobalt-500 hover:bg-cobalt-50 rounded-lg transition-colors"
        >
          Send Inquiry
        </button>
      </div>

      {/* Last updated */}
      {(program.updatedAt ?? program._creationTime) && (
        <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-slate-400">
            Listing updated{" "}
            <span className="font-medium text-slate-500">
              {formatUpdatedAt(program.updatedAt ?? program._creationTime)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

import { CheckCircle2, XCircle } from "lucide-react";
import type { Program } from "../../_components/types";

const FILLER_EXCLUSIONS = [
  "International airfare and travel insurance",
  "Personal expenses and souvenirs",
  "Visa fees and vaccinations",
];

function buildIncluded(program: Program): string[] {
  if (program.whatsIncluded?.length > 0) return program.whatsIncluded;
  const derived: string[] = [];
  if (program.housingType) derived.push(`Housing: ${program.housingType}`);
  if (program.languageOfInstruction) derived.push(`Instruction in ${program.languageOfInstruction}`);
  if (program.creditsAvailable) derived.push(`${program.creditsAvailable} academic credit(s)`);
  if (program.duration) derived.push(`Program duration: ${program.duration}`);
  if (program.terms?.length) derived.push(`Available terms: ${program.terms.join(", ")}`);
  if (program.subjectAreas?.length) derived.push(`Subject areas covered: ${program.subjectAreas.slice(0, 3).join(", ")}`);
  return derived;
}

export default function V5WhatsIncluded({ program }: { program: Program }) {
  const included = buildIncluded(program).slice(0, 5);
  const exclusions = (program.exclusions?.length ? program.exclusions : FILLER_EXCLUSIONS).slice(0, 5);

  if (!included.length && !exclusions) return null;

  const bothPresent = included.length > 0 && !!exclusions;
  // Side by side when both exist → each list is single-column.
  // Only one present → that list spans full width with a 2-col item grid.
  const itemGridClass = bothPresent ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3";

  return (
    <div className={bothPresent ? "grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 items-start" : ""}>
      {included.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{"What's Included"}</h2>
          <div className={itemGridClass}>
            {included.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-fern-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {exclusions && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Exclusions</h2>
          <div className={itemGridClass}>
            {exclusions.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-roman-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

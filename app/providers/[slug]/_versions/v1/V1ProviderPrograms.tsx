import ProgramCard from "@/components/ProgramCard";
import type { ProviderProgram } from "../../_components/types";

interface Props {
  providerName: string;
  programs: ProviderProgram[];
}

export default function V1ProviderPrograms({ providerName, programs }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        {providerName} Programs
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        {programs.length} {programs.length === 1 ? "program" : "programs"} available
      </p>
      {programs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
          <p className="text-sm text-slate-500">
            No published programs from this provider yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program._id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}

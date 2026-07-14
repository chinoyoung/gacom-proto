"use client";

import ProgramCard from "@/components/ProgramCard";
import { CommentAnchor } from "@/components/comments/CommentAnchor";
import type { Provider, ProviderProgram } from "../../_components/types";

export default function V1ProviderPrograms({
  provider,
  programs,
}: {
  provider: Provider;
  programs: ProviderProgram[] | undefined;
}) {
  return (
    <CommentAnchor id="provider-programs">
      <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Programs by {provider.name}</h2>

        {programs === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-lg h-80" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <p className="text-slate-500 text-sm">This provider has no published programs yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        )}
      </section>
    </CommentAnchor>
  );
}

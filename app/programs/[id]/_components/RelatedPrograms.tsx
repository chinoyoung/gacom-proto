"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProgramCard from "@/components/ProgramCard";

interface RelatedProgramsProps {
    currentProgramId: string;
    subjectAreas: string[];
}

export default function RelatedPrograms({ currentProgramId, subjectAreas }: RelatedProgramsProps) {
    const allPrograms = useQuery(api.programs.listPrograms, { status: "published" });

    if (allPrograms === undefined) {
        return (
            <section className="mt-20 pt-10 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Programs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-100 rounded-lg h-80" />
                    ))}
                </div>
            </section>
        );
    }

    // Prefer programs sharing at least 1 subject area
    const relatedPrograms = allPrograms
        .filter((p) => p._id !== currentProgramId)
        .sort((a, b) => {
            const aMatches = a.subjectAreas?.filter((s) => subjectAreas.includes(s)).length ?? 0;
            const bMatches = b.subjectAreas?.filter((s) => subjectAreas.includes(s)).length ?? 0;
            return bMatches - aMatches;
        })
        .slice(0, 3);

    if (relatedPrograms.length === 0) return null;

    return (
        <section className="mt-20 pt-10 border-t border-slate-200 pb-12">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Other Programs You Might Like</h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${relatedPrograms.length >= 3 ? "lg:grid-cols-3" : ""} gap-8`}>
                    {relatedPrograms.map((program: any) => (
                        <ProgramCard key={program._id} program={program} />
                    ))}
                </div>
            </div>
        </section>
    );
}

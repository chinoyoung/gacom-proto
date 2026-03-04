"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProgramCard from "@/components/ProgramCard";

interface RelatedProgramsProps {
    currentProgramId: string;
}

export default function RelatedPrograms({ currentProgramId }: RelatedProgramsProps) {
    const allPrograms = useQuery(api.programs.listPrograms, { status: "published" });

    if (allPrograms === undefined) {
        return (
            <section className="mt-16 pt-16 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Programs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-80" />
                    ))}
                </div>
            </section>
        );
    }

    // Filter out the current program and take the first 3
    const relatedPrograms = allPrograms
        .filter((p) => p._id !== currentProgramId)
        .slice(0, 3);

    if (relatedPrograms.length === 0) return null;

    return (
        <section className="mt-16 pt-16 border-t border-gray-200 pb-12">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Other Programs You Might Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedPrograms.map((program: any) => (
                        <ProgramCard key={program._id} program={program} />
                    ))}
                </div>
            </div>
        </section>
    );
}

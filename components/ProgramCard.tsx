"use client";

import Link from "next/link";
import Image from "next/image";

interface Program {
    _id: string;
    title: string;
    provider: string;
    city: string;
    country: string;
    terms: string[];
    coverImage?: string;
    cost?: string;
    subjectAreas: string[];
    slug?: string;
}

export default function ProgramCard({ program }: { program: Program }) {
    const termColors: Record<string, string> = {
        fall: "bg-orange-100 text-orange-700 border-orange-200",
        spring: "bg-green-100 text-green-700 border-green-200",
        summer: "bg-yellow-100 text-yellow-700 border-yellow-200",
        winter: "bg-cobalt-50/20 text-cobalt-600 border-cobalt-200",
        academic_year: "bg-purple-100 text-purple-700 border-purple-200",
        "year round": "bg-teal-100 text-teal-700 border-teal-200",
    };

    function termClass(term: string): string {
        const key = term.toLowerCase();
        return termColors[key] ?? "bg-gray-100 text-gray-600 border-gray-200";
    }

    function capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
    }

    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group h-full">
            {/* Cover image */}
            <div className="relative h-48 bg-gradient-to-br from-slate-600 to-slate-800 overflow-hidden">
                {program.coverImage ? (
                    <Image
                        src={program.coverImage}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <svg
                            className="w-12 h-12 text-slate-500 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3 3.75h18"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs">No photo</span>
                    </div>
                )}

                {/* Location overlay badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    <svg
                        className="w-3 h-3 shrink-0"
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
                    {program.city}, {program.country}
                </div>
            </div>

            {/* Card body */}
            <div className="p-4 flex flex-col flex-1">
                {/* Provider */}
                <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wider mb-1">
                    {program.provider}
                </p>

                {/* Title */}
                <h2 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-cobalt-500 transition-colors">
                    {program.title}
                </h2>

                {/* Cost */}
                {program.cost && (
                    <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium text-gray-700">{program.cost}</span>
                    </p>
                )}

                {/* Terms badges */}
                {program.terms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {program.terms.slice(0, 3).map((term) => (
                            <span
                                key={term}
                                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${termClass(term)}`}
                            >
                                {capitalizeFirst(term)}
                            </span>
                        ))}
                        {program.terms.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border bg-gray-100 text-gray-500 border-gray-200">
                                +{program.terms.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Subject areas */}
                {program.subjectAreas.length > 0 && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                        {program.subjectAreas.slice(0, 2).join(" · ")}
                        {program.subjectAreas.length > 2
                            ? ` · +${program.subjectAreas.length - 2} more`
                            : ""}
                    </p>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA */}
                <Link
                    href={`/programs/${program.slug ?? program._id}`}
                    className="mt-2 block w-full text-center px-4 py-2 bg-cobalt-500 text-white font-semibold text-sm rounded-lg hover:bg-cobalt-600 transition-colors"
                >
                    View Program
                </Link>
            </div>
        </article>
    );
}

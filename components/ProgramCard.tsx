"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Check, ArrowRight } from "lucide-react";

interface Program {
    _id: string;
    title: string;
    provider: string;
    providerLogo?: string;
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    coverImage?: string;
    slug?: string;
}

export default function ProgramCard({ program }: { program: Program }) {
    return (
        <article className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
            {/* Image area */}
            <div className="relative aspect-[2/1] bg-slate-100 overflow-hidden">
                {program.coverImage ? (
                    <Image
                        src={program.coverImage}
                        alt={program.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <svg
                            className="w-12 h-12 text-slate-300 mb-2"
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
                        <span className="text-xs text-slate-400">No photo</span>
                    </div>
                )}

                {/* Heart / save button */}
                <button
                    type="button"
                    aria-label="Save program"
                    className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/90 text-cobalt-700 hover:bg-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                    <Heart className="w-5 h-5" fill="currentColor" />
                </button>
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col flex-1">
                {/* Provider row */}
                <div className="flex items-center gap-3">
                    {/* Logo tile */}
                    <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                        {program.providerLogo ? (
                            <img
                                src={program.providerLogo}
                                alt={program.provider}
                                className="w-full h-full object-contain p-1"
                            />
                        ) : (
                            <span className="text-lg font-semibold text-slate-400">
                                {program.provider.charAt(0)}
                            </span>
                        )}
                    </div>

                    {/* Text column */}
                    <div className="min-w-0">
                        <p className="text-base font-bold text-neutral-800 leading-snug line-clamp-1">
                            {program.provider}
                        </p>

                        {program.rating != null && (
                            <div className="flex items-center gap-1.5 mt-0.5 text-sm">
                                <span className="font-bold text-neutral-800">
                                    {program.rating.toFixed(2)}
                                </span>
                                <Star className="w-4 h-4 text-sun-500" fill="currentColor" />
                                {program.reviewCount != null && (
                                    <span className="text-slate-500">
                                        {program.reviewCount.toLocaleString()} reviews
                                    </span>
                                )}
                                {program.verified && (
                                    <>
                                        <span className="w-4 h-4 rounded-full bg-fern-500 inline-flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                        </span>
                                        <span className="sr-only">Verified</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-cobalt-700 leading-snug mt-4 line-clamp-2">
                    {program.title}
                </h2>

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA */}
                <Link
                    href={`/programs/${program.slug ?? program._id}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                    View Program <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </article>
    );
}

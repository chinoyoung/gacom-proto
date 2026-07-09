"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Globe, CircleCheck, ExternalLink } from "lucide-react";

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
    const href = `/programs/${program.slug ?? program._id}`;

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-md transition-all duration-300">
            {/* Save button */}
            <button
                type="button"
                aria-label="Save program"
                className="group absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent transition-all duration-300 active:scale-100"
            >
                <Heart className="h-7 w-7 fill-slate-900/35 text-white drop-shadow-md transition-colors group-hover:fill-red-400/40 group-hover:text-red-400" />
            </button>

            {/* Image */}
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
                {program.coverImage ? (
                    <Image
                        src={program.coverImage}
                        alt={program.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                        <svg className="mb-2 h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3 3.75h18" />
                        </svg>
                        <span className="text-xs text-slate-400">No photo</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex grow flex-col justify-between gap-2 px-4 py-3">
                {/* Provider row */}
                <div className="flex items-center gap-3 pb-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                        {program.providerLogo ? (
                            <img src={program.providerLogo} alt={program.provider} className="h-full w-full object-contain p-1" />
                        ) : (
                            <Globe className="h-5 w-5 text-slate-300" />
                        )}
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="line-clamp-1 text-sm font-bold text-slate-700">{program.provider}</p>
                        {program.rating != null && (
                            <div className="flex flex-row items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                    <span className="text-xs font-bold text-slate-800">{program.rating.toFixed(1)}</span>
                                    <Star className="h-3.5 w-3.5 text-sun-500" fill="currentColor" />
                                </div>
                                {program.reviewCount != null && (
                                    <span className="text-[11px] text-slate-500">{program.reviewCount.toLocaleString()} reviews</span>
                                )}
                                {program.verified && <CircleCheck className="h-4 w-4 text-fern-500" />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <Link
                    href={href}
                    className="line-clamp-2 text-left text-lg font-bold leading-6 text-cobalt-500 transition-all duration-300 hover:-translate-y-px hover:text-cobalt-600"
                >
                    {program.title}
                </Link>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
                <Link
                    href={href}
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-cobalt-500 py-2.5 transition-all duration-300 hover:bg-cobalt-600"
                >
                    <span className="text-sm font-bold text-white">View Program</span>
                    <ExternalLink className="h-3 w-3 text-white transition-all duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}

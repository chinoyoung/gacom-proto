"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

interface Article {
    _id: string;
    title: string;
    author: string;
    publishDate: string;
    tags: string[];
    coverImage?: string;
    slug: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
}

export default function ArticleCard({ article }: { article: Article }) {
    const [imageError, setImageError] = useState(false);
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        setFormattedDate(formatDate(article.publishDate));
    }, [article.publishDate]);

    return (
        <div className="relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300">
            {/* Save button */}
            <button
                type="button"
                aria-label="Save article"
                className="group absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent transition-all duration-300 active:scale-100"
            >
                <Heart className="h-7 w-7 fill-slate-900/35 text-white drop-shadow-md transition-colors group-hover:fill-red-400/40 group-hover:text-red-400" />
            </button>

            {/* Image */}
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-slate-100">
                {article.coverImage && !imageError ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        onError={() => setImageError(true)}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-300">
                        <svg className="mb-2 h-12 w-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 opacity-40">No preview</span>
                    </div>
                )}

                {/* Badge */}
                {article.tags.length > 0 && (
                    <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-cobalt-500 px-2 py-1 text-xs font-semibold text-white">
                            {article.tags[0]}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex grow flex-col gap-3 p-4">
                <Link
                    href={`/articles/${article.slug}`}
                    className="line-clamp-2 text-lg font-bold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:text-cobalt-600"
                >
                    {article.title}
                </Link>

                <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium">{article.author}</span>
                    <span>{formattedDate ?? ""}</span>
                </div>
            </div>
        </div>
    );
}

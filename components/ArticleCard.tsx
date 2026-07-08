"use client";

import { useState, useEffect } from "react";
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
        <article className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-[2/1] overflow-hidden bg-slate-100">
                {article.coverImage && !imageError ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        onError={() => setImageError(true)}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-300">
                        <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 opacity-40">No preview</span>
                    </div>
                )}

                {/* Badge Overlay */}
                {article.tags.length > 0 && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-cobalt-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                            {article.tags[0]}
                        </span>
                    </div>
                )}

                {/* Heart Button */}
                <button
                    aria-label="Save article"
                    className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/90 text-cobalt-700 hover:bg-white cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                    <Heart className="w-5 h-5" fill="currentColor" />
                </button>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-800 leading-snug mb-6 line-clamp-2 min-h-14">
                    {article.title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">
                        {article.author}
                    </span>
                    <span className="text-sm text-slate-400">
                        {formattedDate ?? ""}
                    </span>
                </div>
            </div>
        </article>
    );
}

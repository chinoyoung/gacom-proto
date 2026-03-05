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

function getRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US");
}

export default function ArticleCard({ article }: { article: Article }) {
    const [imageError, setImageError] = useState(false);
    const [relativeTime, setRelativeTime] = useState<string | null>(null);

    useEffect(() => {
        setRelativeTime(getRelativeTime(article.publishDate));
    }, [article.publishDate]);

    return (
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {article.coverImage && !imageError ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        onError={() => setImageError(true)}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                        <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No preview</span>
                    </div>
                )}

                {/* Badge Overlay */}
                {article.tags.length > 0 && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-[#172B4D]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase">
                            {article.tags[0]}
                        </span>
                    </div>
                )}

                {/* Heart Button */}
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#172B4D] leading-tight mb-6 line-clamp-2 min-h-[3rem]">
                    {article.title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">
                        {article.author}
                    </span>
                    <span className="text-sm text-slate-400">
                        {relativeTime ?? ""}
                    </span>
                </div>
            </div>
        </article>
    );
}

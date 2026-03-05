"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ArticleCard from "@/components/ArticleCard";

export default function ProgramArticles() {
    const articles = useQuery(api.articles.listArticles);

    if (articles === undefined) {
        return (
            <section className="mt-16 pt-16 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-5">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 rounded-xl h-96" />
                    ))}
                </div>
            </section>
        );
    }

    if (articles.length === 0) return null;

    // Show latest 3 articles
    const displayedArticles = articles.slice(0, 3);

    return (
        <section className="mt-16 pt-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-5">Expert Guides & Advice</h2>
                    <button className="text-cobalt-600 font-bold text-sm hover:underline">
                        Read more articles
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedArticles.map((article) => (
                        <ArticleCard key={article._id} article={article as any} />
                    ))}
                </div>
            </div>
        </section>
    );
}

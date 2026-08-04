"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ArticleCard from "@/components/ArticleCard";
import { CommentAnchor } from "@/components/comments/CommentAnchor";
import Pagination from "../../_components/Pagination";

const PAGE_SIZE = 3;

export default function V1ProviderArticles() {
    const articles = useQuery(api.articles.listArticles);
    const [page, setPage] = useState(0);

    if (articles === undefined) {
        return (
            <section className="mx-auto w-full max-w-7xl px-4 xl:px-0">
                <CommentAnchor id="provider-articles">
                    <div className="flex flex-col gap-4">
                        <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
                            <h2 className="flex items-center gap-2 text-2xl font-bold">Articles</h2>
                        </div>
                        <div className="flex w-full flex-col items-start gap-8 sm:grid-cols-2 md:grid lg:grid-cols-3 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 w-full rounded-lg bg-slate-200" />
                            ))}
                        </div>
                    </div>
                </CommentAnchor>
            </section>
        );
    }

    if (articles.length === 0) return null;

    const displayedArticles = articles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 xl:px-0">
            <CommentAnchor id="provider-articles">
                <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
                        <h2 className="flex items-center gap-2 text-2xl font-bold">Articles</h2>
                    </div>
                    <div className="flex w-full flex-col items-start gap-8 sm:grid-cols-2 md:grid lg:grid-cols-3">
                        {displayedArticles.map((article) => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                    </div>
                    {articles.length > PAGE_SIZE && (
                        <Pagination
                            current={page + 1}
                            max={Math.ceil(articles.length / PAGE_SIZE)}
                            onChange={setPage}
                        />
                    )}
                </div>
            </CommentAnchor>
        </section>
    );
}

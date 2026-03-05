"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LayoutGrid, FileText, Users, MessageSquare } from "lucide-react";
import ProgramsManager from "./_components/ProgramsManager";
import ArticlesManager from "./_components/ArticlesManager";
import ReviewsManager from "./_components/ReviewsManager";
import UsersManager from "./_components/UsersManager";

type AdminTab = "programs" | "articles" | "reviews" | "users";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>("programs");
    const [isCreatingArticle, setIsCreatingArticle] = useState(false);
    const [isCreatingReview, setIsCreatingReview] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-500">Manage all study abroad programs and editorial content.</p>
                    </div>
                    {activeTab === "programs" ? (
                        <Link
                            href="/admin/create-listing"
                            className="inline-flex items-center gap-2 bg-cobalt-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-cobalt-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Program
                        </Link>
                    ) : activeTab === "articles" ? (
                        <button
                            onClick={() => setIsCreatingArticle(true)}
                            className="inline-flex items-center gap-2 bg-cobalt-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-cobalt-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Article
                        </button>
                    ) : activeTab === "reviews" ? (
                        <button
                            onClick={() => setIsCreatingReview(true)}
                            className="inline-flex items-center gap-2 bg-cobalt-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-cobalt-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Review
                        </button>
                    ) : null}
                </div>

                {/* Tab Switcher */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
                    <div className="flex gap-8 border-b border-transparent">
                        <button
                            onClick={() => {
                                setActiveTab("programs");
                                setIsCreatingArticle(false);
                                setIsCreatingReview(false);
                            }}
                            className={`flex items-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === "programs"
                                ? "text-cobalt-600"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Manage Programs
                            {activeTab === "programs" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cobalt-600" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("articles");
                                setIsCreatingArticle(false);
                                setIsCreatingReview(false);
                            }}
                            className={`flex items-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === "articles"
                                ? "text-cobalt-600"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Manage Articles
                            {activeTab === "articles" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cobalt-600" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("reviews");
                                setIsCreatingArticle(false);
                                setIsCreatingReview(false);
                            }}
                            className={`flex items-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === "reviews"
                                ? "text-cobalt-600"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Manage Reviews
                            {activeTab === "reviews" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cobalt-600" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("users");
                                setIsCreatingArticle(false);
                                setIsCreatingReview(false);
                            }}
                            className={`flex items-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === "users"
                                ? "text-cobalt-600"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Manage Team
                            {activeTab === "users" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cobalt-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {activeTab === "programs" ? (
                    <ProgramsManager />
                ) : activeTab === "articles" ? (
                    <ArticlesManager
                        isCreating={isCreatingArticle}
                        onCancelCreate={() => setIsCreatingArticle(false)}
                    />
                ) : activeTab === "reviews" ? (
                    <ReviewsManager
                        isCreating={isCreatingReview}
                        onCancelCreate={() => setIsCreatingReview(false)}
                    />
                ) : (
                    <UsersManager />
                )}
            </div>
        </div>
    );
}

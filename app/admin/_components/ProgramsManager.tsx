"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function ProgramsManager() {
    const programs = useQuery(api.programs.listPrograms, {});
    const deleteProgram = useMutation(api.programs.deleteProgram);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredPrograms = programs?.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.provider.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil((filteredPrograms?.length ?? 0) / ITEMS_PER_PAGE);
    const paginatedPrograms = filteredPrograms?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (id: Id<"programs">) => {
        if (confirm("Are you sure you want to delete this program?")) {
            try {
                await deleteProgram({ id });
            } catch (err) {
                console.error("Failed to delete program:", err);
                alert("Failed to delete program");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title or provider..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:border-transparent transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xl font-extrabold text-gray-900">{programs?.length ?? 0}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Programs</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xl font-extrabold text-green-600">{programs?.filter(p => p.status === 'published').length ?? 0}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Published</span>
                    </div>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                {([
                    { value: "all", label: "All", count: programs?.length ?? 0 },
                    { value: "published", label: "Published", count: programs?.filter(p => p.status === "published").length ?? 0 },
                    { value: "draft", label: "Draft", count: programs?.filter(p => p.status === "draft").length ?? 0 },
                ] as const).map(({ value, label, count }) => (
                    <button
                        key={value}
                        onClick={() => {
                            setStatusFilter(value);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                            statusFilter === value
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {label}
                        <span className={`ml-1.5 text-xs ${
                            statusFilter === value ? "text-gray-500" : "text-gray-400"
                        }`}>
                            {count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Programs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Program</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">By</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {programs === undefined ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin" />
                                        <p className="text-sm font-medium text-gray-500">Loading programs...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredPrograms?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No programs found matching your search.
                                </td>
                            </tr>
                        ) : (
                            paginatedPrograms?.map((program) => (
                                <tr key={program._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{program.title}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Slug: {program.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${program.status === 'published'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {program.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{program.createdBy ?? "—"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/programs/${program.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-cobalt-600 transition-colors"
                                                title="View Public Page"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/create-listing?id=${program._id}`}
                                                className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                                title="Edit Program"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(program._id)}
                                                className="p-2 text-gray-400 hover:text-roman-600 transition-colors cursor-pointer"
                                                title="Delete Program"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {filteredPrograms && filteredPrograms.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredPrograms.length)} of {filteredPrograms.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium text-gray-700 px-2">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

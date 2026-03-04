"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function ProgramsManager() {
    const programs = useQuery(api.programs.listPrograms, {});
    const deleteProgram = useMutation(api.programs.deleteProgram);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPrograms = programs?.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.provider.toLowerCase().includes(searchQuery.toLowerCase())
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Total Programs</span>
                        <span className="text-xl font-extrabold text-gray-900">{programs?.length ?? 0}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Published</span>
                        <span className="text-xl font-extrabold text-green-600">{programs?.filter(p => p.status === 'published').length ?? 0}</span>
                    </div>
                </div>
            </div>

            {/* Programs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Program</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Provider</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {programs === undefined ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin" />
                                        <p className="text-sm font-medium text-gray-500">Loading programs...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredPrograms?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No programs found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filteredPrograms?.map((program) => (
                                <tr key={program._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{program.title}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Slug: {program.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-600">{program.provider}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{program.city}, {program.country}</span>
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
            </div>
        </div>
    );
}

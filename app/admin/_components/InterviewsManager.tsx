"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Edit2, Trash2, Loader2, Save, X, Search, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface InterviewsManagerProps {
    isCreating?: boolean;
    onCancelCreate?: () => void;
}

function getInitialFormData() {
    return {
        programId: "",
        name: "",
        role: "Alumni" as "Alumni" | "Staff",
        year: "",
        bio: "",
        quote: "",
        photo: "",
        status: "published" as "draft" | "published",
    };
}

export default function InterviewsManager({ isCreating, onCancelCreate }: InterviewsManagerProps) {
    const interviews = useQuery(api.interviews.listInterviews);
    const programs = useQuery(api.programs.listPrograms, {});
    const createInterview = useMutation(api.interviews.createInterview);
    const updateInterview = useMutation(api.interviews.updateInterview);
    const deleteInterview = useMutation(api.interviews.deleteInterview);
    const seedMockInterviews = useMutation(api.interviews.seedMockInterviews);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<Id<"interviews"> | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [formData, setFormData] = useState(getInitialFormData);
    const [seedProgramId, setSeedProgramId] = useState("");
    const [isSeeding, setIsSeeding] = useState(false);

    // Sync isCreating prop with internal isEditing state
    useEffect(() => {
        if (isCreating) {
            setIsEditing(true);
            setEditingId(null);
        }
    }, [isCreating]);

    const filteredInterviews = interviews?.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil((filteredInterviews?.length ?? 0) / ITEMS_PER_PAGE);
    const paginatedInterviews = filteredInterviews?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const resetForm = () => {
        setFormData(getInitialFormData());
        setEditingId(null);
        setIsEditing(false);
        if (onCancelCreate) onCancelCreate();
    };

    const handleEdit = (interview: NonNullable<typeof interviews>[number]) => {
        setEditingId(interview._id);
        setFormData({
            programId: interview.programId,
            name: interview.name,
            role: interview.role,
            year: interview.year,
            bio: interview.bio,
            quote: interview.quote,
            photo: interview.photo ?? "",
            status: interview.status,
        });
        setIsEditing(true);
    };

    const handleSubmit = async () => {
        if (!formData.programId) {
            alert("Please select a program.");
            return;
        }

        try {
            if (editingId) {
                await updateInterview({
                    id: editingId,
                    ...formData,
                    programId: formData.programId as Id<"programs">,
                });
            } else {
                await createInterview({
                    ...formData,
                    programId: formData.programId as Id<"programs">,
                });
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save interview:", err);
            alert("Error saving interview. Please check all fields and try again.");
        }
    };

    const handleDelete = async (id: Id<"interviews">) => {
        if (confirm("Are you sure you want to delete this interview?")) {
            await deleteInterview({ id });
        }
    };

    const handleSeed = async () => {
        if (!seedProgramId) {
            alert("Select a program to seed interviews for.");
            return;
        }
        if (!confirm(`Seed mock interviews for this program? This adds sample interviews alongside any existing ones.`)) return;
        setIsSeeding(true);
        try {
            const result = await seedMockInterviews({
                programId: seedProgramId as Id<"programs">,
            });
            alert(`Done! Seeded ${result} interviews.`);
        } catch (err) {
            console.error("Seed failed:", err);
            alert("Seeding failed. Check the console for details.");
        } finally {
            setIsSeeding(false);
        }
    };

    const programTitleById = (id: string) =>
        programs?.find((p) => p._id === id)?.title ?? "Unknown Program";

    const inputClass =
        "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cobalt-500 focus:bg-white outline-none transition-all";

    const labelClass = "block text-sm font-bold text-gray-700 mb-1";

    return (
        <div className="animate-in fade-in duration-500">
            {!isEditing && (
                <>
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search interviews..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:border-transparent transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                                    Total Interviews
                                </span>
                                <span className="text-xl font-extrabold text-gray-900">
                                    {interviews?.length ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bulk seed panel */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <Layers className="hidden sm:block w-5 h-5 text-gray-400 shrink-0" />
                        <span className="text-sm font-bold text-gray-600 shrink-0">Seed mock interviews</span>
                        <select
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-500 transition-all"
                            value={seedProgramId}
                            onChange={(e) => setSeedProgramId(e.target.value)}
                        >
                            <option value="">Select a program…</option>
                            {programs?.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleSeed}
                            disabled={isSeeding || !seedProgramId}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-cobalt-600 text-white rounded-lg text-sm font-bold hover:bg-cobalt-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                        >
                            {isSeeding ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Seeding…
                                </>
                            ) : (
                                <>
                                    <Layers className="w-4 h-4" />
                                    Seed mock interviews
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingId ? "Edit Interview" : "Create New Interview"}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Section: Interviewee & Program */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Interviewee &amp; Program
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Program</label>
                                    <select
                                        required
                                        className={inputClass}
                                        value={formData.programId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, programId: e.target.value })
                                        }
                                    >
                                        <option value="">Select a program...</option>
                                        {programs?.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Kristianna Williams"
                                        className={inputClass}
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select
                                        className={inputClass}
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                role: e.target.value as "Alumni" | "Staff",
                                            })
                                        }
                                    >
                                        <option value="Alumni">Alumni</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Year</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 2017"
                                        className={inputClass}
                                        value={formData.year}
                                        onChange={(e) =>
                                            setFormData({ ...formData, year: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Interview Content */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Interview Content
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>Bio</label>
                                    <textarea
                                        rows={4}
                                        required
                                        placeholder="Short bio shown on the card..."
                                        className={inputClass}
                                        value={formData.bio}
                                        onChange={(e) =>
                                            setFormData({ ...formData, bio: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Quote</label>
                                    <textarea
                                        rows={6}
                                        required
                                        placeholder="The interview excerpt shown on the card..."
                                        className={inputClass}
                                        value={formData.quote}
                                        onChange={(e) =>
                                            setFormData({ ...formData, quote: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Media & Publishing */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Media &amp; Publishing
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Photo URL (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="/images/interview1.webp or https://..."
                                        className={inputClass}
                                        value={formData.photo}
                                        onChange={(e) =>
                                            setFormData({ ...formData, photo: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select
                                        className={inputClass}
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value as "draft" | "published",
                                            })
                                        }
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2 bg-cobalt-600 text-white px-12 py-2.5 rounded-lg font-bold hover:bg-cobalt-700 transition-colors shadow-md active:scale-95 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {editingId ? "Update Interview" : "Save Interview"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Year
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Program
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {interviews === undefined ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredInterviews?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No interviews found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedInterviews?.map((interview) => (
                                    <tr
                                        key={interview._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-900 max-w-xs">
                                            <span className="line-clamp-2">{interview.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {interview.role}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {interview.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {programTitleById(interview.programId)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {interview.status === "published" ? (
                                                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(interview)}
                                                    className="p-2 text-gray-400 hover:text-cobalt-600 transition-colors cursor-pointer"
                                                    title="Edit interview"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(interview._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                                    title="Delete interview"
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
                    {filteredInterviews && filteredInterviews.length > ITEMS_PER_PAGE && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredInterviews.length)} of {filteredInterviews.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium text-gray-700 px-2">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

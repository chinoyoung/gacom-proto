"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Edit2, Trash2, Loader2, Save, X, Search, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import AIGenerateButton from "../create-listing/_components/AIGenerateButton";

interface ReviewsManagerProps {
    isCreating?: boolean;
    onCancelCreate?: () => void;
}

const baseFormData = {
    programId: "",
    reviewerName: "",
    reviewerCountry: "",
    date: "",
    reviewTitle: "",
    body: "",
    overallRating: 10,
    academicsRating: 10,
    livingSituationRating: 10,
    culturalImmersionRating: 10,
    programAdministrationRating: 10,
    healthAndSafetyRating: 10,
    communityRating: 10,
    photo: "",
    status: "published" as "draft" | "published",
};

function getInitialFormData() {
    return { ...baseFormData, date: new Date().toISOString().split("T")[0] };
}

export default function ReviewsManager({ isCreating, onCancelCreate }: ReviewsManagerProps) {
    const reviews = useQuery(api.reviews.listReviews);
    const programs = useQuery(api.programs.listPrograms, {});
    const createReview = useMutation(api.reviews.createReview);
    const updateReview = useMutation(api.reviews.updateReview);
    const deleteReview = useMutation(api.reviews.deleteReview);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<Id<"reviews"> | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState(getInitialFormData);

    // Sync isCreating prop with internal isEditing state
    useEffect(() => {
        if (isCreating) {
            setIsEditing(true);
            setEditingId(null);
        }
    }, [isCreating]);

    const filteredReviews = reviews?.filter(
        (r) =>
            r.reviewTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setFormData(getInitialFormData());
        setEditingId(null);
        setIsEditing(false);
        if (onCancelCreate) onCancelCreate();
    };

    const handleEdit = (review: NonNullable<typeof reviews>[number]) => {
        setEditingId(review._id);
        setFormData({
            programId: review.programId,
            reviewerName: review.reviewerName,
            reviewerCountry: review.reviewerCountry,
            // Convert "February 04, 2025" back to "2025-02-04" for the date input
            date: (() => {
                const parsed = new Date(review.date);
                return isNaN(parsed.getTime())
                    ? getInitialFormData().date
                    : parsed.toISOString().split("T")[0];
            })(),
            reviewTitle: review.reviewTitle,
            body: review.body,
            overallRating: review.overallRating,
            academicsRating: review.academicsRating,
            livingSituationRating: review.livingSituationRating,
            culturalImmersionRating: review.culturalImmersionRating,
            programAdministrationRating: review.programAdministrationRating,
            healthAndSafetyRating: review.healthAndSafetyRating,
            communityRating: review.communityRating,
            photo: review.photo ?? "",
            status: review.status,
        });
        setIsEditing(true);
    };

    const handleSubmit = async () => {
        if (!formData.programId) {
            alert("Please select a program.");
            return;
        }

        const formattedDate = new Date(formData.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        });

        const payload = {
            programId: formData.programId as Id<"programs">,
            reviewerName: formData.reviewerName,
            reviewerCountry: formData.reviewerCountry,
            date: formattedDate,
            reviewTitle: formData.reviewTitle,
            body: formData.body,
            overallRating: formData.overallRating,
            academicsRating: formData.academicsRating,
            livingSituationRating: formData.livingSituationRating,
            culturalImmersionRating: formData.culturalImmersionRating,
            programAdministrationRating: formData.programAdministrationRating,
            healthAndSafetyRating: formData.healthAndSafetyRating,
            communityRating: formData.communityRating,
            photo: formData.photo || undefined,
            status: formData.status,
        };

        try {
            if (editingId) {
                await updateReview({ id: editingId, ...payload });
            } else {
                await createReview(payload);
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save review:", err);
            alert("Error saving review. Please check all fields and try again.");
        }
    };

    const handleDelete = async (id: Id<"reviews">) => {
        if (confirm("Are you sure you want to delete this review?")) {
            await deleteReview({ id });
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
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:border-transparent transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                                Total Reviews
                            </span>
                            <span className="text-xl font-extrabold text-gray-900">
                                {reviews?.length ?? 0}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingId ? "Edit Review" : "Create New Review"}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Section: Reviewer & Program */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Reviewer &amp; Program
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
                                    <label className={labelClass}>Reviewer Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Jacquelaine Anderson"
                                        className={inputClass}
                                        value={formData.reviewerName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reviewerName: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Reviewer Country</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Liberia"
                                        className={inputClass}
                                        value={formData.reviewerCountry}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reviewerCountry: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Date</label>
                                    <input
                                        type="date"
                                        required
                                        className={inputClass}
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Review Content */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Review Content
                            </h3>
                            <AIGenerateButton
                                step="review"
                                formData={formData}
                                onGenerated={(fields) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        ...(fields.reviewTitle && { reviewTitle: fields.reviewTitle }),
                                        ...(fields.body && { body: fields.body }),
                                        ...(fields.reviewerName && { reviewerName: fields.reviewerName }),
                                        ...(fields.reviewerCountry && { reviewerCountry: fields.reviewerCountry }),
                                        ...(fields.overallRating != null && { overallRating: fields.overallRating }),
                                        ...(fields.academicsRating != null && { academicsRating: fields.academicsRating }),
                                        ...(fields.livingSituationRating != null && { livingSituationRating: fields.livingSituationRating }),
                                        ...(fields.culturalImmersionRating != null && { culturalImmersionRating: fields.culturalImmersionRating }),
                                        ...(fields.programAdministrationRating != null && { programAdministrationRating: fields.programAdministrationRating }),
                                        ...(fields.healthAndSafetyRating != null && { healthAndSafetyRating: fields.healthAndSafetyRating }),
                                        ...(fields.communityRating != null && { communityRating: fields.communityRating }),
                                    }));
                                }}
                                className="mb-6"
                            />
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>Review Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder='e.g. EXCEPTIONAL — I want to move to Thailand'
                                        className={inputClass}
                                        value={formData.reviewTitle}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reviewTitle: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Body</label>
                                    <textarea
                                        rows={6}
                                        required
                                        placeholder="Write the full review text here..."
                                        className={inputClass}
                                        value={formData.body}
                                        onChange={(e) =>
                                            setFormData({ ...formData, body: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Ratings */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Ratings
                            </h3>
                            <div className="space-y-6">
                                {/* Overall Rating */}
                                <div className="max-w-xs">
                                    <label className={labelClass}>Overall Rating (1–10)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        step={0.5}
                                        required
                                        className={inputClass}
                                        value={formData.overallRating}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                overallRating: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                </div>

                                {/* Category Ratings — 2-col grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Academics (1–10)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={0.5}
                                            required
                                            className={inputClass}
                                            value={formData.academicsRating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    academicsRating: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Living Situation (1–10)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={0.5}
                                            required
                                            className={inputClass}
                                            value={formData.livingSituationRating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    livingSituationRating: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cultural Immersion (1–10)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={0.5}
                                            required
                                            className={inputClass}
                                            value={formData.culturalImmersionRating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    culturalImmersionRating: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Program Administration (1–10)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={0.5}
                                            required
                                            className={inputClass}
                                            value={formData.programAdministrationRating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    programAdministrationRating: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Health &amp; Safety (1–10)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={0.5}
                                            required
                                            className={inputClass}
                                            value={formData.healthAndSafetyRating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    healthAndSafetyRating: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Community (1–10)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={0.5}
                                            required
                                            className={inputClass}
                                            value={formData.communityRating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    communityRating: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
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
                                        placeholder="https://images.unsplash.com/..."
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
                                className="px-8 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2 bg-cobalt-600 text-white px-12 py-2.5 rounded-lg font-bold hover:bg-cobalt-700 transition-colors shadow-md active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                {editingId ? "Update Review" : "Save Review"}
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
                                    Review Title
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Reviewer
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Program
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Rating
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
                            {reviews === undefined ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredReviews?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            ) : (
                                filteredReviews?.map((review) => (
                                    <tr
                                        key={review._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-900 max-w-xs">
                                            <span className="line-clamp-2">{review.reviewTitle}</span>
                                            <span className="block text-xs font-normal text-gray-400 mt-0.5">
                                                {review.date}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="font-medium">{review.reviewerName}</span>
                                            <span className="block text-xs text-gray-400">
                                                {review.reviewerCountry}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {programTitleById(review.programId)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-sm">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                {review.overallRating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.status === "published" ? (
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
                                                    onClick={() => handleEdit(review)}
                                                    className="p-2 text-gray-400 hover:text-cobalt-600 transition-colors"
                                                    title="Edit review"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete review"
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
            )}
        </div>
    );
}

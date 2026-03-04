"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Edit2, Trash2, Loader2, Save, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import AIGenerateButton from "../create-listing/_components/AIGenerateButton";

export default function ArticlesManager({
    isCreating,
    onCancelCreate
}: {
    isCreating?: boolean,
    onCancelCreate?: () => void
}) {
    const articles = useQuery(api.articles.listArticles);
    const createArticle = useMutation(api.articles.createArticle);
    const updateArticle = useMutation(api.articles.updateArticle);
    const deleteArticle = useMutation(api.articles.deleteArticle);

    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState<Id<"articles"> | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        publishDate: new Date().toISOString().split('T')[0],
        tags: "",
        coverImage: "",
    });

    // Sync isCreating prop with internal isEditing state
    useEffect(() => {
        if (isCreating) {
            setIsEditing(true);
            setEditingId(null);
        }
    }, [isCreating]);

    const filteredArticles = articles?.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            title: "",
            author: "",
            publishDate: new Date().toISOString().split('T')[0],
            tags: "",
            coverImage: "",
        });
        setEditingId(null);
        setIsEditing(false);
        if (onCancelCreate) onCancelCreate();
    };

    const handleEdit = (article: any) => {
        setEditingId(article._id);
        setFormData({
            title: article.title,
            author: article.author,
            publishDate: article.publishDate,
            tags: article.tags.join(", "),
            coverImage: article.coverImage || "",
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const payload = {
            ...formData,
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        };

        try {
            if (editingId) {
                await updateArticle({ id: editingId, ...payload });
            } else {
                await createArticle(payload);
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save article:", err);
            alert("Error saving article");
        }
    };

    const handleDelete = async (id: Id<"articles">) => {
        if (confirm("Are you sure?")) {
            await deleteArticle({ id });
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {!isEditing && (
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:border-transparent transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Total Articles</span>
                            <span className="text-xl font-extrabold text-gray-900">{articles?.length ?? 0}</span>
                        </div>
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Article" : "Create New Article"}</h2>
                        <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Form Column */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Content Details</h3>
                                    <AIGenerateButton
                                        step="article"
                                        formData={formData}
                                        onGenerated={(fields) => {
                                            setFormData({
                                                ...formData,
                                                title: fields.title || formData.title,
                                                author: fields.author || formData.author,
                                                tags: Array.isArray(fields.tags) ? fields.tags.join(", ") : (fields.tags || formData.tags),
                                                coverImage: fields.coverImage || formData.coverImage,
                                            });
                                        }}
                                        className="mb-8"
                                    />

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                            <input
                                                required
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cobalt-500 focus:bg-white outline-none transition-all"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Author / Source</label>
                                            <input
                                                required
                                                placeholder="e.g. GoAbroad 2018 Official Report"
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cobalt-500 focus:bg-white outline-none transition-all"
                                                value={formData.author}
                                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Publish Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cobalt-500 focus:bg-white outline-none transition-all"
                                                    value={formData.publishDate}
                                                    onChange={e => setFormData({ ...formData, publishDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                                                <input
                                                    placeholder="e.g. 2018 GoAbroad Report"
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cobalt-500 focus:bg-white outline-none transition-all"
                                                    value={formData.tags}
                                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image URL</label>
                                            <input
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cobalt-500 focus:bg-white outline-none transition-all"
                                                value={formData.coverImage}
                                                onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Column */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Card Preview</h3>
                                <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 flex items-center justify-center min-h-[400px]">
                                    {formData.title || formData.coverImage ? (
                                        <div className="w-[340px] shadow-2xl scale-110">
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col pointer-events-none">
                                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                                    {formData.coverImage ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={formData.coverImage}
                                                            alt="Preview"
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                            onError={(e: any) => e.target.src = "https://via.placeholder.com/800x500?text=Invalid+Image+URL"}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                            No image
                                                        </div>
                                                    )}
                                                    {formData.tags && (
                                                        <div className="absolute top-4 left-4">
                                                            <span className="bg-[#172B4D]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                                                                {formData.tags.split(",")[0].trim()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-[#172B4D] leading-tight mb-6 line-clamp-2 min-h-[3rem]">
                                                        {formData.title || "Your Title Here"}
                                                    </h3>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-500">
                                                            {formData.author || "Author Name"}
                                                        </span>
                                                        <span className="text-sm text-slate-400">
                                                            Today
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Edit2 className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm">Enter details to see a live preview</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Global Action Buttons */}
                        <div className="mt-12 flex justify-end gap-3 pt-8 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit()}
                                className="inline-flex items-center gap-2 bg-cobalt-600 text-white px-12 py-2.5 rounded-lg font-bold hover:bg-cobalt-700 transition-colors shadow-md active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                {editingId ? "Update Article" : "Save Article"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Article</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Author</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tags</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {articles === undefined ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredArticles?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No articles found.
                                    </td>
                                </tr>
                            ) : (
                                filteredArticles?.map((article) => (
                                    <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{article.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {article.tags.map(t => (
                                                    <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{t}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    className="p-2 text-gray-400 hover:text-cobalt-600"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600"
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

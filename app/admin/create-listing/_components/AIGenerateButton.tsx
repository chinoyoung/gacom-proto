"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface AIGenerateButtonProps {
    step: number | string;
    formData: any;
    onGenerated: (fields: any) => void;
    className?: string;
}

export default function AIGenerateButton({
    step,
    formData,
    onGenerated,
    className = "",
}: AIGenerateButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step, existingData: formData }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Generation failed");
            }

            const { fields } = await response.json();
            onGenerated(fields);
        } catch (err: any) {
            console.error("AI Generation failed:", err);
            setError(err.message || "Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRandomFill = () => {
        const mockData: any = {};
        switch (step) {
            case 1:
                mockData.title = "Sample " + ["Rome", "Paris", "Tokyo", "London"][Math.floor(Math.random() * 4)] + " Exploration";
                mockData.provider = "Global Education Experts";
                mockData.tagline = "A life-changing journey awaits you.";
                mockData.hostInstitution = "Local University Center";
                mockData.slug = mockData.title.toLowerCase().replace(/\s+/g, "-");
                break;
            case 2:
                mockData.city = ["Rome", "Paris", "Tokyo", "London"][Math.floor(Math.random() * 4)];
                mockData.country = ["Italy", "France", "Japan", "UK"][Math.floor(Math.random() * 4)];
                mockData.terms = ["fall", "spring"];
                mockData.duration = "1 Semester";
                break;
            case 3:
                mockData.educationLevels = ["sophomore", "junior"];
                mockData.eligibleNationalities = ["US", "UK", "Canada"];
                mockData.ageRequirement = "18+";
                break;
            case 4:
                mockData.description = "This is a comprehensive sample description of the program. It covers academic excellence, cultural immersion, and student life in a vibrant international setting.";
                mockData.whatsIncluded = ["Housing", "Insurance", "Local Trips"];
                break;
            case 5:
                mockData.subjectAreas = ["Arts", "History"];
                mockData.highlights = ["Small class sizes", "Central location"];
                break;
            case 6:
                mockData.cost = "$5,000";
                mockData.applicationDeadline = "2026-10-01";
                mockData.contactEmail = "admissions@university.edu";
                mockData.contactPhone = "+1 (555) 123-4567";
                mockData.applyUrl = "https://university.edu/apply";
                mockData.housingType = "Apartment";
                mockData.languageOfInstruction = "English";
                mockData.creditsAvailable = "12-15 credits";
                break;
            case 7:
                mockData.coverImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233";
                mockData.photos = ["https://images.unsplash.com/photo-1518780664697-55e3ad937233"];
                break;
        }
        onGenerated(mockData);
    };

    return (
        <div className={`my-6 space-y-3 ${className}`}>
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    title="Generate high-quality content using Claude AI"
                    className={[
                        "group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm tracking-tight transition-all active:scale-95 shadow-md",
                        isGenerating
                            ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
                            : "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300"
                    ].join(" ")}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                            <span>Claude is writing...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
                            <span>AI Auto-Populate</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleRandomFill}
                    disabled={isGenerating}
                    title="Instantly fill with generic sample data (No AI cost)"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm tracking-tight text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                >
                    <span>Random Mock Fill</span>
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    );
}

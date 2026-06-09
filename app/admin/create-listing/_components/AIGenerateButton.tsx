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
                mockData.providerLogo = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=128";
                mockData.coverImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233";
                mockData.photos = ["https://images.unsplash.com/photo-1518780664697-55e3ad937233"];
                break;
            case "review": {
                const destinations = ["Thailand", "Spain", "Japan", "Italy", "South Korea"];
                const dest = destinations[Math.floor(Math.random() * destinations.length)];
                const names = ["Sophia Williams", "Marcus Chen", "Aisha Patel", "James Okafor", "Elena Russo", "Priya Sharma", "Lena Müller", "Tomás Rivera", "Amara Diallo", "Yuki Tanaka", "Fatima Al-Hassan", "Carlos Mendez"];
                const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "India", "Brazil", "Mexico", "France", "Japan"];
                const highlights = [
                    "The language immersion was unlike anything I expected — I gained more fluency in two months than in two years of classes.",
                    "The host family experience was the highlight; they treated me like one of their own from day one.",
                    "Weekend excursions organized by the program were genuinely world-class — unforgettable memories.",
                    "The academic rigor surprised me in the best way; professors were deeply invested in every student's growth.",
                    "The friendships I built with fellow students from across the globe have lasted long beyond the program.",
                    "Every challenge — from navigating public transit to ordering food — became a confidence-building moment.",
                ];
                const advices = [
                    "Bring an open mind and be ready to step outside your comfort zone every single day — that's where the growth happens.",
                    "Learn a few phrases in the local language before you arrive; locals genuinely appreciate even small efforts.",
                    "Don't over-schedule yourself — leave room for spontaneous exploration and unexpected friendships.",
                    "Connect with your host family or local roommates early; they'll show you the city tourists never see.",
                    "Budget for unexpected experiences — the best memories often cost a little extra but are worth every penny.",
                    "Take the optional excursions even when you're tired; you'll regret skipping them far more than attending.",
                ];
                const allIdentityTagSets: string[][] = [
                    [],
                    ["Solo traveler"],
                    ["First-timer"],
                    ["Solo traveler", "First-timer"],
                    ["BIPOC"],
                    ["Women solo"],
                    ["BIPOC", "First-timer"],
                    ["Women solo", "Solo traveler"],
                    [],
                    ["First-timer"],
                ];
                const photoSeeds = [
                    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=600",
                    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=600",
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600",
                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
                    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=600",
                ];
                const idx = Math.floor(Math.random() * names.length);
                const rating = Math.floor(Math.random() * 2) + 4; // 4–5
                mockData.reviewerName = names[idx];
                mockData.reviewerCountry = countries[idx % countries.length];
                mockData.reviewTitle = `An unforgettable experience in ${dest}`;
                mockData.body = `Studying abroad in ${dest} was one of the best decisions I've ever made. The program exceeded every expectation — from the incredible academic coursework to the cultural experiences woven into daily life. The staff were incredibly supportive, always going the extra mile to ensure every student felt at home. I made lifelong friends from around the world and came back with a completely new perspective. I wholeheartedly recommend this program to anyone considering studying abroad.`;
                mockData.overallRating = rating;
                mockData.academicsRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
                mockData.livingSituationRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
                mockData.culturalImmersionRating = Math.min(5, rating);
                mockData.programAdministrationRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
                mockData.healthAndSafetyRating = Math.min(5, rating);
                mockData.communityRating = Math.min(5, rating + Math.floor(Math.random() * 2) - 1);
                // New review fields for reviews-2026
                mockData.helpfulCount = Math.floor(Math.random() * 26); // 0–25
                mockData.highlight = highlights[Math.floor(Math.random() * highlights.length)];
                mockData.advice = advices[Math.floor(Math.random() * advices.length)];
                mockData.identityTags = allIdentityTagSets[Math.floor(Math.random() * allIdentityTagSets.length)];
                const mediaCount = Math.floor(Math.random() * 4); // 0–3 images
                mockData.media = photoSeeds.slice(0, mediaCount);
                break;
            }
        }
        // Note: aiSummary and topicTags are now seeded server-side via
        // the "Seed mock reviews" action in ReviewsManager (convex/reviews.ts seedMockReviews).
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

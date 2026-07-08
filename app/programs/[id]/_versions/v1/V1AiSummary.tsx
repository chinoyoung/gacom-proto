import { Sparkles } from "lucide-react";

interface V1AiSummaryProps {
  summary?: {
    text: string;
    reviewCount: number;
  };
}

export default function V1AiSummary({ summary }: V1AiSummaryProps) {
  if (!summary?.text) return null;

  return (
    <div className="border border-cobalt-500/20 bg-cobalt-500/5 rounded-md p-5 sm:p-6">
      <div className="flex items-center flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-cobalt-600">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          AI summary
        </span>
        <span className="bg-cobalt-500/10 text-cobalt-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {summary.reviewCount} {summary.reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-700 mt-3">
        {summary.text}
      </p>

      <p className="text-xs italic text-slate-400 mt-3">
        AI-generated — read individual reviews for full context.
      </p>
    </div>
  );
}

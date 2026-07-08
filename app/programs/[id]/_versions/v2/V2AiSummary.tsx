"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import type { Program } from "../../_components/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface V2AiSummaryProps {
  program: Program;
  /** Total review count from getReviewStats — used for the ≥ 10 gate. */
  totalReviews: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns a short relative-time string from a Unix ms timestamp.
 * Keeps it simple: "today", "yesterday", "N days ago", "N months ago",
 * "over a year ago". Intentionally coarse — this is decorative meta text.
 */
function relativeTime(ms: number): string {
  const diffMs = Date.now() - ms;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;

  return "over a year ago";
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Displays the AI-generated review summary card.
 *
 * Render conditions:
 * - `program.aiSummary` must be present
 * - `totalReviews` must be ≥ 10
 *
 * This is display-only — no LLM call, no Convex changes.
 */
export default function V2AiSummary({
  program,
  totalReviews,
}: V2AiSummaryProps) {
  const { aiSummary } = program;

  // Compute relative time before guard (unconditionally) to satisfy React hooks rules
  const generated = useMemo(
    () => relativeTime(aiSummary?.generatedAt ?? 0),
    [aiSummary?.generatedAt]
  );

  // Gate: only render when data is present AND there are enough reviews
  if (!aiSummary || totalReviews < 10) return null;

  const { text, reviewCount } = aiSummary;

  return (
    <div
      className="relative bg-white border border-slate-200 rounded-md overflow-hidden"
      aria-label="AI-generated review summary"
    >
      {/* Left accent stripe — single thin cobalt rule, the only "color" moment */}
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-cobalt-300"
        aria-hidden="true"
      />

      <div className="pl-5 pr-5 pt-4 pb-4 sm:pl-6 sm:pr-6 sm:pt-5 sm:pb-5">
        {/* ── Eyebrow row: icon + label ── */}
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles
            className="w-3.5 h-3.5 text-cobalt-500 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-cobalt-500">
            AI Summary
          </span>
        </div>

        {/* ── Summary text ── */}
        <p className="text-sm leading-relaxed text-slate-600 max-w-prose">
          {text}
        </p>

        {/* ── Footer row: disclaimer + meta ── */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5">
          {/* Disclaimer */}
          <p className="text-xs text-slate-500 leading-snug">
            AI-generated from traveler reviews — read individual reviews for
            full context.
          </p>

          {/* Subtle meta: review count + generated date */}
          <p className="text-xs text-slate-500 shrink-0 tabular-nums">
            Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"} ·{" "}
            Generated {generated}
          </p>
        </div>
      </div>
    </div>
  );
}

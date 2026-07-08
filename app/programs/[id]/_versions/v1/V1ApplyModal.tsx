"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { Program } from "../../_components/types";
import V1ApplySection from "./V1ApplySection";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  program: Program;
}

export default function V1ApplyModal({ open, onClose, program }: ApplyModalProps) {
  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full sm:max-w-4xl sm:rounded-xl shadow-xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-8 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-500 mb-1">
              Apply Now
            </p>
            <h2
              id="apply-modal-title"
              className="text-xl font-bold tracking-tight text-neutral-800"
            >
              Start your application
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Tell us a little about yourself and we&rsquo;ll connect you with the right program team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <V1ApplySection program={program} variant="modal" />
        </div>
      </div>
    </div>
  );
}

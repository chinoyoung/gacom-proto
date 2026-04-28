"use client";

import { MessageSquare, MousePointer2, PanelRight } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { useCommentLayer } from "@/components/comments/useCommentLayer";

export function ToolbarCommentToggle() {
  const { mode, setMode, panelOpen, setPanelOpen } = useCommentLayer();

  return (
    <Show when="signed-in">
      <div className="flex items-center gap-2">
        <div className="bg-fern-50 rounded-full p-1 flex gap-1" role="tablist" aria-label="Mode">
          <button
            role="tab"
            aria-selected={mode === "view"}
            onClick={() => setMode("view")}
            className={[
              "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              mode === "view"
                ? "bg-white text-fern-700 shadow-sm"
                : "text-slate-600 hover:text-fern-700",
            ].join(" ")}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            View
          </button>
          <button
            role="tab"
            aria-selected={mode === "comment"}
            onClick={() => setMode("comment")}
            className={[
              "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              mode === "comment"
                ? "bg-fern-500 text-white shadow-sm"
                : "text-slate-600 hover:text-fern-700",
            ].join(" ")}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Comment
          </button>
        </div>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={[
            "p-1.5 rounded-full transition-colors cursor-pointer border",
            panelOpen
              ? "bg-cobalt-500 border-cobalt-500 text-white"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
          ].join(" ")}
          aria-label="Toggle comments panel"
          aria-pressed={panelOpen}
        >
          <PanelRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Show>
  );
}

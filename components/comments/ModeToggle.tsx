"use client";

import { MessageSquare, MousePointer2, PanelRight } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { useCommentLayer } from "./useCommentLayer";

export function ModeToggle() {
  const { mode, setMode, panelOpen, setPanelOpen } = useCommentLayer();

  return (
    <Show when="signed-in">
      <div
        className={[
          "fixed bottom-4 left-4 z-[60] flex items-center gap-2 sm:bottom-4 sm:left-4 transition-all",
          mode === "comment" ? "scale-105" : "",
        ].join(" ")}
      >
        <div
          className={[
            "shadow-lg rounded-full p-1.5 flex items-center gap-1 transition-colors",
            mode === "comment" ? "bg-fern-600 ring-2 ring-fern-300" : "bg-slate-900",
          ].join(" ")}
        >
          <button
            onClick={() => setMode("view")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              mode === "view"
                ? "bg-cobalt-500 text-white"
                : mode === "comment"
                  ? "text-white/80 hover:bg-fern-500"
                  : "text-slate-300 hover:bg-slate-700",
            ].join(" ")}
            aria-pressed={mode === "view"}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => setMode("comment")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              mode === "comment"
                ? "bg-white text-fern-700"
                : "text-slate-300 hover:bg-slate-700",
            ].join(" ")}
            aria-pressed={mode === "comment"}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Comment
          </button>
        </div>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={[
            "p-2 rounded-full shadow-lg transition-colors cursor-pointer",
            panelOpen
              ? "bg-cobalt-500 text-white"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800",
          ].join(" ")}
          aria-label="Toggle comments panel"
          aria-pressed={panelOpen}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </Show>
  );
}

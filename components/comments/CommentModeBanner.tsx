"use client";

import { MessageSquarePlus } from "lucide-react";
import { useCommentLayer } from "./useCommentLayer";

export function CommentModeBanner() {
  const { mode, setMode } = useCommentLayer();
  if (mode !== "comment") return null;

  return (
    <div
      className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-[65] flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex items-center gap-3 bg-fern-500 text-white shadow-lg rounded-full pl-4 pr-2 py-2">
        <MessageSquarePlus className="w-4 h-4" />
        <span className="text-sm font-semibold">Comment mode</span>
        <span className="text-xs text-white/80 hidden sm:inline">
          Click anywhere to add a comment
        </span>
        <button
          onClick={() => setMode("view")}
          className="ml-1 text-[11px] font-semibold bg-white/15 hover:bg-white/25 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
        >
          Esc to exit
        </button>
      </div>
    </div>
  );
}

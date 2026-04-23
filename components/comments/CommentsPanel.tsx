"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { PAGE_ANCHOR_ID } from "./anchor-math";
import { useCommentLayer } from "./useCommentLayer";
import type { CommentThread } from "./types";

interface CommentsPanelProps {
  threads: CommentThread[];
}

type Filter = "open" | "resolved" | "all";

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

function anchorExists(anchorId: string): boolean {
  if (anchorId === PAGE_ANCHOR_ID) return true;
  return !!document.querySelector(
    `[data-comment-anchor="${CSS.escape(anchorId)}"]`,
  );
}

export function CommentsPanel({ threads }: CommentsPanelProps) {
  const { panelOpen, setPanelOpen, setActiveThreadId } = useCommentLayer();
  const [filter, setFilter] = useState<Filter>("open");

  const filtered = useMemo(() => {
    if (filter === "all") return threads;
    return threads.filter((t) => t.status === filter);
  }, [threads, filter]);

  if (!panelOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[65] w-full sm:w-96 bg-white shadow-lg border-l border-slate-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Comments</h2>
        <button
          onClick={() => setPanelOpen(false)}
          className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1 px-3 py-2 border-b border-slate-100">
        {(["open", "resolved", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer",
              filter === f
                ? "bg-cobalt-500 text-white"
                : "text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            {f === "open" ? "Open" : f === "resolved" ? "Resolved" : "All"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No comments {filter === "all" ? "yet" : `(${filter})`}.
          </div>
        ) : (
          filtered.map((thread) => {
            const first = thread.messages[0];
            const exists = anchorExists(thread.anchorId);
            return (
              <button
                key={thread._id}
                onClick={() => {
                  if (!exists) return;
                  setPanelOpen(false);
                  setActiveThreadId(thread._id);
                  const selector =
                    thread.anchorId === PAGE_ANCHOR_ID
                      ? null
                      : `[data-comment-anchor="${CSS.escape(thread.anchorId)}"]`;
                  const el = selector
                    ? document.querySelector<HTMLElement>(selector)
                    : document.body;
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const pinDocY =
                    window.scrollY + rect.top + thread.relY * rect.height;
                  const targetY = Math.max(0, pinDocY - window.innerHeight * 0.25);
                  window.scrollTo({ top: targetY, behavior: "smooth" });
                }}
                disabled={!exists}
                className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-900">
                    {thread.createdByName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatRelative(thread._creationTime)}
                  </span>
                  <span
                    className={[
                      "ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      thread.status === "resolved"
                        ? "bg-slate-100 text-slate-500"
                        : "bg-cobalt-50 text-cobalt-600",
                    ].join(" ")}
                  >
                    {thread.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2">
                  {first?.body ?? ""}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span>#{thread.anchorId}</span>
                  <span>·</span>
                  <span>{thread.messages.length} message{thread.messages.length === 1 ? "" : "s"}</span>
                  {!exists && (
                    <span className="ml-auto text-sun-500">
                      anchor missing on this view
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import type { CommentThread } from "./types";

interface CommentPinProps {
  thread: CommentThread;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export function CommentPin({ thread, index, isActive, onClick }: CommentPinProps) {
  const isResolved = thread.status === "resolved";
  const bg = isResolved
    ? "bg-slate-400"
    : isActive
      ? "bg-fern-600"
      : "bg-fern-500";
  const showPulse = !isResolved && !isActive;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={[
        "pointer-events-auto absolute -translate-x-1/2 -translate-y-full flex items-center justify-center w-7 h-7 rounded-full rounded-bl-none text-white text-xs font-bold ring-2 ring-white shadow-[0_4px_14px_rgba(15,23,42,0.35)] transition-transform hover:scale-125 cursor-pointer",
        bg,
      ].join(" ")}
      aria-label={`Open comment thread ${index + 1}`}
      title={thread.createdByName}
    >
      {showPulse && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-fern-500 opacity-70 animate-ping"
        />
      )}
      <span className="relative">{index + 1}</span>
    </button>
  );
}

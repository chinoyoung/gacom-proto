"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Show, SignInButton, useUser } from "@clerk/nextjs";
import { MoreHorizontal, Check, RotateCcw, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { PAGE_ANCHOR_ID, computeScreenCoords } from "./anchor-math";
import { CommentLayerContext } from "./useCommentLayer";
import { useCommentLayer } from "./useCommentLayer";
import { useDevice } from "./use-device";
import type { CommentThread } from "./types";

interface ThreadPopoverProps {
  thread: CommentThread;
}

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

export function ThreadPopover({ thread }: ThreadPopoverProps) {
  const { setActiveThreadId } = useCommentLayer();
  const { user } = useUser();
  const device = useDevice();
  const isMobile = device === "mobile";
  const addMessage = useMutation(api.comments.addMessage);
  const resolve = useMutation(api.comments.resolveThread);
  const reopen = useMutation(api.comments.reopenThread);
  const deleteThread = useMutation(api.comments.deleteThread);
  const deleteMessage = useMutation(api.comments.deleteMessage);

  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = user?.id;
  const isAuthor = currentUserId === thread.createdBy;

  // When canvas mode is active, the anchor element lives inside the iframe and
  // cannot be queried from the parent DOM. In that case, use `activeThreadCoords`
  // from context (set by CommentCanvasChrome when a pin-click is translated from
  // iframe-local to canvas-local coords). Fall back to DOM-based position lookup
  // for embed/legacy mode where the anchor is accessible.
  const ctx = useContext(CommentLayerContext);
  const activeThreadCoords = ctx?.activeThreadCoords ?? null;

  const [domPosition, setDomPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Skip DOM-based position lookup when canvas-mode coords are available.
    if (activeThreadCoords) return;

    const selector =
      thread.anchorId === PAGE_ANCHOR_ID
        ? null
        : `[data-comment-anchor="${CSS.escape(thread.anchorId)}"]`;

    function recompute() {
      const el = selector
        ? document.querySelector<HTMLElement>(selector)
        : document.body;
      if (!el) {
        setDomPosition(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      const { x, y } = computeScreenCoords(
        { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        thread.relX,
        thread.relY,
      );
      setDomPosition({ x, y });
    }

    recompute();

    const el = selector
      ? document.querySelector<HTMLElement>(selector)
      : document.body;
    const observer = el ? new ResizeObserver(recompute) : null;
    if (el && observer) observer.observe(el);

    window.addEventListener("scroll", recompute, { passive: true, capture: true });
    window.addEventListener("resize", recompute, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", recompute, { capture: true });
      window.removeEventListener("resize", recompute);
    };
  }, [thread, activeThreadCoords]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setActiveThreadId(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [setActiveThreadId]);

  // Resolve the final position: canvas coords take priority over DOM-based coords.
  const position = activeThreadCoords
    ? { x: activeThreadCoords.clientX, y: activeThreadCoords.clientY }
    : domPosition;

  if (!isMobile && !position) return null;

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      await addMessage({ threadId: thread._id, body: reply.trim() });
      setReply("");
    } finally {
      setSubmitting(false);
    }
  }

  const mobileWrapperClass =
    "pointer-events-auto fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  const desktopWrapperStyle = position
    ? { left: `${position.x}px`, top: `${position.y + 8}px` }
    : undefined;

  return (
    <div
      ref={containerRef}
      className={
        isMobile ? mobileWrapperClass : "pointer-events-auto fixed z-[70]"
      }
      style={isMobile ? undefined : desktopWrapperStyle}
    >
      <div
        className={[
          "bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col",
          isMobile
            ? "w-[90vw] max-w-sm max-h-[70vh]"
            : "w-80 max-h-[60vh]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-600">
            {thread.status === "resolved" ? "Resolved" : "Open"}
          </span>
          <Show when="signed-in">
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                aria-label="Thread actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]">
                  {thread.status === "open" ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        resolve({ threadId: thread._id });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Check className="w-3.5 h-3.5 text-fern-500" /> Resolve
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        reopen({ threadId: thread._id });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reopen
                    </button>
                  )}
                  {isAuthor && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        deleteThread({ threadId: thread._id });
                        setActiveThreadId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-roman-500 hover:bg-slate-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete thread
                    </button>
                  )}
                </div>
              )}
            </div>
          </Show>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
          {thread.messages.map((msg) => (
            <div key={msg._id} className="flex items-start gap-2">
              {msg.authorImage ? (
                <img
                  src={msg.authorImage}
                  alt=""
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600 flex-shrink-0">
                  {msg.authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {msg.authorName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatRelative(msg._creationTime)}
                  </span>
                  <Show when="signed-in">
                    {msg.authorId === currentUserId && (
                      <button
                        onClick={() => deleteMessage({ messageId: msg._id })}
                        className="ml-auto text-[10px] text-slate-400 hover:text-roman-500"
                      >
                        Delete
                      </button>
                    )}
                  </Show>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap break-words">
                  {msg.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Show when="signed-in">
          <form
            onSubmit={submitReply}
            className="border-t border-slate-100 p-2"
          >
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply"
              rows={2}
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-cobalt-500 focus:outline-none resize-none"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  submitReply(e as unknown as React.FormEvent);
                }
              }}
            />
            <div className="flex justify-end mt-1">
              <button
                type="submit"
                disabled={!reply.trim() || submitting}
                className="px-3 py-1 text-xs font-semibold text-white bg-cobalt-500 rounded-md hover:bg-cobalt-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </form>
        </Show>
        <Show when="signed-out">
          <div className="border-t border-slate-100 p-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sign in to reply</span>
            <SignInButton mode="modal">
              <button className="px-3 py-1 text-xs font-semibold text-cobalt-600 hover:text-cobalt-700">
                Sign in
              </button>
            </SignInButton>
          </div>
        </Show>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useCommentLayer } from "./useCommentLayer";
import { CommentModeBanner } from "./CommentModeBanner";
import { CommentsPanel } from "./CommentsPanel";
import { NewCommentComposer } from "./NewCommentComposer";
import { ThreadPopover } from "./ThreadPopover";
import { useCanvasMode } from "@/components/canvas/use-canvas-mode";
import {
  isCanvasMessage,
  postToIframe,
  type IframeToParent,
} from "@/components/canvas/cross-frame-protocol";
import type { CommentThread } from "./types";

export function CommentCanvasChrome({
  iframeRef,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const { viewport } = useCanvasMode();
  const device = viewport === "mobile" ? "mobile" : "desktop";
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;

  const {
    mode,
    setActiveThreadId,
    setActiveThreadCoords,
    draftPin,
    setDraftPin,
    activeThreadId,
  } = useCommentLayer();

  const threadsRaw = useQuery(api.comments.listThreadsForPage, { pageKey });
  const threads: CommentThread[] = (threadsRaw ?? []) as CommentThread[];
  const activeThread = threads.find((t) => t._id === activeThreadId) ?? null;

  // Push mode changes to iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    postToIframe(iframeRef.current, { type: "set-mode", mode });
  }, [mode, iframeRef]);

  // Push active-thread changes to iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    postToIframe(iframeRef.current, {
      type: "set-active-thread",
      threadId: activeThreadId,
    });
  }, [activeThreadId, iframeRef]);

  // Receive iframe messages
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return;
      if (e.origin !== window.location.origin) return;
      if (!isCanvasMessage<IframeToParent>(e.data)) return;
      const p = e.data.payload;
      if (p.type === "pin-click") {
        const rect = iframeRef.current.getBoundingClientRect();
        setDraftPin({
          anchorId: p.anchorId,
          relX: p.relX,
          relY: p.relY,
          clientX: rect.left + p.clientX,
          clientY: rect.top + p.clientY,
        });
        setActiveThreadId(null);
      } else if (p.type === "thread-open") {
        const rect = iframeRef.current.getBoundingClientRect();
        setActiveThreadId(p.threadId);
        setActiveThreadCoords({
          clientX: rect.left + p.clientX,
          clientY: rect.top + p.clientY,
        });
        setDraftPin(null);
      } else if (p.type === "pin-rect-update") {
        if (p.rect == null) {
          setActiveThreadCoords(null);
          return;
        }
        const iframeRect = iframeRef.current.getBoundingClientRect();
        const clientX = iframeRect.left + p.rect.left + p.rect.width / 2;
        const clientY = iframeRect.top + p.rect.top + p.rect.height / 2;
        setActiveThreadCoords({ clientX, clientY });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeRef, setActiveThreadId, setActiveThreadCoords, setDraftPin]);

  return (
    <div data-comment-ui>
      <CommentModeBanner />
      {activeThread && !draftPin && <ThreadPopover thread={activeThread} />}
      {draftPin && <NewCommentComposer />}
      <CommentsPanel threads={threads} />
    </div>
  );
}

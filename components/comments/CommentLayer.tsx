"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PAGE_ANCHOR_ID, computeRelativeCoords } from "./anchor-math";
import {
  CommentLayerProvider,
  useCommentLayer,
} from "./useCommentLayer";
import { ModeToggle } from "./ModeToggle";
import { PinOverlay } from "./PinOverlay";
import { ThreadPopover } from "./ThreadPopover";
import { NewCommentComposer } from "./NewCommentComposer";
import { CommentsPanel } from "./CommentsPanel";
import { CommentModeBanner } from "./CommentModeBanner";
import type { CommentThread } from "./types";

export function CommentLayer({ pageKey }: { pageKey: string }) {
  return (
    <CommentLayerProvider pageKey={pageKey}>
      <CommentLayerInner />
    </CommentLayerProvider>
  );
}

function CommentLayerInner() {
  const { pageKey, mode, setMode, setDraftPin, draftPin, activeThreadId } =
    useCommentLayer();
  const threadsRaw = useQuery(api.comments.listThreadsForPage, { pageKey });
  const threads: CommentThread[] = useMemo(
    () => (threadsRaw ?? []) as CommentThread[],
    [threadsRaw],
  );

  const activeThread = useMemo(
    () => threads.find((t) => t._id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );

  useEffect(() => {
    if (mode !== "comment") return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Skip clicks on the UI chrome (mode toggle, popovers, etc.)
      if (target.closest("[data-comment-ui]")) return;

      const anchorEl = target.closest<HTMLElement>("[data-comment-anchor]");
      const anchorId =
        anchorEl?.getAttribute("data-comment-anchor") ?? PAGE_ANCHOR_ID;
      const rect = anchorEl
        ? anchorEl.getBoundingClientRect()
        : document.body.getBoundingClientRect();

      const { relX, relY } = computeRelativeCoords(
        { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        e.clientX,
        e.clientY,
      );

      e.preventDefault();
      e.stopPropagation();
      setDraftPin({ anchorId, relX, relY, clientX: e.clientX, clientY: e.clientY });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [mode, setDraftPin]);

  useEffect(() => {
    if (mode !== "comment") {
      document.body.style.cursor = "";
      document.body.classList.remove("comment-mode");
      return;
    }
    document.body.style.cursor = "crosshair";
    document.body.classList.add("comment-mode");

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMode("view");
    }
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.cursor = "";
      document.body.classList.remove("comment-mode");
      document.removeEventListener("keydown", handleKey);
    };
  }, [mode, setMode]);

  return (
    <div data-comment-ui>
      <CommentModeBanner />
      <ModeToggle />
      <PinOverlay threads={threads} />
      {activeThread && !draftPin && <ThreadPopover thread={activeThread} />}
      {draftPin && <NewCommentComposer />}
      <CommentsPanel threads={threads} />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { PAGE_ANCHOR_ID, computeRelativeCoords } from "./anchor-math";
import { PinOverlay } from "./PinOverlay";
import { useDevice } from "./use-device";
import type { CommentThread, CommentMode } from "./types";
import type { Id } from "@/convex/_generated/dataModel";
import {
  isCanvasMessage,
  postToParent,
  type ParentToIframe,
} from "@/components/canvas/cross-frame-protocol";

export function CommentPinLayer() {
  const pathname = usePathname();
  const params = useSearchParams();
  const v = params.get("v");
  const device = useDevice();
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;

  const [mode, setMode] = useState<CommentMode>("view");
  const [activeThreadId, setActiveThreadId] = useState<Id<"commentThreads"> | null>(null);

  const threadsRaw = useQuery(api.comments.listThreadsForPage, { pageKey });
  const threads: CommentThread[] = useMemo(
    () => (threadsRaw ?? []) as CommentThread[],
    [threadsRaw],
  );

  // Derives the active pin's anchor element and relative coords from activeThreadId + threads.
  // Using useMemo avoids an intermediate state slice and eliminates the
  // react-hooks/set-state-in-effect pattern (state-from-state synchronisation).
  const activeRectTracking = useMemo<{
    threadId: Id<"commentThreads">;
    anchorEl: HTMLElement | null;
    relX: number;
    relY: number;
  } | null>(() => {
    if (!activeThreadId) return null;
    const thread = threads.find((t) => t._id === activeThreadId);
    if (!thread) return null;
    // querySelector is safe here: we're inside useMemo which runs synchronously
    // during render, after the DOM has been updated with the new pins.
    const anchorEl =
      typeof document !== "undefined"
        ? document.querySelector<HTMLElement>(
            `[data-comment-anchor="${thread.anchorId}"]`,
          )
        : null;
    return { threadId: activeThreadId, anchorEl, relX: thread.relX, relY: thread.relY };
  }, [activeThreadId, threads]);

  // On scroll, post the active pin's current position to the canvas so the popover follows.
  // Uses requestAnimationFrame throttling (~60fps max).
  useEffect(() => {
    if (!activeRectTracking) return;
    let rafId = 0;

    function send() {
      rafId = 0;
      if (!activeRectTracking) return;
      const { anchorEl, relX, relY, threadId } = activeRectTracking;
      const domRect = anchorEl ? anchorEl.getBoundingClientRect() : null;

      if (!domRect) {
        postToParent({ type: "pin-rect-update", threadId, rect: null });
        return;
      }

      const pinX = domRect.left + domRect.width * relX;
      const pinY = domRect.top + domRect.height * relY;

      // Hide popover when pin has scrolled entirely out of the iframe viewport.
      if (pinY < 0 || pinY > window.innerHeight) {
        postToParent({ type: "pin-rect-update", threadId, rect: null });
        return;
      }

      // Send a 2×2 rect centered on the exact pin position.
      // The canvas uses `left + width/2, top + height/2` to locate the anchor,
      // so this gives the pin coordinates precisely.
      postToParent({
        type: "pin-rect-update",
        threadId,
        rect: { left: pinX - 1, top: pinY - 1, width: 2, height: 2 },
      });
    }

    function schedule() {
      if (rafId) return;
      rafId = requestAnimationFrame(send);
    }

    window.addEventListener("scroll", schedule, true);
    return () => {
      window.removeEventListener("scroll", schedule, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [activeRectTracking]);

  // Announce ready + pageKey changes to parent
  useEffect(() => {
    postToParent({ type: "ready", pageKey });
  }, [pageKey]);

  // Receive parent commands
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== window.parent) return;
      if (e.origin !== window.location.origin) return;
      if (!isCanvasMessage<ParentToIframe>(e.data)) return;
      const payload = e.data.payload;
      if (payload.type === "set-mode") setMode(payload.mode);
      else if (payload.type === "set-active-thread") setActiveThreadId(payload.threadId);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Comment-mode click capture
  useEffect(() => {
    if (mode !== "comment") return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-comment-ui]")) return;

      const anchorEl = target.closest<HTMLElement>("[data-comment-anchor]");
      const anchorId = anchorEl?.getAttribute("data-comment-anchor") ?? PAGE_ANCHOR_ID;
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
      postToParent({
        type: "pin-click",
        anchorId,
        relX,
        relY,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [mode]);

  // Cursor styling
  useEffect(() => {
    if (mode !== "comment") {
      document.body.style.cursor = "";
      document.body.classList.remove("comment-mode");
      return;
    }
    document.body.style.cursor = "crosshair";
    document.body.classList.add("comment-mode");
    return () => {
      document.body.style.cursor = "";
      document.body.classList.remove("comment-mode");
    };
  }, [mode]);

  return (
    <div data-comment-ui>
      <PinOverlay
        threads={threads}
        activeThreadId={activeThreadId}
        onPinClick={(threadId, clientX, clientY) =>
          postToParent({ type: "thread-open", threadId, clientX, clientY })
        }
      />
    </div>
  );
}

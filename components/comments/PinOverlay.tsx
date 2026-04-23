"use client";

import { useEffect, useMemo, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { PAGE_ANCHOR_ID, computeScreenCoords } from "./anchor-math";
import { CommentPin } from "./CommentPin";
import { useCommentLayer } from "./useCommentLayer";
import type { CommentThread } from "./types";

interface PinOverlayProps {
  threads: CommentThread[];
}

type PositionedPin = {
  thread: CommentThread;
  index: number;
  x: number;
  y: number;
  found: boolean;
};

function findAnchorRect(anchorId: string): DOMRect | null {
  if (anchorId === PAGE_ANCHOR_ID) {
    return document.body.getBoundingClientRect();
  }
  const el = document.querySelector<HTMLElement>(
    `[data-comment-anchor="${CSS.escape(anchorId)}"]`,
  );
  return el ? el.getBoundingClientRect() : null;
}

export function PinOverlay({ threads }: PinOverlayProps) {
  const { activeThreadId, setActiveThreadId } = useCommentLayer();
  const [tick, setTick] = useState(0);

  const uniqueAnchorIds = useMemo(
    () => Array.from(new Set(threads.map((t) => t.anchorId))),
    [threads],
  );

  useEffect(() => {
    const bump = () => setTick((n) => n + 1);

    const observers: ResizeObserver[] = [];
    for (const id of uniqueAnchorIds) {
      const selector =
        id === PAGE_ANCHOR_ID
          ? null
          : `[data-comment-anchor="${CSS.escape(id)}"]`;
      const el = selector
        ? document.querySelector<HTMLElement>(selector)
        : document.body;
      if (el) {
        const obs = new ResizeObserver(bump);
        obs.observe(el);
        observers.push(obs);
      }
    }

    window.addEventListener("scroll", bump, { passive: true, capture: true });
    window.addEventListener("resize", bump, { passive: true });

    return () => {
      for (const obs of observers) obs.disconnect();
      window.removeEventListener("scroll", bump, { capture: true });
      window.removeEventListener("resize", bump);
    };
  }, [uniqueAnchorIds]);

  const positioned: PositionedPin[] = threads.map((thread, index) => {
    const rect = findAnchorRect(thread.anchorId);
    if (!rect) return { thread, index, x: 0, y: 0, found: false };
    const { x, y } = computeScreenCoords(
      { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      thread.relX,
      thread.relY,
    );
    return { thread, index, x, y, found: true };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55]"
      aria-hidden="false"
      data-tick={tick}
    >
      {positioned
        .filter((p) => p.found)
        .map((p) => (
          <div
            key={p.thread._id}
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
            className="absolute top-0 left-0"
          >
            <CommentPin
              thread={p.thread}
              index={p.index}
              isActive={p.thread._id === activeThreadId}
              onClick={() => handlePinClick(p.thread._id, activeThreadId, setActiveThreadId)}
            />
          </div>
        ))}
    </div>
  );
}

function handlePinClick(
  id: Id<"commentThreads">,
  activeId: Id<"commentThreads"> | null,
  setActive: (id: Id<"commentThreads"> | null) => void,
) {
  setActive(id === activeId ? null : id);
}

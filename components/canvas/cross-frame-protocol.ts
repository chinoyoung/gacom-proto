import type { Id } from "@/convex/_generated/dataModel";

export type ParentToIframe =
  | { type: "set-mode"; mode: "view" | "comment" }
  | { type: "set-active-thread"; threadId: Id<"commentThreads"> | null }
  | { type: "cancel-draft" };

export type IframeToParent =
  | { type: "ready"; pageKey: string }
  | {
      type: "pin-click";
      anchorId: string;
      relX: number;
      relY: number;
      clientX: number;
      clientY: number;
    }
  | {
      type: "thread-open";
      threadId: Id<"commentThreads">;
      clientX: number;
      clientY: number;
    }
  | {
      type: "pin-rect-update";
      threadId: Id<"commentThreads"> | "draft";
      rect: { left: number; top: number; width: number; height: number } | null;
    };

export const CANVAS_MESSAGE_NAMESPACE = "gacom-canvas/v1" as const;

interface Envelope<T> {
  __ns: typeof CANVAS_MESSAGE_NAMESPACE;
  payload: T;
}

export function isCanvasMessage<T>(
  data: unknown,
): data is Envelope<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).__ns === CANVAS_MESSAGE_NAMESPACE
  );
}

export function postToIframe(
  iframe: HTMLIFrameElement,
  payload: ParentToIframe,
): void {
  iframe.contentWindow?.postMessage(
    { __ns: CANVAS_MESSAGE_NAMESPACE, payload },
    window.location.origin,
  );
}

export function postToParent(payload: IframeToParent): void {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(
    { __ns: CANVAS_MESSAGE_NAMESPACE, payload },
    window.location.origin,
  );
}

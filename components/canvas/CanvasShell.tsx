"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CanvasToolbar } from "./CanvasToolbar";
import { CanvasFrame } from "./CanvasFrame";
import { CommentLayerProvider } from "@/components/comments/useCommentLayer";
import { CommentCanvasChrome } from "@/components/comments/CommentCanvasChrome";
import { useCanvasMode } from "./use-canvas-mode";

export function CanvasShell() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { viewport } = useCanvasMode();
  const device = viewport === "mobile" ? "mobile" : "desktop";
  const v = searchParams.get("v");
  const pageKey = `${pathname}${v ? `?v=${v}` : ""}::${device}`;

  // Real-mobile fallback: on devices below 768px, force ?viewport=mobile if not already set.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isRealMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isRealMobile) return;
    if (searchParams.get("viewport") === "mobile") return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewport", "mobile");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <CommentLayerProvider pageKey={pageKey}>
      <CanvasToolbar />
      <CanvasFrame ref={iframeRef} />
      <CommentCanvasChrome iframeRef={iframeRef} />
    </CommentLayerProvider>
  );
}

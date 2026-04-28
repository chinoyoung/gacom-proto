"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type CanvasViewport = "mobile" | "desktop";

export function useCanvasMode(): {
  isEmbed: boolean;
  viewport: CanvasViewport;
  setViewport: (next: CanvasViewport) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEmbed = searchParams.get("embed") === "1";
  const rawViewport = searchParams.get("viewport");
  const viewport: CanvasViewport = rawViewport === "mobile" ? "mobile" : "desktop";

  const setViewport = useCallback(
    (next: CanvasViewport) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "desktop") {
        params.delete("viewport");
      } else {
        params.set("viewport", next);
      }
      const qs = params.toString();
      router.push(pathname + (qs ? `?${qs}` : ""));
    },
    [pathname, router, searchParams],
  );

  return { isEmbed, viewport, setViewport };
}

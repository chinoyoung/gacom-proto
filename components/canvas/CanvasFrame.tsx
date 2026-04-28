"use client";

import { forwardRef, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCanvasMode } from "./use-canvas-mode";

export interface CanvasFrameHandle {
  iframe: HTMLIFrameElement | null;
  rect: DOMRect | null;
}

export const CanvasFrame = forwardRef<HTMLIFrameElement>(function CanvasFrame(_, ref) {
  const { viewport } = useCanvasMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build embed src from pathname + all params except `viewport` (parent-only).
  const embedSrc = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("viewport");
    params.set("embed", "1");
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  return (
    <div className="fixed inset-x-0 bottom-0 top-12 bg-slate-100 flex items-stretch justify-center overflow-hidden">
      {viewport === "mobile" ? (
        <div className="flex items-center justify-center w-full h-full p-6 overflow-auto scrollbar-hide">
          <div className="relative w-[417px] h-[876px] flex-shrink-0 bg-slate-900 rounded-[56px] p-3 shadow-lg">
            {/* Dynamic Island */}
            <div
              className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[126px] h-[36px] bg-slate-900 rounded-full z-10"
              aria-hidden="true"
            />
            <iframe
              ref={ref}
              src={embedSrc}
              title="Prototype preview"
              className="block w-full h-full bg-white rounded-[44px]"
            />
            {/* Home indicator */}
            <div
              className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-slate-900/40 rounded-full z-10"
              aria-hidden="true"
            />
          </div>
        </div>
      ) : (
        <iframe
          ref={ref}
          src={embedSrc}
          title="Prototype preview"
          className="w-full h-full bg-white"
        />
      )}
    </div>
  );
});

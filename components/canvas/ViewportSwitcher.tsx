"use client";

import { Smartphone, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useCanvasMode } from "./use-canvas-mode";

export function ViewportSwitcher() {
  const { viewport, setViewport } = useCanvasMode();
  const [showDesktop, setShowDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setShowDesktop(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="bg-slate-100 rounded-full p-1 flex gap-1" role="tablist" aria-label="Viewport">
      <button
        role="tab"
        aria-selected={viewport === "mobile"}
        onClick={() => setViewport("mobile")}
        className={[
          "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
          viewport === "mobile"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-800",
        ].join(" ")}
      >
        <Smartphone className="w-3.5 h-3.5" />
        Mobile
      </button>
      {showDesktop && (
        <button
          role="tab"
          aria-selected={viewport === "desktop"}
          onClick={() => setViewport("desktop")}
          className={[
            "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
            viewport === "desktop"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-800",
          ].join(" ")}
        >
          <Monitor className="w-3.5 h-3.5" />
          Desktop
        </button>
      )}
    </div>
  );
}

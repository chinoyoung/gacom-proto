"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EmbedShell } from "./EmbedShell";
import { CanvasShell } from "./CanvasShell";

function isCanvasRoute(pathname: string): boolean {
  if (/^\/programs\/[^/]+$/.test(pathname)) return true;
  if (pathname === "/marketplace/partner") return true;
  return false;
}

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const urlSaysEmbed = params.get("embed") === "1";
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      if (window.self !== window.top) setIsInIframe(true);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  // Routes that aren't canvas-eligible (e.g. /programs directory) render bare.
  if (!isCanvasRoute(pathname)) {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  const isEmbed = urlSaysEmbed || isInIframe;

  if (isEmbed) {
    return <EmbedShell>{children}</EmbedShell>;
  }

  return (
    <>
      <div className="hidden">{children}</div>
      <CanvasShell />
    </>
  );
}

export function PrototypeShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}

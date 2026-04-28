"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CommentPinLayer } from "@/components/comments/CommentPinLayer";
import type { ReactNode } from "react";

export function EmbedShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.dataset.embed = "1";
    document.body.dataset.embed = "1";
    return () => {
      delete document.documentElement.dataset.embed;
      delete document.body.dataset.embed;
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // only left clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      const target = link.getAttribute("target");
      if (target && target !== "" && target !== "_self") return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.searchParams.get("embed") === "1") return;

      e.preventDefault();
      url.searchParams.set("embed", "1");
      router.push(url.pathname + url.search + url.hash);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [router]);

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CommentPinLayer />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "opportunities", label: "Opportunities" },
  { id: "affiliate", label: "Affiliate" },
  { id: "ambassador", label: "Ambassador" },
  { id: "products", label: "Products" },
  { id: "get-started", label: "Get Started" },
] as const;

const HEADER_HEIGHT = 80;
const NAV_HEIGHT = 56;
const NAV_OFFSET = HEADER_HEIGHT + NAV_HEIGHT;

export default function V1InPageNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: `-${NAV_OFFSET + 8}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Page sections"
      className="hidden md:block sticky top-20 z-40 bg-white/85 backdrop-blur border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <ul className="flex items-center gap-1 -mb-px">
          {SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-center px-4 py-4 text-sm border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                    isActive
                      ? "text-cobalt-600 font-semibold border-cobalt-500"
                      : "text-slate-500 hover:text-neutral-800 border-transparent"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

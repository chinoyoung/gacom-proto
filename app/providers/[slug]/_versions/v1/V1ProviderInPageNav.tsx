"use client";

import { useEffect, useState } from "react";

export interface V1ProviderInPageNavItem {
  id: string;
  label: string;
}

export interface V1ProviderInPageNavProps {
  items: V1ProviderInPageNavItem[];
}

// StickyProviderHeader is a fixed/sticky 60px bar (desktop) that appears on
// scroll. This nav pins directly below it, so the offset covers both bars
// (~60px header + ~56px nav) for click-scroll targets and the scrollspy
// rootMargin.
const NAV_OFFSET = 116;

export default function V1ProviderInPageNav({ items }: V1ProviderInPageNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("program-hero");
    if (!heroEl) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    heroObserver.observe(heroEl);
    return () => heroObserver.disconnect();
  }, []);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: `-${NAV_OFFSET}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top =
      target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Page sections"
      className={`hidden md:block w-full fixed top-[60px] left-0 right-0 z-30 bg-white/85 backdrop-blur-sm border-b border-slate-200 transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ul className="flex items-center gap-1 -mb-px">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-center px-4 py-4 text-sm border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                    isActive
                      ? "text-cobalt-600 font-medium border-cobalt-500"
                      : "text-slate-500 hover:text-slate-700 border-transparent"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

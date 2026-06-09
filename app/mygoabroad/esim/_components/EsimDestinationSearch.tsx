"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { destinations } from "../_data/destinations";
import { DestinationFlag } from "./DestinationFlag";

interface EsimDestinationSearchProps {
  className?: string;
  placeholder?: string;
}

export default function EsimDestinationSearch({
  className,
  placeholder = "Search by country or destination",
}: EsimDestinationSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  }, [query, filtered.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigateTo(slug: string) {
    setIsOpen(false);
    router.push(`/mygoabroad/esim/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((i) => (filtered.length === 0 ? -1 : (i + 1) % filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length === 0 ? -1 : (i - 1 + filtered.length) % filtered.length));
    } else if (e.key === "Enter") {
      if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
        e.preventDefault();
        navigateTo(filtered[activeIndex].slug);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (filtered[0]) navigateTo(filtered[0].slug);
      }}
      className={className ?? "w-full max-w-md"}
    >
      <div ref={containerRef} className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && activeIndex >= 0 && filtered[activeIndex]
              ? `${listboxId}-option-${filtered[activeIndex].slug}`
              : undefined
          }
          role="combobox"
          autoComplete="off"
          className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-lg bg-white text-sm text-neutral-800 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus:border-cobalt-500 transition-colors"
        />
        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Destinations"
            className="absolute left-0 right-0 top-full mt-2 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-left"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500">
                No destinations match &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((dest, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <li
                    key={dest.slug}
                    id={`${listboxId}-option-${dest.slug}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigateTo(dest.slug);
                    }}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer text-sm ${
                      isActive ? "bg-cobalt-500/10 text-cobalt-700" : "text-neutral-800"
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <DestinationFlag destination={dest} size="md" />
                      <span className="min-w-0 flex flex-col">
                        <span className="flex items-center gap-2">
                          <span className="font-medium truncate">{dest.name}</span>
                          {dest.type === "region" && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-900 bg-sun-500 px-1.5 py-0.5 rounded-full shrink-0">
                              Region
                            </span>
                          )}
                        </span>
                        {dest.type === "region" && dest.coverageNote && (
                          <span className="text-xs text-slate-500 truncate">
                            {dest.coverageNote}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500 shrink-0">
                      from {dest.fromPrice}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </form>
  );
}

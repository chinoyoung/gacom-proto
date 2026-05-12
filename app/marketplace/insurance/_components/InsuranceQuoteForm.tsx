"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { countries } from "../_data/countries";

type CoverageType = "non-us" | "us";
type CitizenType = "yes" | "no";

export default function InsuranceQuoteForm() {
  const [destination, setDestination] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = "insurance-destination-listbox";
  const containerRef = useRef<HTMLDivElement>(null);
  const [coverageType, setCoverageType] = useState<CoverageType>("non-us");
  const [usCitizen, setUsCitizen] = useState<CitizenType>("yes");

  const filtered = useMemo(() => {
    const q = destination.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.toLowerCase().includes(q));
  }, [destination]);

  useEffect(() => {
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  }, [destination, filtered.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setDestination(filtered[activeIndex]);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const plansSection = document.getElementById("plans");
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-slate-200 rounded-xl p-5"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="destination"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
          >
            Destination
          </label>
          <div ref={containerRef} className="relative">
            <input
              id="destination"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-activedescendant={
                isOpen && activeIndex >= 0 && filtered[activeIndex]
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Where are you headed?"
              autoComplete="off"
              className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg bg-white text-sm text-neutral-800 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus:border-cobalt-500 transition-colors"
            />
            <ChevronDown
              aria-hidden="true"
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform${isOpen ? " rotate-180" : ""}`}
            />
            {isOpen && (
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Countries"
                className="absolute left-0 right-0 top-full mt-2 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-left"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-500">
                    No countries match &ldquo;{destination}&rdquo;
                  </li>
                ) : (
                  filtered.map((country, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <li
                        key={country}
                        id={`${listboxId}-option-${idx}`}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDestination(country);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-2.5 cursor-pointer text-sm ${
                          isActive ? "bg-cobalt-500/10 text-cobalt-700" : "text-neutral-800"
                        }`}
                      >
                        {country}
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Travel dates
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="departure-date" className="sr-only">
                Departure date
              </label>
              <input
                id="departure-date"
                type="date"
                aria-label="Departure date"
                className="w-full px-3 py-3 border border-slate-300 rounded-lg bg-white text-sm text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus:border-cobalt-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="return-date" className="sr-only">
                Return date
              </label>
              <input
                id="return-date"
                type="date"
                aria-label="Return date"
                className="w-full px-3 py-3 border border-slate-300 rounded-lg bg-white text-sm text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 focus:border-cobalt-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Coverage Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCoverageType("non-us")}
              className={`px-3 py-2.5 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                coverageType === "non-us"
                  ? "border-cobalt-500 bg-cobalt-500/5 text-cobalt-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="block text-xs font-semibold">Non-US Coverage</span>
              <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                For all other destinations
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCoverageType("us")}
              className={`px-3 py-2.5 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                coverageType === "us"
                  ? "border-cobalt-500 bg-cobalt-500/5 text-cobalt-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="block text-xs font-semibold">US Coverage</span>
              <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                For travel that includes the United States
              </span>
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            US Citizen
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUsCitizen("yes")}
              className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                usCitizen === "yes"
                  ? "border-cobalt-500 bg-cobalt-500/5 text-cobalt-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setUsCitizen("no")}
              className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                usCitizen === "no"
                  ? "border-cobalt-500 bg-cobalt-500/5 text-cobalt-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Get Quote
        </button>
      </div>
    </form>
  );
}

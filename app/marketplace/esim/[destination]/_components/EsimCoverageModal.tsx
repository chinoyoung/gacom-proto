"use client";

import { useEffect, useId } from "react";
import { CircleFlag } from "react-circle-flags";
import { X } from "lucide-react";
import type { CoveredCountry } from "../../_data/destinations";

interface EsimCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionName: string;
  countries: CoveredCountry[];
}

export default function EsimCoverageModal({
  isOpen,
  onClose,
  regionName,
  countries,
}: EsimCoverageModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/60 cursor-default"
        tabIndex={-1}
      />
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-lg max-w-lg w-full max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 p-6 md:px-8 md:pt-8 pb-4 border-b border-slate-100">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
              {regionName} coverage
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Included in this plan · {countries.length} {countries.length === 1 ? "country" : "countries"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded p-1 -m-1 shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="overflow-y-auto px-6 md:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {countries.map((c) => (
            <li
              key={c.code}
              className="flex items-center gap-3 py-1.5 text-sm text-neutral-800"
            >
              <span
                className="inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-100 w-6 h-6"
                aria-hidden="true"
              >
                <CircleFlag
                  countryCode={c.code}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="truncate">{c.name}</span>
            </li>
          ))}
        </ul>

        <div className="px-6 md:px-8 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

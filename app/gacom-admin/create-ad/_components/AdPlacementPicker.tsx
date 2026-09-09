"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { PLACEMENT_DIM_LABELS, PLACEMENT_OPTIONS } from "../_shared/mock-data";
import type { PlacementDim } from "../_shared/types";
import type useCreateAdForm from "../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const STATE_KEY: Record<PlacementDim, "locations" | "timings" | "types"> = {
  location: "locations",
  timing: "timings",
  type: "types",
};

const CHIP =
  "inline-flex items-center gap-1 bg-roman-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full";

function PlacementChip({
  value,
  onRemove,
}: {
  value: string;
  onRemove: () => void;
}) {
  return (
    <span className={CHIP}>
      {value}
      <button type="button" aria-label={`Remove ${value}`} onClick={onRemove} className="cursor-pointer">
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </span>
  );
}

const PLACEMENT_PLACEHOLDERS: Record<PlacementDim, string> = {
  location: "Search location…",
  timing: "Search timing…",
  type: "Search subjects…",
};

function PlacementCombobox({ form, dim }: { form: Form; dim: PlacementDim }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = form.state[STATE_KEY[dim]];
  const available = PLACEMENT_OPTIONS[dim]
    .filter((opt) => !selected.includes(opt))
    .filter((opt) => opt.toLowerCase().includes(query.toLowerCase()));

  const listboxId = `${dim}-listbox`;

  useEffect(() => {
    if (!open) return;

    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  function handleSelect(opt: string) {
    form.addPlacementTag(dim, opt);
    setQuery("");
    setOpen(true);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(available.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (available.length === 0) return;
      const opt = available[highlight];
      if (opt) handleSelect(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          value={query}
          placeholder={PLACEMENT_PLACEHOLDERS[dim]}
          className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm bg-white"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onKeyDown={handleKeyDown}
        />

        {open ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute z-30 mt-1 w-full max-h-56 overflow-auto rounded-md border border-slate-200 bg-white shadow-lg"
          >
            {available.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">No matches</div>
            ) : (
              available.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={i === highlight}
                  className={`px-3 py-2 text-sm cursor-pointer w-full text-left hover:bg-slate-50 ${
                    i === highlight ? "bg-slate-100" : ""
                  }`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((v) => (
            <PlacementChip key={v} value={v} onRemove={() => form.removePlacementTag(dim, v)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AdPlacementPicker({ form, columns = false }: { form: Form; columns?: boolean }) {
  return (
    <div className={columns ? "grid grid-cols-1 lg:grid-cols-3 gap-4 items-start" : "space-y-4"}>
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
          {PLACEMENT_DIM_LABELS.location}
        </label>
        <PlacementCombobox form={form} dim="location" />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
          {PLACEMENT_DIM_LABELS.timing}
        </label>
        <PlacementCombobox form={form} dim="timing" />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
          {PLACEMENT_DIM_LABELS.type}
        </label>
        <PlacementCombobox form={form} dim="type" />
      </div>
    </div>
  );
}

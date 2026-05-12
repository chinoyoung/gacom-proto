"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  startValue: string; // YYYY-MM-DD
  endValue: string; // YYYY-MM-DD
  min?: string; // YYYY-MM-DD
  onChange: (range: { start: string; end: string }) => void;
}

function parseISODate(s: string): Date {
  return new Date(s + "T00:00:00");
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatLong(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

export default function DateRangePicker({
  startValue,
  endValue,
  min,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const [numMonths, setNumMonths] = useState(2);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 580px)");
    const update = () => setNumMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const startDate = parseISODate(startValue);
  const endDate = parseISODate(endValue);
  const minDate = min ? parseISODate(min) : undefined;
  const totalDays = daysBetween(startDate, endDate);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setDraft(undefined);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setDraft(undefined);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleToggle() {
    setOpen((prev) => {
      setDraft(undefined);
      return !prev;
    });
  }

  function handleSelect(_range: DateRange | undefined, triggerDate: Date) {
    if (!triggerDate) return;

    if (!draft || (draft.from && draft.to)) {
      setDraft({ from: triggerDate, to: undefined });
      return;
    }

    if (draft.from) {
      const earlier = triggerDate < draft.from ? triggerDate : draft.from;
      const later = triggerDate < draft.from ? draft.from : triggerDate;
      setDraft({ from: earlier, to: later });
      onChange({ start: toISODate(earlier), end: toISODate(later) });
    }
  }

  const visibleSelection: DateRange = draft ?? { from: startDate, to: endDate };
  const isPickingEnd = Boolean(draft?.from && !draft?.to);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 border bg-white rounded-lg text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
          open
            ? "border-cobalt-500 ring-1 ring-cobalt-500"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <span className="flex items-center gap-3 min-w-0">
          <CalendarIcon className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="flex items-center gap-2 text-sm font-medium text-neutral-900 truncate">
            <span className="truncate">{formatLong(startDate)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{formatLong(endDate)}</span>
          </span>
        </span>
        <span className="text-xs text-slate-500 font-medium shrink-0">
          {totalDays} {totalDays === 1 ? "day" : "days"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose travel dates"
          className="esim-datepicker-popover absolute left-0 top-full mt-2 z-30 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-max max-w-[calc(100vw-2rem)]"
        >
          <div className="px-1 pb-3 flex items-center justify-between gap-3 border-b border-slate-100 mb-3">
            <p className="text-sm text-neutral-700">
              {isPickingEnd ? "Now pick the end date" : "Pick your travel dates"}
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setDraft(undefined);
              }}
              className="text-xs font-semibold text-cobalt-500 hover:text-cobalt-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded px-1.5 py-0.5"
            >
              Done
            </button>
          </div>
          <DayPicker
            mode="range"
            numberOfMonths={numMonths}
            pagedNavigation
            selected={visibleSelection}
            defaultMonth={startDate}
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={handleSelect}
            showOutsideDays
            className="esim-range-picker"
          />
        </div>
      )}
    </div>
  );
}

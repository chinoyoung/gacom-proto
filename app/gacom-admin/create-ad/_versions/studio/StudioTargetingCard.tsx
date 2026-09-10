"use client";

import { useState } from "react";
import { CalendarSearch, Check, X } from "lucide-react";
import AdPlacementPicker from "../../_components/AdPlacementPicker";
import type useCreateAdForm from "../../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const CARD = "bg-white rounded-xl border border-slate-200 p-5";
const LABEL = "text-xs font-semibold text-slate-500 mb-1.5 block";
const INPUT = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white";

const DURATIONS = [
  { label: "1 month", months: 1 },
  { label: "3 months", months: 3 },
  { label: "1 year", months: 12 },
];

function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const total = m - 1 + months;
  const year = y + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12; // 0-indexed
  const lastDay = new Date(year, month + 1, 0).getDate();
  const day = Math.min(d, lastDay);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysBetween(startIso: string, endIso: string): number {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  if (!sy || !sm || !sd || !ey || !em || !ed) return 0;
  const s = Date.UTC(sy, sm - 1, sd);
  const e = Date.UTC(ey, em - 1, ed);
  return Math.round((e - s) / 86400000);
}

function checkSlots(loc: string[], tim: string[], typ: string[]): { available: boolean; slots: number } {
  const key = [...loc, ...tim, ...typ].join("|");
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const slots = hash % 5; // 0..4 of 5 remaining
  return { available: slots > 0, slots };
}

export default function StudioTargetingCard({ form }: { form: Form }) {
  const [preset, setPreset] = useState<number | null>(null);
  const [availability, setAvailability] = useState<{ available: boolean; slots: number } | null>(null);
  const [needsPlacement, setNeedsPlacement] = useState(false);

  // Reset the stale result when the placement combo or ad type changes.
  // Adjusted during render (React's documented pattern for "state derived from
  // a prop change") rather than in a useEffect, which would call setState
  // synchronously inside the effect body and trigger a cascading-render lint error.
  const placementKey = `${form.state.adType}|${form.state.locations.join()}|${form.state.timings.join()}|${form.state.types.join()}`;
  const [lastPlacementKey, setLastPlacementKey] = useState(placementKey);
  if (placementKey !== lastPlacementKey) {
    setLastPlacementKey(placementKey);
    setAvailability(null);
    setNeedsPlacement(false);
  }

  function handleCheck() {
    if (form.placementCount === 0) {
      setNeedsPlacement(true);
      setAvailability(null);
      return;
    }
    setNeedsPlacement(false);
    setAvailability(checkSlots(form.state.locations, form.state.timings, form.state.types));
  }

  function handleStart(v: string) {
    form.setStartDate(v);
    if (preset != null) form.setEndDate(addMonths(v, preset));
  }
  function handleEnd(v: string) {
    form.setEndDate(v);
    setPreset(null);
  }
  function applyPreset(months: number) {
    setPreset(months);
    form.setEndDate(addMonths(form.state.startDate, months));
  }

  const runDays = daysBetween(form.state.startDate, form.state.endDate);

  return (
    <div className={CARD}>
      <h2 className="text-sm font-bold text-slate-900 mb-4">Targeting &amp; schedule</h2>
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className="text-xs font-semibold text-slate-500">Duration</span>
          {DURATIONS.map((dur) => (
            <button
              key={dur.months}
              type="button"
              onClick={() => applyPreset(dur.months)}
              className={`text-sm px-3 py-1 rounded-full cursor-pointer ${
                preset === dur.months
                  ? "bg-roman-500 text-white border border-roman-500"
                  : "border border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-36 sm:w-40">
            <label className={LABEL} htmlFor="studio-start-date">
              Start Date
            </label>
            <input
              id="studio-start-date"
              type="date"
              className={INPUT}
              value={form.state.startDate}
              onChange={(e) => handleStart(e.target.value)}
            />
          </div>
          <div className="w-36 sm:w-40">
            <label className={LABEL} htmlFor="studio-end-date">
              End Date
            </label>
            <input
              id="studio-end-date"
              type="date"
              className={INPUT}
              value={form.state.endDate}
              onChange={(e) => handleEnd(e.target.value)}
            />
          </div>
          {preset === null && runDays > 0 ? (
            <div className="flex items-center h-10">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap">
                Runs for {runDays} day{runDays === 1 ? "" : "s"}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {!form.usesPrograms ? (
        <div className="bg-slate-50 rounded-lg p-4">
          <label className={LABEL}>Ad placement</label>
          <AdPlacementPicker
            form={form}
            columns
            actions={
              form.hasLimitedSlots ? (
                <div className="flex items-center gap-2">
                  {needsPlacement && !availability ? (
                    <span className="text-xs text-amber-600 whitespace-nowrap">Select a placement</span>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleCheck}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 cursor-pointer whitespace-nowrap border ${
                      availability
                        ? availability.available
                          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                          : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {availability ? (
                      availability.available ? (
                        <>
                          <Check className="h-3 w-3" aria-hidden="true" />
                          Available
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" aria-hidden="true" />
                          Unavailable
                        </>
                      )
                    ) : (
                      <>
                        <CalendarSearch className="h-3 w-3" aria-hidden="true" />
                        Check availability
                      </>
                    )}
                  </button>
                </div>
              ) : undefined
            }
          />
        </div>
      ) : null}
    </div>
  );
}

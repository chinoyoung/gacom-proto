"use client";

import { useState } from "react";
import { CalendarClock, CalendarSearch, Check, X } from "lucide-react";
import AdPlacementPicker from "../../_components/AdPlacementPicker";
import type useCreateAdForm from "../../_shared/useCreateAdForm";
import type useAdCart from "../../_shared/useAdCart";

type Form = ReturnType<typeof useCreateAdForm>;
type Cart = ReturnType<typeof useAdCart>;

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

// Deterministic mock: each placement combo maps to one slot.
// ~1/3 of combos are open now (null); the rest are held by a running ad
// until a date some weeks out from today.
function slotBookedUntil(loc: string[], tim: string[], typ: string[]): string | null {
  const key = [...loc, ...tim, ...typ].join("|");
  if (!key) return null;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  if (hash % 3 === 0) return null; // open now
  const daysOut = 25 + (hash % 100); // 25..124 days out
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysOut);
  return isoOf(d);
}

function isoOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDaysIso(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return isoOf(dt);
}

function fmtDate(iso: string, withYear = false): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", withYear
    ? { month: "short", day: "numeric", year: "numeric" }
    : { month: "short", day: "numeric" });
}

export default function StudioTargetingCard({ form, cart }: { form: Form; cart: Cart }) {
  const [preset, setPreset] = useState<number | null>(null);
  const [availability, setAvailability] = useState<{ free: boolean; bookedUntil: string | null } | null>(null);
  const [needsPlacement, setNeedsPlacement] = useState(false);
  const [reserveError, setReserveError] = useState<string | null>(null);

  // Reset the stale result when the placement combo, ad type, or start date changes.
  // Adjusted during render (React's documented pattern for "state derived from
  // a prop change") rather than in a useEffect, which would call setState
  // synchronously inside the effect body and trigger a cascading-render lint error.
  const placementKey = `${form.state.adType}|${form.state.locations.join()}|${form.state.timings.join()}|${form.state.types.join()}|${form.state.startDate}`;
  const [lastPlacementKey, setLastPlacementKey] = useState(placementKey);
  if (placementKey !== lastPlacementKey) {
    setLastPlacementKey(placementKey);
    setAvailability(null);
    setNeedsPlacement(false);
    setReserveError(null);
  }

  function handleCheck() {
    if (form.placementCount === 0) {
      setNeedsPlacement(true);
      setAvailability(null);
      return;
    }
    setNeedsPlacement(false);
    const bookedUntil = slotBookedUntil(form.state.locations, form.state.timings, form.state.types);
    const free = bookedUntil === null || bookedUntil < form.state.startDate;
    setAvailability({ free, bookedUntil });
  }

  function handleReserve(bookedUntil: string) {
    // same validation as "Add to campaign"
    if (!form.usesPrograms && form.placementCount === 0) {
      setReserveError("Add at least one placement first.");
      return;
    }
    if (!form.contentComplete) {
      setReserveError("Fill in all required fields: " + form.missingFieldLabels.join(", "));
      return;
    }
    setReserveError(null);

    // reserved window — preserve the chosen duration
    const open = addDaysIso(bookedUntil, 1);
    let newEnd: string;
    if (preset != null) {
      newEnd = addMonths(open, preset);
    } else {
      const len = daysBetween(form.state.startDate, form.state.endDate);
      newEnd = len > 0 ? addDaysIso(open, len) : form.state.endDate;
    }

    form.setStartDate(open);
    form.setEndDate(newEnd);
    cart.addItem({
      adType: form.state.adType,
      locations: form.state.locations,
      timings: form.state.timings,
      types: form.state.types,
      directories: form.state.directories,
      startDate: open,
      endDate: newEnd,
    });
    form.resetPlacementFields();
    cart.openAdded();
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
                        ? availability.free
                          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                          : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {availability ? (
                      availability.free ? (
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
          {availability && !availability.free && availability.bookedUntil ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-fern-500 text-white">
                  <CalendarClock className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">Reserve this spot before someone else does</p>
                <p className="mt-1 text-sm text-slate-600">
                  It opens up on{" "}
                  <span className="font-semibold text-fern-700">
                    {fmtDate(addDaysIso(availability.bookedUntil, 1), true)}
                  </span>
                  . Lock it in now and your ad goes live the moment it frees.
                </p>
                <button
                  type="button"
                  onClick={() => handleReserve(availability.bookedUntil!)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-fern-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fern-600 cursor-pointer"
                >
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Reserve — start {fmtDate(addDaysIso(availability.bookedUntil, 1))}
                </button>
                {reserveError ? (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {reserveError}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

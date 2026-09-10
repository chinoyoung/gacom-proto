"use client";

import AdPlacementPicker from "../../_components/AdPlacementPicker";
import type useCreateAdForm from "../../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const CARD = "bg-white rounded-xl border border-slate-200 p-5";
const LABEL = "text-xs font-semibold text-slate-500 mb-1.5 block";
const INPUT = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white";

export default function StudioTargetingCard({ form }: { form: Form }) {
  return (
    <div className={CARD}>
      <h2 className="text-sm font-bold text-slate-900 mb-4">Targeting &amp; schedule</h2>
      <div className="flex gap-3 mb-4">
        <div className="w-36 sm:w-40">
          <label className={LABEL} htmlFor="studio-start-date">
            Start Date
          </label>
          <input
            id="studio-start-date"
            type="date"
            className={INPUT}
            value={form.state.startDate}
            onChange={(e) => form.setStartDate(e.target.value)}
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
            onChange={(e) => form.setEndDate(e.target.value)}
          />
        </div>
      </div>
      {!form.usesPrograms ? (
        <div>
          <label className={LABEL}>Ad placement</label>
          <AdPlacementPicker form={form} columns />
        </div>
      ) : null}
    </div>
  );
}

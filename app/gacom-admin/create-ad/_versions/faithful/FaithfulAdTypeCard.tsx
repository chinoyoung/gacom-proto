"use client";

import type useCreateAdForm from "../../_shared/useCreateAdForm";
import { AD_TYPES_BY_AREA } from "../../_shared/ad-types";
import AdPlacementPicker from "../../_components/AdPlacementPicker";

type Form = ReturnType<typeof useCreateAdForm>;

const FIELD_LABEL = "text-xs font-semibold text-slate-500 mb-1.5 block";
const FIELD_INPUT = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white";

export default function FaithfulAdTypeCard({ form }: { form: Form }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className={FIELD_LABEL} htmlFor="ad-type">
            Ad Type
          </label>
          <select
            id="ad-type"
            className={`${FIELD_INPUT} cursor-pointer`}
            value={form.state.adType}
            onChange={(e) => form.setAdType(e.target.value)}
          >
            {Object.entries(AD_TYPES_BY_AREA).map(([area, specs]) => (
              <optgroup key={area} label={area}>
                {specs.map((spec) => (
                  <option key={spec.name} value={spec.name}>
                    {spec.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="sm:w-40">
          <label className={FIELD_LABEL} htmlFor="start-date">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            className={FIELD_INPUT}
            value={form.state.startDate}
            onChange={(e) => form.setStartDate(e.target.value)}
          />
        </div>

        <div className="sm:w-40">
          <label className={FIELD_LABEL} htmlFor="end-date">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            className={FIELD_INPUT}
            value={form.state.endDate}
            onChange={(e) => form.setEndDate(e.target.value)}
          />
        </div>
      </div>

      {!form.usesPrograms ? (
        <div className="mt-4">
          <label className={FIELD_LABEL}>Ad Placement</label>
          <AdPlacementPicker form={form} />
        </div>
      ) : null}
    </div>
  );
}

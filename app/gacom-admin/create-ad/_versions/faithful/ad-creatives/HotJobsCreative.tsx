"use client";

import type { AdTypeSpec } from "../../../_shared/ad-types";
import {
  AD_PREVIEW_DEFAULT_DESCRIPTION,
  AD_PREVIEW_DEFAULT_TITLE,
  AD_PREVIEW_PROVIDER,
} from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Hot Jobs archetype (Ad Q): a compact, fully auto-pulled listing row — a
 * small square thumbnail, an amber "Hot" tag next to the provider name, a
 * bold title, and a one-line description. No buttons on this ad type.
 */
export default function HotJobsCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const title = form.state.title || AD_PREVIEW_DEFAULT_TITLE;
  const description = form.state.description || AD_PREVIEW_DEFAULT_DESCRIPTION;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3">
      <div className="w-16 h-16 shrink-0">
        <CoverImage form={form} ratio={spec.imageRatio ?? "1/1"} rounded />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="bg-amber-500 text-white text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
            Hot
          </span>
          <span className="text-xs text-slate-500 truncate">{AD_PREVIEW_PROVIDER}</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 truncate">{title}</h3>
        <p className="text-xs text-slate-600 line-clamp-1">{description}</p>
      </div>
    </div>
  );
}

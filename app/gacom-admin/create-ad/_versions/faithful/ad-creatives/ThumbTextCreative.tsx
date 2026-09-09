"use client";

import type { AdTypeSpec } from "../../../_shared/ad-types";
import {
  AD_PREVIEW_DEFAULT_DESCRIPTION,
  AD_PREVIEW_PROVIDER,
} from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Thumbnail-text archetype (Ad G, R): a compact horizontal card — a small
 * square thumbnail on the left, and a bold provider/title line plus a
 * one-sentence grey description on the right. No button (title is
 * auto-populated from the provider's public name on these two ad types).
 */
export default function ThumbTextCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const title = form.state.title || AD_PREVIEW_PROVIDER;
  const description = form.state.description || AD_PREVIEW_DEFAULT_DESCRIPTION;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
      <div className="w-20 h-20 shrink-0">
        <CoverImage form={form} ratio={spec.imageRatio ?? "1:1"} rounded />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900 truncate">{title}</h3>
        <p className="text-sm text-slate-600 leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

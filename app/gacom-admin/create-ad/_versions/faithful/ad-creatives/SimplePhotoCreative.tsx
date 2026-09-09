"use client";

import { ExternalLink } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import { AD_PREVIEW_DEFAULT_TITLE, AD_PREVIEW_PROVIDER } from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage, LogoTile } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Simple-photo archetype (Ad F, H, M): a square cover photo, then a body
 * with a small logo tile + title, and a full-width single filled button.
 * No reviews, no description.
 */
export default function SimplePhotoCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const title = form.state.title || AD_PREVIEW_DEFAULT_TITLE;
  const href = form.state.clientLink || "#";
  const buttonLabel = spec.buttons[0] ?? "Visit Website";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <CoverImage form={form} ratio={spec.imageRatio} />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <LogoTile provider={AD_PREVIEW_PROVIDER} size="sm" />
          <h3 className="text-base font-bold text-sky-800 leading-snug">{title}</h3>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-semibold py-2.5 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {buttonLabel}
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

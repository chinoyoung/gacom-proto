"use client";

import type { AdTypeSpec } from "../../../_shared/ad-types";
import { AD_PREVIEW_DEFAULT_TITLE, AD_PREVIEW_PROVIDER } from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage, LogoTile } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Centered-overlay archetype (Ad II, NN): a full-bleed cover photo with a
 * dark scrim, and centered content stacked on top — a white logo tile, a
 * white title, and a single filled button. Used for brand-promo formats
 * that don't split into image/text halves like BrandSplitCreative.
 */
export default function CenteredOverlayCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const title = form.state.title || AD_PREVIEW_DEFAULT_TITLE;
  const href = form.state.clientLink || "#";
  const buttonLabel = spec.buttons[0] || "Learn More";

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-slate-200 min-h-[280px]"
      style={{ aspectRatio: (spec.imageRatio ?? "4:3").replace(":", "/") }}
    >
      <div className="absolute inset-0">
        <CoverImage form={form} ratio={spec.imageRatio} />
      </div>
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-4 p-6">
        <LogoTile provider={AD_PREVIEW_PROVIDER} />
        <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-semibold py-2.5 px-6 text-sm inline-flex items-center gap-1.5 cursor-pointer"
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}

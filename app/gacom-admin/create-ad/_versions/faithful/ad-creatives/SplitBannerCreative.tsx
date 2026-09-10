"use client";

import { ExternalLink } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import { AD_PREVIEW_DEFAULT_TITLE, AD_PREVIEW_PROVIDER } from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage, PillBadge } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Split-banner archetype (Ad C, J): a wide two-column banner — a left image
 * half with an amber "Featured Provider of the Month" pill, and a right
 * white half with a large cobalt title, a "with {provider}" subtitle, and a
 * single filled button. Rendered in the wide (640px) preview frame.
 */
export default function SplitBannerCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const title = form.state.title || AD_PREVIEW_DEFAULT_TITLE;
  const href = form.state.clientLink || "#";
  const buttonLabel = spec.buttons[0] ?? "Visit Website";
  // Size the banner card to the ad's real pixel dimensions (e.g. "1000 × 350")
  // so it reads as the actual wide/short unit, rather than the too-tall imageRatio.
  const [bannerW, bannerH] = spec.imageDesktop.split("×").map((s) => Number(s.trim()));
  const bannerAspectRatio =
    bannerW && bannerH ? `${bannerW} / ${bannerH}` : "1000 / 350";

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 overflow-hidden flex min-h-[200px]"
      style={{ aspectRatio: bannerAspectRatio }}
    >
      <div className="relative w-1/2 [&>div]:h-full">
        <CoverImage form={form} ratio={spec.imageRatio} />
        <div className="absolute top-2 left-2">
          <PillBadge>Featured Provider of the Month</PillBadge>
        </div>
      </div>

      <div className="w-1/2 p-5 flex flex-col justify-center gap-3">
        <h3 className="text-lg font-bold text-sky-800 leading-snug">{title}</h3>
        <p className="text-sm text-slate-600">with {AD_PREVIEW_PROVIDER}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-semibold py-2.5 px-5 text-sm inline-flex items-center gap-1.5 cursor-pointer"
        >
          {buttonLabel}
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

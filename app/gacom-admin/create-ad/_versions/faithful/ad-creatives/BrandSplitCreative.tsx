"use client";

import { ExternalLink } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import {
  AD_PREVIEW_DEFAULT_DESCRIPTION,
  AD_PREVIEW_DEFAULT_TITLE,
  AD_PREVIEW_PROVIDER,
} from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage, LogoTile, PillBadge } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Brand-promo split archetype (Ad HH, GG, KK, MM, JJ, LL): a wide two-column
 * card — a left image half with an amber "Featured Resource" pill, and a
 * right white half with a cobalt title, a multi-line description, and a
 * bottom row pairing the provider's logo tile with a single filled button.
 * Rendered in the wide (640px) preview frame.
 */
export default function BrandSplitCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const title = form.state.title || AD_PREVIEW_DEFAULT_TITLE;
  const description = form.state.description || AD_PREVIEW_DEFAULT_DESCRIPTION;
  const href = form.state.clientLink || "#";
  const buttonLabel = spec.buttons[0] ?? "Learn More";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex min-h-[220px]">
      <div className="relative w-1/2 [&>div]:h-full">
        <CoverImage form={form} ratio={spec.imageRatio ?? "1:1"} />
        <div className="absolute top-2 left-2">
          <PillBadge>Featured Resource</PillBadge>
        </div>
      </div>

      <div className="w-1/2 p-5 flex flex-col">
        <h3 className="text-lg font-bold text-sky-800 leading-snug mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
          {description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <LogoTile provider={AD_PREVIEW_PROVIDER} size="sm" />
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-semibold py-2.5 px-5 text-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            {buttonLabel}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

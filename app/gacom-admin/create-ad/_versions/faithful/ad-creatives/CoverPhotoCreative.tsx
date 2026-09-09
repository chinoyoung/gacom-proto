"use client";

import { BadgeCheck, ExternalLink, Heart, Star } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import {
  AD_PREVIEW_PROVIDER,
  AD_PREVIEW_RATING,
  AD_PREVIEW_REVIEWS,
} from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage, LogoTile } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

// No provider-tenure or program-count fields exist on AdTypeSpec — these are
// purely cosmetic mock copy for the provider-cover overlay (Ad K).
const MOCK_SINCE_YEAR = 2005;
const MOCK_PROGRAM_COUNT = 196;

/**
 * Cover-photo archetype (Ad T/D, K): a wide 1440×500 banner.
 *
 * Ad T/D (Listing Cover Photo / Customized Listing Cover Photo) is the
 * image alone, with just a heart — no overlay copy.
 *
 * Ad K (Customized Provider Page Cover Photo) adds a bottom gradient and an
 * overlaid bottom-left block: logo + provider name (white) + a rating /
 * verified / tenure / program-count meta row, plus a Visit Website (red)
 * and Contact Provider (cobalt) button pair from `spec.buttons`.
 */
export default function CoverPhotoCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const isProviderCover = spec.code === "Ad K";
  const href = form.state.clientLink || "#";

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[1440/500]">
      <div className="absolute inset-0 [&>div]:h-full">
        <CoverImage form={form} ratio={spec.imageRatio} />
      </div>

      <button
        type="button"
        aria-label="Save"
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 grid place-items-center cursor-pointer z-10"
      >
        <Heart className="w-4 h-4" aria-hidden="true" />
      </button>

      {isProviderCover ? (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent"
            aria-hidden="true"
          />

          <div className="absolute left-4 bottom-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <LogoTile provider={AD_PREVIEW_PROVIDER} size="sm" />
                <span className="text-white text-lg font-bold truncate">
                  {AD_PREVIEW_PROVIDER}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/90">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" aria-hidden="true" />
                  {AD_PREVIEW_RATING} ({AD_PREVIEW_REVIEWS.toLocaleString()})
                </span>
                <span className="inline-flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  Verified
                </span>
                <span>Since {MOCK_SINCE_YEAR}</span>
                <span>{MOCK_PROGRAM_COUNT} Programs</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {spec.buttons.map((button) => (
                <a
                  key={button}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-lg font-semibold py-2 px-4 text-sm inline-flex items-center gap-1.5 cursor-pointer text-white ${
                    button === "Visit Website"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-sky-800 hover:bg-sky-900"
                  }`}
                >
                  {button}
                  {button === "Visit Website" ? (
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

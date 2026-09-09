"use client";

import { ArrowRight, ChevronRight, ExternalLink, Heart } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import {
  AD_PREVIEW_DEFAULT_DESCRIPTION,
  AD_PREVIEW_DEFAULT_TITLE,
  AD_PREVIEW_PROVIDER,
  AD_PREVIEW_RATING,
  AD_PREVIEW_REVIEWS,
} from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage, LogoTile, ReviewStars } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

// No program-count field exists on AdTypeSpec — the "See All N Programs" link
// is purely cosmetic mock copy, so the count is a fixed sample value.
const MOCK_PROGRAM_COUNT = 25;

const BUTTON_BASE =
  "rounded-lg font-semibold py-2.5 text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer";
const BUTTON_FILLED = `${BUTTON_BASE} bg-sky-800 hover:bg-sky-900 text-white`;
const BUTTON_OUTLINE = `${BUTTON_BASE} border border-sky-800 text-sky-800 hover:bg-sky-50`;

/**
 * Program-card archetype: the highest-value cluster (Ad A, B, I, N, O, P).
 * Cover + heart, an optional provider/reviews row, title, an optional
 * description, an optional "See All Programs" link, and a button row.
 * Ad P has no photo — it renders a large logo tile in the cover's place.
 */
export default function ProgramCardCreative({
  spec,
  form,
}: {
  spec: AdTypeSpec;
  form: Form;
}) {
  const provider = AD_PREVIEW_PROVIDER;
  const title = form.state.title || AD_PREVIEW_DEFAULT_TITLE;
  const isLogoVariant = spec.code === "Ad P" || !spec.imageDesktop.includes("×");
  const showReviews = spec.autoFields.includes("Reviews");
  const showVerified = spec.autoFields.includes("Verification");
  const showSeeAllPrograms = spec.autoFields.includes("See All Programs");
  // descriptionMax != null means the advertiser can type one in; a 2-button
  // card (Ad I/N/O/P) has room for one too and auto-pulls it from the
  // program listing even when there's no manual description field.
  const showDescription = spec.descriptionMax !== null || spec.buttons.length > 1;
  const href = form.state.clientLink || "#";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {isLogoVariant ? (
        <div className="w-full aspect-[4/3] bg-slate-50 grid place-items-center">
          <LogoTile provider={provider} size="lg" />
        </div>
      ) : (
        <div className="relative">
          <CoverImage form={form} ratio={spec.imageRatio} />
          <button
            type="button"
            aria-label="Save program"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/55 text-white grid place-items-center cursor-pointer"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="p-4">
        {showReviews ? (
          <div className="flex items-center gap-2 mb-3">
            <LogoTile provider={provider} size="sm" />
            <span className="font-bold text-slate-800 text-sm truncate">{provider}</span>
            <ReviewStars
              rating={AD_PREVIEW_RATING}
              reviews={AD_PREVIEW_REVIEWS}
              verified={showVerified}
            />
          </div>
        ) : null}

        <h3 className="text-lg font-bold text-sky-800 leading-snug">{title}</h3>

        {showDescription ? (
          <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">
            {form.state.description || AD_PREVIEW_DEFAULT_DESCRIPTION}
          </p>
        ) : null}

        {showSeeAllPrograms ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-0.5 text-sky-700 text-sm font-medium hover:underline cursor-pointer"
          >
            See All {MOCK_PROGRAM_COUNT} Programs
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </a>
        ) : null}

        {spec.buttons.length > 0 ? (
          <div className="flex gap-2 mt-4">
            {spec.buttons.map((button) => (
              <a
                key={button}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 ${button === "View Program" ? BUTTON_OUTLINE : BUTTON_FILLED}`}
              >
                {button}
                {button === "View Program" ? (
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                )}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

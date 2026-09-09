"use client";

import { ImageIcon, LayoutTemplate } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import BrandSplitCreative from "./BrandSplitCreative";
import CenteredOverlayCreative from "./CenteredOverlayCreative";
import CoverPhotoCreative from "./CoverPhotoCreative";
import HotJobsCreative from "./HotJobsCreative";
import ProgramCardCreative from "./ProgramCardCreative";
import SimplePhotoCreative from "./SimplePhotoCreative";
import SplitBannerCreative from "./SplitBannerCreative";
import ThumbTextCreative from "./ThumbTextCreative";
import VideoSplitCreative from "./VideoSplitCreative";

type Form = ReturnType<typeof useCreateAdForm>;

const WIDE_ARCHETYPES: AdTypeSpec["archetype"][] = [
  "split-banner",
  "cover-photo",
  "video-split",
  "brand-split",
];

/**
 * Preview frame max-width per archetype: wide formats (banners, covers,
 * video, brand-split) get more room than card-shaped formats so they
 * aren't squeezed down to card width.
 */
export function frameMaxWidth(spec: AdTypeSpec | undefined): number {
  if (spec && WIDE_ARCHETYPES.includes(spec.archetype)) return 640;
  return 380;
}

function FallbackCreative({ spec }: { spec: AdTypeSpec }) {
  const hasImageDims = spec.imageDesktop.includes("×");
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="mx-auto mb-3 w-11 h-11 rounded-lg bg-white border border-slate-200 grid place-items-center">
        <LayoutTemplate className="w-5 h-5 text-slate-400" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-slate-700">Live preview for {spec.name}</p>
      <p className="text-xs text-slate-500 mt-1">coming in a later phase</p>
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs text-slate-500">
        <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
        {hasImageDims ? (
          <>
            {spec.imageDesktop} px
            {spec.imageMobile ? ` · ${spec.imageMobile} px (mobile)` : ""}
          </>
        ) : (
          spec.imageDesktop
        )}
      </div>
    </div>
  );
}

/**
 * Renders the live creative for the active ad type's archetype. Every
 * archetype currently falls back to a labeled placeholder; each phase of
 * the ad-types rollout wires in its real components (see the design spec's
 * "Archetype components" section).
 */
export default function PreviewSwitcher({
  spec,
  form,
}: {
  spec: AdTypeSpec | undefined;
  form: Form;
}) {
  if (!spec) return null;

  switch (spec.archetype) {
    case "program-card":
      return <ProgramCardCreative spec={spec} form={form} />;
    case "simple-photo":
      return <SimplePhotoCreative spec={spec} form={form} />;
    case "thumb-text":
      return <ThumbTextCreative spec={spec} form={form} />;
    case "split-banner":
      return <SplitBannerCreative spec={spec} form={form} />;
    case "brand-split":
      return <BrandSplitCreative spec={spec} form={form} />;
    case "centered-overlay":
      return <CenteredOverlayCreative spec={spec} form={form} />;
    case "video-split":
      return <VideoSplitCreative spec={spec} form={form} />;
    case "cover-photo":
      return <CoverPhotoCreative spec={spec} form={form} />;
    case "hot-jobs":
      return <HotJobsCreative spec={spec} form={form} />;
    default:
      return <FallbackCreative spec={spec} />;
  }
}

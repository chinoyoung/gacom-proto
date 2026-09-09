"use client";

import { ExternalLink, Play } from "lucide-react";
import type { AdTypeSpec } from "../../../_shared/ad-types";
import { AD_PREVIEW_DEFAULT_TITLE, AD_PREVIEW_PROVIDER } from "../../../_shared/mock-data";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";
import { CoverImage } from "./_shared";

type Form = ReturnType<typeof useCreateAdForm>;

/**
 * Video-split archetype (Ad E, L): a wide left/right layout — a left text
 * column with an amber "Featured video of the month" label, title, provider,
 * and a filled button, and a right mock video player (thumbnail, centered
 * play affordance, faux control bar). No real video/iframe — it's a static
 * mock. Rendered in the wide (640px) preview frame.
 */
export default function VideoSplitCreative({
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
    <div className="flex gap-5 items-center">
      <div className="w-1/2 flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-amber-500">
          Featured video of the month
        </span>
        <h3 className="text-lg font-bold text-slate-900 leading-snug">{title}</h3>
        <p className="text-sm text-slate-600">{AD_PREVIEW_PROVIDER}</p>
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

      <div className="w-1/2">
        <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video [&>div]:h-full">
          <CoverImage form={form} ratio="16:9" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="w-12 h-12 rounded-full bg-black/50 grid place-items-center">
              <Play className="w-5 h-5 text-white fill-current" aria-hidden="true" />
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 bg-black/40 px-2 py-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            <span className="text-[10px] text-white">0:01 / 3:10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

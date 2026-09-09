"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import type useCreateAdForm from "../../_shared/useCreateAdForm";
import type useAdCart from "../../_shared/useAdCart";
import { AD_TYPES_BY_AREA, getAdType } from "../../_shared/ad-types";
import type { PlacementArea } from "../../_shared/ad-types";
import { PREVIEW_URL } from "../../_shared/mock-data";
import PreviewSwitcher, { frameMaxWidth } from "../faithful/ad-creatives/PreviewSwitcher";
import StudioCampaignBar from "./StudioCampaignBar";
import StudioContentPanel from "./StudioContentPanel";
import StudioFormatCarousel from "./StudioFormatCarousel";
import StudioTargetingCard from "./StudioTargetingCard";

type Form = ReturnType<typeof useCreateAdForm>;
type Cart = ReturnType<typeof useAdCart>;

const PLACEMENT_AREAS = Object.keys(AD_TYPES_BY_AREA) as PlacementArea[];

interface StudioBuilderProps {
  form: Form;
  cart: Cart;
}

export default function StudioBuilder({ form, cart }: StudioBuilderProps) {
  const [area, setArea] = useState<PlacementArea>(
    getAdType(form.state.adType)?.area ?? "Homepage"
  );
  const spec = getAdType(form.state.adType);

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 pt-6 pb-28 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Ad</h1>

        <div className="flex flex-wrap gap-2">
          {PLACEMENT_AREAS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setArea(a)}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                a === area
                  ? "bg-roman-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <StudioFormatCarousel area={area} form={form} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Live preview</span>
              <div className="inline-flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => form.setPreviewDevice("desktop")}
                  aria-pressed={form.state.previewDevice === "desktop"}
                  className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium cursor-pointer ${
                    form.state.previewDevice === "desktop"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => form.setPreviewDevice("mobile")}
                  aria-pressed={form.state.previewDevice === "mobile"}
                  className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium cursor-pointer ${
                    form.state.previewDevice === "mobile"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                  Mobile
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 grid place-items-center bg-slate-200 min-h-[36rem]">
              <div
                style={{
                  maxWidth:
                    form.state.previewDevice === "mobile"
                      ? Math.min(frameMaxWidth(spec), 340)
                      : frameMaxWidth(spec),
                }}
                className="mx-auto w-full transition-all rounded-xl border border-slate-300 overflow-hidden bg-white p-4"
              >
                <PreviewSwitcher spec={spec} form={form} />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-200 text-xs text-slate-500">
              This ad will appear on:{" "}
              <a
                href={PREVIEW_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:underline"
              >
                {PREVIEW_URL}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <StudioTargetingCard form={form} />
            <StudioContentPanel form={form} />
          </div>
        </div>
      </div>

      <StudioCampaignBar form={form} cart={cart} />
    </>
  );
}

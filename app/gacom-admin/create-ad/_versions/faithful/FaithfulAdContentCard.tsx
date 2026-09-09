"use client";

import { useState } from "react";
import {
  Check,
  Info,
  Link as LinkIcon,
  Monitor,
  PanelsTopLeft,
  Save,
  ShoppingCart,
  Video,
} from "lucide-react";
import { AD_TYPES, getAdType } from "../../_shared/ad-types";
import type useCreateAdForm from "../../_shared/useCreateAdForm";
import type useAdCart from "../../_shared/useAdCart";

type Form = ReturnType<typeof useCreateAdForm>;
type Cart = ReturnType<typeof useAdCart>;

const FIELD_LABEL = "text-xs font-semibold text-slate-500 mb-1.5 block";
const FIELD_INPUT = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white";

export default function FaithfulAdContentCard({ form, cart }: { form: Form; cart: Cart }) {
  const [addError, setAddError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const spec = getAdType(form.state.adType) ?? AD_TYPES[0];
  const hasImageDims = spec.imageDesktop.includes("×");

  function handleAddToCart() {
    if (form.placementCount === 0) {
      setAddError("Add at least one placement first.");
      return;
    }
    setAddError(null);
    cart.addItem({
      adType: form.state.adType,
      locations: form.state.locations,
      timings: form.state.timings,
      types: form.state.types,
      startDate: form.state.startDate,
      endDate: form.state.endDate,
    });
    form.resetPlacementFields();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
        <PanelsTopLeft className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <span className="font-bold text-slate-900">Ad Content</span>
      </div>

      <div className="p-5 space-y-4">
        {spec.titleAuto || spec.titleMax != null ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="ad-title">
                Title
              </label>
              {!spec.titleAuto ? (
                <span className="text-xs text-slate-400">
                  {form.titleLength}/{spec.titleMax}
                </span>
              ) : null}
            </div>
            {spec.titleAuto ? (
              <div className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 flex items-center text-sm text-slate-400">
                Auto-populated from your account
              </div>
            ) : (
              <input
                id="ad-title"
                type="text"
                className={FIELD_INPUT}
                placeholder="Enter ad title"
                maxLength={spec.titleMax ?? undefined}
                value={form.state.title}
                onChange={(e) => form.setTitle(e.target.value)}
              />
            )}
          </div>
        ) : null}

        {spec.descriptionMax != null ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="ad-description">
                Description
              </label>
              <span className="text-xs text-slate-400">
                {form.descriptionLength}/{spec.descriptionMax}
              </span>
            </div>
            <textarea
              id="ad-description"
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white resize-none"
              placeholder="Enter ad description"
              maxLength={spec.descriptionMax}
              value={form.state.description}
              onChange={(e) => form.setDescription(e.target.value)}
            />
          </div>
        ) : null}

        <div>
          <label className={FIELD_LABEL} htmlFor="client-link">
            Client Link
          </label>
          <div className="relative">
            <LinkIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="client-link"
              type="url"
              className={`${FIELD_INPUT} pl-9`}
              placeholder="https://example.com"
              value={form.state.clientLink}
              onChange={(e) => form.setClientLink(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Image Upload</span>
            <span className="text-xs text-slate-400">
              {hasImageDims ? `Desktop · ${spec.imageDesktop} px` : spec.imageDesktop}
            </span>
          </div>
          {spec.archetype === "video-split" ? (
            <div>
              <label className={FIELD_LABEL} htmlFor="video-url">
                Video URL
              </label>
              <div className="relative">
                <Video
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="video-url"
                  type="url"
                  className={`${FIELD_INPUT} pl-9`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          ) : !hasImageDims ? (
            <div className="border border-dashed border-slate-300 rounded-lg py-8 px-4 grid place-items-center text-slate-400 text-sm text-center">
              Auto-pulled from your account
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-slate-300 rounded-lg py-8 grid place-items-center text-slate-400 text-sm cursor-pointer hover:border-slate-400"
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => form.setUploadedFile(e.target.files?.[0] ?? null)}
              />
              {form.state.uploadedFileName ? (
                <div className="flex flex-col items-center gap-2 px-3 text-center">
                  {form.state.uploadedPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.state.uploadedPreviewUrl}
                      alt=""
                      className="max-h-24 rounded-md"
                    />
                  ) : (
                    <Monitor className="h-6 w-6" aria-hidden="true" />
                  )}
                  <span className="text-slate-600 font-medium break-all">
                    {form.state.uploadedFileName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Monitor className="h-6 w-6" aria-hidden="true" />
                  <span>Click to upload</span>
                </div>
              )}
            </label>
          )}
        </div>

        {spec.autoFields.length > 0 ? (
          <p className="text-xs text-slate-500 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            <span>Pulled from your account: {spec.autoFields.join(", ")}</span>
          </p>
        ) : null}
      </div>

      <div className="px-5 py-3 border-t border-slate-200 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="border border-slate-300 text-slate-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-50 hover:border-slate-400 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className={
              justAdded
                ? "bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                : "bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
            }
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Add to cart
              </>
            )}
          </button>
        </div>
        {addError ? (
          <p role="alert" className="text-xs text-red-600">
            {addError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

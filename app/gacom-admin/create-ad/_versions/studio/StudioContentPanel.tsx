"use client";

import { Info, Link as LinkIcon, Monitor, Video } from "lucide-react";
import { AD_TYPES, getAdType } from "../../_shared/ad-types";
import type useCreateAdForm from "../../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const CARD = "bg-white rounded-xl border border-slate-200 p-5";
const LABEL = "text-xs font-semibold text-slate-500 mb-1.5 block";
const INPUT = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white";

export default function StudioContentPanel({ form }: { form: Form }) {
  const spec = getAdType(form.state.adType) ?? AD_TYPES[0];
  const hasImageDims = spec.imageDesktop.includes("×");

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <h2 className="text-sm font-bold text-slate-900 mb-4">Content</h2>
        <div className="space-y-4">
          {spec.titleAuto || spec.titleMax != null ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="studio-ad-title">
                  Title
                </label>
                {spec.titleMax != null ? (
                  <span className="text-xs text-slate-400">
                    {form.titleLength}/{spec.titleMax}
                  </span>
                ) : null}
              </div>
              <input
                id="studio-ad-title"
                type="text"
                className={INPUT}
                placeholder={
                  spec.titleAuto ? "Pre-populated from your account — edit to customize" : "Enter ad title"
                }
                maxLength={spec.titleMax ?? undefined}
                value={form.state.title}
                onChange={(e) => form.setTitle(e.target.value)}
              />
            </div>
          ) : null}

          {spec.descriptionMax != null ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-semibold text-slate-500"
                  htmlFor="studio-ad-description"
                >
                  Description
                </label>
                <span className="text-xs text-slate-400">
                  {form.descriptionLength}/{spec.descriptionMax}
                </span>
              </div>
              <textarea
                id="studio-ad-description"
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
            <label className={LABEL} htmlFor="studio-client-link">
              Client Link
            </label>
            <div className="relative">
              <LinkIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="studio-client-link"
                type="url"
                className={`${INPUT} pl-9`}
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
                <label className={LABEL} htmlFor="studio-video-url">
                  Video URL
                </label>
                <div className="relative">
                  <Video
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="studio-video-url"
                    type="url"
                    className={`${INPUT} pl-9`}
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
                htmlFor="studio-image-upload"
                className="border-2 border-dashed border-slate-300 rounded-lg py-8 grid place-items-center text-slate-400 text-sm cursor-pointer hover:border-slate-400"
              >
                <input
                  id="studio-image-upload"
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
      </div>
    </div>
  );
}

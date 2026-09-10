"use client";

import { Info, Link as LinkIcon, Monitor, Video, X } from "lucide-react";
import { AD_TYPES, getAdType, getAdFields } from "../_shared/ad-types";
import type { AdField } from "../_shared/ad-types";
import type useCreateAdForm from "../_shared/useCreateAdForm";
import { PROGRAMS } from "../_shared/mock-data";

type Form = ReturnType<typeof useCreateAdForm>;

const LABEL = "text-xs font-semibold text-slate-500 mb-1.5 block";
const INPUT = "h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white";

export default function AdContentFields({ form }: { form: Form }) {
  const spec = getAdType(form.state.adType) ?? AD_TYPES[0];
  const fields = getAdFields(spec);
  const gateClientLink = fields.includes("customizeClientLink");

  function renderField(field: AdField) {
    switch (field) {
      case "featuredProgram":
        return (
          <div key="featuredProgram">
            <label className={LABEL} htmlFor="ad-featured-program">Featured Program</label>
            <select
              id="ad-featured-program"
              disabled
              value={form.state.featuredProgram}
              onChange={(e) => form.setFeaturedProgram(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            >
              <option value="">No approved Programs</option>
            </select>
          </div>
        );
      case "customizeClientLink":
        return (
          <label key="customizeClientLink" className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.state.customizeClientLink}
              onChange={(e) => form.setCustomizeClientLink(e.target.checked)}
              className="h-4 w-4 accent-roman-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Customize Client Link</span>
          </label>
        );
      case "clientLink":
        if (gateClientLink && !form.state.customizeClientLink) return null;
        return (
          <div key="clientLink">
            <label className={LABEL} htmlFor="ad-client-link">Client Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                id="ad-client-link"
                type="url"
                className={`${INPUT} pl-9`}
                placeholder="https://example.com"
                value={form.state.clientLink}
                onChange={(e) => form.setClientLink(e.target.value)}
              />
            </div>
          </div>
        );
      case "title":
        return (
          <div key="title">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="ad-title">Title</label>
              {spec.titleMax != null ? (
                <span className="text-xs text-slate-400">{form.titleLength}/{spec.titleMax}</span>
              ) : null}
            </div>
            <input
              id="ad-title"
              type="text"
              className={INPUT}
              placeholder={spec.titleAuto ? "Pre-populated from your account — edit to customize" : "Enter ad title"}
              maxLength={spec.titleMax ?? undefined}
              value={form.state.title}
              onChange={(e) => form.setTitle(e.target.value)}
            />
          </div>
        );
      case "description":
        return (
          <div key="description">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="ad-description">Description</label>
              {spec.descriptionMax != null ? (
                <span className="text-xs text-slate-400">{form.descriptionLength}/{spec.descriptionMax}</span>
              ) : null}
            </div>
            <textarea
              id="ad-description"
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white resize-none"
              placeholder="Enter ad description"
              maxLength={spec.descriptionMax ?? undefined}
              value={form.state.description}
              onChange={(e) => form.setDescription(e.target.value)}
            />
          </div>
        );
      case "videoLink":
        return (
          <div key="videoLink">
            <label className={LABEL} htmlFor="ad-video-url">Video Link</label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                id="ad-video-url"
                type="url"
                className={`${INPUT} pl-9`}
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.state.videoLink}
                onChange={(e) => form.setVideoLink(e.target.value)}
              />
            </div>
          </div>
        );
      case "image":
        return (
          <div key="image">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500">Image</span>
              <span className="text-xs text-slate-400">Desktop · {spec.imageDesktop} px</span>
            </div>
            <label htmlFor="ad-image-upload" className="border-2 border-dashed border-slate-300 rounded-lg py-8 grid place-items-center text-slate-400 text-sm cursor-pointer hover:border-slate-400">
              <input id="ad-image-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => form.setUploadedFile(e.target.files?.[0] ?? null)} />
              {form.state.uploadedFileName ? (
                <div className="flex flex-col items-center gap-2 px-3 text-center">
                  {form.state.uploadedPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.state.uploadedPreviewUrl} alt="" className="max-h-24 rounded-md" />
                  ) : (
                    <Monitor className="h-6 w-6" aria-hidden="true" />
                  )}
                  <span className="text-slate-600 font-medium break-all">{form.state.uploadedFileName}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Monitor className="h-6 w-6" aria-hidden="true" />
                  <span>Click to upload</span>
                </div>
              )}
            </label>
          </div>
        );
      case "programs": {
        const available = PROGRAMS.filter((p) => !form.state.programs.includes(p));
        return (
          <div key="programs">
            <label className={LABEL} htmlFor="ad-programs">Select program(s)</label>
            {form.state.programs.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.state.programs.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 bg-roman-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {p}
                    <button type="button" aria-label={`Remove ${p}`} onClick={() => form.removeProgram(p)} className="cursor-pointer">
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <select
              id="ad-programs"
              value=""
              onChange={(e) => { if (e.target.value) form.addProgram(e.target.value); }}
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm bg-white cursor-pointer"
            >
              <option value="" disabled>Add a program…</option>
              {available.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        );
      }
      default:
        return null;
    }
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => renderField(field))}
      {spec.autoFields.length > 0 ? (
        <p className="text-xs text-slate-500 flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>Pulled from your account: {spec.autoFields.join(", ")}</span>
        </p>
      ) : null}
    </div>
  );
}

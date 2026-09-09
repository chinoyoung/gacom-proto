"use client";

import { ExternalLink, Info, Monitor, Smartphone } from "lucide-react";
import { getAdType } from "../../_shared/ad-types";
import type useCreateAdForm from "../../_shared/useCreateAdForm";
import { PREVIEW_URL } from "../../_shared/mock-data";
import PreviewSwitcher, { frameMaxWidth } from "./ad-creatives/PreviewSwitcher";

type Form = ReturnType<typeof useCreateAdForm>;

export default function FaithfulAdPreviewCard({ form }: { form: Form }) {
  const device = form.state.previewDevice;
  const spec = getAdType(form.state.adType);
  const maxWidth = frameMaxWidth(spec);

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-slate-800">Ad Preview</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 truncate">{form.state.adType}</span>
        </div>

        <div className="flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5 shrink-0">
          <DeviceButton
            active={device === "desktop"}
            onClick={() => form.setPreviewDevice("desktop")}
            icon={<Monitor className="w-4 h-4" />}
            label="Desktop"
          />
          <DeviceButton
            active={device === "mobile"}
            onClick={() => form.setPreviewDevice("mobile")}
            icon={<Smartphone className="w-4 h-4" />}
            label="Mobile"
          />
        </div>
      </div>

      <div className="p-6">
        <div
          className="mx-auto transition-all"
          style={{ maxWidth: device === "mobile" ? Math.min(maxWidth, 340) : maxWidth }}
        >
          <PreviewSwitcher spec={spec} form={form} />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-1">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>This ad will appear on this page:</span>
        <a
          href={PREVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          {PREVIEW_URL}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function DeviceButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
        active ? "bg-white shadow-sm text-slate-800" : "text-slate-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

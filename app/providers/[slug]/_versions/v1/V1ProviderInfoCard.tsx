"use client";

import { MapPin, CalendarCheck, Globe, FileText } from "lucide-react";
import type { Provider } from "../../_components/types";

function Row({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="text-cobalt-500 w-4 h-4 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm text-slate-900">{children}</span>
      </div>
    </div>
  );
}

export default function V1ProviderInfoCard({
  provider,
  programCount,
  onInquire,
}: {
  provider: Provider;
  programCount: number;
  onInquire: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900">About the provider</h3>

      {provider.headquarters && (
        <Row icon={MapPin} label="Headquarters">{provider.headquarters}</Row>
      )}
      {provider.yearFounded && (
        <Row icon={CalendarCheck} label="Founded">{provider.yearFounded}</Row>
      )}
      <Row icon={FileText} label="Programs">
        {programCount} {programCount === 1 ? "program" : "programs"}
      </Row>
      {provider.website && (
        <Row icon={Globe} label="Website">
          <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-cobalt-500 hover:underline break-all">
            Visit website
          </a>
        </Row>
      )}

      {provider.socialLinks?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {provider.socialLinks.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors rounded-md px-2.5 py-1"
            >
              {s.platform}
            </a>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onInquire}
        className="block text-center text-sm font-semibold bg-cobalt-500 text-white rounded-md py-2.5 hover:bg-cobalt-600 transition-colors mt-1 cursor-pointer"
      >
        Inquire with {provider.name.length > 22 ? "provider" : provider.name}
      </button>
    </div>
  );
}

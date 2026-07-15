"use client";

import { Globe, Clock, Instagram, Facebook, Linkedin, Youtube, Link as LinkIcon } from "lucide-react";
import type { Provider } from "../../_components/types";

function getDomainFromUrl(url: string): string {
  let domain = url.replace(/^https?:\/\//, "");
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }
  const cutIndex = domain.search(/[/?#]/);
  if (cutIndex !== -1) {
    domain = domain.slice(0, cutIndex);
  }
  return domain;
}

function getSocialIcon(platform: string): React.ElementType {
  switch (platform.toLowerCase()) {
    case "instagram":
      return Instagram;
    case "facebook":
      return Facebook;
    case "linkedin":
      return Linkedin;
    case "youtube":
      return Youtube;
    default:
      return LinkIcon;
  }
}

export default function V1ProviderInfoCard({
  provider,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for prop-shape compatibility with V1ProviderPage.tsx
  programCount: _programCount,
  onInquire,
}: {
  provider: Provider;
  programCount: number;
  onInquire: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-slate-900">Get in touch</h3>

      {provider.website && (
        <a
          href={provider.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-cobalt-500 hover:underline break-all"
        >
          <Globe className="w-4 h-4 text-cobalt-500 shrink-0" />
          <span className="text-sm">{getDomainFromUrl(provider.website)}</span>
        </a>
      )}

      {provider.socialLinks?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {provider.socialLinks.map((s) => {
            const Icon = getSocialIcon(s.platform);
            return (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="w-9 h-9 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Clock className="text-cobalt-500 w-4 h-4 shrink-0" />
        <span className="text-sm text-slate-600">Typically responds within 2 business days</span>
      </div>

      <button
        type="button"
        onClick={onInquire}
        className="block text-center text-sm font-semibold bg-cobalt-500 text-white rounded-md py-2.5 hover:bg-cobalt-600 transition-colors mt-1 cursor-pointer"
      >
        Inquire with {provider.name.length > 22 ? "provider" : provider.name}
      </button>

      <p className="text-xs text-slate-500 text-center">Free to inquire · no obligation</p>
    </div>
  );
}

"use client";

import type { Provider } from "../../_components/types";

const BADGES = [
  "/images/badge2.webp",
  "/images/badge1.webp",
  "/images/badge1.webp",
  "/images/badge1.webp",
  "/images/badge1.webp",
  "/images/badge1.webp",
];

export default function V1ProviderRecognitions({ provider }: { provider: Provider }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Recognitions</h2>
      <p className="text-sm text-slate-500 mt-1 mb-4">
        Awards and accreditations earned by {provider.name}
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 lg:grid-cols-6 sm:overflow-visible sm:pb-0">
        {BADGES.map((src, i) => (
          <div key={i} className="shrink-0 w-28 sm:w-auto flex items-center justify-center">
            <img
              src={src}
              alt="Provider recognition badge"
              className="w-full max-w-[120px] h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

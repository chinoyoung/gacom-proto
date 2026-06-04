import { Check } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderAbout({ provider }: { provider: Provider }) {
  if (!provider.about && provider.whyChoosePoints.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900">
          Why choose {provider.name}?
        </h2>
        {provider.about && (
          <p className="text-sm leading-relaxed text-slate-600 mt-3">
            {provider.about}
          </p>
        )}
      </div>
      {provider.whyChoosePoints.length > 0 && (
        <div className="flex-1">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {provider.whyChoosePoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-fern-500/10 text-fern-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" aria-hidden="true" />
                </span>
                <span className="text-sm text-slate-700 leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

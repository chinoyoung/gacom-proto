import { ArrowRight } from "lucide-react";
import { MYG_ESSENTIALS, MYG_LINKS } from "../../_shared/content";

export default function V2TravelEssentials() {
  const { insurance, esim } = MYG_ESSENTIALS;
  return (
    <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-cobalt-500 mb-2">
            Travel essentials
          </p>
          <h2 className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
            {MYG_ESSENTIALS.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mt-3">{MYG_ESSENTIALS.sub}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-cobalt-500 hover:text-cobalt-600"
          >
            {MYG_ESSENTIALS.exploreCta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Insurance card: illustration left, text right */}
        <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 shrink-0 p-6 flex items-center justify-center">
            <img src={insurance.img} alt="Travel Insurance" className="h-48 w-auto object-contain" />
          </div>
          <div className="flex-1 p-8 md:p-10 flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-900">{insurance.h3}</h3>
            <h4 className="text-base font-semibold text-slate-700">{insurance.h4}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{insurance.body1}</p>
            <p className="text-base text-slate-600 leading-relaxed">{insurance.body2}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-6 h-6 rounded-full bg-slate-900" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Trusted partner: {insurance.partner}
              </span>
            </div>
          </div>
        </div>

        {/* eSIM card: text left, static mock right */}
        <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row-reverse">
          <div className="md:w-2/5 shrink-0 p-6 flex items-center justify-center">
            <div className="w-full rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
              <p className="text-sm font-semibold text-slate-700">Find a data plan</p>
              <div className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-400">
                Select a country
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center h-11 bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                Buy Data Plan
              </button>
            </div>
          </div>
          <div className="flex-1 p-8 md:p-10 flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-900">{esim.h3}</h3>
            <h4 className="text-base font-semibold text-slate-700">{esim.h4}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{esim.body1}</p>
            <p className="text-base text-slate-600 leading-relaxed">{esim.body2}</p>
            <img src={esim.partnerLogo} alt="celitech logo" className="h-6 w-auto mt-1 object-contain self-start" />
          </div>
        </div>
      </div>
    </section>
  );
}

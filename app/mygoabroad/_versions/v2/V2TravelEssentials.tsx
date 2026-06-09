import { ArrowRight } from "lucide-react";
import { MYG_ESSENTIALS, MYG_LINKS } from "../../_shared/content";
import V2EsimForm from "./V2EsimForm";

export default function V2TravelEssentials() {
  const { insurance, esim } = MYG_ESSENTIALS;
  return (
    <section
      aria-labelledby="myg-essentials-heading"
      className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
            Travel essentials
          </p>
          <h2
            id="myg-essentials-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight"
          >
            {MYG_ESSENTIALS.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mt-3">{MYG_ESSENTIALS.sub}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-cobalt-500 hover:text-cobalt-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded-lg"
          >
            {MYG_ESSENTIALS.exploreCta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Insurance row: illustration left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex justify-center md:justify-start">
            <img src={insurance.img} alt="Travel Insurance" className="h-56 w-auto object-contain" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-900">{insurance.h3}</h3>
            <h4 className="text-base font-semibold text-slate-700">{insurance.h4}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{insurance.body1}</p>
            <p className="text-base text-slate-600 leading-relaxed">{insurance.body2}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Trusted Partner
              </span>
              <span className="flex items-center gap-2" aria-label={insurance.partner}>
                <span
                  className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <span className="text-xs font-bold lowercase text-white">egi</span>
                </span>
                <span className="text-base font-extrabold uppercase tracking-wide text-slate-700">
                  {insurance.partner}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* eSIM row: text left, form right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-900">{esim.h3}</h3>
            <h4 className="text-base font-semibold text-slate-700">{esim.h4}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{esim.body1}</p>
            <p className="text-base text-slate-600 leading-relaxed">{esim.body2}</p>
            <img src={esim.partnerLogo} alt="celitech logo" className="h-6 w-auto mt-1 object-contain self-start" />
          </div>
          <div>
            <V2EsimForm />
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { MYG_ESSENTIALS, MYG_LINKS } from "../../_shared/content";
import V1EsimForm from "./V1EsimForm";

export default function V1TravelEssentials() {
  const { insurance, esim } = MYG_ESSENTIALS;
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl self-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{MYG_ESSENTIALS.h2}</h2>
        <p className="text-base md:text-lg leading-relaxed text-slate-600">{MYG_ESSENTIALS.sub}</p>
        <a
          href={MYG_LINKS.resources}
          className="inline-flex items-center gap-2 text-sm font-bold text-roman-500 hover:text-roman-600"
        >
          {MYG_ESSENTIALS.exploreCta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      {/* Insurance: image left, text right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-slate-100 pt-10">
        <div className="relative h-64 w-full flex items-center justify-center">
          <img src={insurance.img} alt="Travel Insurance" className="h-full w-auto object-contain" />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{insurance.h3}</h3>
          <h4 className="text-lg font-semibold text-slate-700">{insurance.h4}</h4>
          <p className="text-base text-slate-600 leading-relaxed">{insurance.body1}</p>
          <p className="text-base text-slate-600 leading-relaxed">{insurance.body2}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-6 h-6 rounded-full bg-slate-900" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Trusted partner: {insurance.partner}
            </span>
          </div>
        </div>
      </div>

      {/* eSIM: text left, static form mock right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-slate-100 pt-10">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{esim.h3}</h3>
          <h4 className="text-lg font-semibold text-slate-700">{esim.h4}</h4>
          <p className="text-base text-slate-600 leading-relaxed">{esim.body1}</p>
          <p className="text-base text-slate-600 leading-relaxed">{esim.body2}</p>
          <img src={esim.partnerLogo} alt="celitech logo" className="h-6 w-auto mt-2 object-contain" />
        </div>
        <V1EsimForm />
      </div>
    </div>
  );
}

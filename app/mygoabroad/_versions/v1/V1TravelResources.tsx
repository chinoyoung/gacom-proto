import { ArrowRight } from "lucide-react";
import { MYG_RESOURCES, MYG_LINKS } from "../../_shared/content";

export default function V1TravelResources() {
  return (
    <div className="w-full bg-slate-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-first lg:order-last">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{MYG_RESOURCES.h2}</h2>
          <p className="text-lg text-slate-600 max-w-lg mb-8">{MYG_RESOURCES.body}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 bg-roman-500 hover:bg-roman-600 rounded-md px-5 py-2.5 h-10 text-sm font-bold text-white transition-colors"
          >
            {MYG_RESOURCES.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="relative h-52 lg:h-80 flex items-center justify-center order-last lg:order-first">
          <img src={MYG_RESOURCES.img} alt="Travel Resources" className="h-full w-auto object-contain" />
        </div>
      </div>
    </div>
  );
}

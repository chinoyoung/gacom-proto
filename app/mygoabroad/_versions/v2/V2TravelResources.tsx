import { ArrowRight } from "lucide-react";
import { MYG_RESOURCES, MYG_LINKS } from "../../_shared/content";

export default function V2TravelResources() {
  return (
    <section
      aria-labelledby="v2-resources-heading"
      className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col order-first lg:order-last">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
            Partners
          </p>
          <h2
            id="v2-resources-heading"
            className="text-3xl font-bold tracking-tight text-neutral-800 mb-4"
          >
            {MYG_RESOURCES.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">{MYG_RESOURCES.body}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 self-start bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
          >
            {MYG_RESOURCES.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="relative h-52 lg:h-80 flex items-center justify-center order-last lg:order-first">
          <img src={MYG_RESOURCES.img} alt="Travel Resources" className="h-full w-auto object-contain" />
        </div>
      </div>
    </section>
  );
}

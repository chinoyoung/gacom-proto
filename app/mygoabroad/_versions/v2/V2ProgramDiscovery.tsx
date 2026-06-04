import { ArrowRight } from "lucide-react";
import { MYG_DISCOVERY, MYG_LINKS } from "../../_shared/content";

export default function V2ProgramDiscovery() {
  return (
    <section className="bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-cobalt-500 mb-2">
            Program discovery
          </p>
          <h2 className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
            {MYG_DISCOVERY.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mt-3">{MYG_DISCOVERY.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {MYG_DISCOVERY.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-5 p-6 rounded-lg border border-slate-100 bg-white"
            >
              <div className="w-full h-40 flex items-center justify-center">
                <img src={card.img} alt={card.alt} className="h-full w-auto object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-neutral-800">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          href={MYG_LINKS.search}
          className="inline-flex items-center gap-2 self-start bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
        >
          {MYG_DISCOVERY.cta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

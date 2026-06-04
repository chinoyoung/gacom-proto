import { ArrowRight } from "lucide-react";
import { MYG_DISCOVERY, MYG_LINKS } from "../../_shared/content";

export default function V1ProgramDiscovery() {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{MYG_DISCOVERY.h2}</h2>
        <p className="text-base md:text-lg leading-relaxed text-slate-600">{MYG_DISCOVERY.sub}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {MYG_DISCOVERY.cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm flex flex-col items-center text-center gap-4"
          >
            <div className="relative h-40 w-full flex items-center justify-center">
              <img src={card.img} alt={card.alt} className="h-full w-auto object-contain" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-600">{card.body}</p>
          </div>
        ))}
      </div>
      <a
        href={MYG_LINKS.search}
        className="inline-flex items-center gap-2 bg-roman-500 hover:bg-roman-600 text-sm font-bold text-white px-5 py-2.5 rounded-md transition-colors"
      >
        {MYG_DISCOVERY.cta}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
  );
}

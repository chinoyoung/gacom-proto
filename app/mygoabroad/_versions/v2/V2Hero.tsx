import { ArrowRight } from "lucide-react";
import { MYG_HERO, MYG_IMAGES, MYG_LINKS } from "../../_shared/content";

export default function V2Hero() {
  return (
    <section className="bg-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 flex flex-col md:flex-row md:items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <img src={MYG_IMAGES.logo} alt="MyGoAbroad Logo" className="h-10 w-auto self-start" />
          <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-500">
            Your travel companion
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
            {MYG_HERO.h1}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">{MYG_HERO.body}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center gap-2 bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              {MYG_HERO.primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={MYG_LINKS.signin}
              className="inline-flex items-center bg-white border border-slate-200 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
        <div className="flex-1">
          <img
            src={MYG_IMAGES.hero}
            alt="Six people holding a map"
            className="w-full h-64 md:h-[380px] object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}

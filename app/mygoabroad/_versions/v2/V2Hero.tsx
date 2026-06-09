import { ArrowRight } from "lucide-react";
import { MYG_HERO, MYG_IMAGES, MYG_LINKS } from "../../_shared/content";

export default function V2Hero() {
  return (
    <section
      aria-labelledby="v2-hero-heading"
      className="bg-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 flex flex-col md:flex-row md:items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <img src={MYG_IMAGES.logo} alt="MyGoAbroad Logo" className="h-10 w-auto self-start" />
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500">
            Your travel companion
          </p>
          <h1
            id="v2-hero-heading"
            className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900"
          >
            {MYG_HERO.h1}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">{MYG_HERO.body}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center gap-2 bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              {MYG_HERO.primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={MYG_LINKS.signin}
              className="inline-flex items-center border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 transition-colors text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              {MYG_HERO.signinLink}
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

import { MYG_HERO, MYG_IMAGES, MYG_LINKS } from "../../_shared/content";

export default function V1Hero() {
  return (
    <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8 xl:px-0 pt-8 xl:pt-12">
      <div className="bg-slate-100 rounded-2xl p-6 xl:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
          <img src={MYG_IMAGES.logo} alt="MyGoAbroad Logo" className="h-11 w-auto" />
          <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 leading-tight">
            {MYG_HERO.h1}
          </h1>
          <p className="text-base lg:text-lg text-slate-700 max-w-xl">{MYG_HERO.body}</p>
          <div className="flex flex-col gap-3 items-center lg:items-start">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center justify-center h-12 w-48 bg-roman-500 hover:bg-roman-600 text-white font-semibold rounded-md transition-colors"
            >
              {MYG_HERO.primaryCta}
            </a>
            <p className="text-sm text-slate-600">
              {MYG_HERO.signinPrefix}{" "}
              <a href={MYG_LINKS.signin} className="text-cobalt-500 font-semibold hover:underline">
                {MYG_HERO.signinLink}
              </a>
            </p>
          </div>
        </div>
        <div className="h-[300px] lg:h-[500px] rounded-xl overflow-hidden">
          <img
            src={MYG_IMAGES.hero}
            alt="Six people holding a map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

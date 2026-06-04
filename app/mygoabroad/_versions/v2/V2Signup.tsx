import { ArrowRight } from "lucide-react";
import { MYG_SIGNUP, MYG_LINKS } from "../../_shared/content";

export default function V2Signup() {
  return (
    <section className="bg-sun-50 px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-36">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-64 lg:h-80 flex items-center justify-center order-first">
          <img src={MYG_SIGNUP.img} alt="Sign Up" className="h-full w-auto object-contain" />
        </div>
        <div className="flex flex-col order-last">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight tracking-tight mb-4">
            {MYG_SIGNUP.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md mb-8">{MYG_SIGNUP.body}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center gap-2 bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              {MYG_SIGNUP.primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href={MYG_LINKS.signin} className="text-cobalt-600 font-semibold hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { MYG_SIGNUP, MYG_LINKS } from "../../_shared/content";

export default function V1Signup() {
  return (
    <section
      aria-labelledby="v2-signup-heading"
      className="bg-cobalt-700 px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <h2
          id="v2-signup-heading"
          className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white"
        >
          {MYG_SIGNUP.h2}
        </h2>
        {/* Signup illustration intentionally omitted in v2's dark closing-CTA layout */}
        <p className="text-lg text-white/90 leading-relaxed">{MYG_SIGNUP.body}</p>
        <div className="flex flex-col items-center gap-4 mt-2">
          <a
            href={MYG_LINKS.signup}
            className="inline-flex items-center gap-2 bg-white text-cobalt-700 font-semibold px-7 py-3 rounded-lg ring-1 ring-white/30 hover:bg-slate-100 transition-colors text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {MYG_SIGNUP.primaryCta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <p className="text-white/90 text-sm">
            {MYG_SIGNUP.signinPrefix}{" "}
            <a
              href={MYG_LINKS.signin}
              className="text-white underline-offset-2 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {MYG_SIGNUP.signinLink}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

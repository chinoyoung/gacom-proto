import { MYG_SIGNUP, MYG_LINKS } from "../../_shared/content";

export default function V1Signup() {
  return (
    <div className="w-full bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-64 lg:h-80 flex items-center justify-center order-first">
          <img src={MYG_SIGNUP.img} alt="Sign Up" className="h-full w-auto object-contain" />
        </div>
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-last">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{MYG_SIGNUP.h2}</h2>
          <p className="text-lg text-slate-600 max-w-md mb-8">{MYG_SIGNUP.body}</p>
          <a
            href={MYG_LINKS.signup}
            className="inline-flex items-center justify-center h-12 w-48 bg-roman-500 hover:bg-roman-600 text-white font-semibold rounded-md transition-colors"
          >
            {MYG_SIGNUP.primaryCta}
          </a>
          <p className="text-sm text-slate-600 mt-3">
            {MYG_SIGNUP.signinPrefix}{" "}
            <a href={MYG_LINKS.signin} className="text-cobalt-600 font-semibold hover:underline">
              {MYG_SIGNUP.signinLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

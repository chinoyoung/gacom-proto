"use client";

import { AFFILIATE_FORM, AMBASSADOR_FORM } from "../v1/constants";

export default function V2GetStarted() {
  return (
    <section
      id="get-started"
      aria-labelledby="get-started-heading"
      className="scroll-mt-36 bg-sun-50 px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-36"
    >
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <img
          src="/illustrations/celebrate.svg"
          alt=""
          aria-hidden="true"
          className="w-48 h-auto mb-8"
        />
        <h2
          id="get-started-heading"
          className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight mb-5"
        >
          Ready to partner with us?
        </h2>
        <p className="text-base text-slate-600 leading-relaxed mb-10">
          Choose the path that fits you best. Fill out the form and our team will be in touch.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
          <a
            href={AFFILIATE_FORM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apply for the Affiliate Program"
            className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors w-full sm:w-auto text-center text-sm"
          >
            Affiliate Program
          </a>
          <a
            href={AMBASSADOR_FORM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apply for the Ambassador Program"
            className="inline-flex items-center justify-center bg-roman-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-roman-600 transition-colors w-full sm:w-auto text-center text-sm"
          >
            Ambassador Program
          </a>
        </div>
      </div>
    </section>
  );
}

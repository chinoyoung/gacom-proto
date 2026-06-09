import { MYG_INTRO } from "../../_shared/content";

export default function V2Intro() {
  return (
    <section
      aria-labelledby="v2-intro-heading"
      className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
        <h2
          id="v2-intro-heading"
          className="text-3xl font-bold tracking-tight text-neutral-800"
        >
          {MYG_INTRO.h2}
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">{MYG_INTRO.body}</p>
      </div>
    </section>
  );
}

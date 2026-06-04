import { MYG_INTRO } from "../../_shared/content";

export default function V1Intro() {
  return (
    <div className="flex flex-col items-center text-center gap-4 max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{MYG_INTRO.h2}</h2>
      <p className="text-base md:text-lg leading-relaxed text-slate-600">{MYG_INTRO.body}</p>
    </div>
  );
}

import { Star, CheckCircle, Heart } from "lucide-react";
import type { Program } from "../../_components/types";

export function StickyHeader({
  program,
  avgRating,
  visible,
}: {
  program: Program;
  avgRating: number;
  visible: boolean;
}) {
  const stickyClass = visible ? "flex" : "hidden";

  return (
    <section
      className={`z-50 w-full bg-slate-50 p-4 fixed top-0 left-0 items-center justify-center shadow-[rgba(0,0,15,0.3)_0px_2px_10px_0px] ${stickyClass}`}
    >
      <div className="flex items-center justify-between w-full max-w-7xl">
        <div className="gap-4 items-center hidden lg:flex">
          {program.providerLogo && (
            <div className="h-[50px] bg-slate-200 p-1 rounded-md shrink-0">
              <img
                className="w-full h-full rounded-md"
                src={program.providerLogo}
                alt={`${program.provider} logo`}
              />
            </div>
          )}
          <p className="font-bold text-lg">{program.provider}</p>
          <div className="flex gap-2">
            <span className="items-center flex text-base font-bold gap-2">
              <Star fill="currentColor" className="text-lg text-sun-500" />
              {avgRating > 0 ? avgRating.toFixed(2) : "—"}
            </span>
            <span className="flex gap-1 text-sm font-bold items-center">
              <CheckCircle className="text-base text-fern-500" /> Verified
            </span>
            <span className="flex gap-1 text-sm font-bold items-center cursor-pointer">
              <Heart className="text-lg text-roman-500" /> Save
            </span>
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <a
            href={program.applyUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold bg-cobalt-500 text-white text-sm px-4 w-full lg:w-auto text-center py-2.5 rounded-md"
          >
            Visit Website
          </a>
          <button className="font-bold border border-neutral-500 text-neutral-500 text-sm px-4 w-full lg:w-auto text-center py-2.5 rounded-md cursor-pointer">
            Inquire Here
          </button>
          <button className="font-bold border hidden lg:block text-neutral-500 border-neutral-500 text-sm px-4 w-full lg:w-auto text-center py-2.5 rounded-md cursor-pointer">
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
}

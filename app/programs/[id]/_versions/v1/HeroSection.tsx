import Link from "next/link";
import { Star, CheckCircle, FileText, Heart, ChevronRight } from "lucide-react";
import type { Program } from "../../_components/types";

function Breadcrumbs({ program }: { program: Program }) {
  return (
    <div className="w-full hidden lg:flex justify-center">
      <ul className="flex gap-2 w-full max-w-7xl items-center py-4 px-4 xl:px-0 uppercase text-xs text-neutral-500">
        <li>
          <Link href="/" className="font-bold text-cobalt-500">
            Home
          </Link>
        </li>
        <ChevronRight className="text-xs w-3 h-3" />
        <li>
          <Link href="/programs" className="font-bold text-cobalt-500">
            Providers
          </Link>
        </li>
        <ChevronRight className="text-xs w-3 h-3" />
        <li>
          <Link
            href={`/programs?city=${encodeURIComponent(program.city)}`}
            className="font-bold text-cobalt-500"
          >
            {program.provider}
          </Link>
        </li>
        <ChevronRight className="text-xs w-3 h-3" />
        <li>
          <Link href="#">{program.title}</Link>
        </li>
      </ul>
    </div>
  );
}

export function HeroSection({
  program,
  avgRating,
  reviewCount,
  programCount,
}: {
  program: Program;
  avgRating: number;
  reviewCount: number;
  programCount: number;
}) {
  return (
    <>
      <Breadcrumbs program={program} />
      <section
        id="overview"
        className="w-full flex justify-center relative h-[320px] md:h-[500px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 md:from-slate-900/90" />
        {program.coverImage ? (
          <img
            className="w-full object-cover h-full"
            src={program.coverImage}
            alt="cover"
          />
        ) : (
          <div className="absolute inset-0 bg-cobalt-700" />
        )}

        <div className="flex flex-col absolute bottom-0 max-w-7xl mb-0 md:mb-6 w-full p-4 gap-4 items-start justify-start">
          <div>
            <div className="flex items-center gap-4">
              {/* Provider logo */}
              <div className="h-[65px] max-w-[65px] md:max-w-[75px] object-cover md:h-[75px] bg-slate-200 p-1 rounded-md shrink-0">
                {program.providerLogo ? (
                  <img
                    className="w-full h-full rounded-md object-cover"
                    src={program.providerLogo}
                    alt="logo"
                  />
                ) : (
                  <div className="w-full h-full rounded-md bg-cobalt-300" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-base md:text-xl leading-6 text-white">
                  {program.title}
                </h1>
                <p className="text-sm text-white">
                  by:{" "}
                  <span className="font-bold text-white">{program.provider}</span>
                </p>
                <div className="grid grid-cols-2 gap-1 md:flex md:gap-4 text-xs text-white mt-2 font-bold">
                  <span className="flex gap-1 items-center">
                    <Star
                      fill="currentColor"
                      className="text-lg text-sun-500 w-4 h-4"
                    />
                    {avgRating > 0 ? avgRating.toFixed(2) : "—"} ({reviewCount})
                  </span>
                  <span className="flex gap-1 items-center">
                    <CheckCircle className="text-base text-fern-500 w-4 h-4" />
                    Verified
                  </span>
                  <span className="flex gap-1 items-center">
                    <FileText className="text-lg text-cobalt-300 w-4 h-4" />
                    {programCount} Programs
                  </span>
                  <span className="flex gap-1 items-center cursor-pointer">
                    <Heart className="text-lg text-roman-500 w-4 h-4" />
                    Save
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-2 md:gap-4">
            <a
              href={program.applyUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-roman-500 text-white h-10 text-xs md:text-sm font-bold rounded-md px-5 flex items-center"
            >
              Visit Website
            </a>
            <button className="bg-cobalt-500 text-white h-10 text-xs md:text-sm font-bold rounded-md px-5 cursor-pointer">
              Inquire Here
            </button>
            <button className="bg-cobalt-500 text-white lg:block h-10 text-xs md:text-sm font-bold rounded-md px-5 cursor-pointer">
              Apply Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

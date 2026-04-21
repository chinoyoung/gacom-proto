import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

export function HeroSection({ program }: { program: Program }) {
  return (
    <>
      <Breadcrumbs program={program} />
      {program.coverImage && (
        <section id="overview" className="w-full flex flex-col items-center">
          <div className="w-full max-w-7xl px-4 xl:px-0">
            <img
              className="w-full object-cover h-[220px] md:h-[400px] rounded-md"
              src={program.coverImage}
              alt={`Cover photo for ${program.title}`}
            />
          </div>
        </section>
      )}
    </>
  );
}

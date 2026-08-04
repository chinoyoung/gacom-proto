"use client";

import { ExternalLink, Star, CircleCheck } from "lucide-react";
import type { Provider } from "../../_components/types";

interface V1ProviderBottomCTAProps {
  provider: Provider;
  avgRating: number;
}

export default function V1ProviderBottomCTA({
  provider,
  avgRating,
}: V1ProviderBottomCTAProps) {
  const { name, logo, website } = provider;

  const description = provider.about
    ? provider.about.split(/\n\n+/)[0].trim()
    : "";

  if (!description || !website) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 xl:px-0">
      <div className="hidden flex-col rounded-md bg-slate-900 p-8 lg:flex">
        <div className="flex w-full max-w-7xl items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-bold text-white">
              Ready to Learn More?
            </h3>
            <p
              className={`line-clamp-3 text-white ${
                avgRating > 0 ? "max-w-[75%]" : ""
              }`}
            >
              {description}
            </p>
          </div>
          <div className="flex min-w-[30%] flex-col gap-8 rounded-md bg-slate-50 p-4">
            <div className="flex items-start gap-4">
              {logo && (
                <div className="h-[50px] w-[50px] shrink-0 rounded-md bg-white p-1">
                  <img
                    className="h-full w-full rounded-md"
                    src={logo}
                    alt={name}
                    width={50}
                    height={50}
                  />
                </div>
              )}
              <div className="text-neutral-700">
                <p className="text-lg font-bold">{name}</p>
                <div className="flex gap-2">
                  {avgRating > 0 && (
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-4 h-4 text-sun-500 fill-current" />
                      {avgRating.toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <CircleCheck className="w-4 h-4 text-fern-500" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
            <a
              href={website}
              target="_blank"
              rel="sponsored noopener"
              className="bg-roman-500 flex w-full min-w-48 items-center justify-center rounded-md px-4 py-4 text-center text-sm font-bold text-white hover:bg-roman-600 focus:bg-roman-600 focus:ring-4 focus:ring-roman-200 lg:w-auto"
            >
              Visit Website
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-slate-900 p-8 lg:hidden">
        <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {logo && (
                <div className="h-[50px] w-[50px] shrink-0 rounded-md bg-white p-1">
                  <img
                    className="h-full w-full rounded-md"
                    src={logo}
                    alt={name}
                    width={50}
                    height={50}
                  />
                </div>
              )}
              <div className="">
                <p className="text-lg font-bold text-white">{name}</p>
                <div className="flex gap-2 text-white">
                  {avgRating > 0 && (
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-4 h-4 text-sun-500 fill-current" />
                      {avgRating.toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <CircleCheck className="w-4 h-4 text-fern-500" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">
              Ready to Learn More?
            </h3>
            <p className="line-clamp-2 text-sm text-white">{description}</p>
          </div>
          <div className="flex w-full gap-4 lg:w-auto">
            <a
              href={website}
              target="_blank"
              rel="sponsored noopener"
              className="bg-roman-500 flex w-full items-center justify-center rounded-md px-4 py-4 text-center text-sm font-bold text-white lg:w-auto"
            >
              Visit Website
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

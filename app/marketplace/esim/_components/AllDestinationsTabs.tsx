"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  countryDestinations,
  regionDestinations,
  type Destination,
} from "../_data/destinations";

type Tab = "all" | "regions" | "countries";

const TABS: { id: Tab; label: string; count: number }[] = [
  {
    id: "all",
    label: "All",
    count: countryDestinations.length + regionDestinations.length,
  },
  { id: "regions", label: "Regions", count: regionDestinations.length },
  { id: "countries", label: "Countries", count: countryDestinations.length },
];

const sortedRegions = [...regionDestinations].sort((a, b) => {
  if (a.slug === "global") return 1;
  if (b.slug === "global") return -1;
  return a.name.localeCompare(b.name);
});

const sortedCountries = [...countryDestinations].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export default function AllDestinationsTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const active: Tab =
    tabParam === "regions" || tabParam === "countries" ? tabParam : "all";

  function setTab(tab: Tab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const showRegions = active === "all" || active === "regions";
  const showCountries = active === "all" || active === "countries";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter destinations">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                isActive
                  ? "bg-cobalt-500 border-cobalt-500 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {t.label}
              <span className={`text-xs font-semibold ${isActive ? "text-white/80" : "text-slate-500"}`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {showRegions && (
        <div className={showCountries ? "mb-12" : ""}>
          {active === "all" && (
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
              Regional Plans
            </h2>
          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedRegions.map((dest) => (
              <li key={dest.slug}>
                <DestinationCard dest={dest} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCountries && (
        <div>
          {active === "all" && (
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
              Countries
            </h2>
          )}
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedCountries.map((dest) => (
              <li key={dest.slug}>
                <DestinationCard dest={dest} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DestinationCard({ dest }: { dest: Destination }) {
  const isRegion = dest.type === "region";
  return (
    <Link
      href={`/marketplace/esim/${dest.slug}`}
      className="group h-full bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 hover:border-cobalt-300 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-4xl leading-none" aria-hidden="true">
          {dest.flag}
        </span>
        {isRegion && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cobalt-600 bg-cobalt-50 px-2 py-0.5 rounded-full">
            Region
          </span>
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold text-neutral-800 leading-tight">
          {dest.name}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          {isRegion && dest.coverageNote ? `${dest.coverageNote} · ` : ""}from {dest.fromPrice}
        </p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-500 group-hover:text-cobalt-600 transition-colors mt-auto">
        View Plans
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

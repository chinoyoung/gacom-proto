"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import ProgramCard from "@/components/ProgramCard";
import { CommentAnchor } from "@/components/comments/CommentAnchor";
import Pagination from "../../_components/Pagination";
import type { Provider, ProviderProgram } from "../../_components/types";

const ITEMS_PER_PAGE = 6;

export default function V1ProviderPrograms({
  provider,
  programs,
}: {
  provider: Provider;
  programs: ProviderProgram[] | undefined;
}) {
  const [page, setPage] = useState(0);
  const [country, setCountry] = useState("all");

  // Distinct countries across this provider's own programs — there's no
  // cross-provider data available to build a global country list from.
  const countryOptions = useMemo(() => {
    const distinct = new Set((programs ?? []).map((program) => program.country));
    return Array.from(distinct).sort((a, b) => a.localeCompare(b));
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const all = programs ?? [];
    return country === "all" ? all : all.filter((program) => program.country === country);
  }, [programs, country]);

  const paginatedPrograms = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return filteredPrograms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPrograms, page]);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
    setPage(0);
  };

  return (
    <CommentAnchor id="provider-programs">
      <div className="flex flex-col gap-4 px-4 xl:px-0">
        <div className="flex w-full flex-col items-center gap-2 md:flex-row">
          <div className="flex w-full flex-col items-start lg:w-auto">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              {provider.name} Programs
            </h2>
            <p className="text-sm">Browse programs you might like</p>
          </div>

          {programs !== undefined && programs.length > ITEMS_PER_PAGE && (
            <div className="ml-auto flex h-10 w-full justify-end gap-4 text-xs md:w-auto md:text-sm">
              {/*
                Deliberate omission: production also renders a "Directory" dropdown
                and a "Show online Programs" checkbox in this slot. This prototype's
                Convex schema has no directory taxonomy or online-program flag, so
                only the Country filter (which the schema does support) is implemented.
              */}
              <select
                value={country}
                onChange={handleCountryChange}
                aria-label="Filter by country"
                className="text-sm border border-slate-200 rounded-md px-2.5 py-2 text-slate-600 bg-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              >
                <option value="all">All Countries</option>
                {countryOptions.map((countryOption) => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {programs === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-lg h-80" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <p className="text-slate-500 text-sm">This provider has no published programs yet.</p>
        ) : (
          <div className="flex w-full flex-col gap-6 sm:grid-cols-2 md:grid lg:grid-cols-3">
            {paginatedPrograms.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        )}

        {programs !== undefined && programs.length > ITEMS_PER_PAGE && (
          <Pagination
            current={page + 1}
            max={Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE)}
            onChange={setPage}
          />
        )}
      </div>
    </CommentAnchor>
  );
}

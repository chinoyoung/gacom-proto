"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

const DESTINATIONS = [
  "Japan",
  "Italy",
  "Thailand",
  "France",
  "Spain",
  "Mexico",
  "United Kingdom",
  "Australia",
  "Global / 100+ countries",
];

const DATA_PACKAGES = [
  "1 GB · 7 days",
  "3 GB · 15 days",
  "5 GB · 30 days",
  "10 GB · 30 days",
  "Unlimited · 30 days",
];

const CELITECH_LOGO =
  "https://images.goabroad.com/image/upload/v1/images2/myg/marketplace/celitech_logo.webp";

export default function V1EsimForm() {
  const [destination, setDestination] = useState("");
  const [dataPackage, setDataPackage] = useState("");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col gap-4">
      {/* Destination */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="v2-esim-destination"
          className="text-sm font-semibold text-neutral-800"
        >
          Destination
        </label>
        <select
          id="v2-esim-destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={[
            "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500",
            "cursor-pointer",
            destination === "" ? "text-slate-400" : "text-neutral-800",
          ].join(" ")}
        >
          <option value="" disabled className="text-slate-400">
            Choose your destination
          </option>
          {DESTINATIONS.map((d) => (
            <option key={d} value={d} className="text-neutral-800">
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Start & End Dates */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="v2-esim-dates"
          className="text-sm font-semibold text-neutral-800"
        >
          Start &amp; End Dates
        </label>
        <button
          id="v2-esim-dates"
          type="button"
          aria-label="Select start and end dates"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 flex items-center justify-between text-sm text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          <span>Select dates</span>
          <Calendar className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
        </button>
      </div>

      {/* Data Package */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="v2-esim-package"
          className="text-sm font-semibold text-neutral-800"
        >
          Data Package
        </label>
        <select
          id="v2-esim-package"
          value={dataPackage}
          onChange={(e) => setDataPackage(e.target.value)}
          className={[
            "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500",
            "cursor-pointer",
            dataPackage === "" ? "text-slate-400" : "text-neutral-800",
          ].join(" ")}
        >
          <option value="" disabled className="text-slate-400">
            Choose your data package
          </option>
          {DATA_PACKAGES.map((p) => (
            <option key={p} value={p} className="text-neutral-800">
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Total</span>
        <span className="text-lg font-bold text-cobalt-500">$0.00</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center h-11 rounded-lg border border-slate-300 text-neutral-800 font-semibold text-sm hover:bg-white hover:border-slate-400 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Add To Cart
        </button>
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center h-11 rounded-lg bg-cobalt-500 text-white font-semibold text-sm hover:bg-cobalt-600 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          Buy Now
        </button>
      </div>

      {/* Powered by Celitech */}
      <div className="flex items-center justify-center gap-2 pt-2 text-sm text-slate-400">
        <span>Powered by</span>
        <img
          src={CELITECH_LOGO}
          alt="Celitech"
          className="h-5 w-auto"
        />
      </div>
    </div>
  );
}

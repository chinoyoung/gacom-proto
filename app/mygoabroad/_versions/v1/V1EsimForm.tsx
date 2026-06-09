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
    <div className="rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/60 p-6 md:p-8 flex flex-col gap-5">
      {/* Destination */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="esim-destination"
          className="text-sm font-medium text-slate-700"
        >
          Destination
        </label>
        <select
          id="esim-destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          <option value="" disabled>
            Choose your destination
          </option>
          {DESTINATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Start & End Dates */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="esim-dates"
          className="text-sm font-medium text-slate-700"
        >
          Start &amp; End Dates
        </label>
        <button
          id="esim-dates"
          type="button"
          aria-label="Select start and end dates"
          className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 flex items-center justify-between text-sm text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          <span>Select dates</span>
          <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>

      {/* Data Package */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="esim-package"
          className="text-sm font-medium text-slate-700"
        >
          Data Package
        </label>
        <select
          id="esim-package"
          value={dataPackage}
          onChange={(e) => setDataPackage(e.target.value)}
          className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          <option value="" disabled>
            Choose your data package
          </option>
          {DATA_PACKAGES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-slate-500">Total</span>
        <span className="text-lg font-bold text-cobalt-500">$0.00</span>
      </div>

      {/* Submit buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 h-10 border border-slate-300 text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          Add To Cart
        </button>
        <button
          type="button"
          className="flex-1 h-10 bg-cobalt-500 hover:bg-cobalt-600 text-white rounded-md text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 cursor-pointer"
        >
          Buy Now
        </button>
      </div>

      {/* Powered by Celitech */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <span className="text-sm text-slate-400">Powered by</span>
        <img
          src={CELITECH_LOGO}
          alt="Celitech"
          className="h-5 w-auto"
        />
      </div>
    </div>
  );
}

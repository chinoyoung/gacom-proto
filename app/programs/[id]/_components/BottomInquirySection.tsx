"use client";

import {
  Clock,
  Coins,
  Languages,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { Program } from "./types";

interface DetailItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function buildDetails(program: Program): DetailItem[] {
  const details: DetailItem[] = [];

  const priceValue = program.isFree
    ? "Free"
    : typeof program.startingPrice === "number"
      ? `From $${program.startingPrice.toLocaleString()}`
      : (program.cost ?? "Contact for pricing");
  details.push({ icon: Coins, label: "Starting price", value: priceValue });

  details.push({
    icon: MapPin,
    label: "Location",
    value: [program.city, program.country].filter(Boolean).join(", ") || "—",
  });

  details.push({
    icon: Clock,
    label: "Duration",
    value: program.duration ?? "Flexible",
  });

  details.push({
    icon: Languages,
    label: "Language",
    value: program.languageOfInstruction ?? "Not specified",
  });

  return details;
}

export function BottomInquirySection({ program }: { program: Program }) {
  const details = buildDetails(program);

  return (
    <section className="w-full bg-slate-50 border-t border-gray-200 py-14 mt-20">
      <div className="w-full max-w-7xl mx-auto px-4 xl:px-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left: heading + details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-cobalt-500 mb-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">
              Ready to start?
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Get in touch with {program.provider}
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Send a quick message and the provider will reach out with next
            steps.
          </p>

          {/* Details: 2-col grid inside left column */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {details.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.label}
                  className="bg-white border border-gray-200 rounded-md p-4 flex flex-col gap-2"
                >
                  <Icon className="w-4 h-4 text-cobalt-500" />
                  <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                    {d.label}
                  </p>
                  <p className="text-sm font-bold text-neutral-900 leading-snug">
                    {d.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: inquiry form — minimal fields: name, email, message */}
        <div className="bg-white border border-gray-200 rounded-md p-6 md:p-8 h-full flex flex-col">
          <div className="flex flex-col gap-4 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-800">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="h-10 rounded-md bg-slate-100 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-cobalt-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-800">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 rounded-md bg-slate-100 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-cobalt-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-h-0">
              <label className="text-xs font-bold text-neutral-800">
                Message
              </label>
              <textarea
                placeholder={`Ask ${program.provider} a question…`}
                className="flex-1 min-h-24 rounded-md bg-slate-100 p-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none focus:ring-2 focus:ring-cobalt-300"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="text-xs text-neutral-500">
                  Your information is secure and only shared with{" "}
                  {program.provider}.
                </span>
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-bold rounded-md px-6 py-2.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4" />
                Send inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

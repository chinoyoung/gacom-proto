"use client";

import { ChevronDown, Menu, Phone, Settings } from "lucide-react";

interface FaithfulTopChromeProps {
  programName: string;
  profileCompletion: number;
  bannerDismissed: boolean;
  onDismissBanner: () => void;
}

export default function FaithfulTopChrome({
  programName,
  profileCompletion,
  bannerDismissed,
  onDismissBanner,
}: FaithfulTopChromeProps) {
  return (
    <>
      {!bannerDismissed && (
        <div className="w-full bg-white border-b border-slate-200 py-2 text-center text-sm font-medium text-slate-700 relative">
          Your profile is {profileCompletion}% complete.
          <button
            type="button"
            onClick={onDismissBanner}
            aria-label="Dismiss"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4">
        <button
          type="button"
          aria-label="Open menu"
          className="text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-base font-medium">{programName}</span>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            Create Program
          </button>
          <button
            type="button"
            aria-label="Call"
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { ChevronDown } from "lucide-react";

export default function InquirySidebar() {
  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6 flex flex-col gap-5">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-semibold text-zinc-900 leading-tight">
          Inquire About This Program
        </h2>
        <p className="text-[13px] text-zinc-500 leading-[1.5]">
          Get personalized answers from our advisors
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-900">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Jane Smith"
            className="rounded-md bg-zinc-100 py-2.5 px-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-900">
            Email Address
          </label>
          <input
            type="email"
            placeholder="jane@example.com"
            className="rounded-md bg-zinc-100 py-2.5 px-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Phone (optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-900">
            Phone{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="rounded-md bg-zinc-100 py-2.5 px-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* When do you plan to study abroad? */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-900">
            When do you plan to study abroad?
          </label>
          <div className="relative">
            <select
              defaultValue=""
              className="w-full appearance-none rounded-md bg-zinc-100 py-2.5 px-3 text-[14px] text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            >
              <option value="" disabled>
                Select a timeframe
              </option>
              <option value="fall-2025" className="text-zinc-900">
                Fall 2025
              </option>
              <option value="spring-2026" className="text-zinc-900">
                Spring 2026
              </option>
              <option value="summer-2026" className="text-zinc-900">
                Summer 2026
              </option>
              <option value="fall-2026" className="text-zinc-900">
                Fall 2026
              </option>
              <option value="undecided" className="text-zinc-900">
                Not sure yet
              </option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-zinc-900">
            Message
          </label>
          <textarea
            placeholder="Tell us what you're looking for or any questions you have..."
            className="rounded-md bg-zinc-100 py-2.5 px-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-cobalt-500 hover:bg-cobalt-600 text-white text-[14px] font-semibold rounded-md py-3 text-center transition-colors"
        >
          Send Inquiry
        </button>
      </form>

      {/* Privacy note */}
      <p className="text-[11px] text-zinc-400 text-center">
        We respect your privacy. No spam, ever.
      </p>
    </div>
  );
}

"use client";

import { Mail } from "lucide-react";
import type { Program } from "../../_components/types";

interface InquiryFormSectionProps {
  program: Program;
}

export function InquiryFormSection({ program }: InquiryFormSectionProps) {
  return (
    <div className="flex flex-col px-4 xl:px-0 gap-4">
      <div>
        <h2 className="flex items-center text-2xl font-bold gap-2">
          <Mail className="w-6 h-6 text-cobalt-500" />
          Inquire About This Program
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Get in touch with {program.provider} directly
        </p>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-md p-6">
        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              disabled
              className="bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-slate-400 w-full cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              disabled
              className="bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-slate-400 w-full cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              disabled
              className="bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-slate-400 w-full cursor-not-allowed"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Message</label>
            <textarea
              placeholder="I'm interested in learning more about this program..."
              disabled
              rows={4}
              className="bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm text-slate-400 w-full cursor-not-allowed resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            disabled
            className="py-2.5 px-4 bg-roman-500 text-white text-sm font-bold rounded-md w-full cursor-not-allowed opacity-60 mt-1"
          >
            Send Inquiry
          </button>
        </div>

        {/* Placeholder note */}
        <p className="text-xs text-slate-400 mt-4 text-center">
          This form will be connected to the provider&apos;s inquiry system
        </p>
      </div>
    </div>
  );
}

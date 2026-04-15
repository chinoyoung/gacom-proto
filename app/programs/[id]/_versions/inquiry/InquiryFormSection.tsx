"use client";

import {
  MessageCircle,
  Compass,
  BadgeDollarSign,
  Clock,
  ShieldCheck,
  ChevronDown,
  Send,
} from "lucide-react";

export default function InquiryFormSection() {
  return (
    <section className="w-full bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-12">
      {/* Section header */}
      <div className="flex flex-col items-center gap-3">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cobalt-500/[0.06] py-1.5 px-3.5">
          <MessageCircle className="w-3.5 h-3.5 text-cobalt-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-cobalt-500">Get in Touch</span>
        </span>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight text-center">
          Have Questions? Let&apos;s Talk.
        </h2>

        {/* Subheading */}
        <p className="text-base text-zinc-500 leading-relaxed text-center max-w-[640px]">
          Whether you need help choosing the right program or want to learn about
          scholarships, our team is ready to help.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-12 w-full">
        {/* Left: Benefits column */}
        <div className="flex-1 flex flex-col gap-8 pt-4">
          <p className="text-xl font-bold text-zinc-900">Why reach out?</p>

          {/* Benefit 1 — Personalized Guidance */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-cobalt-500/[0.06] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-cobalt-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-zinc-900">
                Personalized Guidance
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Get tailored program recommendations based on your goals, budget,
                and academic needs.
              </p>
            </div>
          </div>

          {/* Benefit 2 — Scholarship Information */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <BadgeDollarSign className="w-5 h-5 text-amber-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-zinc-900">
                Scholarship Information
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Learn about funding opportunities and financial aid options
                available for your program.
              </p>
            </div>
          </div>

          {/* Benefit 3 — Quick Response Time */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-zinc-900">
                Quick Response Time
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Our advisors typically respond within 24 hours with detailed,
                helpful information.
              </p>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-6 pt-6 border-t border-zinc-200">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cobalt-500" aria-hidden="true" />
              <span className="text-[13px] font-medium text-zinc-600">
                Trusted by 50,000+ students
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cobalt-500" aria-hidden="true" />
              <span className="text-[13px] font-medium text-zinc-600">
                24h average response
              </span>
            </span>
          </div>
        </div>

        {/* Right: Inquiry form card */}
        <div className="w-full lg:w-[480px] lg:shrink-0 bg-white rounded-xl border border-zinc-200 p-8 flex flex-col gap-5">
          <p className="text-xl font-bold text-zinc-900">Send Us a Message</p>

          {/* Name row */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-zinc-900">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="h-10 rounded-md bg-zinc-100 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-cobalt-300 transition-shadow"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-zinc-900">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="h-10 rounded-md bg-zinc-100 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-cobalt-300 transition-shadow"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-zinc-900">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="h-10 rounded-md bg-zinc-100 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-cobalt-300 transition-shadow"
            />
          </div>

          {/* Interest — static select-like display */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-zinc-900">
              I&apos;m interested in...
            </label>
            <div className="h-10 rounded-md bg-zinc-100 px-3 flex items-center justify-between cursor-pointer">
              <span className="text-sm text-zinc-500">Study Abroad Programs</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-zinc-900">
              Your Message
            </label>
            <textarea
              placeholder="Tell us about your goals..."
              className="h-[100px] rounded-md bg-zinc-100 p-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none resize-none focus:ring-2 focus:ring-cobalt-300 transition-shadow"
            />
          </div>

          {/* Submit button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-cobalt-500 hover:bg-cobalt-600 text-white text-[15px] font-semibold rounded-lg py-3.5 transition-colors"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            Send Inquiry
          </button>

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
            <span className="text-xs text-zinc-400">
              Your information is secure. We&apos;ll never share your data.
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

"use client";

import { Send, ShieldCheck } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderInquiry({ provider }: { provider: Provider }) {
  return (
    <section id="inquiry" className="scroll-mt-24 bg-slate-50 rounded-md p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
          Ready to learn more?
        </p>
        <h2 className="text-2xl font-bold text-slate-900">
          Get in touch with {provider.name}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Send a quick message and the provider will reach out with next steps.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inq-name" className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
              <input
                id="inq-name"
                type="text"
                placeholder="Your name"
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              />
            </div>
            <div>
              <label htmlFor="inq-email" className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input
                id="inq-email"
                type="email"
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="inq-message" className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
            <textarea
              id="inq-message"
              rows={4}
              placeholder={`Ask ${provider.name} a question…`}
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Your information is secure and only shared with {provider.name}.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Send inquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

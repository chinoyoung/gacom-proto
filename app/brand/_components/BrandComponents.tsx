"use client";

import { Globe, Handshake, Sun, Leaf, ArrowRight } from "lucide-react";

export default function BrandComponents() {
  return (
    <section
      id="components"
      aria-labelledby="components-heading"
      className="scroll-mt-16 bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2
            id="components-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            UI Components
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Canonical implementations of the four recurring patterns. Copy the class strings exactly — don't invent variants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buttons card */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">Buttons</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <button className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500">
                  Primary
                </button>
                <code className="font-mono text-xs text-slate-500">bg-cobalt-500 text-white px-7 py-3 rounded-lg hover:bg-cobalt-600</code>
              </div>
              <div className="flex flex-col gap-2">
                <button className="inline-flex items-center justify-center border border-slate-300 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-white hover:border-slate-400 transition-colors text-sm self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500">
                  Secondary
                </button>
                <code className="font-mono text-xs text-slate-500">border border-slate-300 text-neutral-800 px-7 py-3 rounded-lg hover:bg-white</code>
              </div>
              <div className="flex flex-col gap-2">
                <button className="inline-flex items-center justify-center bg-roman-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-roman-600 transition-colors text-sm self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500">
                  Roman
                </button>
                <code className="font-mono text-xs text-slate-500">bg-roman-500 text-white px-7 py-3 rounded-lg hover:bg-roman-600</code>
              </div>
              <div className="flex flex-col gap-2">
                <button className="inline-flex items-center justify-center bg-sun-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sun-600 transition-colors text-sm self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500">
                  Sun accent
                </button>
                <code className="font-mono text-xs text-slate-500">bg-sun-500 text-white px-5 py-2.5 rounded-lg hover:bg-sun-600</code>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  disabled
                  className="inline-flex items-center justify-center bg-slate-100 text-slate-400 font-semibold px-7 py-3 rounded-lg text-sm self-start cursor-not-allowed"
                >
                  Disabled
                </button>
                <code className="font-mono text-xs text-slate-500">bg-slate-100 text-slate-400 cursor-not-allowed</code>
              </div>
            </div>
          </div>

          {/* Icon Tiles card */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">Icon Tiles</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-cobalt-500" />
                </div>
                <code className="font-mono text-xs text-slate-500">bg-cobalt-500/10 rounded-lg · icon text-cobalt-500</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-roman-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5 text-roman-500" />
                </div>
                <code className="font-mono text-xs text-slate-500">bg-roman-500/10 rounded-lg · icon text-roman-500</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-sun-500/15 rounded-lg flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5 text-sun-600" />
                </div>
                <code className="font-mono text-xs text-slate-500">bg-sun-500/15 rounded-lg · icon text-sun-600</code>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-fern-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-fern-600" />
                </div>
                <code className="font-mono text-xs text-slate-500">bg-fern-500/10 rounded-lg · icon text-fern-600</code>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Tile size: <code className="font-mono">w-10 h-10</code>. Icon size: <code className="font-mono">w-5 h-5</code>. Always use <code className="font-mono">shrink-0</code> when in flex rows.
              </p>
            </div>
          </div>

          {/* Cards card */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">Card</h3>
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h4 className="text-base font-semibold text-neutral-800 mb-1">Card heading</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  A short description that explains what this card represents. Keep it to two lines maximum.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt-500 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                >
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <code className="font-mono text-xs text-slate-500 leading-relaxed">bg-white rounded-xl p-6 border border-slate-200</code>
            </div>
          </div>

          {/* Numbered List card */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-6">Numbered List</h3>
            <div className="flex flex-col gap-6">
              {[
                { num: "01", title: "First step", description: "Brief description of this item in the sequence. One or two sentences." },
                { num: "02", title: "Second step", description: "Brief description of this item in the sequence. One or two sentences." },
                { num: "03", title: "Third step", description: "Brief description of this item in the sequence. One or two sentences." },
              ].map(({ num, title, description }) => (
                <div key={num} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">{num}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-neutral-800 mb-1">{title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <code className="font-mono text-xs text-slate-500 mt-4 block">w-10 h-10 bg-cobalt-500 rounded-lg · span text-xs font-bold text-white</code>
          </div>
        </div>
      </div>
    </section>
  );
}

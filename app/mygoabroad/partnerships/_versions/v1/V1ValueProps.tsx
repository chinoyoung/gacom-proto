"use client";

import { valueProps } from "./constants";

export default function V1ValueProps() {
  return (
    <section id="overview" aria-labelledby="what-is-marketplace-heading" className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 max-w-md">
          {/* Promoted from <p> to <h2> — this was the only h2-level heading in the section */}
          <h2 id="what-is-marketplace-heading" className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4">
            Your travelers&#39; one-stop shop for travel essentials
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            The GoAbroad Marketplace is a curated hub where travelers can access everything they need for their trip, from eSIMs to insurance. As a partner, you can serve your travelers better and earn along the way.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-7">
          {valueProps.map(({ icon: Icon, title, description, accent }) => {
            const isSun = accent === "sun";
            const iconBg = isSun ? "bg-sun-500/15" : "bg-cobalt-500/8";
            const iconColor = isSun ? "text-sun-600" : "text-cobalt-500";
            return (
              <div key={title} className="flex items-start gap-4">
                <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { valueProps } from "../v1/constants";

// Small illustration paths for each value prop card (indexed by position)
const CARD_ILLUSTRATIONS = [
  "/illustrations/mobile-data.svg",
  "/illustrations/community.svg",
  "/illustrations/celebrate.svg",
];

export default function V2ValueProps() {
  return (
    <section
      id="overview"
      aria-labelledby="what-is-marketplace-heading"
      className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2
            id="what-is-marketplace-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Your travelers&#39; one-stop shop for travel essentials
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            The GoAbroad Marketplace is a curated hub where travelers can access everything they need for their trip, from eSIMs to insurance. As a partner, you can serve your travelers better and earn along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {valueProps.map(({ icon: Icon, title, description, accent }, idx) => {
            const isSun = accent === "sun";
            const iconBg = isSun ? "bg-sun-500/15" : "bg-cobalt-500/10";
            const iconColor = isSun ? "text-sun-600" : "text-cobalt-500";
            const illustration = CARD_ILLUSTRATIONS[idx] ?? CARD_ILLUSTRATIONS[0];

            return (
              <div
                key={title}
                className="flex flex-col gap-5 p-6 rounded-lg border border-slate-100 bg-slate-50"
              >
                <img
                  src={illustration}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-40 object-contain"
                />
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-800 mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

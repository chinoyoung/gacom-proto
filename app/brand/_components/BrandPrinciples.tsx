"use client";

import { Minus, Smartphone, Pipette, Lightbulb, MousePointerClick } from "lucide-react";

const principles = [
  {
    icon: Minus,
    title: "Restraint over decoration",
    description: "Avoid gradients, heavy shadows, and visual noise. Let content breathe. Every added element should earn its place.",
    accent: "cobalt",
  },
  {
    icon: Smartphone,
    title: "Mobile-first, always",
    description: "Design the smallest breakpoint first, then scale up. Every layout decision must work at 375px before 1440px.",
    accent: "cobalt",
  },
  {
    icon: Pipette,
    title: "Standard tokens, not hex",
    description: "Use only the brand color tokens defined in globals.css. Never hardcode hex values in className strings.",
    accent: "sun",
  },
  {
    icon: Lightbulb,
    title: "Clarity over cleverness",
    description: "Use familiar patterns and explicit labels. Predictable interfaces reduce friction and build trust across user types.",
    accent: "cobalt",
  },
  {
    icon: MousePointerClick,
    title: "Clickable means pointer",
    description: "Every clickable element — buttons, action links, role=\"button\" elements, clickable cards and rows — must have cursor-pointer. Tailwind v4 doesn't apply it by default on <button>, and <a> only shows a pointer when it has an href.",
    accent: "cobalt",
  },
] as const;

export default function BrandPrinciples() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="scroll-mt-16 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 max-w-md">
          <h2
            id="principles-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Design principles
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Four rules that govern every visual and interaction decision across GoAbroad prototypes. When in doubt, return to these.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-7">
          {principles.map(({ icon: Icon, title, description, accent }) => {
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

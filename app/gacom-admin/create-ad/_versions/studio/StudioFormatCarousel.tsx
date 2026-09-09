"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Image as ImageIcon,
  Rows3,
  RectangleHorizontal,
  Columns2,
  Focus,
  PlayCircle,
  GalleryHorizontalEnd,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { AD_TYPES_BY_AREA, adExampleThumb } from "../../_shared/ad-types";
import type { AdArchetype, AdTypeSpec, PlacementArea } from "../../_shared/ad-types";
import type useCreateAdForm from "../../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const ARCHETYPE_ICONS: Record<AdArchetype, LucideIcon> = {
  "program-card": LayoutGrid,
  "simple-photo": ImageIcon,
  "thumb-text": Rows3,
  "split-banner": RectangleHorizontal,
  "brand-split": Columns2,
  "centered-overlay": Focus,
  "video-split": PlayCircle,
  "cover-photo": GalleryHorizontalEnd,
  "hot-jobs": Flame,
};

interface StudioFormatCarouselProps {
  area: PlacementArea;
  form: Form;
}

export default function StudioFormatCarousel({ area, form }: StudioFormatCarouselProps) {
  const specs = AD_TYPES_BY_AREA[area] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function update() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }
  useEffect(() => {
    update();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    update();
  }, [area]);

  function scrollByAmount(dir: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">Formats</h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            disabled={!canLeft}
            aria-label="Previous formats"
            className="h-8 w-8 rounded-full bg-roman-500 text-white grid place-items-center cursor-pointer hover:bg-roman-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-roman-500"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            disabled={!canRight}
            aria-label="Next formats"
            className="h-8 w-8 rounded-full bg-roman-500 text-white grid place-items-center cursor-pointer hover:bg-roman-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-roman-500"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {specs.map((spec) => (
          <CarouselCard
            key={spec.name}
            spec={spec}
            selected={spec.name === form.state.adType}
            onSelect={() => form.setAdType(spec.name)}
          />
        ))}
      </div>
    </div>
  );
}

interface CarouselCardProps {
  spec: AdTypeSpec;
  selected: boolean;
  onSelect: () => void;
}

function CarouselCard({ spec, selected, onSelect }: CarouselCardProps) {
  const Icon = ARCHETYPE_ICONS[spec.archetype];
  const thumb = adExampleThumb(spec);
  const specLine = spec.titleAuto
    ? `${spec.imageDesktop} · auto title`
    : `${spec.imageDesktop} · title ${spec.titleMax}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`shrink-0 w-72 rounded-xl bg-white p-2.5 cursor-pointer text-left flex items-center gap-3 transition-colors ${
        selected
          ? "border-2 border-roman-500"
          : "border border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="relative w-32 shrink-0 aspect-video rounded bg-slate-200 overflow-hidden">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={`${spec.name} example`}
            className="absolute inset-0 w-full h-full object-contain p-1"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <Icon className={`w-6 h-6 ${selected ? "text-roman-500" : "text-slate-400"}`} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-800 leading-snug">{spec.name}</div>
        <div className="text-xs text-slate-500">{specLine}</div>
      </div>
    </button>
  );
}

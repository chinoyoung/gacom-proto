"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { Program } from "../../_components/types";

export default function V5MediaGallery({ program }: { program: Program }) {
  const photos = program.photos ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((cur) =>
      cur != null ? (cur - 1 + photos.length) % photos.length : null
    );
  }, [photos.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((cur) =>
      cur != null ? (cur + 1) % photos.length : null
    );
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, prevPhoto, nextPhoto, closeLightbox]);

  if (!photos.length) return null;

  const activePhoto = photos[activeIndex];

  return (
    <>
      <h2 id="gallery" className="text-2xl font-bold text-slate-900 mb-4">
        Media Gallery
      </h2>

      <button
        type="button"
        onClick={() => setLightboxIndex(activeIndex)}
        className="group relative block w-full rounded-md overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        aria-label={`Open photo ${activeIndex + 1} in lightbox`}
      >
        <img
          src={activePhoto}
          alt={`${program.title} — photo ${activeIndex + 1}`}
          className="w-full h-[320px] md:h-[460px] lg:h-[520px] object-cover"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/55 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
          View full size
        </span>
        <span className="absolute bottom-3 left-3 bg-black/55 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
          {activeIndex + 1} / {photos.length}
        </span>
      </button>

      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {photos.map((photo, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={isActive}
                className={`relative aspect-square w-20 md:w-24 shrink-0 rounded-md overflow-hidden cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                  isActive
                    ? "ring-2 ring-cobalt-500"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {lightboxIndex != null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-7 h-7" />
          </button>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh] mx-auto px-16">
            <img
              src={photos[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
            <p className="text-center text-white/50 text-sm mt-3">
              {lightboxIndex + 1} / {photos.length}
            </p>
          </div>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer bg-black/30 rounded p-2"
              aria-label="Next photo"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </>
  );
}

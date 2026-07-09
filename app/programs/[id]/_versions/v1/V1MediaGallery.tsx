"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { Program } from "../../_components/types";

const TILE_BUTTON_CLASS =
  "group relative block overflow-hidden rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500";

function TileHoverOverlay() {
  return (
    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
  );
}

export default function V1MediaGallery({ program }: { program: Program }) {
  const photos = program.photos ?? [];
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

  function renderCollage() {
    // Single photo — centered, simple hero treatment.
    if (photos.length === 1) {
      return (
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className={`${TILE_BUTTON_CLASS} block w-full aspect-[3/2]`}
            aria-label="Open photo 1 in lightbox"
          >
            <img
              src={photos[0]}
              alt={`${program.title} — photo 1`}
              className="w-full h-full object-cover rounded-md"
            />
            <TileHoverOverlay />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/55 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
              View full size
            </span>
          </button>
        </div>
      );
    }

    // Two photos — even split, side by side on larger screens.
    if (photos.length === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className={`${TILE_BUTTON_CLASS} aspect-[3/2]`}
              aria-label={`Open photo ${i + 1} in lightbox`}
            >
              <img
                src={photo}
                alt={`${program.title} — photo ${i + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <TileHoverOverlay />
            </button>
          ))}
        </div>
      );
    }

    // Three or more photos — Airbnb-style collage: a lead image plus a
    // right-hand cell of tiles that visually matches the lead's height
    // once we're on large screens.
    const rest = photos.slice(1);
    const totalCount = photos.length;
    const visibleTiles = rest.slice(0, 6);
    const hasOverflow = rest.length > 6;
    const placeholderCount = 6 - visibleTiles.length;
    const innerGridClass = "grid grid-cols-2 gap-2 lg:grid-rows-3 lg:h-full";

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:aspect-[7/3]">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className={`${TILE_BUTTON_CLASS} w-full aspect-[3/2] lg:aspect-auto lg:h-full lg:col-span-2`}
          aria-label="Open photo 1 in lightbox"
        >
          <img
            src={photos[0]}
            alt={`${program.title} — photo 1`}
            className="w-full h-full object-cover rounded-md"
          />
          <TileHoverOverlay />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-black/55 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
            View full size
          </span>
        </button>

        <div className={innerGridClass}>
          {visibleTiles.map((photo, idx) => {
            const realIndex = idx + 1;
            const isOverflowTile = hasOverflow && idx === visibleTiles.length - 1;

            return (
              <button
                key={realIndex}
                type="button"
                onClick={() => setLightboxIndex(realIndex)}
                className={`${TILE_BUTTON_CLASS} relative aspect-[3/2] lg:aspect-auto`}
                aria-label={
                  isOverflowTile
                    ? `View all ${totalCount} photos`
                    : `Open photo ${realIndex + 1} in lightbox`
                }
              >
                <img
                  src={photo}
                  alt={`${program.title} — photo ${realIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
                <TileHoverOverlay />
                {isOverflowTile && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                    <span className="text-white text-lg font-semibold">
                      View all {totalCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
          {placeholderCount > 0 &&
            Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                aria-hidden="true"
                className="hidden lg:block rounded-md bg-slate-100"
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 id="gallery" className="text-2xl font-bold text-slate-900 mb-4">
        Media Gallery
      </h2>

      {renderCollage()}

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

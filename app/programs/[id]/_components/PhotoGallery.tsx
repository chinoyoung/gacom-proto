"use client";

import { useState } from "react";
import Image from "next/image";
import type { Program } from "./types";

interface PhotoGalleryProps {
  program: Program;
}

export default function PhotoGallery({ program }: PhotoGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const photos = program.photos ?? [];

  return (
    <section aria-labelledby="gallery-heading">
      <h2
        id="gallery-heading"
        className="text-2xl font-bold text-slate-900 mb-5"
      >
        Media Gallery
      </h2>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg py-12 text-center">
          <svg
            className="w-10 h-10 text-slate-300 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18M3 9h18M3 15h18"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 3H3v18h18V3z"
            />
          </svg>
          <p className="text-slate-500 text-sm font-medium">
            No photos added yet
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Photos will appear here once the provider uploads them.
          </p>
        </div>
      ) : (
        <>
          {/* Gallery grid: first photo large, rest smaller */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-lg overflow-hidden">
            {/* Large first photo */}
            <div
              className="col-span-2 row-span-2 relative cursor-pointer group"
              style={{ aspectRatio: "16/10" }}
              onClick={() => setLightboxIdx(0)}
            >
              <Image
                src={photos[0]}
                alt={`${program.title} - photo 1`}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Thumbnails (up to 4) */}
            {photos.slice(1, 5).map((photo, idx) => {
              const photoIdx = idx + 1;
              const isLastVisible = photoIdx === 4 && photos.length > 5;

              return (
                <div
                  key={photoIdx}
                  className="relative cursor-pointer group"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => setLightboxIdx(photoIdx)}
                >
                  <Image
                    src={photo}
                    alt={`${program.title} - photo ${photoIdx + 1}`}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Overlay for "more photos" indicator */}
                  {isLastVisible && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        +{photos.length - 5} more
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Photo count */}
          <p className="text-xs text-slate-400 mt-2 text-right">
            {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </p>
        </>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 cursor-pointer"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close gallery"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Prev button */}
          {lightboxIdx > 0 && (
            <button
              type="button"
              className="absolute left-4 text-white/80 hover:text-white p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx - 1);
              }}
              aria-label="Previous photo"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next button */}
          {lightboxIdx < photos.length - 1 && (
            <button
              type="button"
              className="absolute right-4 text-white/80 hover:text-white p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx + 1);
              }}
              aria-label="Next photo"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIdx]}
              alt={`${program.title} - photo ${lightboxIdx + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] rounded-lg"
            />
            <p className="absolute bottom-3 left-0 right-0 text-center text-white/60 text-xs">
              {lightboxIdx + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

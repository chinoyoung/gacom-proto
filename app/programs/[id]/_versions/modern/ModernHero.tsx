"use client";

import { MapPin, Clock3, Calendar, DollarSign, GraduationCap } from "lucide-react";
import { Program } from "../../_components/types";

interface ModernHeroProps {
  program: Program;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ModernHero({ program }: ModernHeroProps) {
  const visibleThumbnails = program.photos.slice(0, 3);
  const extraPhotos = program.photos.length > 3 ? program.photos.length - 3 : 0;

  const facts = [
    program.duration
      ? { icon: Clock3, label: program.duration }
      : null,
    program.terms.length > 0
      ? { icon: Calendar, label: program.terms.map(capitalize).join(", ") }
      : null,
    program.cost
      ? { icon: DollarSign, label: program.cost }
      : null,
    program.educationLevels.length > 0
      ? { icon: GraduationCap, label: program.educationLevels.map(capitalize).join(", ") }
      : null,
  ].filter(Boolean) as { icon: typeof Clock3; label: string }[];

  return (
    <div>
      {/* Full-bleed hero image container */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        {program.coverImage ? (
          <img
            src={program.coverImage}
            alt={program.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="bg-gradient-to-br from-cobalt-700 to-cobalt-900 w-full h-full" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content overlay — anchored to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          {/* Provider badge */}
          <div className="inline-flex items-center gap-2 w-fit text-xs font-medium text-white/90 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            {program.providerLogo && (
              <img
                src={program.providerLogo}
                alt={program.provider}
                className="w-5 h-5 rounded object-cover"
              />
            )}
            {program.provider}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 max-w-3xl leading-tight">
            {program.title}
          </h1>

          {/* Location */}
          <p className="text-sm text-white/80 mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {program.city}, {program.country}
          </p>
        </div>

        {/* Photo thumbnails — desktop only, inside image container */}
        {program.photos.length > 0 && (
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 hidden sm:flex gap-2">
            {visibleThumbnails.map((photo, index) => {
              const isLast = index === visibleThumbnails.length - 1;
              return (
                <div
                  key={index}
                  className="w-16 h-16 rounded border-2 border-white/50 overflow-hidden cursor-pointer relative"
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="object-cover w-full h-full hover:border-white transition-colors"
                  />
                  {isLast && extraPhotos > 0 && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-xs font-semibold">
                      +{extraPhotos}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Facts Bar — below the image, NOT inside it */}
      {facts.length > 0 && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Desktop layout */}
            <div className="hidden sm:flex items-center gap-6 divide-x divide-slate-200">
              {facts.map(({ icon: Icon, label }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-600 pl-6 first:pl-0"
                >
                  <Icon className="w-4 h-4 text-cobalt-500 shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Mobile layout */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
              {facts.map(({ icon: Icon, label }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <Icon className="w-4 h-4 text-cobalt-500 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

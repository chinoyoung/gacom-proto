"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  CheckCircle,
  MapPin,
  CalendarCheck,
  ShieldAlert,
  UserCheck,
  DollarSign,
  BookOpen,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
  FileText,
  Heart,
} from "lucide-react";
import type { Program } from "../../_components/types";

export function DescriptionSection({
  program,
  avgRating,
  reviewCount,
  programCount,
}: {
  program: Program;
  avgRating: number;
  reviewCount: number;
  programCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const paragraphs = program.description
    ? program.description.split(/\n\n+/).filter(Boolean)
    : [];
  const firstParagraph = paragraphs[0] ?? "";
  const remainingParagraphs = paragraphs.slice(1).join("\n\n");
  const isLong = paragraphs.length > 1;

  const photos = program.photos ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

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
  }, [lightboxIndex, prevPhoto, nextPhoto]);

  const displayedSubjects = showAllSubjects
    ? program.subjectAreas
    : program.subjectAreas.slice(0, 4);

  return (
    <section className="flex flex-col lg:flex-row px-4 xl:px-0 py-4 gap-6">
      {/* Left column */}
      <div className="flex flex-col gap-12 flex-1 min-w-0">
        {/* Provider info + CTAs */}
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-4">
            <div className="h-[65px] max-w-[65px] md:max-w-[75px] object-cover md:h-[75px] bg-slate-200 p-1 rounded-md shrink-0">
              {program.providerLogo ? (
                <img
                  className="w-full h-full rounded-md object-cover"
                  src={program.providerLogo}
                  alt={`${program.provider} logo`}
                />
              ) : (
                <div className="w-full h-full rounded-md bg-cobalt-300" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-base md:text-xl leading-6 text-neutral-900">
                {program.title}
              </h1>
              <p className="text-sm text-neutral-600">
                by:{" "}
                <span className="font-bold text-neutral-800">{program.provider}</span>
              </p>
              <div className="grid grid-cols-2 gap-1 md:flex md:gap-4 text-xs text-neutral-700 mt-2 font-bold">
                <span className="flex gap-1 items-center">
                  <Star
                    fill="currentColor"
                    className="text-lg text-sun-500 w-4 h-4"
                  />
                  {avgRating > 0 ? avgRating.toFixed(2) : "—"} ({reviewCount})
                </span>
                <span className="flex gap-1 items-center">
                  <CheckCircle className="text-base text-fern-500 w-4 h-4" />
                  Verified
                </span>
                <span className="flex gap-1 items-center">
                  <FileText className="text-lg text-cobalt-500 w-4 h-4" />
                  {programCount} Programs
                </span>
                <span className="flex gap-1 items-center cursor-pointer">
                  <Heart className="text-lg text-roman-500 w-4 h-4" />
                  Save
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-2 md:gap-4">
            <a
              href={program.applyUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-roman-500 text-white h-10 text-xs md:text-sm font-bold rounded-md px-5 flex items-center"
            >
              Visit Website
            </a>
            <button className="bg-cobalt-500 text-white h-10 text-xs md:text-sm font-bold rounded-md px-5 cursor-pointer">
              Inquire Here
            </button>
            <button className="bg-cobalt-500 text-white lg:block h-10 text-xs md:text-sm font-bold rounded-md px-5 cursor-pointer">
              Apply Now
            </button>
          </div>
        </div>
          {/* Description */}
          <div className="flex flex-col gap-2">
            <p className="text-sm leading-relaxed text-neutral-700">
              {firstParagraph}
            </p>
            {isLong && (
              <>
                {expanded && (
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {remainingParagraphs}
                  </p>
                )}
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="flex mt-2 font-bold items-center gap-1 text-sm cursor-pointer"
                >
                  {expanded ? "Read Less" : "Read More"}
                  <ChevronRight
                    className={`${expanded ? "-rotate-90" : ""
                      } transform w-3 h-3`}
                  />
                </button>
              </>
            )}
          </div>

          {/* Program Highlights card */}
          {program.highlights.length > 0 && (
            <div className="bg-slate-50 border border-gray-200 rounded-md flex flex-col gap-2 md:gap-4 p-4">
              <h3 className="font-bold text-lg">Program Highlights</h3>
              <div className="flex flex-col gap-2 md:gap-4 text-sm">
                {program.highlights.map((h, i) => (
                  <p key={i} className="flex gap-2 items-start">
                    <Shield className="shrink-0 w-4 h-4 mt-0.5" />
                    {h}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* What's Included */}
          {program.whatsIncluded.length > 0 && (
            <div className="bg-slate-50 border border-gray-200 rounded-md flex flex-col gap-2 md:gap-4 p-4">
              <h3 className="font-bold text-lg">What&apos;s Included</h3>
              <div className="flex flex-col gap-2 md:gap-4 text-sm">
                {program.whatsIncluded.map((item, i) => (
                  <p key={i} className="flex gap-2 items-start">
                    <CheckCircle className="shrink-0 w-4 h-4 mt-0.5 text-fern-500" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {photos.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="flex items-center text-2xl font-bold gap-2">
                Media Gallery
              </h2>
              <div className="w-full relative cursor-pointer" onClick={() => openLightbox(activeIndex)}>
                <img
                  className="rounded-md md:h-[400px] w-full object-cover"
                  src={photos[activeIndex]}
                  alt="Gallery"
                />
                <div className="absolute bottom-0 left-0 w-full flex items-center p-4 bg-slate-900/85 rounded-b-md">
                  <p className="text-white text-xs md:text-base">
                    {program.title} - Photo {activeIndex + 1} of {photos.length}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-2">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      className={`w-24 h-24 rounded-md overflow-hidden md:w-40 shrink-0 cursor-pointer ${i === activeIndex ? "ring-2 ring-cobalt-500" : "opacity-70"
                        }`}
                      onClick={() => setActiveIndex(i)}
                    >
                      <img
                        src={photo}
                        className="w-full h-full object-cover"
                        alt={`thumbnail-${i}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 lg:w-[400px] w-full shrink-0">
          {/* Quick Details card */}
          <div className="flex flex-col gap-4 w-full shrink-0 bg-slate-50 rounded-md p-4 overflow-clip border border-gray-200">
            <h3 className="text-xl font-bold">Quick Details</h3>

            {/* Location */}
            <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
              <div>
                <p className="font-bold">Location</p>
                <p>
                  {program.city}, {program.country}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
              <CalendarCheck className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
              <div>
                <p className="font-bold">Availability</p>
                {program.terms.length > 0 && (
                  <p>{program.terms.join(", ")}</p>
                )}
                {program.duration && <p>{program.duration}</p>}
              </div>
            </div>

            {/* Cost */}
            <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
              <DollarSign className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
              <div>
                <p className="font-bold">Cost Per Week</p>
                <p>{program.cost ?? "Contact Provider"}</p>
              </div>
            </div>

            {/* Age Requirement */}
            <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
              <div>
                <p className="font-bold">Age Requirement</p>
                <p>{program.ageRequirement ?? "Varies"}</p>
              </div>
            </div>

            {/* Types & Subjects */}
            {program.subjectAreas.length > 0 && (
              <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
                <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
                <div>
                  <p className="font-bold">Types &amp; Subjects</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {displayedSubjects.map((s, i) => (
                      <span
                        key={i}
                        className="bg-slate-200 text-xs px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {program.subjectAreas.length > 4 && (
                    <button
                      onClick={() => setShowAllSubjects((v) => !v)}
                      className="text-xs text-cobalt-500 font-bold mt-1 cursor-pointer"
                    >
                      {showAllSubjects
                        ? "Show less"
                        : `+${program.subjectAreas.length - 4} more`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Guidelines */}
            {program.eligibleNationalities.length > 0 && (
              <div className="border-b border-gray-200 px-2 flex items-start text-sm gap-2 pb-4">
                <UserCheck className="w-4 h-4 shrink-0 mt-0.5 text-cobalt-500" />
                <div>
                  <p className="font-bold">Guidelines</p>
                  <p>{program.eligibleNationalities.join(", ")}</p>
                </div>
              </div>
            )}

            {/* See all details link */}
            <a
              href="#details"
              className="font-bold text-sm border border-gray-200 rounded-md bg-white py-2.5 justify-center flex gap-2 items-center"
            >
              See all program details
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* Recognitions card */}
          <div className="flex flex-col gap-4 w-full shrink-0 bg-slate-50 rounded-md p-4 overflow-clip border border-gray-200">
            <h3 className="text-xl font-bold">Recognitions</h3>
            <p className="text-sm text-slate-500">Awards and recognitions will appear here.</p>
          </div>
        </div>

      {/* Lightbox */}
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
    </section>
  );
}

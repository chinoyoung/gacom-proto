"use client";

import { BadgeCheck, Image as ImageIcon, Star } from "lucide-react";
import type { ReactNode } from "react";
import type useCreateAdForm from "../../../_shared/useCreateAdForm";

type Form = ReturnType<typeof useCreateAdForm>;

const LOGO_TILE_SIZES = {
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-20 h-20 text-2xl",
} as const;

/** Rounded-border white tile showing a provider's initials (first letters of the first two words). */
export function LogoTile({
  provider,
  size = "md",
}: {
  provider: string;
  size?: keyof typeof LOGO_TILE_SIZES;
}) {
  const initials = provider
    .split(" ")
    .filter((word) => /[a-zA-Z0-9]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`shrink-0 rounded-lg border border-slate-200 bg-white grid place-items-center font-bold text-sky-800 ${LOGO_TILE_SIZES[size]}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/** Star rating + review count + optional verified badge, used across the program-card family. */
export function ReviewStars({
  rating,
  reviews,
  verified,
}: {
  rating: number;
  reviews: number;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="w-3.5 h-3.5 fill-current text-amber-400" aria-hidden="true" />
      <span className="font-semibold text-slate-800">{rating}</span>
      <span className="text-slate-500">· {reviews.toLocaleString()} reviews</span>
      {verified ? (
        <BadgeCheck className="w-4 h-4 text-green-500" aria-hidden="true" />
      ) : null}
    </div>
  );
}

/** Converts a spec ratio string ("8:5", "16/9", "1.91:1") to a CSS aspect-ratio value. */
function toCssAspectRatio(ratio: string | undefined): string {
  if (!ratio) return "4/3";
  return ratio.replace(":", "/");
}

/** Cover image bound to the uploaded preview, or a muted placeholder, at the spec's aspect ratio. */
export function CoverImage({
  form,
  ratio,
  rounded = false,
}: {
  form: Form;
  ratio?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-100 ${rounded ? "rounded-lg" : ""}`}
      style={{ aspectRatio: toCssAspectRatio(ratio) }}
    >
      {form.state.uploadedPreviewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={form.state.uploadedPreviewUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full grid place-items-center">
          <ImageIcon className="w-8 h-8 text-slate-300" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

/** Amber pill badge used for "Featured…" style callouts on banner/split archetypes. */
export function PillBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded">
      {children}
    </span>
  );
}

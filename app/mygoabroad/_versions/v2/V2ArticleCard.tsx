"use client";
import { useState } from "react";
import { Bookmark, Globe } from "lucide-react";

interface V2ArticleCardProps {
  title: string;
  author: string;
  date: string;
  topic?: string;
}

export default function V2ArticleCard({ title, author, date, topic }: V2ArticleCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="relative h-[209px] w-full overflow-hidden rounded-md">
      {/* Placeholder image background */}
      <div className="absolute inset-0 bg-slate-400 flex items-center justify-center">
        <Globe className="h-12 w-12 text-slate-300" aria-hidden="true" />
      </div>

      {/* Gradient overlay — intrinsic to image-overlay card design */}
      <div className="absolute inset-0 h-full bg-gradient-to-t from-black/60 via-black/30 to-black/10" aria-hidden="true" />

      {/* Bookmark button - top right */}
      <div className="absolute right-4 top-4 z-10 flex items-center justify-center rounded-full bg-white p-2">
        <button
          aria-label={saved ? "Unsave article" : "Save article"}
          onClick={() => setSaved(!saved)}
          className="border-none bg-none p-1 transition-transform active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded-full"
        >
          <Bookmark
            className={`h-5 w-5 text-neutral-800 transition-all duration-100 ease-in-out ${saved ? "fill-current" : "hover:scale-110 hover:fill-current"}`}
          />
        </button>
      </div>

      {/* Bottom-anchored content */}
      <div className="absolute inset-0 flex h-full flex-col justify-end p-[20px]">
        <div className="space-y-2.5 text-left">
          {topic && (
            <div className="mb-2.5 flex h-5 w-fit items-center justify-center rounded-md bg-white px-2.5 text-[8.77px] font-semibold uppercase text-neutral-800 md:mb-2 md:h-6 md:rounded-lg md:px-3 md:text-[9px]">
              {topic}
            </div>
          )}
          <a
            href="#"
            className="hover:text-cobalt-50 focus:text-cobalt-50 text-base font-semibold leading-tight text-white no-underline line-clamp-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
          >
            {title}
          </a>
          <p className="text-xs font-light text-white">
            By <span className="font-bold">{author}</span> | {date}
          </p>
        </div>
      </div>
    </div>
  );
}

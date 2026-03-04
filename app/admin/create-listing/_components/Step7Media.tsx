"use client";

import { useState } from "react";
import TagInput from "./TagInput";
import AIGenerateButton from "./AIGenerateButton";

interface Step7Data {
  coverImage: string;
  photos: string[];
}

interface Step7MediaProps {
  data: Step7Data;
  onChange: (data: Partial<Step7Data>) => void;
  formData: any;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function ImagePreview({ url, alt }: { url: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!isValidUrl(url)) return null;
  if (error) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-md border border-red-200 bg-red-50 text-xs text-red-400">
        Failed
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      onError={() => setError(true)}
      className="h-16 w-16 rounded-md object-cover border border-gray-200"
    />
  );
}

export default function Step7Media({ data, onChange, formData }: Step7MediaProps) {
  const [coverImageError, setCoverImageError] = useState(false);

  const handleCoverImageChange = (url: string) => {
    setCoverImageError(false);
    onChange({ coverImage: url });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Media</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add images to make your listing visually compelling. Paste image URLs below.
        </p>
      </div>

      <AIGenerateButton
        step={7}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-5">
        {/* Cover Image */}
        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700"
          >
            Cover Image URL{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            The main image shown at the top of your listing. Use a high-quality landscape image.
          </p>
          <input
            id="coverImage"
            type="url"
            value={data.coverImage}
            onChange={(e) => handleCoverImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />

          {/* Cover image preview */}
          {data.coverImage && isValidUrl(data.coverImage) && (
            <div className="mt-3">
              {coverImageError ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-red-200 bg-red-50">
                  <p className="text-sm text-red-500">
                    Could not load image from this URL.
                  </p>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.coverImage}
                  alt="Cover image preview"
                  onError={() => setCoverImageError(true)}
                  className="h-64 w-full rounded-lg object-cover border border-gray-200"
                />
              )}
            </div>
          )}
        </div>

        {/* Additional Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Photo URLs{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            Add more photos to show campus, housing, activities, and city life.
          </p>
          <div className="mt-1">
            <TagInput
              tags={data.photos}
              onChange={(tags) => onChange({ photos: tags })}
              placeholder="Paste a photo URL and press Enter..."
            />
          </div>

          {/* Photo thumbnails */}
          {data.photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.photos.map((url, index) => (
                <div key={index} className="relative group">
                  <ImagePreview url={url} alt={`Photo ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tip box */}
        <div className="rounded-md bg-cobalt-50/10 border border-cobalt-50/20 p-4">
          <div className="flex gap-3">
            <svg
              className="h-5 w-5 text-cobalt-300 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-cobalt-700">Photo tips</p>
              <ul className="mt-1 text-sm text-cobalt-600 space-y-0.5 list-disc list-inside">
                <li>Use direct image URLs (ending in .jpg, .png, .webp)</li>
                <li>Recommended cover image size: 1200x630px or wider</li>
                <li>Showcase city landmarks, campus, housing, and activities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

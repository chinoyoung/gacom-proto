"use client";

import { useEffect, useRef, useState } from "react";
import AIGenerateButton from "./AIGenerateButton";

const IMPORT_STATUS_MESSAGES = [
  "Scanning website...",
  "Reading program details...",
  "Extracting courses & subjects...",
  "Gathering pricing info...",
  "Analyzing eligibility requirements...",
  "Checking housing options...",
  "Compiling results...",
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Step1Data {
  title: string;
  provider: string;
  hostInstitution: string;
  slug: string;
}

interface Step1BasicInfoProps {
  data: Step1Data;
  onChange: (data: Partial<Step1Data>) => void;
  onImport: (data: Record<string, any>) => void;
  formData: any;
}

export default function Step1BasicInfo({ data, onChange, onImport, formData }: Step1BasicInfoProps) {
  // Track whether the slug has been manually edited
  const slugManuallyEdited = useRef(data.slug !== "" && data.slug !== generateSlug(data.title));

  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importProgress, setImportProgress] = useState(0);
  const [importStatusIndex, setImportStatusIndex] = useState(0);

  useEffect(() => {
    if (!isImporting) {
      return;
    }

    setImportProgress(0);
    setImportStatusIndex(0);

    // Progress bar: increment every 300ms, slow down as it approaches 90%
    const progressInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 90) return prev;
        const remaining = 90 - prev;
        const increment = Math.max(0.5, remaining * 0.08);
        return Math.min(90, prev + increment);
      });
    }, 300);

    // Status text: rotate every 2.5 seconds
    const statusInterval = setInterval(() => {
      setImportStatusIndex((prev) => (prev + 1) % IMPORT_STATUS_MESSAGES.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [isImporting]);

  // Auto-generate slug from title unless admin has manually edited it
  useEffect(() => {
    if (!slugManuallyEdited.current) {
      onChange({ slug: generateSlug(data.title) });
    }
  }, [data.title]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSlugChange = (value: string) => {
    // Sanitize as user types: only allow lowercase letters, numbers, hyphens
    const sanitized = value.toLowerCase().replace(/[^\w-]/g, "").replace(/_/g, "-");
    slugManuallyEdited.current = true;
    onChange({ slug: sanitized });
  };

  const handleSlugReset = () => {
    slugManuallyEdited.current = false;
    onChange({ slug: generateSlug(data.title) });
  };

  const handleImport = async () => {
    if (!importUrl.trim()) return;

    setIsImporting(true);
    setImportError("");

    try {
      const res = await fetch("/api/ai/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        setImportError(result.error || "Failed to import program information");
        setIsImporting(false);
        return;
      }

      if (result.fields && Object.keys(result.fields).length > 0) {
        // Show completion state briefly
        setImportProgress(100);
        setImportStatusIndex(-1); // signals "Done!"
        onImport(result.fields);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setImportUrl("");
        setIsImporting(false);
      } else {
        setImportError("No program information found on that page.");
        setIsImporting(false);
      }
    } catch {
      setImportError("Something went wrong. Please try again.");
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Start with the core details about your study abroad program.
        </p>
      </div>

      {/* URL Import */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <label className="block text-sm font-medium text-gray-700">
          Import from URL
        </label>
        <p className="mt-0.5 text-xs text-gray-500">
          Paste a program page URL to auto-fill fields across all steps.
        </p>
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            value={importUrl}
            onChange={(e) => {
              setImportUrl(e.target.value);
              if (importError) setImportError("");
            }}
            placeholder="https://university.edu/study-abroad/program"
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            disabled={isImporting}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImport();
              }
            }}
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || !importUrl.trim()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-cobalt-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cobalt-700 focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting ? "Importing..." : "Import"}
          </button>
        </div>
        {isImporting && (
          <div className="mt-3">
            <div className="relative h-7 w-full overflow-hidden rounded-md bg-gray-200">
              <div
                className="absolute inset-y-0 left-0 rounded-md bg-cobalt-600 transition-all duration-300 ease-out"
                style={{ width: `${importProgress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {importStatusIndex === -1
                    ? "Done!"
                    : IMPORT_STATUS_MESSAGES[importStatusIndex]}
                </span>
              </div>
            </div>
          </div>
        )}
        {importError && (
          <p className="mt-2 text-sm text-red-600">{importError}</p>
        )}
      </div>

      <AIGenerateButton
        step={1}
        formData={formData}
        onGenerated={onChange}
      />

      <div className="space-y-4">
        {/* Program Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Program Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Summer in Rome: Art, History & Culture"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            required
          />
        </div>

        {/* URL Slug */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL Slug <span className="text-red-500">*</span>
            </label>
            {slugManuallyEdited.current && data.title && (
              <button
                type="button"
                onClick={handleSlugReset}
                className="text-xs text-cobalt-500 hover:text-cobalt-600 hover:underline"
              >
                Reset to auto-generated
              </button>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            Used in the public URL. Auto-generated from the title — you can customize it.
          </p>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-xs text-gray-500 select-none">
              /programs/
            </span>
            <input
              id="slug"
              type="text"
              value={data.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="summer-in-rome-art-history-culture"
              className="block w-full rounded-none rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
              required
            />
          </div>
          {data.slug && (
            <p className="mt-1 text-xs text-gray-400">
              Preview:{" "}
              <span className="font-mono text-gray-600">
                yoursite.com/programs/{data.slug}
              </span>
            </p>
          )}
        </div>

        {/* Provider */}
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
            Provider / Organization <span className="text-red-500">*</span>
          </label>
          <input
            id="provider"
            type="text"
            value={data.provider}
            onChange={(e) => onChange({ provider: e.target.value })}
            placeholder="e.g. Global Academic Connections"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
            required
          />
        </div>

        {/* Host Institution */}
        <div>
          <label htmlFor="hostInstitution" className="block text-sm font-medium text-gray-700">
            Host Institution{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            The local university or institution hosting the program.
          </p>
          <input
            id="hostInstitution"
            type="text"
            value={data.hostInstitution}
            onChange={(e) => onChange({ hostInstitution: e.target.value })}
            placeholder="e.g. University of Rome La Sapienza"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500"
          />
        </div>
      </div>
    </div>
  );
}

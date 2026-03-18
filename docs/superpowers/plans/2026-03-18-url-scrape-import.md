# URL Scrape Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a URL input to Step 1 of create listing that scrapes a university website and pre-fills all form fields using Claude.

**Architecture:** New API route `POST /api/ai/scrape` fetches HTML, strips to text, sends to Claude for structured extraction. Step 1 UI gets a URL input + Import button that calls this route and merges results into `formData` via the existing `updateFormData` callback.

**Tech Stack:** Next.js API route, Anthropic SDK (already installed), existing `ProgramFormData` type

**Spec:** `docs/superpowers/specs/2026-03-18-url-scrape-import-design.md`

---

### Task 1: Create the scrape API route

**Files:**
- Create: `app/api/ai/scrape/route.ts`

This route handles URL validation, HTML fetching, text extraction, Claude-based field extraction, and response validation. Follow the pattern in `app/api/ai/generate/route.ts` for Anthropic SDK usage.

- [ ] **Step 1: Create `app/api/ai/scrape/route.ts` with full implementation**

```typescript
import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "[::1]",
];

const BLOCKED_IP_PREFIXES = [
  "10.",
  "172.16.", "172.17.", "172.18.", "172.19.",
  "172.20.", "172.21.", "172.22.", "172.23.",
  "172.24.", "172.25.", "172.26.", "172.27.",
  "172.28.", "172.29.", "172.30.", "172.31.",
  "192.168.",
  "169.254.",
  "0.",
];

function isBlockedUrl(hostname: string): boolean {
  if (BLOCKED_HOSTNAMES.includes(hostname)) return true;
  return BLOCKED_IP_PREFIXES.some((prefix) => hostname.startsWith(prefix));
}

function stripHtml(html: string): string {
  // Remove script and style tags and their content
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, " ");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function truncateText(text: string, maxLength: number = 50000): string {
  if (text.length <= maxLength) return text;
  const keepStart = Math.floor(maxLength * 0.7);
  const keepEnd = Math.floor(maxLength * 0.3);
  const start = text.substring(0, keepStart);
  const end = text.substring(text.length - keepEnd);
  return start + "\n\n[... content truncated ...]\n\n" + end;
}

const VALID_TERMS = ["fall", "spring", "summer", "academic_year", "year_round"];
const VALID_EDUCATION_LEVELS = ["freshman", "sophomore", "junior", "senior", "graduate"];

function normalizeTerms(terms: unknown): string[] {
  if (!Array.isArray(terms)) return [];
  return terms
    .map((t) => {
      if (typeof t !== "string") return null;
      const lower = t.toLowerCase().replace(/[\s-]+/g, "_");
      if (VALID_TERMS.includes(lower)) return lower;
      // Fuzzy match common variations
      if (lower.includes("fall")) return "fall";
      if (lower.includes("spring")) return "spring";
      if (lower.includes("summer")) return "summer";
      if (lower.includes("year") && lower.includes("round")) return "year_round";
      if (lower.includes("academic") || lower.includes("full_year")) return "academic_year";
      return null;
    })
    .filter((t): t is string => t !== null);
}

function normalizeEducationLevels(levels: unknown): string[] {
  if (!Array.isArray(levels)) return [];
  return levels
    .map((l) => {
      if (typeof l !== "string") return null;
      const lower = l.toLowerCase();
      if (VALID_EDUCATION_LEVELS.includes(lower)) return lower;
      if (lower.includes("fresh")) return "freshman";
      if (lower.includes("soph")) return "sophomore";
      if (lower.includes("junior")) return "junior";
      if (lower.includes("senior")) return "senior";
      if (lower.includes("grad") || lower.includes("master") || lower.includes("phd") || lower.includes("doctoral"))
        return "graduate";
      return null;
    })
    .filter((l): l is string => l !== null);
}

function validateAndCleanFields(fields: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  // String fields
  const stringFields = [
    "title", "provider", "hostInstitution", "city", "country", "duration",
    "ageRequirement", "description", "cost", "applicationDeadline",
    "contactEmail", "contactPhone", "applyUrl", "housingType",
    "languageOfInstruction", "creditsAvailable", "providerLogo",
    "coverImage",
  ];
  for (const key of stringFields) {
    if (typeof fields[key] === "string" && (fields[key] as string).trim()) {
      cleaned[key] = (fields[key] as string).trim();
    }
  }

  // Array of strings fields
  const arrayFields = [
    "eligibleNationalities", "whatsIncluded", "subjectAreas", "highlights", "photos",
  ];
  for (const key of arrayFields) {
    if (Array.isArray(fields[key])) {
      const filtered = (fields[key] as unknown[]).filter(
        (item): item is string => typeof item === "string" && item.trim() !== ""
      );
      if (filtered.length > 0) cleaned[key] = filtered;
    }
  }

  // Enum fields with normalization
  const terms = normalizeTerms(fields.terms);
  if (terms.length > 0) cleaned.terms = terms;

  const educationLevels = normalizeEducationLevels(fields.educationLevels);
  if (educationLevels.length > 0) cleaned.educationLevels = educationLevels;

  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // Validate URL
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please enter a valid website URL" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid website URL" },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Please enter a valid website URL" },
        { status: 400 }
      );
    }

    if (isBlockedUrl(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "That URL can't be accessed" },
        { status: 400 }
      );
    }

    // Fetch the page
    let html: string;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GoAbroadBot/1.0)",
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(
          { error: "We couldn't reach that website. Check the URL and try again." },
          { status: 400 }
        );
      }
      html = await response.text();
    } catch (err: any) {
      if (err.name === "AbortError") {
        return NextResponse.json(
          { error: "We couldn't reach that website. Check the URL and try again." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "We couldn't reach that website. Check the URL and try again." },
        { status: 400 }
      );
    }

    // Strip HTML and truncate
    const text = truncateText(stripHtml(html));

    if (text.length < 100) {
      return NextResponse.json(
        { error: "We didn't find program information on that page. Try a specific program page." },
        { status: 400 }
      );
    }

    // Extract fields using Claude
    const systemPrompt = `You are a data extraction specialist. You extract study abroad program information from website content and return it as structured JSON.

You MUST return ONLY a valid JSON object. No markdown, no explanation, no code blocks.

Only include fields where the information is clearly present in the content. Omit fields where info is ambiguous or absent.`;

    const userPrompt = `Extract study abroad program information from this website content and return a JSON object with these fields:

String fields (include only if found):
- title: program name/title
- provider: the organization or company running the program
- hostInstitution: the local university or institution
- city: program city
- country: program country
- duration: program length (e.g. "8 weeks", "1 semester")
- ageRequirement: any age requirements mentioned
- description: program description (2-4 paragraphs)
- cost: program cost/tuition (include currency symbol)
- applicationDeadline: application deadline
- contactEmail: contact email address
- contactPhone: contact phone number
- applyUrl: application URL
- housingType: type of housing (e.g. "Shared Apartment", "Host Family", "Dormitory")
- languageOfInstruction: language of instruction
- creditsAvailable: academic credits available
- coverImage: a main/hero image URL found on the page (must be an absolute URL starting with https://; resolve relative paths using the page's base URL: ${url})
- providerLogo: a logo image URL found on the page (must be an absolute URL starting with https://; resolve relative paths using the page's base URL: ${url})

Array fields (include only if found):
- terms: program terms, each must be EXACTLY one of: "fall", "spring", "summer", "academic_year", "year_round"
- educationLevels: eligible education levels, each must be EXACTLY one of: "freshman", "sophomore", "junior", "senior", "graduate"
- eligibleNationalities: list of eligible nationalities/countries
- whatsIncluded: list of what's included in the program
- subjectAreas: list of academic subject areas
- highlights: list of program highlights or features
- photos: array of image URLs found on the page (must be absolute URLs starting with https://; resolve relative paths using the page's base URL: ${url})

Website content:
${text}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("AI did not return text");
    }

    const jsonText = content.text.trim();
    const cleanedJson = jsonText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    const rawFields = JSON.parse(cleanedJson);
    const fields = validateAndCleanFields(rawFields);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "We didn't find program information on that page. Try a specific program page." },
        { status: 400 }
      );
    }

    return NextResponse.json({ fields });
  } catch (err: any) {
    console.error("Scrape Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to extract program information" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify the route compiles**

Run: `npx next lint --file app/api/ai/scrape/route.ts` or just start the dev server and check for errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/ai/scrape/route.ts
git commit -m "feat: add POST /api/ai/scrape route for URL import"
```

---

### Task 2: Add URL import UI to Step 1

**Files:**
- Modify: `app/admin/create-listing/_components/Step1BasicInfo.tsx`

Add a URL input with an "Import" button above the existing form fields. The `onChange` prop already accepts `Partial<ProgramFormData>` so we can pass all extracted fields through it.

- [ ] **Step 1: Update Step1BasicInfo props to accept `onImport` callback**

The component needs a new prop for importing scraped data across all steps. Since `onChange` on Step1 is typed as `Partial<Step1Data>`, we need a separate callback for the full form import. Looking at `page.tsx:289`, `onChange={updateFormData}` is already `Partial<ProgramFormData>`, so in practice it works — but to be clean, add a dedicated `onImport` prop.

Update the `Step1BasicInfoProps` interface and component in `app/admin/create-listing/_components/Step1BasicInfo.tsx`:

```typescript
// At top, add useState import:
import { useEffect, useRef, useState } from "react";

// Update the interface:
interface Step1BasicInfoProps {
  data: Step1Data;
  onChange: (data: Partial<Step1Data>) => void;
  onImport: (data: Record<string, any>) => void;
  formData: Record<string, any>;
}
```

- [ ] **Step 2: Add the URL import section to the component JSX**

Insert a URL import block between the `<AIGenerateButton>` and the form fields `<div className="space-y-4">`. Place it after the description paragraph and before `<AIGenerateButton>`.

```tsx
export default function Step1BasicInfo({ data, onChange, onImport, formData }: Step1BasicInfoProps) {
  const slugManuallyEdited = useRef(data.slug !== "" && data.slug !== generateSlug(data.title));
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  // ... existing useEffect and handlers ...

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

      const data = await res.json();

      if (!res.ok) {
        setImportError(data.error || "Failed to import program information");
        return;
      }

      if (data.fields && Object.keys(data.fields).length > 0) {
        onImport(data.fields);
        setImportUrl("");
      } else {
        setImportError("No program information found on that page.");
      }
    } catch {
      setImportError("Something went wrong. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  // In JSX, add between the description <p> and <AIGenerateButton>:
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
            {isImporting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Importing...
              </>
            ) : (
              "Import"
            )}
          </button>
        </div>
        {importError && (
          <p className="mt-2 text-sm text-red-600">{importError}</p>
        )}
      </div>

      <AIGenerateButton step={1} formData={formData} onGenerated={onChange} />

      {/* ... rest of existing form fields unchanged ... */}
    </div>
  );
}
```

- [ ] **Step 3: Update `page.tsx` to pass `onImport` prop to Step1**

In `app/admin/create-listing/page.tsx`, update the Step1 render (around line 282):

```tsx
// Change from:
<Step1BasicInfo
  data={{
    title: formData.title,
    provider: formData.provider,
    hostInstitution: formData.hostInstitution,
    slug: formData.slug,
  }}
  onChange={updateFormData}
  formData={formData}
/>

// Change to:
<Step1BasicInfo
  data={{
    title: formData.title,
    provider: formData.provider,
    hostInstitution: formData.hostInstitution,
    slug: formData.slug,
  }}
  onChange={updateFormData}
  onImport={updateFormData}
  formData={formData}
/>
```

Both `onChange` and `onImport` use `updateFormData` — they're the same function, but having separate props makes the Step1 interface explicit about the two different use cases.

- [ ] **Step 4: Verify the app compiles and renders correctly**

Run: `npm run dev` and navigate to `/admin/create-listing`. Verify:
- URL input appears at the top of Step 1
- Import button is disabled when input is empty
- Form fields still work normally

- [ ] **Step 5: Manual test with a real URL**

Paste a university study abroad program page URL, click Import, and verify:
- Loading spinner shows during scrape
- Fields get populated across Step 1
- Navigate to Steps 2-7 and confirm those fields are also populated
- Error messages show for invalid URLs

- [ ] **Step 6: Commit**

```bash
git add app/admin/create-listing/_components/Step1BasicInfo.tsx app/admin/create-listing/page.tsx
git commit -m "feat: add URL import to Step 1 for auto-filling program fields"
```

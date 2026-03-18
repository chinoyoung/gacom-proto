import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "::1",
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
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, " ");
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

function isValidHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function validateAndCleanFields(fields: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  const stringFields = [
    "title", "provider", "hostInstitution", "city", "country", "duration",
    "ageRequirement", "description", "cost", "applicationDeadline",
    "contactEmail", "contactPhone", "applyUrl", "housingType",
    "languageOfInstruction", "creditsAvailable",
  ];
  for (const key of stringFields) {
    if (typeof fields[key] === "string" && (fields[key] as string).trim()) {
      cleaned[key] = (fields[key] as string).trim();
    }
  }

  if (typeof fields.coverImage === "string" && isValidHttpsUrl(fields.coverImage)) {
    cleaned.coverImage = fields.coverImage.trim();
  }
  if (typeof fields.providerLogo === "string" && isValidHttpsUrl(fields.providerLogo)) {
    cleaned.providerLogo = fields.providerLogo.trim();
  }

  const arrayFields = [
    "eligibleNationalities", "whatsIncluded", "subjectAreas", "highlights",
  ];
  for (const key of arrayFields) {
    if (Array.isArray(fields[key])) {
      const filtered = (fields[key] as unknown[]).filter(
        (item): item is string => typeof item === "string" && item.trim() !== ""
      );
      if (filtered.length > 0) cleaned[key] = filtered;
    }
  }

  if (Array.isArray(fields.photos)) {
    const validPhotos = (fields.photos as unknown[]).filter(
      (item): item is string => typeof item === "string" && isValidHttpsUrl(item)
    );
    if (validPhotos.length > 0) cleaned.photos = validPhotos;
  }

  const terms = normalizeTerms(fields.terms);
  if (terms.length > 0) cleaned.terms = terms;

  const educationLevels = normalizeEducationLevels(fields.educationLevels);
  if (educationLevels.length > 0) cleaned.educationLevels = educationLevels;

  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

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

    let html: string;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let fetchResponse: Response;
      try {
        fetchResponse = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; GoAbroadBot/1.0)",
          },
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!fetchResponse!.ok) {
        return NextResponse.json(
          { error: "We couldn't reach that website. Check the URL and try again." },
          { status: 400 }
        );
      }
      html = await fetchResponse!.text();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
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

    const text = truncateText(stripHtml(html));

    if (text.length < 100) {
      return NextResponse.json(
        { error: "We didn't find program information on that page. Try a specific program page." },
        { status: 400 }
      );
    }

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
- coverImage: a main/hero image URL found on the page (must be an absolute URL starting with https://; resolve relative paths using the page's base URL: ${parsedUrl.origin})
- providerLogo: a logo image URL found on the page (must be an absolute URL starting with https://; resolve relative paths using the page's base URL: ${parsedUrl.origin})

Array fields (include only if found):
- terms: program terms, each must be EXACTLY one of: "fall", "spring", "summer", "academic_year", "year_round"
- educationLevels: eligible education levels, each must be EXACTLY one of: "freshman", "sophomore", "junior", "senior", "graduate"
- eligibleNationalities: list of eligible nationalities/countries
- whatsIncluded: list of what's included in the program
- subjectAreas: list of academic subject areas
- highlights: list of program highlights or features
- photos: array of image URLs found on the page (must be absolute URLs starting with https://; resolve relative paths using the page's base URL: ${parsedUrl.origin})

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
    const cleanedJson = jsonText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let rawFields: Record<string, unknown>;
    try {
      rawFields = JSON.parse(cleanedJson);
    } catch {
      return NextResponse.json(
        { error: "We couldn't extract program information from that page." },
        { status: 422 }
      );
    }

    const fields = validateAndCleanFields(rawFields);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "We didn't find program information on that page. Try a specific program page." },
        { status: 400 }
      );
    }

    return NextResponse.json({ fields });
  } catch (err: unknown) {
    console.error("Scrape Error:", err);
    return NextResponse.json(
      { error: "Failed to extract program information" },
      { status: 500 }
    );
  }
}

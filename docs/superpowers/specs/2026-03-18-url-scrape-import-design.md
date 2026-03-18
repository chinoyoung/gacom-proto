# URL Scrape Import for Create Listing

**Date:** 2026-03-18
**Status:** Approved

## Problem

Users creating study abroad program listings must manually enter all fields across 8 form steps. When the program info already exists on a university/provider website, this is tedious and error-prone.

## Solution

Add a URL input to Step 1 of the create listing form. When a user pastes a university/provider URL and clicks "Import", the system fetches the page, extracts relevant program information using Claude, and pre-fills all available form fields across Steps 1-7.

## Architecture

### New API Route: `POST /api/ai/scrape`

**Request:** `{ url: string }`

**Processing:**
1. Validate URL format (must be http/https, reject private/internal IPs to prevent SSRF)
2. Fetch the page HTML server-side via `fetch()` with a timeout (10s)
3. Strip scripts, styles, and non-content elements to extract meaningful text
4. Truncate to ~50K characters if needed (keep top 70% + bottom 30% for head/footer coverage)
5. Send extracted text to Claude with a structured prompt that maps content to `ProgramFormData` fields
6. Validate Claude's JSON response against expected field types (strings are strings, arrays are arrays)
7. Normalize enum fields (e.g., map "Fall 2026" to "Fall", reject unrecognized values)

**Response:** `{ fields: Partial<ProgramFormData> }` — same field names as the existing form data shape. Only includes fields where information was found.

**Why a separate route (not extending `/api/ai/generate`):**
- Different input (URL vs. step number + existing data)
- Different concern (scraping/extraction vs. mock data generation)
- Keeps each route focused and testable

### Step 1 UI Change

Add a URL input group at the top of `Step1BasicInfo.tsx`:
- Text input with placeholder (e.g., "Paste a program URL to auto-fill...")
- "Import" button next to it
- Loading state: button shows spinner, form inputs disabled during scrape
- Success: merge extracted fields into `formData` via `updateFormData()`
- Error: inline error message below the input, form remains editable

### Data Flow

```
User pastes URL -> clicks Import
  -> POST /api/ai/scrape { url }
  -> Server fetches HTML -> strips to text
  -> Claude extracts fields -> returns JSON
  -> Client merges into formData (only non-empty fields)
  -> User sees Step 1 populated, continues through steps with other fields pre-filled
```

### Claude Prompt Strategy

The prompt instructs Claude to extract and map website content to these form fields:

- **Step 1:** title, provider, hostInstitution
- **Step 2:** city, country, terms, duration
- **Step 3:** educationLevels, eligibleNationalities, ageRequirement
- **Step 4:** description, whatsIncluded
- **Step 5:** subjectAreas, highlights
- **Step 6:** cost, applicationDeadline, contactEmail, contactPhone, applyUrl, housingType, languageOfInstruction, creditsAvailable
- **Step 7:** coverImage, photos, providerLogo (image URLs found on the page)

Fields use the same enum values defined in the Convex schema (e.g., terms from "fall", "spring", "summer", "academic_year", "year_round"; educationLevels from "freshman", "sophomore", "junior", "senior", "graduate").

Return only fields where information is clearly present. Omit fields where information is ambiguous or absent.

### Security

- **SSRF protection:** Validate URL before fetching — only allow http/https, block private IP ranges (127.x, 10.x, 192.168.x, 169.254.x, localhost)
- **Fetch timeout:** 10 second timeout to prevent hanging on slow/unresponsive servers

### Error Messages

- Invalid URL format: "Please enter a valid website URL"
- Private/internal URL: "That URL can't be accessed"
- Unreachable/timeout: "We couldn't reach that website. Check the URL and try again."
- No relevant data found: "We didn't find program information on that page. Try a specific program page."

### Edge Cases

- **Invalid/unreachable URL:** Return error message, form stays editable
- **Page has no relevant info:** Return empty fields object, form stays blank
- **Partial info:** Fill what's available, leave rest blank for manual entry
- **User already typed data:** Scraped data overwrites (acceptable since this is Step 1, early in the flow)
- **JS-rendered pages:** Server-side fetch won't capture JS content; known limitation, most university sites are server-rendered
- **Very large pages:** Truncate extracted text (top 70% + bottom 30%) to ~50K characters
- **Claude returns invalid data:** Validate response types, drop invalid enum values silently

### Files Changed

- **New:** `app/api/ai/scrape/route.ts` — scrape + extract API route
- **Modified:** `app/admin/create-listing/_components/Step1BasicInfo.tsx` — add URL input + import button

### Files Not Changed

- Convex schema, mutations, or queries
- Steps 2-8 components (they already read from `formData`)
- Existing `/api/ai/generate` route
- Main create-listing `page.tsx` (updateFormData already supports partial updates)

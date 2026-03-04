import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { step, existingData } = await req.json();

        let systemPrompt = `You are a study abroad program content specialist. Generate realistic, compelling content for a GoAbroad.com program listing.
      You MUST return ONLY a valid JSON object. No markdown, no explanation, no apology tags.
      Context from the admin so far: ${JSON.stringify(existingData || {})}
    `;

        let stepInstructions = "";
        let fieldList = "";

        switch (step) {
            case 0:
                fieldList = "ALL fields (title, provider, tagline, hostInstitution, slug, city, country, terms, duration, educationLevels, eligibleNationalities, ageRequirement, description, whatsIncluded, subjectAreas, highlights, cost, applicationDeadline, contactEmail, contactPhone, applyUrl, housingType, languageOfInstruction, creditsAvailable, coverImage, photos)";
                stepInstructions = "Generate a complete, realistic study abroad program listing with all fields filled. Ensure high quality for the description and highlights. terms must be an array from ['fall', 'spring', 'summer', 'academic_year', 'year_round']. educationLevels must be an array from ['freshman', 'sophomore', 'junior', 'senior', 'graduate']. Suggest relevant Unsplash photo URLs for coverImage and photos array.";
                break;
            case 1:
                fieldList = "{ title, provider, tagline, hostInstitution, slug }";
                stepInstructions = "Generate a compelling program title and tagline. If provider is given, suggest a title that fits. Auto-generate the URL slug based on the title.";
                break;
            case 2:
                fieldList = "{ city, country, terms, duration }";
                stepInstructions = "Based on the program title and provider, suggest a realistic location. Terms must be an array of strings from: ['fall', 'spring', 'summer', 'academic_year', 'year_round']. Suggest a typical duration.";
                break;
            case 3:
                fieldList = "{ educationLevels, eligibleNationalities, ageRequirement }";
                stepInstructions = "Suggest typical eligibility criteria. educationLevels must be an array from: ['freshman', 'sophomore', 'junior', 'senior', 'graduate']. eligibleNationalities should be an array of country names.";
                break;
            case 4:
                fieldList = "{ description, whatsIncluded }";
                stepInstructions = "Write a detailed, engaging 200-400 word description. Suggest 5-8 inclusions for the whatsIncluded array.";
                break;
            case 5:
                fieldList = "{ subjectAreas, highlights }";
                stepInstructions = "Suggest relevant academic subjects for subjectAreas (array) and 4-6 compelling highlights (array of strings).";
                break;
            case 6:
                fieldList = "{ cost, applicationDeadline, contactEmail, contactPhone, applyUrl, housingType, languageOfInstruction, creditsAvailable }";
                stepInstructions = "Suggest realistic pricing ($), application deadline, contact email, contact phone, and application URL. housingType: shared apt/host family/etc. language: English/Local/etc. credits: typical semester credits.";
                break;
            case 7:
                fieldList = "{ coverImage, photos }";
                stepInstructions = "Suggest a relevant, high-quality Unsplash image URL for the coverImage and an array of 3-5 additional high-quality Unsplash image URLs for the photos array. Ensure they are based on the program's location and theme. Example: https://images.unsplash.com/photo-XXX?auto=format&fit=crop&q=80&w=1200";
                break;
            case "article":
                fieldList = "{ title, author, tags, coverImage }";
                stepInstructions = "Generate a compelling study abroad article title, a professional author or report name (e.g., 'GoAbroad Research Team'), 1-2 relevant tags, and a high-quality Unsplash cover image URL. The content should be inspiring and informative.";
                break;
            default:
                return NextResponse.json({ error: "Invalid step" }, { status: 400 });
        }

        const prompt = `${systemPrompt}
      You MUST return a JSON object with ONLY these fields: ${fieldList}.
      Task: ${stepInstructions}
    `;

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: "user", content: prompt }],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error("AI did not return text");
        }

        const jsonText = content.text.trim();
        // Sometimes Claude wraps JSON in code blocks
        const cleanedJson = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
        const fields = JSON.parse(cleanedJson);

        return NextResponse.json({ fields });
    } catch (err: any) {
        console.error("AI Generation Error:", err);
        return NextResponse.json({ error: err.message || "Failed to generate content" }, { status: 500 });
    }
}

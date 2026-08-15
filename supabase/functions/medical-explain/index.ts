import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are a medical communication assistant. Your job is to help patients understand medical reports and doctor's notes by converting complex medical language into plain, simple English that anyone can understand.

Given a medical text, you must return a JSON object with this exact structure:
{
  "plain_summary": "A complete rewrite of the medical text in simple, everyday language. Use short sentences. Avoid all medical jargon. Be reassuring but accurate. Do not add medical advice beyond what is in the text.",
  "jargon_terms": [
    { "term": "the original medical word or phrase", "explanation": "a simple one-sentence explanation of what this term means" }
  ],
  "confidence_level": "high" | "medium" | "low",
  "confidence_note": "A brief note about what the patient should double-check with their doctor. One or two sentences."
}

Rules:
1. The plain_summary should be a full rewrite, not just a word swap. Make it read naturally.
2. List every difficult medical term you found in jargon_terms, even abbreviations.
3. confidence_level should be "high" if the text is straightforward, "medium" if there are some complex terms, and "low" if the text is very technical or ambiguous.
4. confidence_note should tell the patient what to ask their doctor about.
5. Never give your own medical advice. Only simplify what is written.
6. Return ONLY the JSON object, no other text.`;

interface ExplainRequest {
  text: string;
  language?: string;
}

interface JargonTerm {
  term: string;
  explanation: string;
}

interface ExplainResponse {
  plain_summary: string;
  jargon_terms: JargonTerm[];
  confidence_level: 'high' | 'medium' | 'low';
  confidence_note: string;
  source: 'ai';
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function buildTranslationPrompt(languageCode: string): string {
  const languageMap: Record<string, string> = {
    hi: 'Hindi',
    es: 'Spanish',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    ar: 'Arabic',
    fr: 'French',
  };
  const langName = languageMap[languageCode] || 'English';
  if (languageCode === 'en') return '';
  return `\n\nAlso, translate the plain_summary into ${langName} and put it in a field called "translated_summary". Keep the jargon_terms explanations in English. Keep the same JSON structure but add the "translated_summary" field.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { text, language = 'en' }: ExplainRequest = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Medical text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Text is too long. Please limit to 10,000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");

    if (!groqKey) {
      return new Response(
        JSON.stringify({ error: "AI service is not configured. Using fallback mode.", fallback: true }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const translationPrompt = buildTranslationPrompt(language);
    const userPrompt = `Please explain this medical text in plain language:\n\n"${text}"${translationPrompt}`;

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Groq API error:", response.status, errBody);
      return new Response(
        JSON.stringify({ error: "The AI service encountered an error. Please try again.", fallback: true }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No response from AI service. Please try again.", fallback: true }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: ExplainResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse AI response");
      }
    }

    if (!parsed.plain_summary || typeof parsed.plain_summary !== 'string') {
      return new Response(
        JSON.stringify({ error: "Received an incomplete response. Please try again.", fallback: true }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result: ExplainResponse = {
      plain_summary: parsed.plain_summary,
      jargon_terms: Array.isArray(parsed.jargon_terms) ? parsed.jargon_terms : [],
      confidence_level: parsed.confidence_level || 'medium',
      confidence_note: parsed.confidence_note || 'Please discuss these results with your doctor.',
      source: 'ai',
    };

    if (language !== 'en' && (parsed as Record<string, unknown>).translated_summary) {
      (result as Record<string, unknown>).translated_summary = (parsed as Record<string, unknown>).translated_summary;
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again.", fallback: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

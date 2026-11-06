const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Owner-Id",
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const PAGE_COUNT = 10;

const THEME_PROMPTS: Record<string, string> = {
  space: "a space adventure with rockets, glowing planets, and friendly aliens",
  dino: "a prehistoric dino world with gentle giant dinosaurs, ferns, and hidden valleys",
  forest: "a magic forest with sparkling fairies, glowing mushrooms, and secret paths",
  jungle: "a jungle safari with friendly lions, playful monkeys, and hidden waterfalls",
};

interface StoryInput {
  name: string;
  age: number;
  gender: "boy" | "girl";
  themeId: string;
}

interface StoryDraft {
  text: string;
}

interface StoryResult {
  title: string;
  pages: StoryDraft[];
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseInput(value: unknown): StoryInput | null {
  if (typeof value !== "object" || value === null) return null;
  const { name, age, gender, themeId } = value as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 40) return null;
  if (typeof age !== "number" || !Number.isInteger(age) || age < 2 || age > 10) return null;
  if (gender !== "boy" && gender !== "girl") return null;
  if (typeof themeId !== "string" || !Object.hasOwn(THEME_PROMPTS, themeId)) return null;
  return { name: name.trim(), age, gender, themeId };
}

function buildStoryPrompt(input: StoryInput): string {
  const pronoun = input.gender === "boy" ? "boy" : "girl";
  return [
    `Write a high-quality, engaging, full 10-page children's story where the main character is named ${input.name}, age ${input.age}, gender ${pronoun}, matching the selected theme: ${THEME_PROMPTS[input.themeId]}.`,
    `You must return exactly 10 distinct sequential pages.`,
    "Each page has two short, gentle sentences that calm a sleepy child, and the last page ends with a cozy goodnight.",
    "Also provide a short, enchanting title for the story.",
    `Output format must strictly be a JSON object containing: {"title": "string", "pages": [{"page_number": 1, "text": "string"}, ... {"page_number": 10, "text": "string"}]} containing exactly 10 pages.`,
  ].join(" ");
}

function isStoryDraftList(value: unknown): value is StoryDraft[] {
  return (
    Array.isArray(value) &&
    value.length === PAGE_COUNT &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StoryDraft).text === "string",
    )
  );
}

function isStoryResult(value: unknown): value is StoryResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== "string" || v.title.trim().length === 0) return false;
  return isStoryDraftList(v.pages);
}

async function requestStoryResult(input: StoryInput, apiKey: string): Promise<StoryResult> {
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You write warm, gentle bedtime stories for young children." },
        { role: "user", content: buildStoryPrompt(input) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`OpenAI returned status ${response.status}`);

  const data: unknown = await response.json();
  const content = (data as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("OpenAI response had no content");

  const parsed: unknown = JSON.parse(content);
  if (!isStoryResult(parsed)) throw new Error("OpenAI response had an unexpected shape");
  return parsed;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) return json({ error: "Story generation is not configured" }, 503);

    const input = parseInput(await req.json());
    if (!input) return json({ error: "Invalid story details" }, 400);

    const result = await requestStoryResult(input, openAiKey);

    const pages = result.pages.map((draft) => ({
      text: draft.text,
      imageUrl: null as string | null,
    }));

    return json({ title: result.title, pages }, 200);
  } catch (error) {
    console.error("Story generation failed", error);
    return json({ error: "Story generation failed" }, 500);
  }
});

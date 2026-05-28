import { env } from "../config/env.js";

type AssistPayload = {
  businessType: string;
  goal: string;
  tone?: string;
};

type AssistantResult = {
  content: string;
  provider: "openai" | "template";
};

function buildPrompt(payload: AssistPayload) {
  const tone = payload.tone?.trim() || "professional and friendly";

  return [
    "You are an expert small-business marketing assistant.",
    "Write one short social media post (max 140 words).",
    "Output plain text only, no markdown, no hashtags unless naturally relevant.",
    `Business type: ${payload.businessType}`,
    `Goal: ${payload.goal}`,
    `Tone: ${tone}`,
  ].join("\n");
}

function buildTemplate(payload: AssistPayload) {
  const tone = payload.tone?.trim() || "professional and friendly";
  return `Hi everyone! We are excited to share an update from our ${payload.businessType} business. ${payload.goal}. We are focused on delivering real value with a ${tone} approach. Message us to learn more.`;
}

async function generateWithOpenAI(prompt: string): Promise<string | null> {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You write concise, high-converting marketing copy for small businesses.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content?.trim();

  return content || null;
}

export const assistantService = {
  async generatePost(payload: AssistPayload): Promise<AssistantResult> {
    const prompt = buildPrompt(payload);
    const aiContent = await generateWithOpenAI(prompt);

    if (aiContent) {
      return { content: aiContent, provider: "openai" };
    }

    return { content: buildTemplate(payload), provider: "template" };
  },
};

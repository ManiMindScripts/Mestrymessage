import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {
  try {
    const prompt = "Create a short story about a robot and a cat.";

    const result = streamText({
      model: openai("gpt-4o"),
      prompt, // ✅ using direct prompt instead of messages
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

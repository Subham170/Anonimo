import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
    });

    return new Response(JSON.stringify({ success: true, output: result.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OpenAI generateText error", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong while generating response.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

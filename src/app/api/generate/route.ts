import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { prompt, model, openaiApiKey } = await req.json();

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a professional proposal writer. Write a detailed and well-structured proposal based on the requirements provided.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const proposal = response.choices[0]?.message?.content;

    if (!proposal) {
      throw new Error("Failed to generate proposal");
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("Error generating proposal:", error);
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}

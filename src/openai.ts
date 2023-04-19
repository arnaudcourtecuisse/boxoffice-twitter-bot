// src/openai.ts

import fetch from "node-fetch";

interface OpenAIResponse {
  choices: {
    text: string;
    index: number;
    logprobs: null;
    finish_reason: string;
  }[];
  created: number;
  model: string;
}

export async function generateTweet(
  prompt: string,
  apiKey: string
): Promise<string> {
  const responseOpenAI = await fetch(
    "https://api.openai.com/v1/engines/davinci-codex/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 50,
        temperature: 0.5,
        n: 1,
        stop: ".",
      }),
    }
  );
  const { choices } = (await responseOpenAI.json()) as OpenAIResponse;
  return choices[0].text.trim();
}

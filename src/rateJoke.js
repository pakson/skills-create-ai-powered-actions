const OpenAI = require("openai");
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");

// Define the structured output format using Zod
const JokeRatingSchema = z.object({
  is_joke: z.boolean().describe("Whether the input is recognized as a joke or attempt at humor"),
  score: z.number().min(0).max(10).nullable().describe("Rating from 0-10, where 0 is not funny at all and 10 is extremely funny. Null if not a joke."),
  humor_type: z.string().nullable().describe("The type of humor (e.g., pun, dark humor, slapstick), or null if not a joke"),
  feedback: z.string().nullable().describe("Short feedback on the joke's strengths and weaknesses, or null if not a joke")
});

async function rateJoke(joke, token) {
  const endpoint = "https://models.github.ai/inference";
  
  // Initialize the OpenAI client with the custom endpoint and token
  const client = new OpenAI({
    baseURL: endpoint,
    apiKey: token
  });

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that evaluates jokes. Assess whether the input is actually a joke, and if so, rate its humor quality, creativity, and delivery.",
      },
      {
        role: "user",
        content: `Please rate this joke: "${joke}"`,
      }
    ],
    model: "openai/gpt-4.1-mini",
    response_format: zodResponseFormat(JokeRatingSchema, "joke_rating"),
  });

  return response.choices[0]?.message?.parsed;
}

module.exports = { rateJoke };
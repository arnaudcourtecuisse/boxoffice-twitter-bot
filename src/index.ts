import dotenv from "dotenv";
import fetch from "node-fetch";
import Twitter from "twitter-lite";

// Load environment variables from .env file
dotenv.config();

// Define interface for OpenAI API response
interface OpenAIResponse {
  choices: {
    text: string;
  }[];
}

// Fetch top movie from IMDb RSS feed
const fetchTopMovie = async (): Promise<string> => {
  const response = await fetch("https://www.imdb.com/chart/top?ref_=nv_mv_250");
  const data = await response.text();
  const movieRegex = /<td class="titleColumn">\d+\.\s<a.*?>(.*?)<\/a>/;
  const result = movieRegex.exec(data);
  if (!result) {
    throw new Error("Could not find top movie on IMDb");
  }
  return result[1];
};

// Call OpenAI API to generate tweet text based on movie
const generateTweet = async (movie: string): Promise<string> => {
  const prompt = `Write a tweet about the movie "${movie}".`;
  const responseOpenAI = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      temperature: 0.7,
      max_tokens: 50,
      n: 1,
      stop: "\n",
    }),
  });
  const responseData: OpenAIResponse = await responseOpenAI.json();
  const { choices } = responseData;
  return choices[0].text.trim();
};

// Post tweet using Twitter API
const postTweet = async (status: string): Promise<void> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
  await client.post("statuses/update", {
    status,
  });
};

// Main function
const main = async (): Promise<void> => {
  try {
    const movie = await fetchTopMovie();
    const tweet = await generateTweet(movie);
    await postTweet(tweet);
    console.log("Tweet posted successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Call main function
main();

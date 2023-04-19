import fetch from "node-fetch";
import Twitter from "twitter-lite";

interface Movie {
  title: string;
  variation: number;
}

interface MovieFeed {
  feed: {
    top10: Movie[];
  };
}
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

async function fetchBoxOfficeData(): Promise<Movie[]> {
  const response = await fetch("https://api.allocine.fr/alqapibrest2/promo");
  const data = (await response.json()) as MovieFeed;
  return data.feed.top10;
}

async function generateTweet(movie: Movie, apiKey: string): Promise<string> {
  const prompt = `Le film ${movie.title} est ${movie.variation}% plus populaire aujourd'hui que la semaine dernière.`;
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

async function postBoxOfficeTweet() {
  const movies = await fetchBoxOfficeData();
  const movie = movies[Math.floor(Math.random() * movies.length)];
  const tweet = await generateTweet(movie, process.env.OPENAI_API_KEY!);
  const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
  await twitterClient.post("statuses/update", { status: tweet });
}

postBoxOfficeTweet();

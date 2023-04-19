import dotenv from "dotenv";
import fetch from "node-fetch";
import Twitter from "twitter-lite";

dotenv.config();

interface Movie {
  title: string;
  variation: string;
}

async function postBoxOfficeTweet() {
  // Fetch live box office admission data from an API
  const response = await fetch("https://api.allocine.fr/alqapibrest2/promo");
  const data = await response.json();

  // Choose a random movie from the top 10 movies
  const movies = data.feed.top10 as Movie[];
  const movie = movies[Math.floor(Math.random() * movies.length)];

  // Generate a tweet using OpenAI API
  const openaiApiKey = process.env.OPENAI_API_KEY as string;
  const prompt = `Le film ${movie.title} est ${movie.variation}% plus populaire aujourd'hui que la semaine dernière.`;
  const responseOpenAI = await fetch(
    "https://api.openai.com/v1/engines/davinci-codex/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
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
  const { choices } = await responseOpenAI.json();
  const tweet = choices[0].text.trim();

  // Post the tweet to Twitter
  const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY as string,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
  });
  await twitterClient.post("statuses/update", { status: tweet });
}

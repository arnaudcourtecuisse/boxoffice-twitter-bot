import fetch from "node-fetch";
import Twitter from "twitter-lite";

async function postBoxOfficeTweet() {
  // Fetch live box office admission data from an API
  const response1 = await fetch("https://api.allocine.fr/alqapibrest2/promo");
  const data = await response1.json();

  // Choose a random movie from the top 10 movies
  const movies = (data as any).feed.top10;
  const movie = movies[Math.floor(Math.random() * movies.length)];

  // Generate a tweet using OpenAI API
  const openaiApiKey = "YOUR_OPENAI_API_KEY";
  const prompt = `Le film ${movie.title} est ${movie.variation}% plus populaire aujourd'hui que la semaine dernière.`;
  const response2 = await fetch(
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
  const responseData = await response2.json();
  const choices = (responseData as any).choices;
  const tweet = choices[0].text.trim();

  // Post the tweet to Twitter
  const twitterClient = new Twitter({
    consumer_key: "YOUR_CONSUMER_KEY",
    consumer_secret: "YOUR_CONSUMER_SECRET",
    access_token_key: "YOUR_ACCESS_TOKEN_KEY",
    access_token_secret: "YOUR_ACCESS_TOKEN_SECRET",
  });
  await twitterClient.post("statuses/update", { status: tweet });
}

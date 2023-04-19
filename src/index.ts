import dotenv from "dotenv";
import fetch from "node-fetch";
import Twitter from "twitter-lite";

dotenv.config();

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  OPENAI_API_KEY,
} = process.env;

type Movie = {
  title: string;
  summary: string;
  imdb_link: string;
};

type MovieFeed = {
  top10: Movie[];
};

async function getTop10Movies(): Promise<Movie[]> {
  const response = await fetch(
    "https://www.reddit.com/r/movies/top.json?sort=top&t=week&limit=10"
  );
  const data = await response.json();
  const movies = (data as MovieFeed).top10;
  return movies;
}

async function getMoviePlot(movieTitle: string): Promise<string> {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=54d41809&t=${encodeURI(movieTitle)}`
  );
  const data = await response.json();
  return data.Plot;
}

async function generateMoviePlotPrompt(movie: Movie): Promise<string> {
  const plot = await getMoviePlot(movie.title);
  return `Write a plot summary of "${movie.title}", a movie about ${plot}.`;
}

async function generateMoviePlot(): Promise<string> {
  const movies = await getTop10Movies();
  const randomMovie = movies[Math.floor(Math.random() * movies.length)];
  const prompt = await generateMoviePlotPrompt(randomMovie);
  const response = await fetch(
    "https://api.openai.com/v1/engines/davinci-codex/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 100,
        n: 1,
        stop: "\n",
      }),
    }
  );
  const { choices } = await response.json();
  return choices[0].text.trim();
}

async function postTweet(tweet: string): Promise<void> {
  const client = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY!,
    consumer_secret: TWITTER_CONSUMER_SECRET!,
    access_token_key: TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET!,
  });
  await client.post("statuses/update", {
    status: tweet,
  });
}

async function main(): Promise<void> {
  const tweet = await generateMoviePlot();
  await postTweet(tweet);
  console.log("Tweeted:", tweet);
}

main().catch((err) => console.error(err));

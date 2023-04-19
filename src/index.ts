import fetch from "node-fetch";
import Twitter from "twitter-lite";

interface AdmissionData {
  admissions: number; // number of tickets sold for the movie on a given period
  rank: number; // rank of the movie on that period
}
interface Movie {
  title: string;
  releaseDate: string;
  // Admission data on the current day
  liveAdmissions: AdmissionData;
  // Admission data on the same day of the previous week, if it was already released
  admissionsLastWeek: AdmissionData | null;
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
  const variation = movie.admissionsLastWeek
    ? movie.liveAdmissions.admissions / movie.admissionsLastWeek.admissions - 1
    : 1;
  const prompt = `Le film ${movie.title} est ${variation}% plus populaire aujourd'hui que la semaine dernière.`;
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
  const now = new Date();
  const newReleases = movies.filter((movie) => {
    const releaseDate = new Date(movie.releaseDate);
    const daysSinceRelease = Math.floor(
      (now.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24)
    );
    return daysSinceRelease === 0;
  });
  newReleases.sort((a, b) => a.liveAdmissions.rank - b.liveAdmissions.rank);
  if (newReleases.length === 0) {
    console.log("No newly-released movies found.");
    return;
  }
  const movie = newReleases[0];
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

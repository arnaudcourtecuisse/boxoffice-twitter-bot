import { Movie, fetchBoxOfficeData } from "./allocine";
import { generateTweet } from "./openai";
import { postTweet } from "./twitter";

function selectNewlyReleasedMovie(movies: Movie[]): {
  movie: Movie;
  isNew: boolean;
} {
  const now = new Date();
  const newReleases = movies.filter((movie) => {
    const releaseDate = new Date(movie.releaseDate);
    const daysSinceRelease = Math.floor(
      (now.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24)
    );
    return daysSinceRelease === 0;
  });
  if (newReleases.length > 0) {
    newReleases.sort((a, b) => a.liveAdmissions.rank - b.liveAdmissions.rank);
    const movie = newReleases[0];
    return { movie, isNew: true };
  } else {
    const bestRankedMovie = movies.sort(
      (a, b) => a.liveAdmissions.rank - b.liveAdmissions.rank
    )[0];
    return { movie: bestRankedMovie, isNew: false };
  }
}

function generateTweetPrompt(movie: Movie, isNew: boolean): string {
  if (isNew) {
    return `Generate a tweet about the new movie ${movie.title} which is ranked ${movie.liveAdmissions.rank} today. Don't forget to mention Boxoffice Live!`;
  } else {
    return `Generate a tweet about the movie ${movie.title} which is ranked ${movie.liveAdmissions.rank} today. Don't forget to mention Boxoffice Live!`;
  }
}

export async function postBoxOfficeTweet() {
  const { movie, isNew } = selectNewlyReleasedMovie(await fetchBoxOfficeData());

  if (!movie) {
    console.log("No new or best-ranked movies found.");
    return;
  }

  const prompt = generateTweetPrompt(movie, isNew);

  const tweet = await generateTweet(prompt, process.env.OPENAI_API_KEY!);
  await postTweet(tweet, {
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
}

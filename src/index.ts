import { fetchBoxOfficeData } from "./allocine";
import { generateTweet } from "./openai";
import { postTweet } from "./twitter";

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
  const variation = movie.admissionsLastWeek
    ? movie.liveAdmissions.admissions / movie.admissionsLastWeek.admissions - 1
    : 1;
  const prompt =
    "Can you generate a tweet to promote the Boxoffice Live tool and mention that the movie " +
    `${movie.title}" was just released and is currently ranked ${movie.liveAdmissions.rank} at the box office? #BoxofficeLive`;
  const tweet = await generateTweet(prompt, process.env.OPENAI_API_KEY!);
  await postTweet(tweet, {
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
}

postBoxOfficeTweet();

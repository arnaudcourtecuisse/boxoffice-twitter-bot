// src/twitter.ts

import Twitter from "twitter-lite";

export async function postTweet(tweet: string, twitterConfig: any) {
  const twitterClient = new Twitter(twitterConfig);
  await twitterClient.post("statuses/update", { status: tweet });
}

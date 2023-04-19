// src/allocine.ts

import fetch from "node-fetch";

interface AdmissionData {
  admissions: number; // number of tickets sold for the movie on a given period
  rank: number; // rank of the movie on that period
}

export interface Movie {
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

export async function fetchBoxOfficeData(): Promise<Movie[]> {
  const response = await fetch("https://api.allocine.fr/alqapibrest2/promo");
  const data = (await response.json()) as MovieFeed;
  return data.feed.top10;
}

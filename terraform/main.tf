terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.5.0"
    }
  }
}

provider "google" {
  project = "your-project-id"
  region  = "europe-west1"
}

resource "google_storage_bucket" "function_bucket" {
  name = "your-bucket-name"
}

resource "google_cloudfunctions_function" "boxoffice_tweet" {
  name        = "boxoffice-tweet"
  description = "Posts a tweet about the newly released or best ranked movie of the day"

  runtime = "nodejs16"

  source_archive_bucket = google_storage_bucket.function_bucket.name
  source_archive_object = "path/to/your/function.zip"

  entry_point = "postBoxOfficeTweet"

  environment_variables = {
    OPENAI_API_KEY              = "your-openai-api-key"
    TWITTER_CONSUMER_KEY        = "your-twitter-consumer-key"
    TWITTER_CONSUMER_SECRET     = "your-twitter-consumer-secret"
    TWITTER_ACCESS_TOKEN_KEY    = "your-twitter-access-token-key"
    TWITTER_ACCESS_TOKEN_SECRET = "your-twitter-access-token-secret"
  }

  trigger_http = true

  available_memory_mb = 256

  timeout = "60s"
}

resource "google_cloud_scheduler_job" "boxoffice_tweet_schedule" {
  name        = "boxoffice-tweet-schedule"
  description = "Schedule boxoffice-tweet function to run every hour on Wednesdays between 10am and 11pm CET"
  schedule    = "0 * * * 3"
  time_zone   = "CET"

  job_target {
    project_id = google_cloudfunctions_function.boxoffice_tweet.project
    region     = google_cloudfunctions_function.boxoffice_tweet.region
    type       = "cloud_function"
    name       = google_cloudfunctions_function.boxoffice_tweet.name
  }
}

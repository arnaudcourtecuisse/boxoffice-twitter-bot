provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_scheduler_job" "post_box_office_tweet_job" {
  name      = "post-box-office-tweet-job"
  schedule  = "0 9-22 * * 3"
  time_zone = "Europe/Paris"

  http_target {
    http_method = "POST"
    uri         = google_cloud_functions_function.post_box_office_tweet.https_trigger_url
  }
}

resource "google_cloud_functions_function" "post_box_office_tweet" {
  name                = "post-box-office-tweet"
  description         = "Posts a tweet about the latest box office movie using OpenAI and Twitter APIs"
  runtime             = "nodejs16"
  timeout             = "60"
  available_memory_mb = 128

  source_archive_bucket = google_storage_bucket.post_box_office_tweet_bucket.name
  source_archive_object = google_storage_bucket_object.post_box_office_tweet_object.name

  environment_variables = {
    TWITTER_CONSUMER_KEY        = var.twitter_consumer_key
    TWITTER_CONSUMER_SECRET     = var.twitter_consumer_secret
    TWITTER_ACCESS_TOKEN_KEY    = var.twitter_access_token_key
    TWITTER_ACCESS_TOKEN_SECRET = var.twitter_access_token_secret
    OPENAI_API_KEY              = var.openai_api_key
  }
}

resource "google_storage_bucket" "post_box_office_tweet_bucket" {
  name = "post-box-office-tweet-bucket"

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
  }
}

resource "google_storage_bucket_object" "post_box_office_tweet_object" {
  name   = "post-box-office-tweet-object"
  bucket = google_storage_bucket.post_box_office_tweet_bucket.name

  content_type = "application/zip"

  source = "../dist/post-box-office-tweet.zip"
}

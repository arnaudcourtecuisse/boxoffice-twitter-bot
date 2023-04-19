# Boxoffice Twitter Bot

This is a Twitter bot that tweets about the top ranked movies of the day, using data from AlloCiné.

## Conception

The Boxoffice Live Twitter bot project was created to help movie enthusiasts
stay up-to-date with the latest box office news.
The project uses TypeScript and several external APIs to fetch data
about the top 10 movies of the day, generate a tweet about
the most popular or newly-released movie, and post it to Twitter.

To generate the TypeScript code for the project, we used
the OpenAI GPT-3.5 language model. We first created a prompt that instructed
the model to generate a tweet about a movie, and provided it with several
examples of tweets that we wanted it to mimic in tone and content.
The model was then fine-tuned on this prompt and examples,
until we were satisfied with its output.

After generating the TypeScript code, we created a Terraform configuration
to deploy the code as a Google Cloud Function. We also set up
a Google Cloud Scheduler job to run the function every Wednesday
between 10am and 11pm CET. Finally, we created a Github Actions workflow
to automatically build, package and deploy the code to Google Cloud
using Terraform.

## Architecture

The project is composed of several components:

- An `allocine` module that fetches data from the AlloCiné API and returns a list of movies.
- An `openai` module that generates a tweet prompt based on a movie.
- A `twitter` module that posts a tweet using the Twitter API.
- An `index.ts` file that combines the above modules to post a tweet
about the top ranked movie of the day.
- A `terraform` directory that contains a Terraform configuration to deploy
the bot on Google Cloud Functions, and a Cloud Scheduler job
that triggers the bot to run every Wednesday, between 10am and 11pm CET.
- A Github Actions CI/CD pipeline that builds and deploys the code.

## Development

The project is written in TypeScript.
You can start the development server by running:

```bash
npm start
```

This will compile the code and start the TypeScript server.

## Deployment

To deploy the bot, you will need to:

1. Create a Google Cloud project.
2. Create a Google Cloud service account with the necessary roles
to deploy and run the function.
3. Create a Twitter Developer account and get your API keys.
4. Create an OpenAI account and get your API key.
5. Set the necessary environment variables in the Github repository settings.
6. Push your changes to the `main` branch.

The Github Actions pipeline will then build and deploy the code
to Google Cloud Functions, and set up the Cloud Scheduler job
to trigger the bot every Wednesday, between 10am and 11pm CET.

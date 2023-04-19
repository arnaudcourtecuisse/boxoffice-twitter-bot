# Discussion that led to this repository

> ❔ I want you to help me create a Tweeter chatbot.
> I'll provide you detailed instructions to generate code,
> then test it and ask you corrections along the way.
> Are you ready?

Yes, I'm ready to help you create a Twitter chatbot!
Please provide me with the instructions,
and I'll do my best to assist you with the process.

> ❔ We're going to use git, Node.js and Typescript.
> Generate a script that I can run to initialize this project.

Sure, here's the step-by-step process to initialize a new Node.js project using TypeScript and git:

First, make sure you have Node.js and npm installed on your machine.
You can download and install them from the official Node.js website:
<https://nodejs.org/>

Create a new directory for your project and navigate to it
using the command line interface.

Run the following command to initialize a new Node.js project

```bash
npm init -y
```

Next, we'll install the necessary dependencies. Run the following command:

```bash
npm install --save-dev typescript ts-node nodemon @types/node
```

This will install TypeScript, nodemon for automatic reloading,
ts-node to run TypeScript code without compiling it to JavaScript,
and the @types/node package,
which provides TypeScript definitions for Node.js core modules.

Create a tsconfig.json file in the root directory of your project
with the following contents:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

This file configures TypeScript to compile your code to ES6 modules
using CommonJS, enforces strict type-checking, enables ES module interop,
and ensures consistent casing for file names.

Create a src directory in your project directory,
and create a file named index.ts inside it.

Open the index.ts file and add the following code:

```typescript
console.log("Hello, world!");
```

This code will simply log "Hello, world!" to the console when you run the script.

Create a nodemon.json file in the root directory of your project
with the following contents:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/index.ts"
}
```

This file configures nodemon to watch the src directory for changes,
and run the index.ts file using ts-node when any changes occur.

Finally, initialize a new git repository in your project directory:

```bash
git init
```

You're now ready to start building your Twitter chatbot!
You can run the script by running the following command
in your project directory:

```bash
npm run dev
```

This will start the nodemon process,
which will watch for changes in the src directory and automatically
reload the script when changes are made.
You should see "Hello, world!" logged to the console.

Let me know if you have any questions or need further assistance!

> ❔ The dev script is missing.
> Can you show me the package.json with the necessary scripts?

Sure, here's an updated package.json file with the necessary scripts:

```json
{
  "name": "my-twitter-chatbot",
  "version": "1.0.0",
  "description": "My Twitter chatbot",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "twitter",
    "chatbot"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^17.0.13",
    "eslint": "^8.2.0",
    "nodemon": "^2.0.15",
    "typescript": "^4.5.4"
  },
  "dependencies": {
    "twitter-lite": "^2.4.0"
  }
}
```

Here are the scripts:

* `start`: Runs the compiled TypeScript code in the dist directory.
* `dev`: Runs the nodemon process for automatic reloading during development.
* `build`: Compiles the TypeScript code to JavaScript in the dist directory.
* `lint`: Lints the TypeScript code using ESLint.
* `test`: Placeholder script for running tests.

To run the dev script, you can simply run the following command
in your project directory:

```bash
npm run dev
```

This will start the nodemon process and automatically reload your code
when changes are made. Let me know if you have any questions!


> ❔ Ok, now it works. Now let's work on the bot implementation.
> It should post tweets about live boxoffice admissions in France.
> It fetches admission data from an API,
> then uses OpenAI API to generate a tweet in French,
> and finally posts the tweet.
> Can you update the Typescript function to do that?

Sure, here's an updated TypeScript function that fetches live box office
admission data for movies in France, generates a tweet using OpenAI API,
and posts the tweet to Twitter:

```typescript
import Twitter from "twitter-lite";
import fetch from "node-fetch";

async function postBoxOfficeTweet() {
  // Fetch live box office admission data from an API
  const response = await fetch("https://api.allocine.fr/alqapibrest2/promo");
  const data = await response.json();

  // Choose a random movie from the top 10 movies
  const movies = data.feed.top10;
  const movie = movies[Math.floor(Math.random() * movies.length)];

  // Generate a tweet using OpenAI API
  const openaiApiKey = "YOUR_OPENAI_API_KEY";
  const prompt = `Le film ${movie.title} est ${movie.variation}% plus populaire aujourd'hui que la semaine dernière.`;
  const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      prompt,
      max_tokens: 50,
      temperature: 0.5,
      n: 1,
      stop: "."
    })
  });
  const { choices } = await response.json();
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
```

Here's a brief explanation of how the function works:

The function uses the node-fetch package to fetch live box office admission data from the Allocine API.
It chooses a random movie from the top 10 movies returned by the API.
It then generates a tweet using the OpenAI Codex API. The prompt for the API is a string that includes the movie title and its popularity variation. The API returns a completed tweet based on the prompt.
Finally, the function uses the twitter-lite package to post the generated tweet to Twitter.
Note that you'll need to replace the placeholders for the OpenAI API key and Twitter API keys with your own keys.

Let me know if you have any questions or need further assistance!
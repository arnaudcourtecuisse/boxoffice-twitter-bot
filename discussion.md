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

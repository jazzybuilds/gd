# Getting started

Run `npm install`.

## Local Development
1. make copy of `.env.dev`, name it `.env`, the sample file is pre-populated
1. `npm start`
1.  visit `http://localhost:3000`

## Local export
1. make copy of `.env.export`, name it `.env`
1. `npm run export`
1. The site will be exported to the `./out` folder.
1. Run any static server on it `npx serve out` for example.
1. The site should be able to serve statically now.

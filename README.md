### HitFactor.Info

A Better Classification System for Action Shooting Sports

#### Project Goals

1. Pick Data-Driven Recommended HHF for All Classifiers/Divisions.
2. Implement Closer-To-Major-Match-Performance Classification Algorithm
3. Provide Better Classification System or at least Partial Improvements to All Interested Action Shooting Sport Organizations

#### License

This repository is licensed under the MIT License, except for the contents
of the following directories:

- `data/`

See the README files in those directories for more details.

#### Running

> [!CAUTION]
> This README is possibly (most likely) OUTDATED.
> If you're a developer willing to contribute, join our Discord

##### Locally with Docker-Compose

For faster turn around when developing API, use:
This starts up the app with a Mongo instance running in Docker.

```
npm i
npm run local
```

Populate the local database with production data by doing the following:

1. Download a production `mongodump` archive (ask an existing contributor to provide you with the archive).
2. Extract `zeta` folder to be at the root level of this repo.
3. Run the following `mongorestore` command:

```
mongorestore --host localhost:27017 zeta -d test
```

NOTE: Before running this command, it is highly recommended to increase memory availability in `Docker Desktop` to at least 5 or 6 GB.

Otherwise, the restore process may crash due to Docker's OOMKiller.

##### Locally against MONGO_URL

Note: You must supply `MONGO_URL={URL_OF_SANDBOX_DATABASE}` to test in this manner.

```
npm i
npm start
```

Connect to the mongo instance via:

```
mongosh "mongodb://localhost:27017"
```

#### Run the Uploads Worker locally

The Uploads Worker fetches matches and populates scores.

To run it locally, run the following:

```
ALGOLIA_URL='from_env' PS_S3_ACCESS_KEY_ID=from_env PS_S3_SECRET_ACCESS_KEY=from_env MONGO_URL=mongodb://localhost:27017 NODE_OPTIONS='--max-old-space-size=512' node scripts/uploadsWorker.js
```

You may need to tweak scheduling of the runner to run at more frequent intervals for testing purposes.

###### In Production

Currently deployed on Koyeb using Dockerfiles. To run api/web in prod mode, use:

```
npm i
npm run prod
```

Note: `npm` i is required, because it uses vite build as a post-install step and serves frontend files from the node itself, instead of running two processes concurrently.

##### Technical Stack

- Main language: JavaScript (ES13), TypeScript when needed
- Monorepo, Node/Fastify Backend, React (vite-swc) Frontend.
- Backend serves API and static files: (build of React Frontend, downloadables, etc)
- Mongo

##### Folder Structure

- `scripts/` -- standalone scripts
- `data/` -- imported (partially processed / split) data, mostly used by backend
- `shared/` -- source code imported by both front- and backend
- `api/` -- backend
- `web/` -- frontend
- package.json -- monorepo wrapper scripts

For more info, see READMEs in each root folder

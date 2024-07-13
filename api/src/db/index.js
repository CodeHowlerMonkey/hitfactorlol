import mongoose from "mongoose";
import { hydrateStats } from "./stats.js";
import { hydrateScores } from "./scores.js";
import { rehydrateRecHHF } from "./recHHF.js";
import { hydrateShooters } from "./shooters.js";
import { hydrateClassifiersExtendedMeta } from "./classifiers.js";

export const connect = async () => {
  const { LOCAL_DEV, MONGO_URL, MONGO_URL_LOCAL } = process.env;
  const url = !LOCAL_DEV ? MONGO_URL : MONGO_URL_LOCAL;

  if (!LOCAL_DEV && !MONGO_URL) {
    throw new Error(
      `Environment Variable MONGO_URL must be specified in top-level environment variables in sandbox mode.`
    );
  }

  const _connect = () => {
    console.error("DB: connecting");
    return mongoose.connect(url);
  };

  mongoose.connection.on("error", function (e) {
    console.error("Mongo connection error:");
    if (e) {
      console.error(e);
    }
  });

  mongoose.connection.on("disconnected", async () => {
    console.error("DB: lost connection");
    await _connect();
  });
  mongoose.connection.on("connected", function () {
    console.error("DB: connected");
  });

  mongoose.connection.on("reconnected", function () {
    console.error("DB: reconnected");
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on("SIGINT", async function () {
    await mongoose.connection.close();
    process.exit(0);
  });
  await _connect();
};

export const hydrate = async () => {
  console.log("hydrating everything");
  console.time("full hydration");

  await hydrateScores();
  await rehydrateRecHHF();
  await hydrateShooters();
  await hydrateClassifiersExtendedMeta();
  await hydrateStats();

  console.timeEnd("full hydration");
  console.log("hydration done");
};

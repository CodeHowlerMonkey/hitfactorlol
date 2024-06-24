import mongoose from "mongoose";

const A = 1;
const B = 16;
const C = 256;
const D = 4096;
const NS = 65536;
const M = 1048576;
const NPM = 16777216;

const MatchesSchema = new mongoose.Schema(
  {
    updated: Date,
    created: Date,
    id: { type: Number, required: true, unique: true },
    name: String,

    type: String,
    subType: String,
    templateName: String,

    uuid: { type: String, required: true, unique: true },
    date: String, // match_date string as-is e.g. 2024-01-01

    fetched: Date,
    uploaded: Date,
  },
  { strict: false }
);
MatchesSchema.index({ id: -1 });
MatchesSchema.index({ fetched: 1, uploaded: 1 });
MatchesSchema.index({ updated: 1, uploaded: 1 });
MatchesSchema.index({ updated: 1 });
MatchesSchema.index({ fetched: 1 });
export const Matches = mongoose.model("Matches", MatchesSchema);

const MATCHES_PER_FETCH = 1000;
const _idRange = (fromId) =>
  encodeURIComponent(`id: ${fromId + 1} TO ${fromId + MATCHES_PER_FETCH + 1}`);
const filtersForTemplate = (template) => {
  if (!template) {
    return "";
  }

  return `"templateName:${template}"`;
};

const fetchMatchesRange = async (fromId, template = "USPSA") => {
  console.log("fetching from " + fromId);
  const {
    results: [{ hits }],
  } = await (
    await fetch(process.env.ALGOLIA_URL, {
      body: JSON.stringify({
        requests: [
          {
            indexName: "postmatches",
            params: `hitsPerPage=${MATCHES_PER_FETCH}&query=&numericFilters=${_idRange(
              fromId
            )}&facetFilters=${filtersForTemplate(template)}`,
          },
        ],
      }),
      method: "POST",
    })
  ).json();

  return hits.map((h) => ({
    updated: new Date(h.updated + "Z"),
    created: new Date(h.created + "Z"),
    id: h.id,
    name: h.match_name,
    uuid: h.match_id,
    date: h.match_date,
    timestamp_utc_updated: h.timestamp_utc_updated,
    type: h.match_type,
    subType: h.match_subtype,
    templateName: h.templateName,
  }));
};

const fetchMatchesRangeByTimestamp = async (timestamp, template = "USPSA") => {
  console.log("fetching since " + timestamp);
  const {
    results: [{ hits }],
  } = await (
    await fetch(process.env.ALGOLIA_URL, {
      body: JSON.stringify({
        requests: [
          {
            indexName: "postmatches",
            params: `hitsPerPage=${MATCHES_PER_FETCH}&query=&numericFilters=${encodeURIComponent(
              "timestamp_utc_updated > " + timestamp
            )}&facetFilters=templateName:${template}`,
          },
        ],
      }),
      method: "POST",
    })
  ).json();

  return hits.map((h) => ({
    updated: new Date(h.updated + "Z"),
    created: new Date(h.created + "Z"),
    id: h.id,
    name: h.match_name,
    uuid: h.match_id,
    date: h.match_date,
    timestamp_utc_updated: h.timestamp_utc_updated,
  }));
};

/**
 * @param startId match id to start with, defaults to 220k, somewhere around May 2024,
 * which was before the USPSA Import Loss.
 */
const fetchMoreMatches = async (startId = 220000, template, onPageCallback) => {
  let resultsCount = 0;

  let lastResults = [];
  let curId = startId;
  do {
    lastResults = (await fetchMatchesRange(curId, template)).sort((a, b) => b.id - a.id);

    curId = lastResults[0]?.id || Number.MAX_SAFE_INTEGER;

    resultsCount += lastResults.length;
    await onPageCallback(lastResults);
  } while (lastResults.length > 0);

  return resultsCount;
};

/**
 * @param startDate match updated date to start with
 */
const fetchMoreMatchesByTimestamp = async (startTimestamp, template, onPageCallback) => {
  let resultsCount = 0;

  let lastResults = [];
  let curTimestamp = startTimestamp;
  do {
    lastResults = (await fetchMatchesRangeByTimestamp(curTimestamp, template)).sort(
      (a, b) => b.timestamp_utc_updated - a.timestamp_utc_updated
    );

    curTimestamp = lastResults[0]?.timestamp_utc_updated || new Date() / 1000;

    resultsCount += lastResults.length;
    await onPageCallback(lastResults);
  } while (lastResults.length > 0);

  return resultsCount;
};

/**
 * Fetch loop by id, won't produce updates, since id stays the same, and we're fetching
 * only ids that are higher than the highest one we already have in the database.
 *
 * Saves matches into Matches collecion, which is later used by upload loop.
 *
 * Use for initial fetch of matches, for day-to-day use fetchAndSaveMoreUSPASMatchesByUpdateDate
 */
export const fetchAndSaveMoreUSPSAMatchesById = async () => {
  const lastMatch = await Matches.findOne().sort({ id: -1 });
  console.log("lastMatchId = " + lastMatch?.id);
  return fetchMoreMatches(lastMatch?.id, "", async (matches) =>
    Matches.bulkWrite(
      matches.map((m) => ({
        updateOne: {
          filter: {
            uuid: m.uuid,
          },
          update: { $set: m },
          upsert: true,
        },
      }))
    )
  );
};

/**
 * Same as fetchAndSaveMoreUSPSAMatchesById, but uses updated date.
 *
 * Should overwrite some matches if they were updated after previous fetch.
 */
export const fetchAndSaveMoreUSPSAMatchesByUpdatedDate = async () => {
  const lastMatch = await Matches.findOne().sort({ updated: -1 });
  console.log(
    "lastUpdatedMatch= " +
      lastMatch?.updated?.toLocaleDateString?.("en-us", { timeZone: "UTC" })
  );
  return fetchMoreMatchesByTimestamp(
    (lastMatch?.updated || new Date()) / 1000,
    "USPSA",
    async (matches) =>
      Matches.bulkWrite(
        matches.map((m) => ({
          updateOne: {
            filter: {
              uuid: m.uuid,
            },
            update: { $set: m },
            upsert: true,
          },
        }))
      )
  );
};

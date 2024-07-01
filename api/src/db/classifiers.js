import uniqBy from "lodash.uniqby";
import transform from "lodash.transform";

import { stringSort } from "../../../shared/utils/sort.js";

import {
  basicInfoForClassifier,
  classifiers as _classifiers,
  classifiersByNumber,
} from "../dataUtil/classifiersData.js";
import { HF, N, Percent } from "../dataUtil/numbers.js";
import { hhfsForDivision } from "../dataUtil/hhf.js";

import mongoose from "mongoose";
import { Score } from "./scores.js";
import { RecHHF } from "./recHHF.js";
import { divShortNames, hfuDivisionExplosionForScores } from "../dataUtil/divisions.js";

const calcLegitRunStats = (runs, hhf) =>
  runs.reduce(
    (acc, cur) => {
      const curFraction = cur.hf / hhf;
      if (curFraction < 0.4) {
        acc.D += 1;
      } else if (curFraction < 0.6) {
        acc.C += 1;
      } else if (curFraction < 0.75) {
        acc.B += 1;
      } else if (curFraction < 0.85) {
        acc.A += 1;
      } else if (curFraction < 0.95) {
        acc.M += 1;
      } else if (curFraction >= 0.95) {
        acc.GM += 1;
      }

      if (curFraction >= 1.0) {
        acc.Hundo += 1;
      }

      return acc;
    },
    { D: 0, C: 0, B: 0, A: 0, M: 0, GM: 0, Hundo: 0, Total: runs.length }
  );

const extendedInfoForClassifier = (c, division, hitFactorScores) => {
  if (!division || !c?.id) {
    return {};
  }
  const divisionHHFs = hhfsForDivision(division);
  if (!divisionHHFs) {
    return {};
  }
  const curHHFInfo = divisionHHFs.find((dHHF) => dHHF.classifier === c.id);
  const hhf = Number(curHHFInfo.hhf);

  const topXPercentileStats = (x) => ({
    [`top${x}PercentilePercent`]:
      hitFactorScores[Math.floor(x * 0.01 * hitFactorScores.length)]?.percent,
    [`top${x}PercentileCurPercent`]: Percent(
      hitFactorScores[Math.floor(x * 0.01 * hitFactorScores.length)]?.hf,
      hhf
    ),
    [`top${x}PercentileHF`]:
      hitFactorScores[Math.floor(x * 0.01 * hitFactorScores.length)]?.hf,
  });

  const inversePercentileStats = (xPercent) => ({
    [`inverse${xPercent}CurPercentPercentile`]: Percent(
      hitFactorScores.findLastIndex((c) => (100 * c.hf) / hhf >= xPercent),
      hitFactorScores.length
    ),
  });

  // sik maf bro
  // historical high hit factors, Math.ceil(x * 100, 2) uniqueness, cause maf is hard on
  // computers and gets too much noise. If they changed HF <= 0.01 it doesn't
  // matter anyway, so toFixed(2)
  const hhfs = uniqBy(
    hitFactorScores
      .filter((run) => run.percent !== 0 && run.percent !== 100)
      .map((run) => ({
        date: new Date(run.sd).getTime(),
        sd: run.sd,
        hhf: HF((100 * run.hf) / run.percent),
      }))
      .sort((a, b) => a.date - b.date),
    (hhfData) => Math.ceil(hhfData.hhf * 100)
  );
  const clubs = uniqBy(hitFactorScores, "clubid")
    .map(({ clubid: id, club_name: name }) => ({
      id,
      name,
      label: id + " " + name,
    }))
    .filter(({ id }) => !!id)
    .sort((a, b) => stringSort(a, b, "id", 1));

  const result = {
    updated: curHHFInfo.updated, //actualLastUpdate, // before was using curHHFInfo.updated, and it's bs
    hhf,
    prevHHF: hhfs.findLast((c) => c.hhf !== hhf)?.hhf ?? hhf,
    hhfs,
    clubsCount: clubs.length,
    clubs,
    ...transform(
      calcLegitRunStats(hitFactorScores, hhf),
      (r, v, k) => (r["runsTotalsLegit" + k] = v)
    ),
    runs: hitFactorScores.length,
    top10CurPercentAvg:
      hitFactorScores
        .slice(0, 10)
        .map((s) => Percent(s.hf, hhf))
        .reduce((a, b) => a + b, 0) / 10,
    ...topXPercentileStats(1),
    ...topXPercentileStats(2),
    ...topXPercentileStats(5),
    ...inversePercentileStats(100),
    ...inversePercentileStats(95),
    ...inversePercentileStats(85),
    ...inversePercentileStats(75),
    ...inversePercentileStats(60),
    ...inversePercentileStats(40),
  };
  return result;
};

const ClassifierSchema = new mongoose.Schema({}, { strict: false });

const WORST_QUALITY_DISTANCE_FROM_TARGET = 100;
const scoresCountOffset = (runsCount) => {
  if (runsCount < 200) {
    return -40;
  } else if (runsCount < 400) {
    return -20;
  } else if (runsCount < 750) {
    return -10;
  } else if (runsCount < 1400) {
    return -5;
  }

  return 0;
};

ClassifierSchema.virtual("quality").get(function () {
  return (
    scoresCountOffset(this.runs) +
    Percent(
      WORST_QUALITY_DISTANCE_FROM_TARGET -
        (10.0 * Math.abs(1 - this.inverse95RecPercentPercentile) +
          4.0 * Math.abs(5 - this.inverse85RecPercentPercentile) +
          1.0 * Math.abs(15 - this.inverse75RecPercentPercentile) +
          0.5 * Math.abs(45 - this.inverse60RecPercentPercentile) +
          0.3 * Math.abs(85 - this.inverse40RecPercentPercentile)),
      WORST_QUALITY_DISTANCE_FROM_TARGET
    )
  );
});
ClassifierSchema.virtual("hqQuality").get(function () {
  return (
    scoresCountOffset(this.runs) +
    Percent(
      WORST_QUALITY_DISTANCE_FROM_TARGET -
        (10.0 * Math.abs(1 - this.inverse95CurPercentPercentile) +
          4.0 * Math.abs(5 - this.inverse85CurPercentPercentile) +
          1.0 * Math.abs(15 - this.inverse75CurPercentPercentile) +
          0.5 * Math.abs(45 - this.inverse60CurPercentPercentile) +
          0.3 * Math.abs(85 - this.inverse40CurPercentPercentile)),
      WORST_QUALITY_DISTANCE_FROM_TARGET
    )
  );
});
ClassifierSchema.index({ classifier: 1, division: 1 }, { unique: true });
ClassifierSchema.index({ division: 1 });
export const Classifier = mongoose.model("Classifier", ClassifierSchema);

export const singleClassifierExtendedMetaDoc = async (
  division,
  classifier,
  recHHFReady
) => {
  const c = classifiersByNumber[classifier];
  const divisions = [division, ...(hfuDivisionExplosionForScores[division] || [])];
  const [recHHFQuery, hitFactorScores] = await Promise.all([
    recHHFReady ?? RecHHF.findOne({ division, classifier }).select("recHHF").lean(),
    Score.find({
      division: { $in: divisions },
      classifier,
      hf: { $gte: 0 },
      bad: { $exists: false },
    })
      .sort({ hf: -1 })
      .limit(0)
      .lean(),
  ]);

  const recHHF = recHHFQuery?.recHHF;
  const inverseRecPercentileStats = (xPercent) => ({
    [`inverse${xPercent}RecPercentPercentile`]: Percent(
      recHHF > 0
        ? hitFactorScores.findLastIndex((c) => (100 * c.hf) / recHHF >= xPercent)
        : -1,
      hitFactorScores.length
    ),
  });
  return {
    division,
    ...basicInfoForClassifier(c),
    ...extendedInfoForClassifier(c, division, hitFactorScores),
    recHHF,
    ...inverseRecPercentileStats(100),
    ...inverseRecPercentileStats(95),
    ...inverseRecPercentileStats(85),
    ...inverseRecPercentileStats(75),
    ...inverseRecPercentileStats(60),
    ...inverseRecPercentileStats(40),
  };
};

export const hydrateClassifiersExtendedMeta = async () => {
  let i = 0;
  const total = _classifiers.length * 9;
  console.log("hydrating classifiers extended meta");
  console.time("classifiers");
  for (const division of divShortNames) {
    for (const c of _classifiers) {
      ++i;
      const { classifier } = c;
      const doc = await singleClassifierExtendedMetaDoc(division, classifier);
      await Classifier.updateOne(
        { division, classifier },
        { $set: doc },
        { upsert: true }
      );
      process.stdout.write(`\r${i}/${total}`);
    }
  }
  console.timeEnd("classifiers");
};

// TODO: classifier quality score, maybe dependent on number of scores, but most importantly:
// 10* percentDiffFromGMTarget 4*fromM 1*fromA
let _allDivQuality = null;
export const allDivisionClassifiersQuality = async () => {
  if (_allDivQuality) {
    return _allDivQuality;
  }

  let [co, opn, ltd, pcc] = await Promise.all([
    Classifier.find({ division: "co" }),
    Classifier.find({ division: "opn" }),
    Classifier.find({ division: "ltd" }),
    Classifier.find({ division: "pcc" }),
  ]);

  co = co.map((c) => c.toObject({ virtuals: true }));
  opn = opn.map((c) => c.toObject({ virtuals: true }));
  opn = opn.reduce((acc, cur) => {
    acc[cur.classifier] = cur;
    return acc;
  }, {});
  ltd = ltd.map((c) => c.toObject({ virtuals: true }));
  ltd = ltd.reduce((acc, cur) => {
    acc[cur.classifier] = cur;
    return acc;
  }, {});
  pcc = pcc.map((c) => c.toObject({ virtuals: true }));
  pcc = pcc.reduce((acc, cur) => {
    acc[cur.classifier] = cur;
    return acc;
  }, {});

  _allDivQuality = co.reduce((acc, c) => {
    const id = c.classifier;
    acc[id] = (c.quality + opn[id].quality + ltd[id].quality + pcc[id].quality) / 4;
    return acc;
  }, {});

  return _allDivQuality;
};

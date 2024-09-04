import uniqBy from "lodash.uniqby";

import { basicInfoForClassifier, classifiers, ScsaPointsPerString } from "../../../dataUtil/classifiersData.js";
import { HF, N, Percent, PositiveOrMinus1 } from "../../../dataUtil/numbers.js";
import { curHHFForDivisionClassifier } from "../../../dataUtil/hhf.js";
import { Score } from "../../../db/scores.js";
import {
  allDivisionClassifiersQuality,
  allScsaDivisionClassifiersQuality,
  Classifier
} from "../../../db/classifiers.js";
import { RecHHF } from "../../../db/recHHF.js";
import {
  addPlaceAndPercentileAggregation,
  addTotalCountAggregation,
  multiSortAndPaginate,
  percentAggregationOp,
  textSearchMatch
} from "../../../db/utils.js";
import { divisionsForScoresAdapter, hfuDivisionsShortNamesThatNeedMinorHF } from "../../../dataUtil/divisions.js";

const _getShooterField = (field) => ({
  $getField: {
    input: { $arrayElemAt: ["$shooters", 0] },
    field,
  },
});
const _getRecHHFField = (field) => ({
  $getField: {
    input: { $arrayElemAt: ["$rechhfs", 0] },
    field,
  },
});

const _replaceHFWithMinorHFIfNeeded = (division) =>
  !hfuDivisionsShortNamesThatNeedMinorHF.includes(division)
    ? []
    : [
        {
          $addFields: {
            originalHF: "$hf",
            hf: "$minorHF",
          },
        },
      ];

// override division and all division-derived fields to given division, used for correct lookup of HFU scores, even when they came from another division
const _overwriteDivision = (division) => ({
  $addFields: {
    originalDivision: "$division",
    division,
    classifierDivision: { $concat: ["$classifier", ":", division] },
    memberNumberDivision: { $concat: ["$memberNumber", ":", division] },
  },
});
const _runsAggregation = async ({
  classifier,
  division,
  sort,
  order,
  page,
  filterString,
  filterClubString,
}) =>
  Score.aggregate([
    {
      $project: {
        _id: false,
        _v: false,
      },
    },
    ..._replaceHFWithMinorHFIfNeeded(division),
    {
      $match: {
        classifier,
        division: { $in: divisionsForScoresAdapter(division) },
        hf: { $gt: 0 },
        bad: { $exists: false },
      },
    },
    _overwriteDivision(division),
    {
      $lookup: {
        from: "shooters",
        localField: "memberNumberDivision",
        foreignField: "memberNumberDivision",
        as: "shooters",
      },
    },
    {
      $lookup: {
        from: "rechhfs",
        localField: "classifierDivision",
        foreignField: "classifierDivision",
        as: "rechhfs",
      },
    },
    {
      $addFields: {
        // score data for RunsTable
        recHHF: _getRecHHFField("recHHF"),
        curHHF: _getRecHHFField("curHHF"),

        // shooter data for ShooterCell
        hqClass: _getShooterField("class"),
        hqCurrent: _getShooterField("current"),
        name: _getShooterField("name"),
        recClass: _getShooterField("recClass"),
        curHHFClass: _getShooterField("curHHFClass"),
        reclassificationsCurPercentCurrent: _getShooterField(
          "reclassificationsCurPercentCurrent"
        ),
        reclassificationsRecPercentCurrent: _getShooterField(
          "reclassificationsRecPercentCurrent"
        ),
      },
    },
    {
      $project: {
        shooters: false,
        rechhfs: false,
        memberNumberDivision: false,
        classifier: false,
      },
    },
    {
      $addFields: {
        recPercent: percentAggregationOp("$hf", "$recHHF", 4),
        curPercent: percentAggregationOp("$hf", "$curHHF", 4),
      },
    },

    ...addPlaceAndPercentileAggregation("hf"),
    ...(!filterString
      ? []
      : [{ $match: textSearchMatch(["memberNumber", "name"], filterString) }]),
    ...(!filterClubString ? [] : [{ $match: { clubid: filterClubString } }]),
    ...addTotalCountAggregation("totalWithFilters"),
    ...multiSortAndPaginate({ sort, order, page }),
  ]);

const scsaHhfToPeakTime = (classifier, hf) => {
  const numScoringStrings = classifier === 'SC-104' ? 3 : 4;
  return Number(parseFloat(((ScsaPointsPerString)/(hf / numScoringStrings))).toFixed(2))
}

const classifiersRoutes = async (fastify, opts) => {
  fastify.get("/", (req, res) => classifiers.map(basicInfoForClassifier));

  fastify.get("/:division", async (req) => {
    const { division } = req.params;
    const [ classifiers, classifiersAllDivQuality ] = await Promise.all([
      Classifier.find({ division, classifier: { $exists: true, $ne: null } }),
      division.startsWith('scsa') ? allScsaDivisionClassifiersQuality() : allDivisionClassifiersQuality()
    ]);
    return classifiers.map((c) => {
      const cur = c.toObject({ virtuals: true });
      cur.allDivQuality = classifiersAllDivQuality[cur.classifier];
      if (division.startsWith('scsa')) {
        cur.recHHF = scsaHhfToPeakTime(c.classifier, cur.recHHF);
        cur.hhf = scsaHhfToPeakTime(c.classifier, cur.hhf);
      }
      return cur;
    });
  });

  fastify.get("/info/:division/:number", async (req, res) => {
    const { division, number } = req.params;
    const c = classifiers.find((cur) => cur.classifier === number);

    if (!c) {
      res.statusCode = 404;
      return { info: null };
    }

    const basic = basicInfoForClassifier(c);
    const [extended, recHHFInfo] = await Promise.all([
      Classifier.findOne({ division, classifier: number }).lean(),
      RecHHF.findOne({ classifier: number, division })
        .select(["recHHF", "rec1HHF", "rec5HHF", "rec15HHF", "curHHF"])
        .lean(),
    ]);

    const result = {
      info: {
        ...basic,
        ...extended,
        curHHF: recHHFInfo?.curHHF || 0,
        recHHF: recHHFInfo?.recHHF || 0,
        recommendedHHF1: recHHFInfo?.rec1HHF || 0,
        recommendedHHF5: recHHFInfo?.rec5HHF || 0,
        recommendedHHF15: recHHFInfo?.rec15HHF || 0,
      },
    };

    return result;
  });

  fastify.get("/scores/:division/:number", async (req, res) => {
    const { division, number } = req.params;
    const { sort, order, page, club: filterClubString, filter: filterString } = req.query;
    const runsFromDB = await _runsAggregation({
      classifier: number,
      division,
      filterString,
      filterClubString,
      sort,
      order,
      page,
    });

    return {
      runs: runsFromDB.map((run, index) => {
        const percent = N(run.percent);
        const curPercent = PositiveOrMinus1(run.curPercent);
        const recPercent = PositiveOrMinus1(run.recPercent);
        const percentMinusCurPercent = N(percent - curPercent);

        run.sd = new Date(run.sd).toLocaleDateString("en-us", { timeZone: "UTC" });
        run.historicalHHF = HF((100 * run.hf) / run.percent); // recalculated only
        run.percent = percent;
        run.curPercent = curPercent;
        run.recPercent = recPercent;
        run.percentMinusCurPercent = percent >= 100 ? 0 : percentMinusCurPercent;
        run.classifier = number;
        run.index = index;
        if (division.startsWith('scsa')) {
          run.hf = Number(run.stageTimeSecs);
        }
        return run;
      }),
      runsTotal: runsFromDB[0]?.total || 0,
      runsTotalWithFilters: runsFromDB[0]?.totalWithFilters || 0,
      runsPage: Number(page) || 1,
    };
  });

  fastify.get("/:division/:number/chart", async (req, res) => {
    const { division, number } = req.params;
    const { full: fullString } = req.query;
    const full = Number(fullString);

    const runs = await Score.aggregate([
      {
        $project: {
          minorHF: true,
          hf: true,
          memberNumber: true,
          memberNumberDivision: true,
          classifier: true,
          division: true,
          bad: true,
          _id: false,
        },
      },
      ..._replaceHFWithMinorHFIfNeeded(division),
      {
        $match: {
          classifier: number,
          division: { $in: divisionsForScoresAdapter(division) },
          hf: { $gt: 0 },
          bad: { $exists: false },
        },
      },
      _overwriteDivision(division),
      {
        $lookup: {
          from: "shooters",
          localField: "memberNumberDivision",
          foreignField: "memberNumberDivision",
          as: "shooters",
        },
      },
      {
        $addFields: {
          curPercent: {
            $getField: {
              input: { $arrayElemAt: ["$shooters", 0] },
              field: "current",
            },
          },
          curHHFPercent: {
            $getField: {
              input: { $arrayElemAt: ["$shooters", 0] },
              field: "reclassificationsCurPercentCurrent",
            },
          },
          recPercent: {
            $getField: {
              input: { $arrayElemAt: ["$shooters", 0] },
              field: "reclassificationsRecPercentCurrent",
            },
          },
        },
      },
      {
        $project: {
          shooters: false,
          memberNumberDivision: false,
          classifier: false,
          division: false,
        },
      },
      { $sort: { hf: -1 } },
    ]);

    const hhf = curHHFForDivisionClassifier({ number, division });
    const allPoints = runs.map((run, index, allRuns) => ({
      x: HF(run.hf),
      y: PositiveOrMinus1(Percent(index, allRuns.length)),
      memberNumber: run.memberNumber,
      curPercent: run.curPercent || 0,
      curHHFPercent: run.curHHFPercent || 0,
      recPercent: run.recPercent || 0,
    }));

    // for zoomed in mode return all points
    if (full === 1) {
      return allPoints;
    }

    // always return top 100 points, and reduce by 0.5% grouping for other to make render easier
    const first50 = allPoints.slice(0, 100);
    const other = allPoints.slice(100, allPoints.length);
    return [
      ...first50,
      ...uniqBy(
        other,
        ({ x }) => Math.floor((200 * x) / hhf) // 0.5% grouping for graph points reduction
      ),
    ];
  });
};

export default classifiersRoutes;

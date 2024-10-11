/* eslint-disable no-console */
import fs from "fs";

import { connect } from "../api/src/db/index";
import { Scores } from "../api/src/db/scores";

const go = async () => {
  await connect();

  const membersByWeekAggregation = [
    {
      $group: {
        _id: {
          week: {
            $dateTrunc: {
              date: "$sd",
              unit: "week",
              binSize: 1,
              timezone: "UTC",
            },
          },
        },
        shooters: {
          $addToSet: "$memberNumber",
        },
      },
    },
    {
      $project: {
        week: "$_id.week",
        shooterCount: {
          $size: "$shooters",
        },
      },
    },
    {
      $project: {
        _id: false,
        shooters: false,
      },
    },
  ];

  const scoresByWeekMax = await Scores.aggregate([
    ...membersByWeekAggregation,
    {
      $sort: {
        shooterCount: -1,
      },
    },
  ]);

  const scoresByWeek = await Scores.aggregate([
    ...membersByWeekAggregation,
    {
      $sort: {
        week: 1,
      },
    },
  ]);

  fs.writeFileSync(
    `./data/stats/scoresByWeekMax.json`,
    JSON.stringify(scoresByWeekMax, null, 2),
  );

  fs.writeFileSync(
    `./data/stats/scoresByWeek.json`,
    JSON.stringify(scoresByWeek, null, 2),
  );

  console.log("done");
};

go();

/* eslint-disable no-console */

import { connect } from "../../api/src/db/index";
import { reclassifyShooters, Shooters } from "../../api/src/db/shooters";

const rehydrateCOShooters = async () => {
  const shooters = await Shooters.find({
    memberNumberDivision: { $exists: true },
    division: "co",
    reclassificationsRecPercentCurrent: { $gt: 0 },
  })
    .limit(0)
    .select(["memberNumberDivision", "name", "memberNumber", "division"])
    .lean();

  console.error(`Total CO Shooters to Process: ${shooters.length}`);

  const batchSize = 64;
  for (let i = 0; i < shooters.length; i += batchSize) {
    const batch = shooters.slice(i, i + batchSize);
    const actualBatchSize = batch.length;
    await reclassifyShooters(batch);
    process.stdout.write(`\r${i + actualBatchSize}/${shooters.length}`);
  }

  console.error("\ndone");
  process.exit(0);
};

const migrate = async () => {
  await connect();
  await rehydrateCOShooters();
};

migrate();
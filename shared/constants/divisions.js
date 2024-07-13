import divisionsFromJson from "../../data/division.json" assert { type: "json" };

/** Extracts division from memberNumberDivision or classifierDivision */
export const pairToDivision = (pair) => pair.split(":")[1];

// TODO: add allDivisions for multisport, use uspsaDivisions for USPSA only
export const uspsaDivisions = divisionsFromJson.divisions;
/** ["opn", "ltd", "l10", "prod", "rev", "ss", "co", "lo", "pcc"] */
export const divShortNames = uspsaDivisions.map((c) => c.short_name.toLowerCase());
export const uspsaDivShortNames = divShortNames;

export const mapDivisions = (mapper) =>
  Object.fromEntries(divShortNames.map((div) => [div, mapper(div)]));

export const mapDivisionsFlat = (mapper) => divShortNames.map((div) => mapper(div));

export const mapDivisionsAsync = async (mapper) =>
  Object.fromEntries(
    await Promise.all(divShortNames.map(async (div) => [div, await mapper(div)]))
  );

export const forEachDivisionSeq = async (cb) => {
  for (const division of divShortNames) {
    await cb(division);
  }
};

/** {opn: 2, ltd: 3, l10: 4, ... } */
export const divShortToId = uspsaDivisions.reduce(
  (result, cur) => ({ ...result, [cur.short_name.toLowerCase()]: cur.id }),
  {}
);
export const uspsaDivShortToId = divShortToId;

export const divShortToLong = uspsaDivisions.reduce(
  (result, cur) => ({
    ...result,
    [cur.short_name.toLowerCase()]: cur.long_name,
  }),
  {}
);
export const uspsaDivShortToLong = divShortToLong;

export const divIdToShort = Object.fromEntries(
  Object.entries(divShortToId).map((flip) => [flip[1], flip[0]])
);
export const uspsaDivIdToShort = divIdToShort;

export const divisions = divisionsFromJson;
export const hfuDivisions = [
  {
    long: "Competition",
    short: "comp", // src: opn, counts: opn
  },
  {
    long: "Optics",
    short: "opt", // src: loco, counts: loco
  },
  {
    long: "Irons",
    short: "irn", // src: ltd, counts: ltd, l10, prod, ss, rev
  },
  {
    long: "Carbine",
    short: "car",
  },
];
export const hfuDivisionsShortNames = hfuDivisions.map((d) => d.short);
export const hfuDivisionsShortNamesThatNeedMinorHF = ["comp", "irn"];

export const sportForDivision = (division) => {
  if (hfuDivisionsShortNames.indexOf(division) >= 0) {
    return "hfu";
  }

  if (division.includes("_")) {
    const [sport] = division.split("_");
    return sport;
  }

  return "uspsa";
};

export const sportName = (code) =>
  ({ hfu: "Hit Factor", pcsl: "PCSL", uspsa: "USPSA" }[code] || "USPSA");

export const hfuDivisionCompatabilityMap = {
  // from USPSA
  opn: "comp",

  co: "opt",
  lo: "opt",

  ltd: "irn",
  l10: "irn",
  prod: "irn",
  ss: "irn",
  rev: "irn",

  pcc: "car",

  // from PCSL
  pcsl_comp: "comp",
  pcsl_po: "opt",
  pcsl_pi: "irn",
  pcsl_pcc: "car",
  pcsl_acp: "opt",
};

export const pcslDivisions = ["pcsl_comp", "pcsl_po", "pcsl_pi", "pcsl_pcc", "pcsl_acp"];

/**
 * Divisions that should NOT be used to calculate RecHHF for HFU divisions.
 * Still can be used to show scores under them though.
 */
export const hfuDivisionRecHHFExclusion = ["pcsl_acp", "l10", "prod", "ss", "rev"];

/**
 * All directions switch from sport to sport with selected division map.
 * User in DivisionNavigation
 *
 * Format: [newSport][oldDiv] = newDiv
 */
export const divisionChangeMap = {
  hfu: hfuDivisionCompatabilityMap,
  uspsa: {
    // from HFU
    comp: "opn",
    opt: "co",
    irn: "ltd",
    car: "pcc",

    // from PCSL
    pcsl_comp: "opn",
    pcsl_po: "co",
    pcsl_pi: "ltd",
    pcsl_pcc: "pcc",
    pcsl_acp: "co",
  },
};

export const minorDivisions = ["co", "lo", "prod", "pcc", "comp", "opt", "irn", "car"];

export const hfuDivisionCompatabilityMapInversion = (excludedDivisions = []) =>
  Object.keys(hfuDivisionCompatabilityMap)
    .filter((div) => !excludedDivisions.includes(div))
    .reduce((acc, curKey) => {
      const curValue = hfuDivisionCompatabilityMap[curKey];
      const invertedArray = acc[curValue] || [curValue];
      invertedArray.push(curKey);
      acc[curValue] = invertedArray;
      return acc;
    }, {});

// inversion of hfuDivisionCompatabilityMap, only used for displaying
// scores (in ClassifierRuns/ShooterRuns), but not for RecHHF calculation
// (see hfuDivisionExplosionForRecHHF)
export const hfuDivisionExplosionForScores = hfuDivisionCompatabilityMapInversion();

// reduced inversion of hfuDivisionCompatabilityMap, because not all scores
// can be used to calculate RecHHF (e.g. prod for irn, due to round limit)
export const hfuDivisionExplosionForRecHHF = hfuDivisionCompatabilityMapInversion(
  hfuDivisionRecHHFExclusion
);

/** Plug for HHF source to make classifiers hydrate for HFU divisions on upload
 * Should be removed or replaced with custom HFU HHF mapping
 */
export const hfuDivisionMapForHHF = Object.fromEntries(
  Object.entries(hfuDivisionExplosionForRecHHF).map(([key, value]) => [key, value[1]])
);

const defaultDivisionAccess = (something) => something.division;
/**
 * Takes array of something and makes it bigger by including additional divisions
 * from provided mapping.
 */
export const arrayWithExplodedDivisions = (
  arr,
  divisionExplosionMap,
  arrDivCb = defaultDivisionAccess,
  arrResultCb
) => {
  const withExtras = arr
    .map((c) => {
      const division = arrDivCb(c);
      const extraDivisions = [].concat(divisionExplosionMap[division] || []);
      return [
        arrResultCb(c, division),
        ...extraDivisions.map((extraDiv) => arrResultCb(c, extraDiv)),
      ];
    })
    .flat()
    .filter(Boolean);

  return [...new Set(withExtras)];
};

/**
 * Takes array of classifiers and returns array of classifierDivision keys,
 * adding all compatible divisions for RecHHFs
 */
export const classifierDivisionArrayWithExplodedDivisions = (
  classifiers,
  divisionExplosionMap
) =>
  arrayWithExplodedDivisions(
    classifiers,
    divisionExplosionMap,
    defaultDivisionAccess,
    (classifierObj, division) => [classifierObj.classifier, division].join(":")
  );

export const classifierDivisionArrayWithHFUExtras = (classifiers) =>
  classifierDivisionArrayWithExplodedDivisions(classifiers, hfuDivisionCompatabilityMap);

export const classifierDivisionArrayForHFURecHHFs = (classifiers) =>
  classifierDivisionArrayWithExplodedDivisions(
    classifiers,
    hfuDivisionExplosionForRecHHF
  );

export const divisionsForScoresAdapter = (division) => {
  const hfuDivisions = hfuDivisionExplosionForScores[division];
  if (hfuDivisions) {
    return hfuDivisions;
  }

  return [division];
};

export const divisionsForRecHHFAdapter = (division) => {
  const hfuDivisions = hfuDivisionExplosionForRecHHF[division];
  if (hfuDivisions) {
    return hfuDivisions;
  }

  return [division];
};

export const allDivShortNames = [
  ...uspsaDivShortNames,
  ...hfuDivisionsShortNames,
  // TODO: pcsl
  // TODO: scsa
];
export const mapAllDivisions = (mapper) =>
  Object.fromEntries(allDivShortNames.map((div) => [div, mapper(div)]));

const r1 = "rec1HHF";
const r5 = "rec5HHF";
const r15 = "rec15HHF";

const manual = {
  opn: {
    "23-01": r1,
    "23-02": r1,

    "99-28": r5,
    "99-53": r5,
    "99-61": r5,
    "99-63": r5,
    "03-03": r15,
    "08-02": r15,
    "09-09": r5, // consider deprecation, too easy, probably doesn't scale right for open with same fixed time
  },
  ltd: {
    "99-02": r5,
    "99-07": r5,
    "99-08": r5,
    "99-10": r1,
    "99-11": r1,
    "99-12": r5,
    "99-13": r1,
    "99-14": r1,
    "99-16": r5,
    "99-19": r5,
    "99-21": r1,
    "99-22": r1,
    "99-23": r1,
    "99-24": r5,
    "99-28": r5,
    "99-33": r5,
    "99-40": r5,
    "99-41": r5,
    "99-42": r5,
    "99-46": r5,
    "99-47": r5,
    "99-48": r1,
    "99-51": r5,
    "99-53": r5,
    "99-56": r5,
    "99-57": r5,
    "99-59": r1, // consider deprecation, hard for CBA
    "99-61": r5,
    "99-62": r1,
    "99-63": r1, // consider deprecattion, very hard for CBA

    "03-02": r1,
    "03-03": r5,
    "03-04": r5,
    "03-05": r5,
    "03-07": r5,
    "03-08": r1,
    "03-09": r1,
    "03-11": r1,
    "03-12": r5,
    "03-14": r1,
    "03-18": r1,

    "06-01": r5,
    "06-02": r5,
    "06-03": r5,
    "06-04": r1,
    "06-05": r5,
    "06-06": r5,
    "06-10": r1,

    "08-01": r1, // consider deprecation, hard for CBA
    "08-02": r5,
    "08-03": r1,

    "09-01": r5,
    "09-02": r1,
    "09-03": r5,
    "09-04": r1,
    "09-07": r1,
    "09-08": r5,
    "09-09": r1,
    "09-10": r5,
    "09-13": r5,
    "09-14": r5,

    "13-01": r1,
    "13-02": r1,
    "13-03": r5,
    "13-04": r1,
    "13-05": r1,
    "13-06": r5,
    "13-07": r5,
    "13-08": r1,

    "18-01": r1,
    "18-02": r1,
    "18-03": r5,
    "18-04": r1,
    "18-05": r1,
    "18-06": r1,
    "18-07": r1,
    "18-08": r5,
    "18-09": r5,

    "19-01": r5,
    "19-02": r5,
    "19-03": r1,
    "19-04": r5,

    "20-01": r5,
    "20-02": r1,
    "20-03": r5,

    "21-01": r5,

    "22-01": r5,
    "22-02": r5,
    "22-04": r5,
    "22-05": r5,
    "22-06": r5,
    "22-07": r5,

    "23-01": r1,
    "23-02": r1,
  },
  l10: {
    "23-01": r15, // barely any data, nobody shoots this div really
    "23-02": r15,

    "99-28": r1,
    "09-08": r5,
    "99-47": r5,
    "20-03": r5,
    "13-07": r5,
    "03-14": r5,
    "99-14": r5,
    "99-41": r5,
    "03-11": r1, // consider deprecation, too hard
    "09-07": r1,
    "06-01": r5,
    "99-19": r1,
    "18-09": r5,
    "03-08": r5,
    "09-13": r5,
    "18-05": r5,
    "99-21": r5,
    "09-03": r5,
    "09-04": r5,
    "06-05": r5,
    "03-04": r5,
    "13-02": r5,
    "18-06": r5,
    "99-48": r5,
    "06-10": r1,
    "20-01": r5,
    "99-23": r5,
    "06-04": r5,
    "03-18": r5,
    "13-06": r5,
  },
  prod: {
    "23-01": r1,
    "23-02": r5,

    "22-01": r5,
    "03-12": r5,
    "99-61": r5,
    "99-14": r1,
    "06-02": r5,
    "99-63": r5,
    "18-01": r5,
    "18-02": r1,
    "18-05": r5,
    "03-09": r5,
    "08-01": r5,
    "09-07": r1,
    "03-02": r1,
    "13-02": r1,
    "99-59": r5,
  },
  rev: {
    "23-01": r5,
    "23-02": r5,
  },
  ss: {
    "23-01": r1,
    "23-02": r5,

    "99-59": r5,
    "03-05": r5,
    "03-14": r5,
    "06-02": r5,
    "08-01": r5,
    "03-09": r5,
    "13-02": r5,
    "09-02": r5,
    "99-07": r5,
    "09-14": r1,
    "03-03": r5,
    "13-07": r5,
    "13-08": r5,
    "99-14": r5,
    "99-33": r15,
    "03-11": r5,
    "99-48": r5,
    "03-12": r5,
    "06-10": r5,
    "18-01": r5,
    "18-06": r1,
    "99-47": r5,
  },
  co: {
    "99-02": r5,
    "99-07": r1,
    "99-08": r1,
    "99-10": r15,
    "99-11": r1,
    "99-12": r5,
    "99-13": r1,
    "99-14": r5,
    "99-16": r15,
    "99-19": r5,
    "99-21": r5,
    "99-22": r5,
    "99-23": r5,
    "99-24": r1,
    "99-28": r5,
    "99-33": r15,
    "99-40": r5,
    "99-41": r5,
    "99-42": r15,
    "99-46": r5,
    "99-47": r5,
    "99-48": r5,
    "99-51": r15,
    "99-53": r15,
    "99-56": r5,
    "99-57": r5,
    "99-59": r5,
    "99-61": r5,
    "99-62": r1,
    "99-63": r1, // consider deprecattion, very hard for CB, hard for AM

    "03-02": r1,
    "03-03": r5,
    "03-04": r1,
    "03-05": r15,
    "03-07": r1,
    "03-08": r1,
    "03-09": r1,
    "03-11": r5,
    "03-12": r15,
    "03-14": r15,
    "03-18": r5,

    "06-01": r1,
    "06-02": r5,
    "06-03": r5,
    "06-04": r5,
    "06-05": r5,
    "06-06": r5,
    "06-10": r5,

    "08-01": r1, // consider deprecation, hard for CBA
    "08-02": r5,
    "08-03": r1,

    "09-01": r15,
    "09-02": r1,
    "09-03": r1,
    "09-04": r1,
    "09-07": r1,
    "09-08": r1,
    "09-09": r5, // TODO: double checked, still closest is r1
    "09-10": r5,
    "09-13": r5,
    "09-14": r5,

    "13-01": r1,
    "13-02": r5,
    "13-03": r5,
    "13-04": r5,
    "13-05": r1,
    "13-06": r1,
    "13-07": r1, // TODO: changed to r1 check
    "13-08": r5,

    "18-01": r5,
    "18-02": r1,
    "18-03": r1,
    "18-04": r5,
    "18-05": r1,
    "18-06": r1, // double checked, closest is r1 still
    "18-07": r1,
    "18-08": r1,
    "18-09": r1,

    "19-01": r5,
    "19-02": r1,
    "19-03": r5,
    "19-04": r5,

    "20-01": r1,
    "20-02": r1,
    "20-03": r15,

    "21-01": r5,

    "22-01": r5,
    "22-02": r5,
    "22-04": r1, // wow, super calibrated to r1
    "22-05": r5,
    "22-06": r5,
    "22-07": r1,

    "23-01": r5,
    "23-02": r5,
  },
  lo: {
    "23-01": r1,
    "23-02": r5,
    "99-33": r5,
    "09-09": r15,
    "99-56": r15,
    "03-14": r5,
  },
  pcc: {
    "99-14": r5, // should be either deprecated, modified, or enjoy your 85% max with all the points
    "09-02": r5,
    "18-04": r5,
    "09-09": r5,
    "99-40": r5,
    "03-14": r5,
    "22-05": r5,
    "09-01": r5,
    "09-10": r15,
    "99-51": r15,
    "22-01": r5,
    "23-01": r1,
    "23-02": r15,
  },
};

export const recHHFFieldForDivisionAndClassifier = (
  division: string,
  classifier: string,
) => {
  const m = manual[division][classifier];
  if (!m) {
    return r1;
  }

  return m;
};

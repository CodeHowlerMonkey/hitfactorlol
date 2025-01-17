export const numSort = (a, b, field, order) => order * (a[field] - b[field]);

export const stringCompare = (a, b) => {
  if (a.toLowerCase() === b.toLowerCase()) {
    return 0;
  }

  if (a.toLowerCase() > b.toLowerCase()) {
    return 1;
  }
  return -1;
};

export const stringSort = (a, b, field, order) =>
  order * stringCompare(a[field], b[field]);

export const clubSort = (a, b, field, order) => {
  const aa = a[field].match(/[a-zA-Z]+|[0-9]+/g);
  const bb = b[field].match(/[a-zA-Z]+|[0-9]+/g);

  const stringSortResult = order * stringCompare(aa[0], bb[0]);
  if (!stringSortResult) {
    return order * (Number(aa[1]) - Number(bb[1]));
  }

  return stringSortResult;
};

export const dateSort = (a, b, field, order) =>
  order * (new Date(a[field]).getTime() - new Date(b[field]).getTime());

const letterRanks = ["X", "U", "D", "C", "B", "A", "M", "GM"];
export const classLetterSort = (a, b, field, order) => {
  const aa = field ? a[field] : a;
  const bb = field ? b[field] : b;
  return order * (letterRanks.indexOf(aa) - letterRanks.indexOf(bb));
};

// converts classifier code to sortable number, taking thee actual meaning behind first two
// digits (year) into account. For example 03-02 will be converted to 200302
const fullCodeNum = code =>
  Number(((code.startsWith("99") ? "19" : "20") + code).replace("-", ""));

export const classifierCodeSort = (a, b, field, order) =>
  order * (fullCodeNum(a[field]) - fullCodeNum(b[field]));

const singleFieldSort = (a, b, field, order) => {
  switch (field) {
    case "sd":
      return dateSort(a, b, field, order);

    case "hqClass":
    case "recClass":
    case "curHHFClass": {
      return classLetterSort(a, b, field, order);
    }

    default:
      if (typeof a[field] === "string") {
        return stringSort(a, b, field, order);
      }
      return numSort(a, b, field, order);
  }
};

export const multisortObj = (fields, orders) =>
  Object.fromEntries(
    (fields || []).map((f, i) => [f, Number(orders?.[i] || 0) > 0 ? 1 : -1]),
  );

export const multisort = (data = [], fields, orders) =>
  !fields?.length
    ? data
    : data.sort((a, b) => {
        for (const methodIndex in fields) {
          const field = fields[methodIndex];
          const orderString = orders[methodIndex];
          const order = Number(orderString) || -1;

          const sortResult = singleFieldSort(a, b, field, order);
          if (sortResult === 0) {
            continue;
          }

          return sortResult;
        }

        return 0;
      });

export const safeNumSort = field => (a, b) => {
  // sort by current to calculate currentRank
  // have to use Max and || 0 because U/X shooters need to be in the
  // output here (used in shooter info head), but can't mess up the
  // ranking due to null/-1/undefined values
  // note: || is used instead of ?? to convert NaN to 0 as well
  const aValue = field ? a[field] : a;
  const bValue = field ? b[field] : b;
  return Math.max(0, bValue || 0) - Math.max(0, aValue || 0);
};

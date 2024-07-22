export * from "./useTablePagination";
export * from "./useTableSort";

// TODO: move utils table here

export const renderPercentDiff = (c, { field }) => {
  const value = c[field];
  if ([undefined, NaN, null].includes(value)) {
    return "—";
  }

  return value.toFixed(2) + "%";
};

export const letterRatingForPercent = (p) => {
  if (p >= 98) {
    return "AAA";
  } else if (p >= 95) {
    return "AA";
  } else if (p >= 93) {
    return "A";
  } else if (p >= 91) {
    return "A-";
  } else if (p >= 88) {
    return "B+";
  } else if (p >= 85) {
    return "B";
  } else if (p >= 80) {
    return "B-";
  } else if (p >= 75) {
    return "C+";
  } else if (p >= 70) {
    return "C";
  } else if (p >= 65) {
    return "C-";
  } else if (p >= 60) {
    return "C--";
  } else {
    return "F";
  }

  return "F";
};

export const renderPercent = (c, { field }) => {
  let value = c[field];
  if (value < 0 || value === undefined) {
    return "—";
  }

  if (typeof value !== "number") {
    value = Number(value);
  }

  return value.toFixed(2) + "%";
};

export const renderHFOrNA = (c, { field }) => {
  let value = c[field];
  if (value < 0 || value === undefined || value === null) {
    return "—";
  }

  if (typeof value !== "number") {
    value = Number(value);
  }

  return value.toFixed(4);
};

export const renderClubIdMatchLink = (c, { field }) => {
  const content = c[field] || "";
  if (c.upload) {
    const title = content + "\n" + (c.matchName || "");
    return (
      <a
        target="_blank"
        href={`https://practiscore.com/results/new/${c.upload}`}
        title={title}
      >
        {content.split(" ").slice(0, 2).join(" ")}
      </a>
    );
  }

  return content;
};

export const headerTooltipOptions = {
  position: "top",
  style: { maxWidth: "300px" },
};

export const clubMatchColumn = {
  field: "clubid",
  header: "Club / Match",
  sortable: true,
  showFilterMenu: false,
  body: (c, { field }) => {
    const clubText = renderClubIdMatchLink(c, { field });
    return (
      <span
        style={{
          overflow: "hidden",
          display: "inline-block",
          maxWidth: "4em",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {clubText}
      </span>
    );
  },
};

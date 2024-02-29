import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Row, Column } from "../../components";
import { useApi } from "../../utils/client";
import { Checkbox } from "primereact/checkbox";
import { TabView, TabPanel } from "primereact/tabview";
import MultiProgress from "react-multi-progress";
import { SelectButton } from "primereact/selectbutton";

export const ClassificationsChart = ({
  division,
  includeU,
  apiData,
  bar,
  alignBy,
}) => {
  const data = [
    ...(!includeU && !!apiData
      ? []
      : [
          {
            title: apiData ? "U" : "Loading",
            value: apiData?.[division]?.["U"] ?? 0,
            color: "#939697",
          },
        ]),
    {
      title: apiData ? "D" : "",
      value: apiData?.[division]?.["D"] ?? 0,
      color: "#cc5e0d",
    },
    {
      title: apiData ? "C" : "",
      value: apiData?.[division]?.["C"] ?? 0,
      color: "#008627",
    },
    {
      title: apiData ? "B" : "",
      value: apiData?.[division]?.["B"] ?? 0,
      color: "#1a3bbd",
    },
    {
      title: apiData ? "A" : "",
      value: apiData?.[division]?.["A"] ?? 0,
      color: "#909",
    },
    {
      title: apiData ? "M" : "",
      value: apiData?.[division]?.["M"] ?? 0,
      color: "#994800",
    },
    {
      title: apiData ? "GM" : "",
      value: apiData?.[division]?.["GM"] ?? 0,
      color: "#000000",
    },
  ];

  const total = data.map((d) => d.value).reduce((a, b) => a + b);

  if (bar) {
    const shift = [
      0.15,
      0.15 + 0.4,
      0.15 + 0.4 + 0.25,
      0.15 + 0.4 + 0.25 + 0.12,
      0.15 + 0.4 + 0.25 + 0.12 + 0.06,
      1.0,
    ];
    const offset =
      alignBy < 0
        ? 1
        : data
            .filter((v, index) => index <= alignBy)
            .map((d) =>
              Number(parseFloat((100.0 * d.value) / total).toFixed(2))
            )
            .reduce((a, b) => a + b, 0);

    const shortName = {
      ltd: "Lim",
      l10: "L10",
      prod: "Prod",
      rev: "Rev",
      ss: "SS",
      co: "CO",
      lo: "LO",
      opn: "Open",
      pcc: "PCC",
    };

    return (
      <>
        <div
          style={{
            width: "600px",
            position: "relative",
            right: `${6 * offset - 600 * (shift[alignBy] ?? 0)}px`,
          }}
        >
          <MultiProgress
            elements={data.map((d) => ({
              ...d,
              showPercentage: true,
              value: Number(parseFloat((100.0 * d.value) / total).toFixed(2)),
            }))}
          />
        </div>
        <span
          style={{
            fontSize: 12,
            width: 60,
            textAlign: "right",
            position: "relative",
            right: `${6 * offset - 600 * shift[alignBy]}px`,
          }}
        >
          {shortName[division] ?? division}
        </span>
      </>
    );
  }

  return (
    <div style={{ margin: 8 }}>
      <PieChart
        data={data}
        style={{
          fontFamily:
            '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
          fontSize: "3.0px",
          fontWeight: "bold",
        }}
        lineWidth={60}
        label={({ dataEntry: { title, percentage, value } }) =>
          !value ? "" : `${title} ${value} (${percentage.toFixed(2)}%)`
        }
        labelPosition={72}
        labelStyle={(dataIndex) => ({
          fill: data[dataIndex].title === "GM" ? "red" : "#000",
          opacity: 0.75,
          pointerEvents: "none",
        })}
      />
    </div>
  );
};

const ModeSwitch = ({ mode, setMode, modes }) => (
  <SelectButton
    options={modes}
    value={mode}
    onChange={(e) => setMode(e.value)}
  />
);

// main "page" of this file
export const ClassificationStats = () => {
  const modes = ["By Class", "By Percent"];
  const [mode, setMode] = useState(modes[0]);
  const modeSwitchProps = { modes, mode, setMode };
  const modeBucket = mode === "By Percent" ? "byPercent" : "byClass";
  const [includeU, setChecked] = useState(false);
  const apiData = useApi("/classifications");
  const [alignBy, setAlignBy] = useState(-1);
  const items = [
    { name: "D", value: -1 },
    { name: "C", value: 0 },
    { name: "B", value: 1 },
    { name: "A", value: 2 },
    { name: "M", value: 3 },
    { name: "GM", value: 4 },
  ];

  return (
    <TabView>
      <TabPanel header="Pie Charts">
        <div className="card flex justify-content-center m-4">
          <ModeSwitch {...modeSwitchProps} />
        </div>
        <div className="card flex justify-content-center m-4">
          Include Unclassified
          <Checkbox
            onChange={(e) => setChecked(e.checked)}
            checked={includeU}
          />
        </div>
        <div>
          <Row height={400}>
            <div style={{ width: "50%", margin: "0 80px" }}>
              <ClassificationsChart
                includeU={includeU}
                division="all"
                label="All"
                apiData={apiData?.[modeBucket]}
              />
            </div>
          </Row>
          <Row>
            <span style={{ fontSize: 24 }}>All Divisions</span>
          </Row>
          <Row>
            <Column>
              <ClassificationsChart
                division="opn"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Open
            </Column>
            <Column>
              <ClassificationsChart
                division="co"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Carry Optics
            </Column>
            <Column>
              <ClassificationsChart
                division="lo"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Limited Optics
            </Column>
          </Row>
          <Row>
            <Column>
              <ClassificationsChart
                division="pcc"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              PCC
            </Column>
            <Column>
              <ClassificationsChart
                division="ltd"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Limited
            </Column>
            <Column>
              <ClassificationsChart
                division="l10"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Limited 10
            </Column>
          </Row>
          <Row>
            <Column>
              <ClassificationsChart
                division="prod"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Production
            </Column>
            <Column>
              <ClassificationsChart
                division="ss"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Single Stack
            </Column>
            <Column>
              <ClassificationsChart
                division="rev"
                includeU={includeU}
                apiData={apiData?.[modeBucket]}
              />
              Revolver
            </Column>
          </Row>
        </div>
      </TabPanel>

      <TabPanel header="Alignment">
        <div className="card flex justify-content-center m-4">
          <ModeSwitch {...modeSwitchProps} />
        </div>
        <div className="card flex justify-content-center m-4">
          <SelectButton
            value={alignBy}
            onChange={(e) => setAlignBy(e.value)}
            optionLabel="name"
            options={items}
          />
        </div>
        <div>
          <Row>
            <ClassificationsChart
              division="all"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="lo"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="l10"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="ss"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="co"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="ltd"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="prod"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="rev"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="pcc"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />
          </Row>
          <Row>
            <ClassificationsChart
              division="opn"
              apiData={apiData?.[modeBucket]}
              bar
              alignBy={alignBy}
            />{" "}
          </Row>
        </div>
        <div style={{ height: 24 }} />
        <Row>
          <ClassificationsChart
            division="Approx"
            apiData={apiData?.[modeBucket]}
            bar
          />{" "}
        </Row>
      </TabPanel>
    </TabView>
  );
};

export default ClassificationStats;

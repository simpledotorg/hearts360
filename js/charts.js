// This charts file is code to set up the interactive charts using
// the chartJS package - https://www.chartjs.org/

// [plugin] vertical intersect line
const dynamicChartSegementDashed = (
  ctx,
  numberOfXAxisTicks,
  numberOfDashedSegments = 1
) => {
  const dashStyle = [4, 3];
  const segmentStartIndex = ctx.p0DataIndex;
  return isSegmentDashed(
    segmentStartIndex,
    numberOfXAxisTicks,
    numberOfDashedSegments
  )
    ? dashStyle
    : undefined;
};

function isSegmentDashed(
  segmentStartIndex,
  numberOfXAxisTicks,
  segmentsToDashFromEnd
) {
  return segmentStartIndex >= numberOfXAxisTicks - (segmentsToDashFromEnd + 1);
}

function dashboardReportsChartJSColors() {
  return {
    darkGreen: "rgba(0, 122, 49, 1)",
    mediumGreen: "rgba(0, 184, 73, 1)",
    lightGreen: "rgba(242, 248, 245, 0.5)",
    darkRed: "rgba(184, 22, 49, 1)",
    mediumRed: "rgba(255, 51, 85, 1)",
    lightRed: "rgba(255, 235, 238, 0.5)",
    darkPurple: "rgba(83, 0, 224, 1)",
    lightPurple: "rgba(169, 128, 239, 0.5)",
    darkBlue: "rgba(12, 57, 102, 1)",
    mediumBlue: "rgba(0, 117, 235, 1)",
    lightBlue: "rgba(233, 243, 255, 0.75)",
    darkGrey: "rgba(108, 115, 122, 1)",
    mediumGrey: "rgba(173, 178, 184, 1)",
    lightGrey: "rgba(240, 242, 245, 0.9)",
    white: "rgba(255, 255, 255, 1)",
    amber: "rgba(250, 190, 70, 1)",
    darkAmber: "rgba(223, 165, 50, 1)",
    transparent: "rgba(0, 0, 0, 0)",
    teal: "rgba(48, 184, 166, 1)",
    darkTeal: "rgba(34,140,125,1)",
    maroon: "rgba(71, 0, 0, 1)",
    darkMaroon: "rgba(60,0,0,1)",
    orange: "rgb(223,104,15)",
    lightOrange: "rgba(255,156,8,0.15)",
  };
}

function baseLineChartConfig() {
  const colors = dashboardReportsChartJSColors();
  return {
    type: "line",
    options: {
      animation: false,
      clip: false,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 26,
          bottom: 0,
        },
      },
      elements: {
        point: {
          pointStyle: "circle",
          pointBackgroundColor: colors.white,
          hoverBackgroundColor: colors.white,
          borderWidth: 2,
          hoverRadius: 4,
          hoverBorderWidth: 2,
        },
        line: {
          tension: 0.4,
          borderWidth: 2,
          fill: true,
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          // enabled: false,
          displayColors: false,
          caretPadding: 6,
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            color: colors.darkGrey,
            font: {
              // family: "var(--system-ui)",
              size: 11,
            },
            padding: 6,
            showLabelBackdrop: true,
          },
          beginAtZero: true,
          min: 0,
        },
        y: {
          stacked: false,
          border: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            color: colors.darkGrey,
            font: {
              // family: "var(--system-ui)",
              size: 10,
            },
            padding: 8,
            stepSize: 25,
          },
          beginAtZero: true,
          min: 0,
          max: 100,
        },
      },
    },
    plugins: [intersectDataVerticalLine],
  };
}

intersectDataVerticalLine = {
  id: "intersectDataVerticalLine",
  beforeDraw: (chart) => {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const ctx = chart.ctx;
      ctx.save();
      const activePoint = chart.tooltip._active[0];
      const chartArea = chart.chartArea;
      // grey vertical hover line - full chart height
      ctx.beginPath();
      ctx.moveTo(activePoint.element.x, chartArea.top);
      ctx.lineTo(activePoint.element.x, chartArea.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0,0,0, 0.1)";
      ctx.stroke();
      ctx.restore();
      // colored vertical hover line - ['node' point to chart bottom] - only for line graphs (graphs with 1 data point)
      if (chart.tooltip._active.length === 1) {
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, activePoint.element.y);
        ctx.lineTo(activePoint.element.x, chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }
  },
};

function createChart(ctx, config) {
  new Chart(ctx, config);
}

// BP Controlled
const bpControlledData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "BP controlled",
      data: [
        28, 23, 32, 34, 43, 34, 43, 44, 46, 43, 52, 57, 57, 59, 56, 60, 61, 55,
      ],
      borderColor: "#3BB231",
      backgroundColor: "rgba(69, 205, 57, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const bpControlledConfig = baseLineChartConfig();
bpControlledConfig.data = bpControlledData;
const percentageLabel = (context) => {
  return `${context.dataset.label}: ${context.parsed.y}%`;
};
bpControlledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
bpControlledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
const bpControlledCanvas = document.getElementById("bpcontrolled");
if (bpControlledCanvas) {
  createChart(bpControlledCanvas, bpControlledConfig);
}

// Hypertension: BP Uncontrolled
const bpUncontrolledData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "BP uncontrolled",
      data: [
        54, 51, 46, 45, 44, 47, 37, 33, 36, 37, 30, 28, 24, 24, 18, 17, 17, 20,
      ],
      borderColor: "#D19600",
      backgroundColor: "rgba(255, 201, 63, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const bpUncontrolledConfig = baseLineChartConfig();
bpUncontrolledConfig.data = bpUncontrolledData;
bpUncontrolledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
bpUncontrolledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
const bpUncontrolledCanvas = document.getElementById("bpuncontrolled");
if (bpUncontrolledCanvas) {
  createChart(bpUncontrolledCanvas, bpUncontrolledConfig);
}

// Hypertension: No visit in 3 months
const ltfu3MonthData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "No visit in past 3 months",
      data: [
        18, 26, 22, 21, 13, 19, 20, 23, 18, 20, 18, 15, 19, 17, 26, 21, 22, 25,
      ],
      borderColor: "#ed6300",
      backgroundColor: "rgba(230, 137, 70, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const ltfu3MonthConfig = baseLineChartConfig();
ltfu3MonthConfig.data = ltfu3MonthData;
ltfu3MonthConfig.options.plugins.tooltip.callbacks = { label: percentageLabel };
ltfu3MonthConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

const ltfu3MonthCanvas = document.getElementById("ltfu3Month");
if (ltfu3MonthCanvas) {
  createChart(ltfu3MonthCanvas, ltfu3MonthConfig);
}

// Hypertension: Registrations
const registrationsData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Cumulative registrations",
      data: [
        3074, 3719, 3989, 4308, 4958, 5338, 5705, 5975, 6284, 6762, 7019, 7523,
        8043, 8941, 9906, 11062, 12105, 12213,
      ],
      borderColor: "#007ee4",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      label: "Patients under care",
      data: [
        3063, 3716, 3984, 4301, 4903, 5217, 5505, 5678, 5895, 6223, 6438, 6768,
        7146, 7882, 8649, 9648, 10539, 10632,
      ],
      borderColor: "#b51bdc",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      type: "bar",
      label: "Monthly registrations",
      data: [
        786, 303, 270, 319, 650, 380, 285, 270, 309, 362, 257, 504, 520, 604,
        965, 1156, 1043, 236,
      ],
      borderColor: "#BEDFF9",
      backgroundColor: "#BEDFF9",
      yAxisID: "yMonthlyRegistrations",
    },
  ],
};

const registrationsConfig = baseLineChartConfig();
registrationsConfig.data = registrationsData;
registrationsConfig.options.scales.y.grid = { drawTicks: false };
registrationsConfig.options.scales.y.ticks.display = false;
registrationsConfig.options.scales.y.ticks.count = 3;
registrationsConfig.options.scales.y.max = 12105;
registrationsConfig.options.scales.y.ticks.stepSize = 6052;

registrationsConfig.options.scales.yMonthlyRegistrations = {
  display: false,
  beginAtZero: true,
  max: 1156,
};

registrationsConfig.options.plugins.tooltip.displayColors = true;
registrationsConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};
const registrationsCanvas = document.getElementById("registrations");
if (registrationsCanvas) {
  createChart(registrationsCanvas, registrationsConfig);
}

// Hypertension: Lost to follow-up
const ltfu12MonthsData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "12 month lost to follow-up",
      data: [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 6, 6, 7, 8, 9, 10, 10],
      borderColor: "#FF3355",
      backgroundColor: "rgba(255, 51, 85, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const ltfu12MonthsConfig = baseLineChartConfig();
ltfu12MonthsConfig.data = ltfu12MonthsData;
ltfu12MonthsConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
ltfu12MonthsConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

const ltfu12MonthsCanvas = document.getElementById("ltfu12Months");
if (ltfu12MonthsCanvas) {
  createChart(ltfu12MonthsCanvas, ltfu12MonthsConfig);
}

// Hypertension opportunistic screening
const screeningsData = {
  labels: [
    "Mar-2022",
    "Apr-2022",
    "May-2022",
    "Jun-2022",
    "Jul-2022",
    "Aug-2022",
    "Sep-2022",
    "Oct-2022",
    "Nov-2022",
    "Dec-2022",
    "Jan-2023",
    "Feb-2023",
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
  ],
  datasets: [
    {
      label: "% of patients screened",
      data: [
        10, 15, 16, 12, 11, 10, 9, 11, 14, 20, 22, 23, 23, 24, 23, 24, 23, 6,
      ],
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
      borderColor: "#34AEA0",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      type: "bar",
      label: "Monthly screenings",
      data: [
        2000, 2200, 2300, 2200, 1600, 1800, 3400, 3600, 3900, 5800, 5700, 5600,
        6600, 6200, 6000, 6500, 6900, 500,
      ],
      borderColor: "#C5E5E2",
      backgroundColor: "#C5E5E2",
      yAxisID: "yMonthlyscreenings",
    },
  ],
};

const screeningsConfig = baseLineChartConfig();
screeningsConfig.data = screeningsData;
console.log(screeningsConfig.options.scales.y);
screeningsConfig.options.scales.y.grid = { drawTicks: false };
screeningsConfig.options.scales.y.ticks.display = false;
screeningsConfig.options.scales.y.ticks.count = 5;
screeningsConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
screeningsConfig.options.scales.y.max = 100;

screeningsConfig.options.scales.yMonthlyscreenings = {
  display: false,
  beginAtZero: true,
  max: 7000,
};

screeningsConfig.options.plugins.tooltip.displayColors = true;
screeningsConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};

const screeningsCanvas = document.getElementById("screenings");
if (screeningsCanvas) {
  createChart(screeningsCanvas, screeningsConfig);
}

// Anti-hypertensive drug stock

const drugStockData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Facilities with >30 days of Step 1 drugs",
      data: [
        96, 94, 90, 80, 70, 70, 71, 72, 73, 74, 75, 76, 78, 86, 96, 95, 94, 94,
      ],
      borderColor: "#222",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
    {
      label: "Facilities with >30 days of Step 2 drugs",
      data: [
        86, 84, 80, 70, 40, 30, 31, 32, 33, 34, 30, 46, 48, 46, 56, 55, 64, 64,
      ],
      borderColor: "#D8DB56",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
    {
      label: "Facilities with >30 days of Step 3 drugs",
      data: [
        90, 92, 92, 90, 90, 90, 91, 92, 93, 94, 90, 96, 98, 92, 94, 92, 92, 90,
      ],
      borderColor: "#18D6A8",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const drugStockConfig = baseLineChartConfig();
drugStockConfig.data = drugStockData;
const stockLabel = (context) => {
  return `${context.dataset.label}: ${context.parsed.y}%`;
};
drugStockConfig.options.plugins.tooltip.callbacks = {
  label: stockLabel,
};
drugStockConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

drugStockConfig.options.plugins.tooltip.displayColors = true;
drugStockConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};

const drugStockCanvas = document.getElementById("drugstock");
if (drugStockCanvas) {
  createChart(drugStockCanvas, drugStockConfig);
}

// DM Controlled
const dmControlledData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Blood sugar controlled",
      data: [
        12, 18, 19, 14, 10, 12, 13, 14, 16, 18, 20, 22, 20, 16, 14, 17, 20, 22,
      ],
      borderColor: "#3BB231",
      backgroundColor: "rgba(69, 205, 57, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const dmControlledConfig = baseLineChartConfig();
dmControlledConfig.data = dmControlledData;
dmControlledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
dmControlledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
const dmControlledCanvas = document.getElementById("dmcontrolled");
if (dmControlledCanvas) {
  createChart(dmControlledCanvas, dmControlledConfig);
}

//DM: Uncontrolled
const dmUncontrolledData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Blood sugar not controlled (total)",
      data: [
        50, 46, 49, 56, 62, 61, 61, 64, 61, 60, 56, 56, 60, 58, 64, 62, 58, 56,
      ],
      borderColor: "#D19600",
      backgroundColor: "transparent",
      yAxisID: "y",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
    {
      type: "bar",
      label: "FBS ≥200 mg/dL or HbA1c ≥9%",
      data: [
        15, 14, 15, 17, 19, 18, 18, 19, 18, 18, 17, 17, 18, 17, 19, 19, 17, 17,
      ],
      borderColor: "rgba(249, 191, 45, 0.8)",
      backgroundColor: "rgba(249, 191, 45, 0.8)",
      yAxisID: "y",
    },
    {
      type: "bar",
      label: "FBS 126-199 mg/dL or HbA1c 7-8.9%",
      data: [
        35, 32, 34, 39, 43, 43, 43, 45, 43, 42, 39, 39, 42, 41, 45, 43, 41, 39,
      ],
      borderColor: "rgba(244, 212, 128, 0.6)",
      backgroundColor: "rgba(244, 212, 128, 0.6)",
      yAxisID: "y",
    },
  ],
};

const dmUncontrolledConfig = baseLineChartConfig();
dmUncontrolledConfig.data = dmUncontrolledData;
dmUncontrolledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

dmUncontrolledConfig.options.scales.x.stacked = true;
dmUncontrolledConfig.options.scales.y.stacked = true;

dmUncontrolledConfig.options.plugins.tooltip.displayColors = true;
dmUncontrolledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};

const dmUncontrolledCanvas = document.getElementById("dmuncontrolled");
if (dmUncontrolledCanvas) {
  createChart(dmUncontrolledCanvas, dmUncontrolledConfig);
}

// DM: No visit in 3 months
const dmLtfu3MonthData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "No visit in past 3 months",
      data: [
        38, 36, 32, 30, 28, 27, 26, 22, 23, 22, 24, 22, 20, 26, 22, 21, 22, 22,
      ],
      borderColor: "#ed6300",
      backgroundColor: "rgba(230, 137, 70, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const dmLtfu3MonthConfig = baseLineChartConfig();
dmLtfu3MonthConfig.data = dmLtfu3MonthData;
dmLtfu3MonthConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
dmLtfu3MonthConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

const dmLtfu3MonthCanvas = document.getElementById("dmLtfu3Month");
if (dmLtfu3MonthCanvas) {
  createChart(dmLtfu3MonthCanvas, dmLtfu3MonthConfig);
}

//DM: Registrations

const dmRegistrationsData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Cumulative registrations",
      data: [
        900, 1000, 1100, 1200, 1400, 1500, 2000, 2500, 2750, 3000, 3200, 3500,
        3750, 3900, 4000, 4050, 4100, 4150,
      ],
      borderColor: "#007ee4",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      label: "Patients under care",
      data: [
        720, 810, 900, 990, 1180, 1250, 1700, 2150, 2350, 2580, 2750, 3030,
        3250, 3380, 3440, 3470, 3500, 3500,
      ],
      borderColor: "#b51bdc",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      type: "bar",
      label: "Monthly registrations",
      data: [
        150, 100, 100, 100, 200, 100, 500, 500, 250, 250, 200, 300, 250, 150,
        100, 50, 50, 50,
      ],
      borderColor: "#BEDFF9",
      backgroundColor: "#BEDFF9",
      yAxisID: "yMonthlyRegistrations",
    },
  ],
};

const dmRegistrationsConfig = baseLineChartConfig();
dmRegistrationsConfig.data = dmRegistrationsData;
dmRegistrationsConfig.options.scales.y.grid = { drawTicks: false };
dmRegistrationsConfig.options.scales.y.ticks.display = false;
dmRegistrationsConfig.options.scales.y.max = 4150;
dmRegistrationsConfig.options.scales.y.ticks.count = 3;
dmRegistrationsConfig.options.scales.y.ticks.stepSize = 2075;

dmRegistrationsConfig.options.scales.yMonthlyRegistrations = {
  display: false,
  beginAtZero: true,
  max: 500,
};

dmRegistrationsConfig.options.plugins.tooltip.displayColors = true;
dmRegistrationsConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};
const dmRegistrationsCanvas = document.getElementById("dmregistrations");
if (dmRegistrationsCanvas) {
  createChart(dmRegistrationsCanvas, dmRegistrationsConfig);
}

// DM: Lost to follow-up
const dmLtfu12MonthsData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "12 month lost to follow-up",
      data: [
        20, 19, 18, 18, 18, 16, 17, 15, 14, 15, 14, 14, 13, 13, 13, 14, 14, 15,
        16,
      ],
      borderColor: "#FF3355",
      backgroundColor: "rgba(255, 51, 85, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const dmLtfu12MonthsConfig = baseLineChartConfig();
dmLtfu12MonthsConfig.data = dmLtfu12MonthsData;
dmLtfu12MonthsConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
dmLtfu12MonthsConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

const dmLtfu12MonthsCanvas = document.getElementById("dmltfu12months");
if (dmLtfu12MonthsCanvas) {
  createChart(dmLtfu12MonthsCanvas, dmLtfu12MonthsConfig);
}

// DM opportunistic screening
const dmScreeningsData = {
  labels: [
    "Mar-2022",
    "Apr-2022",
    "May-2022",
    "Jun-2022",
    "Jul-2022",
    "Aug-2022",
    "Sep-2022",
    "Oct-2022",
    "Nov-2022",
    "Dec-2022",
    "Jan-2023",
    "Feb-2023",
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
  ],
  datasets: [
    {
      label: "% of patients screened",
      data: [8, 6, 8, 7, 8, 6, 7, 7, 8, 9, 10, 10, 10, 9, 10, 12, 16, 2],
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
      borderColor: "#34AEA0",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      type: "bar",
      label: "Monthly screenings",
      data: [
        2400, 1500, 1500, 1800, 1500, 1800, 1800, 2100, 2400, 2700, 3000, 3000,
        3000, 2700, 3000, 3600, 4800, 600,
      ],
      borderColor: "#C5E5E2",
      backgroundColor: "#C5E5E2",
      yAxisID: "yMonthlyscreenings",
    },
  ],
};

const dmScreeningsConfig = baseLineChartConfig();
dmScreeningsConfig.data = dmScreeningsData;
console.log(dmScreeningsConfig.options.scales.y);
dmScreeningsConfig.options.scales.y.grid = { drawTicks: false };
dmScreeningsConfig.options.scales.y.ticks.display = false;
dmScreeningsConfig.options.scales.y.ticks.count = 5;
dmScreeningsConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
dmScreeningsConfig.options.scales.y.max = 100;

dmScreeningsConfig.options.scales.yMonthlyscreenings = {
  display: false,
  beginAtZero: true,
  max: 5000,
};

dmScreeningsConfig.options.plugins.tooltip.displayColors = true;
dmScreeningsConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};

const dmScreeningsCanvas = document.getElementById("dmscreenings");
if (dmScreeningsCanvas) {
  createChart(dmScreeningsCanvas, dmScreeningsConfig);
}

// DM: Statins
const dmStatinsData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Prescribed statins",
      data: [
        30, 32, 35, 42, 38, 36, 37, 38, 40, 36, 40, 42, 50, 45, 60, 64, 66, 64,
      ],
      borderColor: "#666666",
      backgroundColor: "rgba(100, 100, 100, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const dmStatinsConfig = baseLineChartConfig();
dmStatinsConfig.data = dmStatinsData;
dmStatinsConfig.options.plugins.tooltip.callbacks = { label: percentageLabel };
dmStatinsConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

const dmStatinsCanvas = document.getElementById("dmstatins");
if (dmStatinsCanvas) {
  createChart(dmStatinsCanvas, dmStatinsConfig);
}

// Co-morbid Hypertension and Diabetes: BP Uncontrolled
const comorbidControlledData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "BP controlled",
      data: [
        26, 28, 31, 30, 30, 32, 36, 38, 39, 41, 40, 42, 45, 44, 45, 47, 50, 48,
      ],
      borderColor: "#3BB231",
      backgroundColor: "rgba(69, 205, 57, 0.1)",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const comorbidControlledConfig = baseLineChartConfig();
comorbidControlledConfig.data = comorbidControlledData;
comorbidControlledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
comorbidControlledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
const comorbidControlledCanvas = document.getElementById("comodrbidcontrolled");
if (comorbidControlledCanvas) {
  createChart(comorbidControlledCanvas, comorbidControlledConfig);
}

// Diabetes controlled BP chart
const dmBPControlledData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "BP controlled <140/90",
      data: [
        26, 28, 31, 30, 30, 32, 36, 38, 39, 41, 40, 42, 45, 44, 45, 47, 50, 49,
      ],
      borderColor: "#3BB231",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
    {
      label: "BP controlled <130/80",
      data: [
        9, 11, 13, 16, 17, 20, 18, 24, 25, 26, 26, 25, 27, 29, 32, 30, 35, 38,
      ],
      borderColor: "#096301",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const dmBPControlledConfig = baseLineChartConfig();
dmBPControlledConfig.data = dmBPControlledData;
dmBPControlledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
dmBPControlledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
const dmBPControlledCanvas = document.getElementById("dmBpControlled");
if (dmBPControlledCanvas) {
  createChart(dmBPControlledCanvas, dmBPControlledConfig);
}

// Diabetes drug stock

const dmDrugStockData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Facilities with >30 days of Metformin",
      data: [
        96, 94, 90, 80, 70, 70, 71, 72, 73, 74, 75, 76, 78, 86, 96, 95, 94, 94,
      ],
      borderColor: "#222",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
    {
      label: "Facilities with >30 days of Glimeperide",
      data: [
        86, 84, 80, 70, 40, 30, 31, 32, 33, 34, 30, 46, 48, 46, 56, 55, 64, 64,
      ],
      borderColor: "#D8DB56",
      backgroundColor: "transparent",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const dmDrugStockConfig = baseLineChartConfig();
dmDrugStockConfig.data = dmDrugStockData;

dmDrugStockConfig.options.plugins.tooltip.callbacks = {
  label: stockLabel,
};
dmDrugStockConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};

dmDrugStockConfig.options.plugins.tooltip.displayColors = true;
dmDrugStockConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};

const dmDrugStockCanvas = document.getElementById("dmdrugstock");
if (dmDrugStockCanvas) {
  createChart(dmDrugStockCanvas, dmDrugStockConfig);
}

// Patients protected
const patientsProtectedData = {
  labels: [
    "Aug-2021",
    "Sep-2021",
    "Oct-2021",
    "Nov-2021",
    "Dec-2021",
    "Jan-2022",
    "Feb-2022",
    "Mar-2022",
    "Apr-2022",
    "May-2022",
    "Jun-2022",
    "Jul-2022",
    "Aug-2022",
    "Sep-2022",
    "Oct-2022",
    "Nov-2022",
    "Dec-2022",
    "Jan-2023",
    "Feb-2023",
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
  ],
  datasets: [
    {
      label: "Patients with BP <140/90",
      data: [
        10, 120, 140, 160, 130, 120, 150, 200, 260, 310, 400, 450, 500, 550,
        600, 650, 700, 710, 720, 750, 800, 830, 880, 908, 1244, 1412, 1646,
        1800, 2644, 2809, 3087, 3245, 3688, 3867, 4106, 4808,
      ],
      borderColor: "#3BB231",
      backgroundColor: "rgba(69, 205, 57, 0.1)",
    },
  ],
};

const patientsProtectedConfig = baseLineChartConfig();
patientsProtectedConfig.data = patientsProtectedData;
patientsProtectedConfig.options.scales.y.grid = { drawTicks: false };
patientsProtectedConfig.options.scales.y.ticks.display = true;
patientsProtectedConfig.options.scales.y.ticks.count = 10;
patientsProtectedConfig.options.scales.y.max = 5000;
patientsProtectedConfig.options.scales.y.ticks.stepSize = 500;

const patientsProtectedCanvas = document.getElementById("patientsprotected");
if (patientsProtectedCanvas) {
  createChart(patientsProtectedCanvas, patientsProtectedConfig);
}

// -- Overdue dashboard

// Overdue: At start of month
const overdueData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Overdue patients",
      data: [
        58, 54, 53, 52, 44, 39, 37, 40, 38, 37, 31, 28, 25, 28, 29, 30, 26, 25,
      ],
      borderColor: "#E77215",
      backgroundColor: "#E7721525",
      yAxisID: "y",
    },
  ],
};

const overdueConfig = baseLineChartConfig();
overdueConfig.data = overdueData;
// overdueConfig.options.scales.y.grid = { drawTicks: false };
// overdueConfig.options.scales.y.ticks.display = false;
overdueConfig.options.scales.y.ticks.count = 3;
overdueConfig.options.scales.y.max = 100;
// overdueConfig.options.scales.y.ticks.stepSize = 6052;

overdueConfig.options.scales.yMonthlyRegistrations = {
  display: false,
  beginAtZero: true,
  max: 1156,
};

overdueConfig.options.plugins.tooltip.displayColors = true;
overdueConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};
const overdueCanvas = document.getElementById("overdue");
if (overdueCanvas) {
  createChart(overdueCanvas, overdueConfig);
}

// Overdue: Contacted
const overdueContactedData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Overdue patients contacted",
      data: [0, 5, 0, 0, 8, 12, 16, 22, 12, 10, 14, 25, 30, 22, 20, 21, 42, 10],
      borderColor: "#edbe00",
      backgroundColor: "#edbe0025",
      yAxisID: "y",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18 // number of data elements
          ),
      },
    },
  ],
};

const overdueContactedConfig = baseLineChartConfig();
overdueContactedConfig.data = overdueContactedData;
overdueContactedConfig.options.scales.y.grid = { drawTicks: false };
overdueContactedConfig.options.scales.y.max = 100;

bpControlledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
bpControlledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
overdueContactedConfig.options.plugins.tooltip.displayColors = true;
overdueContactedConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};
const overdueContactedCanvas = document.getElementById("overdueContacted");
if (overdueContactedCanvas) {
  createChart(overdueContactedCanvas, overdueContactedConfig);
}

// Overdue: Returned to care
const overdueReturnedData = {
  labels: [
    "Mar-2023",
    "Apr-2023",
    "May-2023",
    "Jun-2023",
    "Jul-2023",
    "Aug-2023",
    "Sep-2023",
    "Oct-2023",
    "Nov-2023",
    "Dec-2023",
    "Jan-2024",
    "Feb-2024",
    "Mar-2024",
    "Apr-2024",
    "May-2024",
    "Jun-2024",
    "Jul-2024",
    "Aug-2024",
  ],
  datasets: [
    {
      label: "Overdue patients returned to care",
      data: [
        0, 25, 0, 0, 10, 12, 22, 40, 24, 55, 60, 62, 44, 50, 33, 36, 58, 15,
      ],
      borderColor: "#5300e0",
      backgroundColor: "#5300e010",
      yAxisID: "y",
      segment: {
        borderDash: (ctx) =>
          dynamicChartSegementDashed(
            ctx,
            18, // number of data elements,
            2
          ),
      },
    },
  ],
};

const overdueReturnedConfig = baseLineChartConfig();
overdueReturnedConfig.data = overdueReturnedData;

overdueReturnedConfig.options.scales.yMonthlyRegistrations = {
  display: false,
  beginAtZero: true,
  max: 1156,
};

overdueReturnedConfig.options.plugins.tooltip.displayColors = true;
overdueReturnedConfig.options.plugins.tooltip.callbacks = {
  labelColor: function (context) {
    return {
      borderColor: "#fff",
      backgroundColor: context.dataset.borderColor,
      borderWidth: 1,
    };
  },
};

bpControlledConfig.options.scales.y.ticks.callback = (val) => {
  return val + "%";
};
bpControlledConfig.options.plugins.tooltip.callbacks = {
  label: percentageLabel,
};
const overdueReturnedCanvas = document.getElementById("overdueReturned");
if (overdueReturnedCanvas) {
  createChart(overdueReturnedCanvas, overdueReturnedConfig);
}

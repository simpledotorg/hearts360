// This charts file is code to set up the interactive charts using
// the chartJS package - https://www.chartjs.org/

// [plugin] vertical instersect line
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
// tooltip: {
//   callbacks: {
//     afterBody: function(context) {
//       console.log(context);
//       return context.element + '%'
//     }
//   }
// }
const bpControlledCanvas = document.getElementById("bpcontrolled");
createChart(bpControlledCanvas, bpControlledConfig);

// BP Uncontrolled
// BP Controlled
const bpUncontrolledData = {
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
      label: "BP uncontrolled",
      data: [
        54, 51, 46, 45, 44, 47, 37, 33, 36, 37, 30, 28, 24, 24, 18, 17, 17, 20,
      ],
      borderColor: "#F6B100",
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
console.log(bpUncontrolledCanvas);
createChart(bpUncontrolledCanvas, bpUncontrolledConfig);

const ltfu3MonthData = {
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
      label: "3 month lost to follow-up",
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
console.log(bpUncontrolledCanvas);
createChart(ltfu3MonthCanvas, ltfu3MonthConfig);

const registrationsData = {
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
      backgroundColor: "#BEDFF9",
      yAxisID: "yMonthlyRegistrations",
    },
  ],
};

const registrationsConfig = baseLineChartConfig();
registrationsConfig.data = registrationsData;
console.log(registrationsConfig.options.scales.y);
registrationsConfig.options.scales.y.grid = { drawTicks: false };
registrationsConfig.options.scales.y.ticks.display = false;
registrationsConfig.options.scales.y.ticks.count = 5;
registrationsConfig.options.scales.y.max = 12105;

registrationsConfig.options.scales.yMonthlyRegistrations = {
  display: false,
  beginAtZero: true,
  max: 1156,
};

registrationsConfig.options.plugins.tooltip.displayColors = true;

const registrationsCanvas = document.getElementById("registrations");
createChart(registrationsCanvas, registrationsConfig);

const ltfu12MonthsData = {
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
console.log(bpUncontrolledCanvas);
createChart(ltfu12MonthsCanvas, ltfu12MonthsConfig);

// Drug stock

const drugStockData = {
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

drugStockConfig.options.plugins.tooltip.displayColors = true;

const drugStockCanvas = document.getElementById("drugstock");
createChart(drugStockCanvas, drugStockConfig);

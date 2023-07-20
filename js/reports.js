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
  ],
  datasets: [
    {
      label: "BP controlled",
      data: [24, 30, 25, 32, 34, 43, 38, 40, 44, 48, 46, 52, 57, 57, 60, 54, 60, 61],
      borderColor: '#3BB231',
      backgroundColor: 'rgba(69, 205, 57, 0.1)',
    },
  ],
};


const bpControlledConfig = baseLineChartConfig();
bpControlledConfig.data = bpControlledData;
const percentageLabel = (context) => {
  return `${context.dataset.label}: ${context.parsed.y}%`
};
bpControlledConfig.options.plugins.tooltip.callbacks = { label: percentageLabel }
// tooltip: {
//   callbacks: {
//     afterBody: function(context) {
//       console.log(context);
//       return context.element + '%'
//     }
//   }
// }
const bpControlledCanvas = document.getElementById("bpcontrolled");
createChart(bpControlledCanvas, bpControlledConfig)

// BP Uncontrolled
// BP Controlled
const bpUncontrolledData = {
  labels: [
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
  ],
  datasets: [
    {
      label: "BP uncontrolled",
      data: [51, 58, 53, 46, 45, 45, 48, 35, 33, 40, 38, 30, 28, 24, 26, 17, 15, 17],
      borderColor: '#F6B100',
      backgroundColor: 'rgba(255, 201, 63, 0.1)',
    },
  ],
};

const bpUncontrolledConfig = baseLineChartConfig();
bpUncontrolledConfig.data = bpUncontrolledData;
bpUncontrolledConfig.options.plugins.tooltip.callbacks = { label: percentageLabel }

const bpUncontrolledCanvas = document.getElementById("bpuncontrolled");
console.log(bpUncontrolledCanvas);
createChart(bpUncontrolledCanvas, bpUncontrolledConfig)

const ltfu3MonthData = {
  labels: [
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
  ],
  datasets: [
    {
      label: "3 month lost to follow up",
      data: [25, 21, 28, 22, 21, 14, 21, 21, 21, 19, 20, 18, 15, 19, 17, 25, 20, 22],
      borderColor: '#ed6300',
      backgroundColor: 'rgba(230, 137, 70, 0.1)',
    },
  ],
};

const ltfu3MonthConfig = baseLineChartConfig();
ltfu3MonthConfig.data = ltfu3MonthData;
ltfu3MonthConfig.options.plugins.tooltip.callbacks = { label: percentageLabel }

const ltfu3MonthCanvas = document.getElementById("ltfu3Month");
console.log(bpUncontrolledCanvas);
createChart(ltfu3MonthCanvas, ltfu3MonthConfig)

const registrationsData = {
  labels: [
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
  ],
  datasets: [
    {
      label: "Registrations",
      data: [
        8731, 8834, 8974, 9244, 9563, 10213, 10593, 10873, 11143, 11452, 11814, 12071, 12575, 13095, 13695, 14660, 15703,
        16705,
      ],
      borderColor: "#afb2b9",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      label: "Patients under care",
      data: [
        60, 65, 47, 47, 42, 44, 51, 35, 36, 41, 29, 32, 36, 30, 15, 18, 24, 18,
      ],
      borderColor: "#7B7F8A",
      backgroundColor: "transparent",
      yAxisID: "y",
    },
    {
      type: "bar",
      label: "Monthly registrations",
      data: [
        119, 103, 140, 270, 319, 650, 380, 280, 270, 309, 362, 257, 504, 520,
        600, 965, 1043, 1002,
      ],
      // borderColor: "#7B7F8A",
      backgroundColor: "rgba(163, 169, 184, 0.4)",
      yAxisID: "yMonthlyRegistrations",
    },
  ],
};

const registrationsConfig = baseLineChartConfig();
registrationsConfig.data = registrationsData;
console.log(registrationsConfig.options.scales.y);
registrationsConfig.options.scales.y.grid = { drawTicks: false };
registrationsConfig.options.scales.y.ticks.display = false;
registrationsConfig.options.scales.y.ticks.count = 3;
registrationsConfig.options.scales.y.max = 16705;

registrationsConfig.options.scales.yMonthlyRegistrations = {
  display: false,
  beginAtZero: true,
  max: 1043,
};

const registrationsCanvas = document.getElementById("registrations");
createChart(registrationsCanvas, registrationsConfig);

const ltfu12MonthsData = {
  labels: [
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
  ],
  datasets: [
    {
      label: "12 month lost to follow up",
      data: [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 6, 6, 7, 8, 9, 10],
      borderColor: '#FF3355',
      backgroundColor: 'rgba(255, 51, 85, 0.1)',
    },
  ],
};

const ltfu12MonthsConfig = baseLineChartConfig();
ltfu12MonthsConfig.data = ltfu12MonthsData;
ltfu12MonthsConfig.options.plugins.tooltip.callbacks = { label: percentageLabel }

const ltfu12MonthsCanvas = document.getElementById("ltfu12Months");
console.log(bpUncontrolledCanvas);
createChart(ltfu12MonthsCanvas, ltfu12MonthsConfig)

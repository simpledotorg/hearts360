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
    overdueCalledChartLineDarkYellow: "rgba(228, 180, 57, 1)",
    overdueCalledChartFillLightGreen: "rgba(41,181,0,0.2)",
    overdueCalledChartFillLightYellow: "rgba(255,241,49,0.25)",
    overdueCalledChartFillLightRed: "rgba(255,146,122,0.2)",
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
          enabled: false,
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
      label: "Dataset 1",
      data: [22, 25, 20, 18, 18, 24, 28, 33, 55, 48, 50, 52, 55, 49, 37, 51, 62, 66],
      borderColor: dashboardReportsChartJSColors().mediumBlue,
      backgroundColor: dashboardReportsChartJSColors().lightBlue,
    },
  ],
};

const bpControlledConfig = baseLineChartConfig();
bpControlledConfig.data = bpControlledData;

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
      label: "Dataset 1",
      data: [60, 65, 47, 47, 42, 44, 51, 35, 36, 41, 29, 32, 36, 30, 15, 18, 24, 18],
      borderColor: dashboardReportsChartJSColors().mediumBlue,
      backgroundColor: dashboardReportsChartJSColors().lightBlue,
    },
  ],
};

const bpUncontrolledConfig = baseLineChartConfig();
bpUncontrolledConfig.data = bpUncontrolledData;

const bpUncontrolledCanvas = document.getElementById("bpuncontrolled");
console.log(bpUncontrolledCanvas);
createChart(bpUncontrolledCanvas, bpUncontrolledConfig)

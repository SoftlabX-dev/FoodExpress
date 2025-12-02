import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaCalendarAlt, FaArrowUp } from "react-icons/fa";
import "./RevenueTrendsChart.css";
import { ClientApi } from "../../ClientApi/ClientApi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Custom number formatter: no commas, removes trailing zeros
const formatRevenue = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";

  // Convert to number
  const num = parseFloat(value);

  // If it's a whole number, return it without decimals
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Format with up to 2 decimal places, remove trailing zeros
  let formatted = num.toFixed(2);

  // Remove trailing zeros after decimal point
  formatted = formatted.replace(/\.?0+$/, "");

  return formatted;
};

const RevenueTrendsChart = () => {
  const [period, setPeriod] = useState("7days");
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
    total: 0,
    average: 0,
    trend: "+0%",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch revenue data from backend
  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ClientApi.getRevenueTrends(period);
        const data = response.data; // { labels: [...], data: [...] }
        console.log(data);
        const total = data.data.reduce((sum, val) => sum + parseFloat(val), 0);
        console.log(total);
        const average = data.data.length
          ? Math.round(total / data.data.length)
          : 0;

        // Ici tu peux calculer la tendance réelle ou la récupérer depuis le backend
        setChartData({
          labels: data.labels,
          data: data.data,
          total,
          average,
          trend: "+12.5%",
        });
      } catch (err) {
        console.error("Erreur API Revenue:", err);
        setError("Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [period]);

  // Chart configuration
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: chartData.data,
        borderColor: "#FF7A00",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(255, 122, 0, 0.3)");
          gradient.addColorStop(1, "rgba(255, 122, 0, 0.0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#FF7A00",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#FF7A00",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `Revenue: ${formatRevenue(context.parsed.y)} $`,
          afterLabel: (context) => {
            const avgOrderValue = context.parsed.y / 125;
            return `Avg Order: ${formatRevenue(avgOrderValue)} $`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          callback: (value) => formatRevenue(value) + " $",
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  return (
    <div className="revenue-trends-card">
      {/* Header */}
      <div className="chart-header">
        <div className="header-left">
          <h3 className="chart-title">📈 Revenue Trends</h3>
          <p className="chart-subtitle">Track your revenue performance</p>
        </div>

        {/* Period Selector */}
        <div className="period-selector">
          <FaCalendarAlt className="calendar-icon" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
          >
            <option value="1day">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Loading / Error Handling */}
      {loading && <p>Loading chart...</p>}
      {error && <p className="error">{error}</p>}

      {/* Chart */}
      {!loading && !error && (
        <>
          <div className="chart-container">
            <Line data={data} options={options} />
          </div>

          {/* Stats Below Chart */}
          <div className="chart-stats">
            <div className="stat-item">
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value total">
                {formatRevenue(chartData.total)} $
              </p>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <p className="stat-label">Average Daily</p>
              <p className="stat-value average">
                {formatRevenue(chartData.average)} $
              </p>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <p className="stat-label">Trend</p>
              <p className="stat-value trend">
                <FaArrowUp className="trend-icon" />
                {chartData.trend}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueTrendsChart;

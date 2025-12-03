import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaHourglassHalf,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import "./OrderStatusChart.css";
import { ClientApi } from "../../ClientApi/ClientApi";

const statusMeta = {
  completed: { color: "#10b981", icon: <FaCheckCircle /> },
  on_delivery: { color: "#3b82f6", icon: <FaTruck /> },
  preparing: { color: "#f59e0b", icon: <FaClock /> },
  pending: { color: "#6b7280", icon: <FaHourglassHalf /> },
  cancelled: { color: "#ef4444", icon: <FaTimesCircle /> },
};

const OrderStatusChart = () => {
  const [period, setPeriod] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setdata] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ClientApi.getOrderDistribution(period);
        const data = response.data;
        console.log(data);
        setdata(data);
      } catch (err) {
        console.error("Erreur API Revenue:", err);
        setError("Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [period]);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="order-status-card">
      {/* Header */}
      <div className="chart-header">
        <div className="header-left">
          <h3 className="chart-title">📊 Order Status Distribution</h3>
          <p className="chart-subtitle">
            Track order progress across all statuses
          </p>
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

      {/* Order Status Bars */}
      <div className="order-status-bars">
        {data.distribution.map((order, index) => {
          const meta = statusMeta[order.statut] || {
            color: "#6b7280",
            icon: <FaHourglassHalf />,
          }; // récupère icon + color with fallback
          const statusLabel = order.statut
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()); // Format: "on_delivery" → "On Delivery"
          return (
            <div key={index} className="status-row">
              {/* Status Label */}
              <div className="status-label">
                <span className="status-icon" style={{ color: meta.color }}>
                  {meta.icon}
                </span>
                <span className="status-name">{statusLabel}</span>
              </div>

              {/* Progress Bar Container */}
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${order.percentage}%`,
                    backgroundColor: meta.color,
                  }}
                >
                  <span className="progress-label">{order.percentage}%</span>
                </div>
              </div>

              {/* Count */}
              <div className="status-count" style={{ color: meta.color }}>
                {order.count.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Orders Summary */}
      <div className="order-summary">
        <div className="summary-item">
          <p className="summary-label">Total Orders</p>
          <p className="summary-value">{data.total_orders.toLocaleString()}</p>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <p className="summary-label">Completion Rate</p>
          <p className="summary-value success">{data.completion_rate}%</p>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <p className="summary-label">Active Orders</p>
          <p className="summary-value active">
            {data.active_orders.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;

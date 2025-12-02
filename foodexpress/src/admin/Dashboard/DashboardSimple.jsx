import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBell,
  FaUserCircle,
  FaCog,
  FaShoppingBag,
  FaMoneyBillWave,
  FaMotorcycle,
  FaUtensils,
  FaFileAlt,
  FaChartLine,
  FaTruck,
  FaArrowUp,
  FaArrowDown,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import "./SimpleDashboard.css";
import RevenueTrendsChart from "./RevenueTrendsChart";
import OrderStatusChart from "./OrderStatusChart";
import axios from "axios";
import { ClientApi } from "../../ClientApi/ClientApi";

const DashboardSimple = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [stats, setstats] = useState({});
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  //API STATS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ClientApi.getStats();
        console.log(response.data);
        setstats(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  // Admin pages list
  const adminPages = [
    {
      id: 1,
      name: "Dashboard",
      icon: <FaChartLine />,
      path: "/admin/dashboard",
    },
    {
      id: 2,
      name: "Orders",
      icon: <FaShoppingBag />,
      path: "/admin/orders",
    },
    {
      id: 3,
      name: "Menu",
      icon: <FaUtensils />,
      path: "/admin/menu",
    },
    {
      id: 4,
      name: "Customers",
      icon: <FaUserCircle />,
      path: "/admin/customers",
    },
    {
      id: 5,
      name: "Deliveries",
      icon: <FaTruck />,
      path: "/admin/deliveries",
    },
    {
      id: 6,
      name: "Drivers",
      icon: <FaMotorcycle />,
      path: "/admin/drivers",
    },
    {
      id: 7,
      name: "Reports",
      icon: <FaFileAlt />,
      path: "/admin/reports",
    },
  ];

  const handllogout = async () => {
    console.log("Attempting to log out...");
    try {
      const res = await ClientApi.Logout();
      if (res.status === 201 || res.status === 200) {
        navigate("/login");
      } else if (res.data && res.data.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="simple-dashboard">
      {/* LEFT SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Toggle Button Inside Sidebar */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            {sidebarOpen && (
              <div className="logo-section">
                <div className="logo-icon">
                  <FaUtensils />
                </div>
                <div className="logo-text">
                  <h1>FoodExpress</h1>
                  <p>Admin Panel</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="logo-icon-only">
                <FaUtensils />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {adminPages.map((page) => (
            <Link
              key={page.id}
              to={page.path}
              className={`nav-item ${
                location.pathname === page.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{page.icon}</span>
              {sidebarOpen && (
                <div className="nav-text">
                  <p>{page.name}</p>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handllogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP HEADER - NEW DESIGN */}
        <header className="top-header">
          {/* Left Side - Brand Name */}
          <h1 className="header-title">FoodExpress</h1>

          {/* Right Side - User Section */}
          <div className="header-user-section">
            {/* User Info */}
            <div className="header-user-info">
              <p className="header-user-name">Admin</p>
              <p className="header-user-role">Manager</p>
            </div>

            {/* Avatar Circle */}
            <div className="header-user-avatar">A</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="page-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1>Welcome back, Admin! 👋</h1>
            <p>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="metrics-grid">
            <div className="metric-card blue">
              <div className="metric-header">
                <div className="metric-info">
                  <p className="metric-title">Total Orders</p>
                  <p className="metric-value">
                    {stats?.total_Commandes?.value ?? ""}
                  </p>
                </div>
                <span className="metric-icon">📊</span>
              </div>
              <p className="metric-trend positive">
                <FaArrowUp /> {stats?.total_Commandes?.trend ?? ""}
              </p>
            </div>

            <div className="metric-card green">
              <div className="metric-header">
                <div className="metric-info">
                  <p className="metric-title">Revenue Today</p>
                  <p className="metric-value">
                    {stats?.revenue_today?.value ?? ""}
                  </p>
                </div>
                <span className="metric-icon">💰</span>
              </div>
              <p className="metric-trend positive">
                <FaArrowUp />
                {stats?.revenue_today?.trend ?? ""}
              </p>
            </div>

            <div className="metric-card orange">
              <div className="metric-header">
                <div className="metric-info">
                  <p className="metric-title">Active Orders</p>
                  <p className="metric-value">
                    {stats?.active_Commandes?.value ?? ""}
                  </p>
                </div>
                <span className="metric-icon">🚀</span>
              </div>
              <p className="metric-trend negative">
                <FaArrowDown /> -3.2%
              </p>
            </div>

            <div className="metric-card purple">
              <div className="metric-header">
                <div className="metric-info">
                  <p className="metric-title">New Customers</p>
                  <p className="metric-value">
                    {stats?.new_customers?.value ?? ""}
                  </p>
                </div>
                <span className="metric-icon">👥</span>
              </div>
              <p className="metric-trend positive">
                <FaArrowUp /> +15.8%
              </p>
            </div>
          </div>

          {/* Revenue Trends Chart */}
          <RevenueTrendsChart />

          {/* Order Status Chart */}
          <OrderStatusChart />
        </main>
      </div>
    </div>
  );
};

export default DashboardSimple;

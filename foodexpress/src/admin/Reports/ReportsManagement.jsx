import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaTrash,
  FaEnvelope,
  FaEnvelopeOpen,
  FaExclamationCircle,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUtensils,
  FaChartLine,
  FaTruck,
  FaUsers,
  FaMotorcycle,
  FaFileAlt,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaClock,
  FaReply,
} from "react-icons/fa";
import "./ReportsManagement.css";
import { ClientApi } from "../../ClientApi/ClientApi";

const ReportsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // États pour les données du backend
  const [reports, setReports] = useState([]);
  const [kpis, setKpis] = useState({
    total_reports: 0,
    unread: 0,
    read: 0,
    resolved: 0,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0,
    avg_resolution_time: 0,
    resolution_rate: 0,
    overdue_reports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      icon: <FaUsers />,
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

  // Charger les données au montage du composant
  useEffect(() => {
    fetchReports();
    fetchKPIs();
  }, [statusFilter, searchTerm, currentPage]);

  // Fonction pour récupérer les reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        per_page: reportsPerPage,
      };

      const response = await ClientApi.getReports(params);
      console.log("API Reports:", response.data.data);
      setReports(response.data.data || []);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les KPIs
  const fetchKPIs = async () => {
    try {
      const data = await ClientApi.getKPIs();
      console.log(data);
      setKpis(data.data);
    } catch (err) {
      console.error("Error fetching KPIs:", err);
    }
  };

  // Marquer comme lu
  const handleMarkAsRead = async (reportId) => {
    try {
      await ClientApi.markAsRead(reportId);
      // Rafraîchir les données
      fetchReports();
      fetchKPIs();

      // Mettre à jour le modal si ouvert
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: "read" });
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  // Marquer comme résolu tofixed
  const handleMarkAsResolved = async (reportId) => {
    try {
      await ClientApi.markAsResolved(reportId);
      // Rafraîchir les données
      fetchReports();
      fetchKPIs();

      // Mettre à jour le modal si ouvert
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: "resolved" });
      }
    } catch (err) {
      alert("Erreur lors de la résolution du report");
    }
  };

  // Voir les détails
  const handleViewReport = async (report) => {
    setSelectedReport(report);
    setShowViewModal(true);

    // Marquer comme lu automatiquement si non lu
    if (report.status === "unread") {
      await handleMarkAsRead(report.id);
    }
  };

  // Supprimer un report
  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce report ?")) {
      try {
        await ClientApi.deleteReport(reportId);
        fetchReports();
        fetchKPIs();
        alert("Report supprimé avec succès");
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  //tofixed

  const getStatusBadge = (status) => {
    const statusConfig = {
      unread: { color: "#f59e0b", icon: <FaEnvelope />, text: "Unread" },
      read: { color: "#3b82f6", icon: <FaEnvelopeOpen />, text: "Read" },
      resolved: { color: "#10b981", icon: <FaCheckCircle />, text: "Resolved" },
    };
    return statusConfig[status] || statusConfig.unread;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: "#ef4444", text: "High" },
      medium: { color: "#f59e0b", text: "Medium" },
      low: { color: "#6b7280", text: "Low" },
    };
    return priorityConfig[priority] || priorityConfig.medium;
  };

  // Pagination
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  return (
    <div className="reports-management-container">
      {/* LEFT SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

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

        {sidebarOpen && (
          <div className="sidebar-footer">
            <button className="logout-btn">
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <header className="top-header">
          <h1 className="header-title">FoodExpress</h1>
          <div className="header-user-section">
            <div className="header-user-info">
              <p className="header-user-name">Admin</p>
              <p className="header-user-role">Manager</p>
            </div>
            <div className="header-user-avatar">A</div>
          </div>
        </header>

        <div className="reports-management">
          {/* Header */}
          <div className="reports-header">
            <div className="header-left">
              <FaFileAlt className="page-icon" />
              <div>
                <h1 className="page-title">Reports & Messages</h1>
                <p className="page-subtitle">
                  Manage customer reports and contact messages
                </p>
              </div>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon total">
                <FaFileAlt />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Reports</p>
                <h3 className="stat-value">{kpis.total_reports}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon unread">
                <FaEnvelope />
              </div>
              <div className="stat-info">
                <p className="stat-label">Unread</p>
                <h3 className="stat-value">{kpis.unread}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon read">
                <FaEnvelopeOpen />
              </div>
              <div className="stat-info">
                <p className="stat-label">Read</p>
                <h3 className="stat-value">{kpis.read}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon resolved">
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <p className="stat-label">Resolved</p>
                <h3 className="stat-value">{kpis.resolved}</h3>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="filters-section">
            <div className="modern-search-container">
              <div className="modern-search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="🔍 Search by name, email, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modern-search-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="clear-search-btn"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${
                  statusFilter === "all" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("all")}
              >
                All ({kpis.total_reports})
              </button>
              <button
                className={`filter-btn ${
                  statusFilter === "unread" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("unread")}
              >
                Unread ({kpis.unread})
              </button>
              <button
                className={`filter-btn ${
                  statusFilter === "read" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("read")}
              >
                Read ({kpis.read})
              </button>
              <button
                className={`filter-btn ${
                  statusFilter === "resolved" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("resolved")}
              >
                Resolved ({kpis.resolved})
              </button>
            </div>
          </div>
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Chargement des reports...</p>
            </div>
          )}
          {/* Error State */}
          {error && (
            <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
              <p>{error}</p>
            </div>
          )}
          {/*class="filter-btn active"*/} {/* Reports Table */}
          {!loading && !error && (
            <div className="reports-table-container">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Contact</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date & Time</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => {
                    const statusBadge = getStatusBadge(report.status);
                    const priorityBadge = getPriorityBadge(report.priority);

                    return (
                      <tr key={report.id}>
                        <td>
                          <div className="reporter-info">
                            <div className="reporter-avatar">
                              {report.name.charAt(0)}
                            </div>
                            <div className="reporter-details">
                              <p className="reporter-name">{report.name}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <p className="contact-email">{report.email}</p>
                          </div>
                        </td>
                        <td>
                          <span className="subject-text">{report.subject}</span>
                        </td>
                        <td>
                          <p className="message-preview">
                            {report.message.substring(0, 50)}...
                          </p>
                        </td>
                        <td>
                          <div className="date-time">
                            <p className="date">
                              {new Date(report.created_at).toLocaleDateString()}
                            </p>
                            <p className="time">
                              {new Date(report.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td>
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: priorityBadge.color }}
                          >
                            {priorityBadge.text}
                          </span>
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: statusBadge.color }}
                          >
                            {statusBadge.icon}
                            {statusBadge.text}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-btn view-btn"
                              onClick={() => handleViewReport(report)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteReport(report.id)}
                              title="Delete Report"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="report-detail-section">
                <h3>Reporter Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <div>
                      <label>Name</label>
                      <p>{selectedReport.name}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <div>
                      <label>Email</label>
                      <p>{selectedReport.email}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <label>Date & Time</label>
                      <p>
                        {new Date(selectedReport.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-detail-section">
                <h3>Report Content</h3>
                <div className="detail-item full-width">
                  <label>Subject</label>
                  <p className="subject-full">{selectedReport.subject}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Message</label>
                  <p className="message-full">{selectedReport.message}</p>
                </div>
              </div>

              <div className="report-detail-section">
                <h3>Status & Priority</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status</label>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusBadge(selectedReport.status)
                          .color,
                      }}
                    >
                      {getStatusBadge(selectedReport.status).icon}
                      {getStatusBadge(selectedReport.status).text}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Priority</label>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: getPriorityBadge(
                          selectedReport.priority
                        ).color,
                      }}
                    >
                      {getPriorityBadge(selectedReport.priority).text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn reply-btn">
                <FaReply /> Reply to Customer
              </button>
              <button
                className="modal-btn resolve-btn"
                onClick={() => handleMarkAsResolved(selectedReport.id)}
              >
                <FaCheckCircle /> Mark as Resolved
              </button>
              <button
                className="modal-btn close-btn"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;

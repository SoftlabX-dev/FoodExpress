import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUtensils,
  FaBars,
  FaTimes,
  FaChartLine,
  FaTruck,
  FaUsers,
  FaMotorcycle,
  FaFileAlt,
  FaShoppingBag,
  FaTrash,
  FaPlus,
  FaSearch,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
} from "react-icons/fa";
import { Phone } from "lucide-react";
import "./DriversManagement.css";
import { ClientApi } from "../../ClientApi/ClientApi";

const statusStyles = {
  active: {
    bg: "#d1fae5",
    text: "#065f46",
    badge: "#10b981",
    icon: "🟢",
  },
  on_delivery: {
    bg: "#dbeafe",
    text: "#1e40af",
    badge: "#3b82f6",
    icon: "🚚",
  },
  offline: {
    bg: "#f3f4f6",
    text: "#374151",
    badge: "#6b7280",
    icon: "🔴",
  },
};

const DriversManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Drivers");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  //ADD New
  const [stats, setStats] = useState({
    total_drivers: 0,
    active: 0,
    on_delivery: 0,
    offline: 0,
    avg_rating: 0,
    total_deliveries: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    statut: "active",
    vehicle_type: "Motorcycle",
    vehicle_plate: "",
    is_available: true,
  });

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
    fetchDriversData();
  }, []);

  // Fonction pour récupérer les données des livreurs
  const fetchDriversData = async () => {
    setLoading(true);
    try {
      const response = await ClientApi.DriverDashboard();
      console.log(response.data);
      if (response.data.success) {
        setStats(response.data.data.stats);
        setDrivers(response.data.data.drivers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des livreurs:", error);
      alert("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const statusCounts = useMemo(() => {
    return {
      "All Drivers": drivers.length,
      Active: stats.active,
      "On Delivery": stats.on_delivery,
      Offline: stats.offline,
    };
  }, [drivers, stats]);

  const filteredDrivers = useMemo(() => {
    let result = drivers;

    // Filtre par statut
    if (statusFilter !== "All Drivers") {
      const statusMap = {
        Active: "active",
        "On Delivery": "on_delivery",
        Offline: "offline",
      };
      result = result.filter((d) => d.status === statusMap[statusFilter]);
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.phone.includes(query) ||
          (d.vehicle_plate && d.vehicle_plate.toLowerCase().includes(query))
      );
    }

    return result;
  }, [drivers, statusFilter, searchQuery]);

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        phone: driver.phone,
        email: driver.email || "",
        status: driver.status,
        vehicle_type: driver.vehicle,
        vehicle_plate: driver.vehicle_plate || "",
        is_available: driver.is_available,
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        statut: "active",
        vehicle_type: "Motorcycle",
        vehicle_plate: "",
        is_available: true,
      });
    }
    setShowModal(true);
    setOpenMenu(null);
  };

  const handleSaveDriver = async () => {
    // Validation
    if (!formData.name || !formData.phone) {
      alert("Le nom et le téléphone sont obligatoires");
      return;
    }

    try {
      if (editingDriver) {
        // Mise à jour
        const response = await ClientApi.DriverUpdate(
          editingDriver.id,
          formData
        );

        if (response.data.success) {
          alert("Livreur mis à jour avec succès");
          fetchDriversData();
        }
      } else {
        // Création
        const response = await ClientApi.CreateDriver(formData);

        if (response.data.success) {
          alert("Livreur créé avec succès");
          fetchDriversData();
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error("Erreur:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        alert(`Erreurs de validation:\n${errorMessages}`);
      } else {
        alert("Erreur lors de l'enregistrement du livreur");
      }
    }
  };

  const handleChangeStatus = async (driverId, newStatus) => {
    try {
      const statusMap = {
        Active: "active",
        "On Delivery": "on_delivery",
        Offline: "offline",
      };

      const response = await ClientApi.DriverupdateStatus(driverId, {
        statut: statusMap[newStatus],
      });

      if (response.data.success) {
        fetchDriversData();
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du changement de statut");
    }
    setOpenMenu(null);
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livreur ?")) {
      return;
    }

    try {
      const response = await ClientApi.DriverDelete(driverId);

      if (response.data.success) {
        alert("Livreur supprimé avec succès");
        fetchDriversData();
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression du livreur");
    }
    setOpenMenu(null);
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  // Fonction pour formater le statut pour l'affichage
  const getStatusDisplay = (status) => {
    const statusDisplayMap = {
      active: "Active",
      on_delivery: "On Delivery",
      offline: "Offline",
    };
    return statusDisplayMap[status] || status;
  };

  if (loading) {
    return (
      <div className="drivers-management-container">
        <div className="loading-container">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drivers-management-container">
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
        {/* PAGE CONTENT */}
        <div className="drivers-management">
          {/* Banner Section */}
          <div className="drivers-banner">
            <div className="banner-left">
              <div className="banner-icon">
                <FaMotorcycle />
              </div>
              <div>
                <h2 className="banner-title">Manage Your Delivery Drivers</h2>
                <p className="banner-subtitle">Track performance and status</p>
              </div>
            </div>
            <button
              className="add-driver-btn"
              onClick={() => handleOpenModal()}
            >
              <FaPlus /> Add Driver
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card total">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <p className="stat-label">TOTAL DRIVERS</p>
                <h3 className="stat-value">{stats.total_drivers}</h3>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">🟢</div>
              <div className="stat-info">
                <p className="stat-label">ACTIVE/DELIVERING</p>
                <h3 className="stat-value">
                  {stats.active + stats.on_delivery}
                </h3>
              </div>
            </div>
            <div className="stat-card rating">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <p className="stat-label">AVG RATING</p>
                <h3 className="stat-value">{stats.avg_rating}</h3>
              </div>
            </div>
            <div className="stat-card deliveries">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <p className="stat-label">TOTAL DELIVERIES</p>
                <h3 className="stat-value">{stats.total_deliveries}</h3>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="status-filters">
            {["All Drivers", "Active", "On Delivery", "Offline"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`filter-btn ${
                    statusFilter === status ? "active" : ""
                  }`}
                >
                  {status === "Active" && "🟢"}
                  {status === "On Delivery" && "🚚"}
                  {status === "Offline" && "🔴"}
                  {status}
                  <span className="filter-count">{statusCounts[status]}</span>
                </button>
              )
            )}
          </div>

          {/* Search */}
          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, phone, or plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Drivers Table */}
          <div className="drivers-table-container">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Vehicle</th>
                  <th>Deliveries</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <React.Fragment key={driver.id}>
                      <tr className="driver-row">
                        <td>
                          <button
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === driver.id ? null : driver.id
                              )
                            }
                            className="expand-btn"
                          >
                            {expandedRow === driver.id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        </td>
                        <td>
                          <div className="driver-info">
                            <div className="driver-avatar">
                              {driver.name?.charAt(0).toUpperCase() ||
                                driver.initials}
                            </div>
                            <div className="driver-details">
                              <p className="driver-name">{driver.name}</p>
                              <p className="driver-phone">{driver.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor:
                                statusStyles[driver.status]?.bg || "#f3f4f6",
                              color:
                                statusStyles[driver.status]?.text || "#374151",
                            }}
                          >
                            {statusStyles[driver.status]?.icon || "⚪"}{" "}
                            {getStatusDisplay(driver.status)}
                          </span>
                        </td>
                        <td>
                          <div className="vehicle-info">
                            <p className="vehicle-type">{driver.vehicle}</p>
                            <p className="vehicle-plate">
                              {driver.vehicle_plate || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="deliveries-count">
                          {driver.total_deliveries}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleCall(driver.phone)}
                              className="action-btn call-btn"
                              title="Call driver"
                            >
                              📞
                            </button>
                            <div className="action-menu-wrapper">
                              <button
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu === driver.id ? null : driver.id
                                  )
                                }
                                className="action-btn menu-btn"
                              >
                                ⋮
                              </button>
                              {openMenu === driver.id && (
                                <div className="action-dropdown">
                                  <button
                                    onClick={() => handleOpenModal(driver)}
                                    className="dropdown-item edit"
                                  >
                                    <FaEdit /> Edit Driver
                                  </button>
                                  <div className="dropdown-divider">
                                    <p className="dropdown-label">
                                      Change Status
                                    </p>
                                    {["Active", "On Delivery", "Offline"].map(
                                      (status) => (
                                        <button
                                          key={status}
                                          onClick={() =>
                                            handleChangeStatus(
                                              driver.id,
                                              status
                                            )
                                          }
                                          className={`dropdown-item status ${
                                            getStatusDisplay(driver.status) ===
                                            status
                                              ? "selected"
                                              : ""
                                          }`}
                                        >
                                          {status === "Active" && "🟢"}
                                          {status === "On Delivery" && "🚚"}
                                          {status === "Offline" && "🔴"}
                                          {status}
                                        </button>
                                      )
                                    )}
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteDriver(driver.id)
                                    }
                                    className="dropdown-item delete"
                                  >
                                    <FaTrash /> Delete Driver
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === driver.id && (
                        <tr className="expanded-row">
                          <td colSpan="7">
                            <div className="expanded-content">
                              <div className="expanded-section">
                                <p className="section-title">📍 Contact Info</p>
                                <p className="section-value">{driver.phone}</p>
                                {driver.email && (
                                  <p className="section-detail">
                                    {driver.email}
                                  </p>
                                )}
                              </div>
                              <div className="expanded-section">
                                <p className="section-title">📊 Performance</p>
                                <p className="section-value">
                                  Total: {driver.total_deliveries} | Completed:{" "}
                                  {driver.completed_deliveries}
                                </p>
                              </div>
                              <div className="expanded-section">
                                <p className="section-title">
                                  🚚 Current Status
                                </p>
                                <p className="section-value">
                                  Current deliveries:{" "}
                                  {driver.current_deliveries}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No drivers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Driver Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDriver ? "Edit Driver" : "Add New Driver"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Driver Name </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Ahmed El Amrani"
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+212 6 12 34 56 78"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="driver@example.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="driver@example.com"
                />
              </div>

              <div className="form-group">
                <label>Password Confirmation</label>
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                  placeholder="driver@example.com"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="on_delivery">On Delivery</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  value={formData.vehicle_type}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_type: e.target.value })
                  }
                >
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>

              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  value={formData.vehicle_plate}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_plate: e.target.value })
                  }
                  placeholder="e.g., ABC-1234"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_available: e.target.checked,
                      })
                    }
                  />
                  Available for deliveries
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button onClick={handleSaveDriver} className="modal-btn save">
                {editingDriver ? "Update Driver" : "Add Driver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversManagement;

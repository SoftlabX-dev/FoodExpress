import React, { useState, useMemo, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEye,
  FaTimes,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendar,
  FaShoppingBag,
  FaDollarSign,
  FaStar,
  FaFilter,
  FaDownload,
  FaUpload,
  FaBan,
  FaCheckCircle,
  FaCrown,
  FaEdit,
  FaHeart,
  FaChartLine,
  FaGift,
  FaClock,
  FaCommentDots,
  FaUtensils,
  FaTruck,
  FaMotorcycle,
  FaFileAlt,
  FaBars,
  FaInfoCircle,
  FaUserEdit,
  FaTrashAlt,
  FaUserLock,
} from "react-icons/fa";
import { SquarePen } from "lucide-react";
import "./CustomersManagement.css";
import { ClientApi } from "../../ClientApi/ClientApi";

const CustomersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 999999; // Show all customers
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [customers, setcustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form, setform] = useState({
    name: "",
    email: "",
    phone: "",
    adress: "",
    role: "",
    password: "",
    password_confirmation: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await ClientApi.GetAllUsers();
        console.log(response.data);
        setcustomers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await ClientApi.AddCustomer(form);
      const data = response.data;
      console.log(data);
      if (response.status === 201) {
        navigate(-1);
      }
    } catch (err) {
      console.error("Erreur API Revenue:", err);
      setError("Impossible de récupérer les données.");
    }
  };
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

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm));

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Status counts
  const statusCounts = {
    all: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    blocked: customers.filter((c) => c.status === "blocked").length,
  };

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    // In production, open edit modal
    console.log("Edit customer:", customer);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      console.log("Delete customer:", customerId);
      // In production, delete via API
    }
  };

  const handleBlockCustomer = (customerId) => {
    console.log("Block/Unblock customer:", customerId);
    // In production, update via API
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "platinum":
        return <FaCrown style={{ color: "#E5E4E2" }} />;
      case "gold":
        return <FaCrown style={{ color: "#FFD700" }} />;
      case "silver":
        return <FaStar style={{ color: "#C0C0C0" }} />;
      default:
        return <FaUserCircle style={{ color: "#CD7F32" }} />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "platinum":
        return "#E5E4E2";
      case "gold":
        return "#FFD700";
      case "silver":
        return "#C0C0C0";
      default:
        return "#CD7F32";
    }
  };

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // Helper function to format amount without commas and proper decimals
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return "0";
    const num = parseFloat(amount);
    if (isNaN(num)) return "0";

    // If integer, return without decimals
    if (Number.isInteger(num)) {
      return num.toString();
    }

    // Convert to string and remove trailing zeros
    const str = num.toFixed(2);
    const parts = str.split(".");

    // Remove trailing zeros after decimal point
    if (parts[1]) {
      parts[1] = parts[1].replace(/0+$/, "");
      if (parts[1] === "") {
        return parts[0];
      }
      return parts.join(".");
    }

    return parts[0];
  };

  {
    loading && <p>Loading chart...</p>;
  }
  //Add Customer
  return (
    <div className="customers-management-container">
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
            <button className="logout-btn">
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* PAGE CONTENT */}
        <div className="customers-management">
          {/* Header */}
          <div className="customers-header">
            <div className="header-content">
              <div className="header-left">
                <div className="header-icon">
                  <FaUserCircle />
                </div>
                <div>
                  <h1 className="page-title">Customer Management</h1>
                  <p className="page-subtitle">
                    Manage customer accounts and information
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button
                  className="header-btn add-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus />
                  Add Customer
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="customers-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <FaUserCircle />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Customers</span>
                <span className="stat-value">{customers.length}</span>
                <span className="stat-change positive">
                  <FaChartLine /> +12% this month
                </span>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <span className="stat-label">Active</span>
                <span className="stat-value">{statusCounts.active}</span>
                <span className="stat-change positive">
                  <FaChartLine /> 87.5% activity rate
                </span>
              </div>
            </div>
            <div className="stat-card revenue">
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">20.8K $</span>
                <span className="stat-change positive">
                  <FaChartLine /> +8.2% growth
                </span>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All Customers
              <span className="tab-count">{statusCounts.all}</span>
            </button>
            <button
              className={`status-tab ${
                statusFilter === "active" ? "active" : ""
              }`}
              onClick={() => setStatusFilter("active")}
            >
              <FaCheckCircle />
              Active
              <span className="tab-count">{statusCounts.active}</span>
            </button>
            <button
              className={`status-tab ${
                statusFilter === "inactive" ? "active" : ""
              }`}
              onClick={() => setStatusFilter("inactive")}
            >
              <FaClock />
              Inactive
              <span className="tab-count">{statusCounts.inactive}</span>
            </button>
            <button
              className={`status-tab ${
                statusFilter === "blocked" ? "active" : ""
              }`}
              onClick={() => setStatusFilter("blocked")}
            >
              <FaBan />
              Blocked
              <span className="tab-count">{statusCounts.blocked}</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="customers-toolbar">
            <div className="modern-search-container">
              <div className="modern-search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="🔍 Search by name, email, or phone..."
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
          </div>

          {/* Customers Table */}

          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Join Date</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {getInitials(customer.name)}
                        </div>
                        <div className="customer-details">
                          <span className="customer-name">{customer.name}</span>
                          <span className="customer-id">
                            ID: #{customer.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <span className="contact-item">
                          <FaEnvelope />
                          {customer?.email}
                        </span>
                        <span className="contact-item">
                          <FaPhone />
                          {customer?.phone}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <FaCalendar />
                        {customer?.joinDate
                          ? new Date(customer.joinDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </div>
                    </td>
                    <td>
                      <div className="orders-info">
                        <FaShoppingBag />
                        <span className="orders-count">
                          {customer?.totalOrders}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="amount">
                        {formatAmount(customer?.totalSpent)} $
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${customer.status}`}>
                        {customer?.status === "active" && <FaCheckCircle />}
                        {customer?.status === "inactive" && <FaClock />}
                        {customer?.status === "blocked" && <FaBan />}
                        {customer?.status.charAt(0).toUpperCase() +
                          customer?.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <SquarePen
                          size={20}
                          className="w-5 h-5 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors"
                          onClick={() => handleViewCustomer(customer)}
                          title="View Details"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* View Customer Modal */}
          {showViewModal && selectedCustomer && (
            <div
              className="modal-overlay"
              onClick={() => setShowViewModal(false)}
            >
              <div
                className="modal-content large-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Customer Details</h2>
                  <button
                    className="modal-close"
                    onClick={() => setShowViewModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="customer-profile">
                    <div className="profile-header">
                      <div className="customer-avatar">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="profile-info">
                        <h3>{selectedCustomer.name}</h3>
                        <span
                          className={`status-badge ${selectedCustomer.status}`}
                        >
                          {selectedCustomer.status?.charAt(0).toUpperCase() +
                            selectedCustomer.status?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="profile-details">
                      <div className="detail-section">
                        <h4>Contact Information</h4>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <FaEnvelope />
                            <div>
                              <span className="detail-label">Email</span>
                              <span className="detail-value">
                                {selectedCustomer.email}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <FaPhone />
                            <div>
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">
                                {selectedCustomer.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="detail-section">
                        <h4>Order Statistics</h4>
                        <div className="stats-grid">
                          <div className="stat-box">
                            <FaShoppingBag />
                            <div>
                              <span className="stat-number">
                                {selectedCustomer.totalOrders}
                              </span>
                              <span className="stat-text">Total Orders</span>
                            </div>
                          </div>
                          <div className="stat-box">
                            <FaDollarSign />
                            <div>
                              <span className="stat-number">
                                {selectedCustomer.totalSpent?.toLocaleString()}{" "}
                                $
                              </span>
                              <span className="stat-text">Total Spent</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Customer Modal */}
          {showAddModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Add New Customer</h2>
                  <button
                    className="modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="modal-body">
                    <form
                      className="customer-form"
                      onSubmit={handleAddCustomer}
                    >
                      {/* NAME */}
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setform({ ...form, name: e.target.value })
                          }
                          placeholder="Enter customer name"
                        />
                      </div>

                      {/* EMAIL */}
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setform({ ...form, email: e.target.value })
                          }
                          placeholder="customer@email.com"
                        />
                      </div>
                      {/* PASSWORD */}
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) =>
                            setform({ ...form, password: e.target.value })
                          }
                          placeholder="Enter password"
                        />
                      </div>

                      {/* PASSWORD CONFIRMATION */}
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          value={form.password_confirmation}
                          onChange={(e) =>
                            setform({
                              ...form,
                              password_confirmation: e.target.value,
                            })
                          }
                          placeholder="Confirm password"
                        />
                      </div>

                      {/* PHONE */}
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setform({ ...form, phone: e.target.value })
                          }
                          placeholder="+212 XXX-XXX-XXX"
                        />
                      </div>

                      {/* ADDRESS */}
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          rows="3"
                          value={form.adress}
                          onChange={(e) =>
                            setform({ ...form, adress: e.target.value })
                          }
                          placeholder="Enter full address"
                        ></textarea>
                      </div>

                      {/* ROLE */}
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          value={form.role}
                          onChange={(e) =>
                            setform({ ...form, role: e.target.value })
                          }
                        >
                          <option value="">Select role</option>
                          <option value="admin">admin</option>
                          <option value="client">client</option>
                          <option value="driver">driver</option>
                        </select>
                      </div>

                      {/* ACTIONS */}
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setShowAddModal(false)}
                        >
                          Cancel
                        </button>

                        <button type="submit" className="btn-primary">
                          Add Customer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersManagement;

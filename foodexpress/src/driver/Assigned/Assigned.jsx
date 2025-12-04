import React, { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation,
  AlertCircle,
} from "lucide-react";
import "./Assigned.css";
import { ClientApi } from "../../ClientApi/ClientApi";
import { useAuth } from "../../context/AuthContext";

const Assigned = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Use the logged-in user's ID as the current driver
  const currentDriver = {
    id: user?.id, // Get the driver's ID from authenticated user
    name: user?.name || "Driver",
  };

  useEffect(() => {
    if (currentDriver.id) {
      loadAssignedOrders();
    }
  }, [currentDriver.id]);

  const mapBackendOrders = (commandes) => {
    return commandes.map((commande) => ({
      id: commande.id,
      orderId: commande.id,
      driverId: commande.driver_id, // This is a number from backend
      status: commande.statut, // "on_delivery", "en attente", etc.
      assignedAt: commande.assigned_at,
      pickedUpAt: commande.picked_up_at,
      deliveredAt: commande.delivered_at,
      priority: commande.priority,
      total: parseFloat(commande.prix_total) || 0,
      paymentMethod: commande.paymentMethod,

      customerName:
        commande.adresse_livraison?.full_name || commande.user?.name || "N/A",
      customerPhone:
        commande.adresse_livraison?.phone || commande.user?.phone || "N/A",
      deliveryAddress: commande.adresse_livraison
        ? `${commande.adresse_livraison.street_address}, ${
            commande.adresse_livraison.city || ""
          }`
        : commande.user?.adress || "N/A",

      livreur: commande.livreur,
      plats:
        commande.plats?.map((plat) => ({
          id: plat.id,
          name: plat.nom || plat.name,
          price: parseFloat(plat.prix || plat.price) || 0,
          quantity: plat.quantite || plat.pivot?.quantite || 1,
          image: plat.image,
          description: plat.description,
          categoryId: plat.category_id,
        })) || [],

      // Fix: Create orderDetails from plats
      orderDetails: {
        items:
          commande.plats?.map((plat) => ({
            name: plat.nom || plat.name,
            price: parseFloat(plat.prix || plat.price) || 0,
            quantity: plat.pivot?.quantite || plat.quantite || 1,
          })) || [],
        total: parseFloat(commande.prix_total) || 0,
      },

      notes: commande.notes || "",
      createdAt: commande.created_at,
      updatedAt: commande.updated_at,
    }));
  };

  const loadAssignedOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("=== LOADING ASSIGNED ORDERS ===");
      console.log("Current User:", user);

      const response = await ClientApi.getAllDeliveries();
      console.log("API Response:", response.data);

      if (!response.data || !response.data.commandes) {
        throw new Error("Invalid API response");
      }

      // Log driver info from backend
      if (response.data.driver_info) {
        console.log("Driver Info from Backend:", response.data.driver_info);
      }

      const deliveries = mapBackendOrders(response.data.commandes);
      console.log("Mapped deliveries:", deliveries);
      console.log("Total deliveries from backend:", deliveries.length);

      // Backend already filters by driver, so we only filter by status here
      // Remove completed and cancelled orders from the display
      const activeDeliveries = deliveries.filter((delivery) => {
        const statusLower = delivery.status?.toLowerCase();
        const isActive =
          statusLower !== "completed" &&
          statusLower !== "cancelled" &&
          statusLower !== "livré";

        console.log(
          `Order #${delivery.id}: status=${delivery.status}, isActive=${isActive}`
        );
        return isActive;
      });

      console.log("Active driver deliveries:", activeDeliveries.length);
      console.log("=== END LOADING ===");
      setAssignedOrders(activeDeliveries);
    } catch (error) {
      console.error("Error loading assigned orders:", error);
      setError("Failed to load deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      // Update backend first
      await ClientApi.PatchStatusCommande(deliveryId, newStatus);

      // Update local state
      const updatedOrders = assignedOrders.map((delivery) => {
        if (delivery.id === deliveryId) {
          return {
            ...delivery,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return delivery;
      });

      setAssignedOrders(updatedOrders);

      // If completed, remove from list after a delay
      const statusLower = newStatus?.toLowerCase();
      if (statusLower === "completed" || statusLower === "cancelled") {
        setTimeout(() => {
          setAssignedOrders((prev) => prev.filter((d) => d.id !== deliveryId));
          if (selectedOrder?.id === deliveryId) {
            setSelectedOrder(null);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Failed to update delivery status. Please try again.");
    }
  };

  const handleStartDelivery = (deliveryId) => {
    // Backend expects "on_delivery" status
    updateDeliveryStatus(deliveryId, "on_delivery");
  };

  const handleCompleteDelivery = (deliveryId) => {
    if (
      window.confirm(
        "Are you sure you want to mark this delivery as completed?"
      )
    ) {
      // Backend expects "completed" status (lowercase)
      updateDeliveryStatus(deliveryId, "completed");
    }
  };

  const handleCancelDelivery = (deliveryId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this delivery? This action cannot be undone."
      )
    ) {
      // Backend expects "cancelled" status (lowercase)
      updateDeliveryStatus(deliveryId, "cancelled");
    }
  };

  const getStatusColor = (status) => {
    // Backend uses: "on_delivery", "preparing", "pending", etc.
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "preparing":
      case "pending":
        return "#fbbf24";
      case "on_delivery":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getFilteredOrders = () => {
    if (filter === "all") return assignedOrders;
    if (filter === "pending")
      return assignedOrders.filter(
        (o) =>
          o.status?.toLowerCase() === "pending" ||
          o.status?.toLowerCase() === "preparing"
      );
    if (filter === "on_delivery")
      return assignedOrders.filter(
        (o) => o.status?.toLowerCase() === "on_delivery"
      );
    return assignedOrders;
  };

  const filteredOrders = getFilteredOrders();

  // Show loading state if user is not yet loaded
  if (!user) {
    return (
      <div className="assigned-container">
        <div
          className="loading-state"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          Loading driver information...
        </div>
      </div>
    );
  }

  return (
    <div className="assigned-container">
      {/* Header */}
      <div className="assigned-header">
        <div className="header-content">
          <div className="header-top">
            <div className="header-title-section">
              <div className="icon-wrapper">
                <Package size={28} strokeWidth={2.5} />
              </div>
              <div className="title-text">
                <h1>My Deliveries</h1>
                <p>Track and manage your assigned orders</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="refresh-btn"
                onClick={loadAssignedOrders}
                disabled={loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="header-stats-inline">
            <div className="stat-item">
              <div className="stat-icon total">
                <Package size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{assignedOrders.length}</span>
                <span className="stat-text">Total</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon transit">
                <Navigation size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">
                  {
                    assignedOrders.filter(
                      (o) =>
                        o.status?.toLowerCase() === "in transit" ||
                        o.status?.toLowerCase() === "on_delivery"
                    ).length
                  }
                </span>
                <span className="stat-text">In Transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            margin: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            color: "#c00",
          }}
        >
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="assigned-content">
        {loading ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>Loading deliveries...</h3>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>No Assigned Orders</h3>
            <p>
              You don't have any {filter !== "all" ? filter : ""} deliveries at
              the moment.
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((delivery) => (
              <div key={delivery.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{delivery.orderId}</h3>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(delivery.status),
                      }}
                    >
                      {delivery.status}
                    </span>
                  </div>
                  <div className="order-time">
                    <Clock size={16} />
                    <span>
                      {delivery.assignedAt
                        ? new Date(delivery.assignedAt).toLocaleTimeString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Customer Info */}
                  <div className="info-section">
                    <h4>Customer Information</h4>
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">
                        {delivery.customerName}
                      </span>
                    </div>
                    <div className="info-item">
                      <Phone size={16} />
                      <span className="info-value">
                        {delivery.customerPhone}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="info-section">
                    <h4>Delivery Address</h4>
                    <div className="address-box">
                      <MapPin size={18} />
                      <p>{delivery.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  {delivery.orderDetails &&
                    delivery.orderDetails.items?.length > 0 && (
                      <div className="info-section">
                        <h4>Order Details</h4>
                        <div className="order-items">
                          {delivery.orderDetails.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total">
                          <strong>Total:</strong>
                          <strong>
                            ${delivery.orderDetails.total.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    )}

                  {/* Special Instructions */}
                  {delivery.notes && (
                    <div className="info-section">
                      <h4>Special Instructions</h4>
                      <div className="notes-box">
                        <AlertCircle size={18} />
                        <p>{delivery.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  {delivery.status?.toLowerCase() === "en attente" && (
                    <>
                      <button
                        className="btn-primary"
                        onClick={() => handleStartDelivery(delivery.id)}
                      >
                        <Navigation size={18} />
                        Start Delivery
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleCancelDelivery(delivery.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {(delivery.status?.toLowerCase() === "on_delivery" ||
                    delivery.status?.toLowerCase() === "in transit") && (
                    <>
                      <button
                        className="btn-success"
                        onClick={() => handleCompleteDelivery(delivery.id)}
                      >
                        <CheckCircle size={18} />
                        Mark as Completed
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleCancelDelivery(delivery.id)}
                      >
                        Cancel Delivery
                      </button>
                    </>
                  )}
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedOrder(delivery)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.orderId}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h3>Delivery Information</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <span className="modal-label">Status:</span>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(selectedOrder.status),
                      }}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-label">Assigned:</span>
                    <span>
                      {selectedOrder.assignedAt
                        ? new Date(selectedOrder.assignedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-label">Customer:</span>
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-label">Phone:</span>
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Delivery Address</h3>
                <div className="modal-address">
                  <MapPin size={20} />
                  <p>{selectedOrder.deliveryAddress}</p>
                </div>
              </div>

              {selectedOrder.orderDetails &&
                selectedOrder.orderDetails.items?.length > 0 && (
                  <div className="modal-section">
                    <h3>Order Items</h3>
                    <div className="modal-items">
                      {selectedOrder.orderDetails.items.map((item, index) => (
                        <div key={index} className="modal-item">
                          <div className="modal-item-info">
                            <span className="modal-item-name">{item.name}</span>
                            <span className="modal-item-qty">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="modal-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="modal-total">
                      <span>Total Amount:</span>
                      <span className="modal-total-amount">
                        ${selectedOrder.orderDetails.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
            </div>
            <div className="modal-footer">
              {selectedOrder.status?.toLowerCase() === "en attente" && (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      handleStartDelivery(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                  >
                    <Navigation size={18} />
                    Start Delivery
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      handleCancelDelivery(selectedOrder.id);
                    }}
                  >
                    Cancel Delivery
                  </button>
                </>
              )}
              {(selectedOrder.status?.toLowerCase() === "on_delivery" ||
                selectedOrder.status?.toLowerCase() === "in transit") && (
                <>
                  <button
                    className="btn-success"
                    onClick={() => {
                      handleCompleteDelivery(selectedOrder.id);
                    }}
                  >
                    <CheckCircle size={18} />
                    Mark as Completed
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      handleCancelDelivery(selectedOrder.id);
                    }}
                  >
                    Cancel Delivery
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assigned;

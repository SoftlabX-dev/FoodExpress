import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";
import emptyOrdersImage from "../../assets/images/empty-orders.svg";
import "./OrdersPage.css";
import { ClientApi } from "../../ClientApi/ClientApi";

// Icons
const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TruckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const BanknoteIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useOrder();
  useEffect(() => {
    const OrderHistory = async () => {
      try {
        const response = await ClientApi.getCommandeClient();

        // ✅ Trier les commandes par date de création décroissante (les plus récentes en premier)
        const sortedOrders = response.data.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // Ordre décroissant: plus récent d'abord
        });

        setOrders(sortedOrders);
        console.log(sortedOrders);
      } catch (error) {
        console.error(error);
      }
    };
    OrderHistory();
  }, []);

  // Get statut badge styling - matching admin orders management
  const getstatutBadge = (statut) => {
    const statusLower = statut?.toLowerCase() || "preparing";
    const statutClasses = {
      preparing: "status-preparing",
      pending: "status-pending",
      on_delivery: "status-ondelivery",
      completed: "status-completed",
      cancelled: "status-cancelled",
    };

    return statutClasses[statusLower] || "status-preparing";
  };

  // Get display text for status - matching admin orders management
  const getStatusText = (statut) => {
    // Filter out payment methods that might be in status field
    const paymentMethods = ["card", "credit", "debit", "especes", "paypal"];
    if (paymentMethods.includes(statut?.toLowerCase())) {
      return "Preparing"; // Default to Preparing if status is actually a payment method
    }

    const statusLower = statut?.toLowerCase() || "preparing";
    const statusMap = {
      preparing: "Preparing",
      pending: "Pending",
      on_delivery: "On Delivery",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return statusMap[statusLower] || "Preparing";
  };

  // Get first item image for order display
  const getOrderImage = (order) => {
    if (order.plats && order.plats.length > 0) {
      const firstItem = order.plats[0];
      return firstItem.image || "/src/assets/food/burgers/burger1.webp"; // fallback image
    }
    return "/src/assets/food/burgers/burger1.webp";
  };

  // Get payment method display text
  const getPaymentText = (paymentMethod) => {
    if (!paymentMethod) return "Cash";
    const paymentMap = {
      especes: "Cash",
      credit: "Credit Card",
      debit: "Debit Card",
      paypal: "PayPal",
    };
    return paymentMap[paymentMethod.toLowerCase()] || paymentMethod;
  };
  /*[
  {
    "id": 14,
    "user_id": 3,
    "statut": "Delivered",
    "prix_total": 120,
    "created_at": "2025-02-10",
    "plats": [
      {
        "id": 1,
        "nom": "Pizza Margherita",
        "prix": 40,
        "image": "pizza.jpg",
        "pivot": {
          "quantite": 2
        }
      },
      {
        "id": 3,
        "nom": "Burger",
        "prix": 40,
        "image": "burger.png",
        "pivot": {
          "quantite": 1
        }
      }
    ]
  }
]
 */
  // Format order items for display
  const getOrderSummary = (order) => {
    if (!order.plats || order.plats.length === 0) return "No items";

    const summary = order.plats
      .map((plat) => `${plat.pivot.quantite}x ${plat.nom}`)
      .join(", ");

    return summary.length > 50 ? summary.substring(0, 50) + "..." : summary;
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Breadcrumb Navigation */}
        <nav className="orders-breadcrumb">
          <button
            className="breadcrumb-back"
            onClick={() => navigate("/profile")}
            aria-label="Back to Profile"
          >
            <ChevronLeftIcon />
          </button>
          <div className="breadcrumb-path">
            <button
              className="breadcrumb-link"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Orders</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="orders-header">
          <h1 className="orders-title">Order History</h1>
          <p className="orders-subtitle">Track and view your past orders</p>
        </div>

        {/* Orders Content */}
        <div className="orders-content">
          {orders.length === 0 ? (
            /* Empty State */
            <div className="empty-orders">
              <div className="empty-illustration">
                <img
                  src={emptyOrdersImage}
                  alt="No orders yet"
                  className="empty-image"
                />
              </div>
              <h3 className="empty-title">No Orders Yet</h3>
              <p className="empty-description">
                You haven't placed any orders yet. Start by browsing our
                delicious menu!
              </p>
              <button
                className="browse-menu-button"
                onClick={() => navigate("/")}
              >
                <ShoppingBagIcon />
                Browse Menu
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  {/* Order Image */}
                  <div className="order-image">
                    <img
                      src={getOrderImage(order)}
                      alt={`Order ${order.id}`}
                      onError={(e) => {
                        e.target.src = "/src/assets/food/burgers/burger1.webp";
                      }}
                    />
                  </div>

                  {/* Order Details */}
                  <div className="order-details">
                    <div className="order-header">
                      <h3 className="order-number">Order #{order.id}</h3>
                      <span
                        className={`order-statut ${getstatutBadge(
                          order.statut
                        )}`}
                      >
                        {getStatusText(order.statut)}
                      </span>
                    </div>

                    <div className="order-meta">
                      <div className="order-date">
                        <ClockIcon />
                        <span>{order.date_commande}</span>
                      </div>
                    </div>

                    <div className="order-items">
                      <p className="items-summary">{getOrderSummary(order)}</p>
                    </div>

                    {/* Driver Info - Only show when order is on delivery */}
                    {order.statut?.toLowerCase() === "on_delivery" &&
                      order.driver_info && (
                        <div className="driver-info-section">
                          \n{" "}
                          <div className="driver-info-header">
                            <TruckIcon />
                            <span className="driver-label">Your Driver</span>
                          </div>
                          <div className="driver-details">
                            <div className="driver-main-info">
                              <div className="driver-avatar">
                                {order.driver_info.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="driver-name-info">
                                <span className="driver-name">
                                  {order.driver_info.name}
                                </span>
                              </div>
                            </div>
                            <div className="driver-contact-vehicle">
                              <div className="driver-phone">
                                <PhoneIcon />
                                <a href={`tel:${order.driver_info.phone}`}>
                                  {order.driver_info.phone}
                                </a>
                              </div>
                              <div className="driver-vehicle">
                                <span className="vehicle-type">
                                  {order.driver_info.vehicle_type}
                                </span>
                                {order.driver_info.vehicle_plate && (
                                  <span className="vehicle-plate">
                                    • {order.driver_info.vehicle_plate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="order-footer">
                      <div className="order-payment">
                        <BanknoteIcon />
                        <span className="payment-label">Payment:</span>
                        <span className="payment-method">
                          {getPaymentText(
                            order.paymentMethod || order.payment_method
                          )}
                        </span>
                      </div>
                      <div className="order-total">
                        <span className="total-label">Total:</span>
                        <span className="total-amount">
                          ${order.prix_total || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

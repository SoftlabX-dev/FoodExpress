import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import "./Profile.css";
import empty from "../../assets/images/empty-orders.svg"

// ============================================
// ICONS (SVG Components)
// ============================================

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// ============================================
// PROFILE PAGE COMPONENT
// ============================================

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout,user } = useAuth();
  const { orders, clearOrderNotification } = useOrder();
  
  // Local state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('account'); // For mobile tabs
  const [isLoading, setIsLoading] = useState(true);

  // Clear notification and handle loading on mount
  useEffect(() => {
    // Clear the red dot notification
    clearOrderNotification();
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      
      // If there are orders, scroll to the newest one
      if (orders.length > 0) {
        const orderSection = document.getElementById('order-history-section');
        if (orderSection) {
          setTimeout(() => {
            orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }, 500);
  }, [clearOrderNotification, orders.length]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format date for "member since"
  const getMemberSince = () => {
    return 'November 2025'; // In real app, would use actual signup date
  };

  // Get time ago for last order
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const orderDate = new Date(timestamp);
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Check if order is new (within last 5 minutes)
  const isNewOrder = (timestamp) => {
    const now = new Date();
    const orderDate = new Date(timestamp);
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins < 5;
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'preparing': return 'status-preparing';
      case 'on the way': return 'status-delivery';
      case 'delivered': return 'status-delivered';
      default: return 'status-preparing';
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Mobile Tab Navigation */}
      <div className="profile-mobile-tabs">
        <button 
          className={`mobile-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <h1 className="profile-title">My Profile</h1>

      {/* Top Section: Account Info + Stats */}
      <div className={`profile-top-section ${activeTab === 'account' ? 'active' : ''}`}>
        {/* Account Information */}
        <div className="account-info-card">
          <div className="account-header">
            <div className="profile-avatar">
              {getInitials(currentUser?.name || 'User')}
            </div>
            <div className="account-details">
              <h2 className="account-name">{currentUser?.name || 'User'}</h2>
              <div className="account-email">
                <EmailIcon />
                <span>{currentUser?.email || 'user@foodexpress.com'}</span>
              </div>
            </div>
          </div>

          <div className="account-actions">
            <button className="action-btn secondary">
              <LockIcon />
              <span>Change Password</span>
            </button>
            <button className="action-btn danger" onClick={() => setShowLogoutModal(true)}>
              <LogoutIcon />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-card">
          <h3 className="stats-title">Quick Stats</h3>
          <div className="stat-item">
            <PackageIcon />
            <div className="stat-content">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
          </div>
          <div className="stat-item">
            <CalendarIcon />
            <div className="stat-content">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{getMemberSince()}</span>
            </div>
          </div>
          {orders.length > 0 && (
            <div className="stat-item">
              <ClockIcon />
              <div className="stat-content">
                <span className="stat-label">Last Order</span>
                <span className="stat-value">{getTimeAgo(orders[0].timestamp)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order History Section */}
      <div 
        id="order-history-section" 
        className={`order-history-section ${activeTab === 'orders' ? 'active' : ''}`}
      >
        <h2 className="section-title">Order History</h2>

        {orders.length === 0 ? (
          // Empty State
          <div className="empty-state">
            <div className="empty-state-image">
              <img 
                src={empty} 
                alt="No orders yet" 
              />
            </div>
            <h3 className="empty-state-title">No Orders Yet</h3>
            <p className="empty-state-text">
              Start exploring our delicious menu and place your first order!
            </p>
            <Link to="/" className="browse-menu-btn">
              Browse Menu
            </Link>
          </div>
        ) : (
          // Order Cards
          <div className="orders-list">
            {orders.map((order, index) => (
              <div 
                key={order.id} 
                className={`order-card ${isNewOrder(order.timestamp) ? 'new-order' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-number">
                    <span className="order-label">Order</span>
                    <span className="order-id">{order.orderNumber}</span>
                  </div>
                  <div className="order-status-wrapper">
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    {isNewOrder(order.timestamp) && (
                      <span className="new-badge">NEW</span>
                    )}
                  </div>
                </div>

                {/* Order Date/Time */}
                <div className="order-date">
                  <CalendarIcon />
                  <span>{order.date} • {order.time}</span>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="item-name">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="summary-total-line">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="order-details">
                  <div className="detail-item">
                    <LocationIcon />
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <div className="detail-item">
                    <CreditCardIcon />
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Log Out</h3>
            <p className="modal-text">Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn confirm"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
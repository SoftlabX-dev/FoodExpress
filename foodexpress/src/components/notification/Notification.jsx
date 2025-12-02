import React, { useEffect, useState } from "react";
import { useOrder } from "../../context/OrderContext";
import "./Notification.css";

// ============================================
// SUCCESS ICON (SVG)
// ============================================

const SuccessIcon = () => (
  <svg 
    className="notification-icon" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// ============================================
// NOTIFICATION COMPONENT
// ============================================

const Notification = () => {
  const { hasNewOrderNotification, clearOrderNotification, getLatestOrder } = useOrder();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasNewOrderNotification) {
      // Show the notification
      setIsVisible(true);

      // Auto-hide after 4 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        
        // Clear the notification flag after animation completes
        setTimeout(() => {
          clearOrderNotification();
        }, 300); // Wait for slide-up animation to complete
      }, 4000);

      // Cleanup
      return () => clearTimeout(hideTimer);
    }
  }, [hasNewOrderNotification, clearOrderNotification]);

  // Get the latest order details
  const latestOrder = getLatestOrder();

  // Don't render anything if there's no notification
  if (!hasNewOrderNotification) {
    return null;
  }

  return (
    <div className={`notification-container ${isVisible ? 'visible' : ''}`}>
      <div className="notification-card">
        <div className="notification-icon-wrapper">
          <SuccessIcon />
        </div>
        <div className="notification-content">
          <div className="notification-title">Order Successful!</div>
          <div className="notification-message">
            Your order is being prepared
          </div>
          {latestOrder && (
            <div className="notification-order-number">
              Order #{latestOrder.orderNumber}
            </div>
          )}
        </div>
        <button 
          className="notification-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => clearOrderNotification(), 300);
          }}
          aria-label="Close notification"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {useOrder} from "../../context/OrderContext"
import "./Checkout.css";
import { ClientApi } from "../../ClientApi/ClientApi";

// ============================================
// ICONS (SVG Components)
// ============================================

const LocationIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="location-icon-svg"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

const CheckoutProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Cart', status: 'completed' },
    { number: 2, label: 'Delivery', status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending' },
    { number: 3, label: 'Payment', status: currentStep === 3 ? 'active' : 'pending' }
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-line">
        <div className="progress-line-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      {steps.map((step, index) => (
        <div key={index} className={`progress-step ${step.status}`}>
          <div className="progress-step-circle">
            {step.status !== 'completed' && step.number}
          </div>
          <div className="progress-step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// ORDER SUMMARY COMPONENT
// ============================================

const OrderSummaryBox = () => {
  const { cartItems,setPrixtotal} = useCart();
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.plat.prix * item.quantite), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;
  return (
    <div className="order-summary-box">
      <h2 className="summary-title">Order Summary</h2>
      
      <div className="summary-items">
        {cartItems.map(item => (
          <div key={item.plat_id} className="summary-item">
            <img src={item.plat.image} alt={item.plat.name} className="summary-item-image" />
            <div className="summary-item-details">
              <div className="summary-item-name">{item.plat.name}</div>
              <div className="summary-item-quantity">Qty: {item.quantite}</div>
            </div>
            <div className="summary-item-price">
              ${(item.plat.prix * item.quantite).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="summary-line subtotal">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      
      <div className="summary-line">
        <span>Delivery Fee</span>
        <span>${deliveryFee.toFixed(2)}</span>
      </div>

      <div className="summary-total">
        <span>Total</span>
        <span className="summary-total-amount">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

// ============================================
// CHECKOUT PAGE COMPONENT
// ============================================

const CheckoutPage = () => {
    const { cartItems} = useCart();

  useEffect(() => {
  if (cartItems.length === 0) {
    navigate("/cart");
  }
}, [cartItems]);

  const navigate = useNavigate();
  const { user } = useAuth();
  // Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Location feature state
  const [locationNotification, setLocationNotification] = useState(null);

  // Handle location button click
  const handleGetLocation = () => {
    setLocationNotification({ type: 'loading', message: '📍 Getting your location...' });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding with a mock address
          setTimeout(() => {
            const mockAddress = '123 Main Street, Agadir';
            setAddress(mockAddress);
            setLocationNotification({ 
              type: 'success', 
              message: '✓ Location found! Address filled automatically.' 
            });
            
            // Clear notification after 3 seconds
            setTimeout(() => setLocationNotification(null), 3000);
          }, 1000);
        },
        (error) => {
          setLocationNotification({ 
            type: 'error', 
            message: '✗ Could not get location. Please enter manually.' 
          });
          setTimeout(() => setLocationNotification(null), 4000);
        }
      );
    } else {
      setLocationNotification({ 
        type: 'error', 
        message: '✗ Geolocation is not supported by your browser.' 
      });
      setTimeout(() => setLocationNotification(null), 4000);
    }
  };
    const {infosItems,errors} = useOrder();
  // Handle form submission
  const handleSubmit =async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fullName || !phone || !address) {
      alert('Please fill in all required fields');
      return;
    }
     const data = {
        full_name: fullName,
        phone: phone,
        street_address: address,
        delivery_instructions: instructions || '', 
    };
 
        const response =await infosItems(data); //infosItems est une fonction alors il ppeut retourner
     if (response?.status === 201) {
    console.log('✅ Adresse créée, on peut naviguer');
    navigate('/payment'); 
  } else {
    console.log('❌ Validation échouée, rester sur la page');
  }
         
   

  };

  return (
    <div className="checkout-page-container">
      <h1 className="checkout-title">Delivery Details</h1>
      
      <CheckoutProgressBar currentStep={2} />

      <div className="checkout-layout">
        {/* LEFT COLUMN - FORM */}
        <div className="checkout-form-container">
          <h2 className="form-section-title">Delivery Address</h2>
          
          <div onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              {errors.full_name && <p className="errors">{errors.full_name[0]}</p>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6XX-XXXXXX"
                required
              />
              {errors.phone && <p className="error-text">{errors.phone[0]}</p>}
            </div>

            {/* Address with Location Button */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Street Address <span className="required">*</span>
              </label>
              <div className="address-input-wrapper">
                <input
                  type="text"
                  id="address"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street address"
                  required
                />
                 {errors.street_address && <p className="error-text">{errors.street_address[0]}</p>}

                <button
                  type="button"
                  className="location-icon-btn"
                  onClick={handleGetLocation}
                  title="Get my location"
                >
                  <LocationIcon />
                </button>
              </div>
              
              {/* Location Notification */}
              {locationNotification && (
                <div className={`location-notification ${locationNotification.type}`}>
                  {locationNotification.message}
                </div>
              )}
            </div>

            {/* Delivery Instructions */}
            <div className="form-group">
              <label htmlFor="instructions" className="form-label">
                Delivery Instructions (Optional)
              </label>
              <textarea
                id="instructions"
                className="form-textarea"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Gate code is #1234, please don't ring the bell, leave at door..."
              />
            </div>

            {/* Submit Button */}
            <button type="button" className="checkout-submit-btn" onClick={handleSubmit}>
              Proceed to Payment →
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY */}
        <OrderSummaryBox />
      </div>
    </div>
  );
};

export default CheckoutPage;
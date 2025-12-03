import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Contact.css";
import { ClientApi } from "../../ClientApi/ClientApi";

// Icons
const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate form submission
    console.log("Form submitted:", formData);

    // Clear form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    try {
      const res = await ClientApi.report(formData);
    } catch (error) {
      console.log(error);
    }

    // Show success message
    setShowSuccess(true);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleQuickHelpClick = (type) => {
    switch (type) {
      case "order":
        navigate("/profile");
        break;
      case "menu":
        navigate("/menu");
        break;
      case "refunds":
        document
          .getElementById("contact-form")
          .scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&crop=center"
            alt="FoodExpress Restaurant Interior"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">How can we help you today?</h1>
          <p className="hero-subtitle">
            We're here for you, ready to assist with any questions or concerns
          </p>
        </div>
      </section>

      <div className="contact-container">
        {/* Quick Help Cards */}
        <section className="quick-help-section">
          <h2 className="section-title">Quick Help</h2>
          <div className="quick-help-cards">
            <div
              className="help-card"
              onClick={() => handleQuickHelpClick("order")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleQuickHelpClick("order");
                }
              }}
            >
              <div className="card-icon order-icon">
                <SearchIcon />
              </div>
              <h3 className="card-title">Where is my order?</h3>
              <p className="card-description">
                Track your order status and delivery progress
              </p>
              <div className="card-arrow">→</div>
            </div>

            <div
              className="help-card"
              onClick={() => handleQuickHelpClick("menu")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleQuickHelpClick("menu");
                }
              }}
            >
              <div className="card-icon menu-icon">
                <MenuIcon />
              </div>
              <h3 className="card-title">Menu & Allergens</h3>
              <p className="card-description">
                Browse our menu and view allergen information
              </p>
              <div className="card-arrow">→</div>
            </div>

            <div
              className="help-card"
              onClick={() => handleQuickHelpClick("refunds")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleQuickHelpClick("refunds");
                }
              }}
            >
              <div className="card-icon refund-icon">
                <HeartIcon />
              </div>
              <h3 className="card-title">Refunds & Issues</h3>
              <p className="card-description">
                Get help with order issues and refund requests
              </p>
              <div className="card-arrow">→</div>
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="main-contact-section">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="form-title">Send us a Message</h2>
              <p className="form-subtitle">
                We'll get back to you as soon as possible
              </p>

              {showSuccess && (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <div className="success-text">
                    <strong>Thank you!</strong> Our support team will call you
                    within 15 minutes.
                  </div>
                </div>
              )}

              <form
                id="contact-form"
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-select"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="General Question">General Question</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Please describe your question or issue in detail..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info & Map */}
            <div className="contact-info-section">
              <h2 className="info-title">Find Us</h2>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <PhoneIcon />
                  </div>
                  <div className="contact-item-content">
                    <h4 className="contact-item-title">Call Us</h4>
                    <a href="tel:+1234567890" className="contact-link">
                      +123 456 7890
                    </a>
                    <p className="contact-item-desc">
                      Available during business hours
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <EmailIcon />
                  </div>
                  <div className="contact-item-content">
                    <h4 className="contact-item-title">Email Us</h4>
                    <a
                      href="mailto:support@foodexpress.com"
                      className="contact-link"
                    >
                      support@foodexpress.com
                    </a>
                    <p className="contact-item-desc">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <ClockIcon />
                  </div>
                  <div className="contact-item-content">
                    <h4 className="contact-item-title">Opening Hours</h4>
                    <p className="contact-text">Mon-Sun: 10am - 11pm</p>
                    <p className="contact-item-desc">
                      Open every day of the week
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <LocationIcon />
                  </div>
                  <div className="contact-item-content">
                    <h4 className="contact-item-title">Visit Our Restaurant</h4>
                    <p className="contact-text">
                      123 Food Street
                      <br />
                      Delicious City, DC 12345
                    </p>
                    <p className="contact-item-desc">Dine-in also available</p>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="map-section">
                <div className="map-container">
                  <div className="map-overlay">
                    <div className="map-pin">📍</div>
                    <p className="map-text">FoodExpress Restaurant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;

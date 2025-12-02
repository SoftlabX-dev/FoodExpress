import React from "react";
import "./HeroSection.css";

const HeroSection = ({ onOrderNow }) => {
  return (
    <section className="hero-section">
      {/* Hero Background Image */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
        {/* Using a placeholder for the hero image, replace with your burger banner */}
        <img
          src="/src/assets/food/burgers/burger1.webp"
          alt="Delicious Food"
          className="hero-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&h=1080&fit=crop"; // Fallback
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-container">
          <h1 className="hero-headline">
            Hot, Fresh, & <span className="hero-highlight">Unforgettable.</span>
          </h1>
          <p className="hero-subheadline">
            The best burgers, pizza, and more in town, delivered to your door.
          </p>
          <button className="hero-cta-button" onClick={onOrderNow}>
            <span className="button-text">VIEW MENU & ORDER NOW</span>
            <div className="button-shine"></div>
          </button>
        </div>
      </div>

      {/* Floating Elements for Visual Appeal */}
      <div className="hero-floating-elements">
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
      </div>
    </section>
  );
};

export default HeroSection;
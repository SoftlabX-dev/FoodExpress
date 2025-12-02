import React from "react";
import "./WhyChooseUs.css";

// Icons for the features
const QualityIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const DeliveryIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16,8 20,8 23,11 23,16 16,16" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const FreshIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2a3 3 0 0 0-3 3c0 .74.25 1.42.68 1.96L6.5 10.5a6 6 0 1 0 11 0l-3.18-3.54A3 3 0 0 0 15 5a3 3 0 0 0-3-3z" />
    <path d="M2 13h20" />
    <path d="M8 17s0 2 4 2 4-2 4-2" />
  </svg>
);

const WhyChooseUs = () => {
  const features = [
    {
      icon: <QualityIcon />,
      title: "Best Quality",
      description:
        "Premium ingredients and expert preparation ensure every bite is perfect.",
    },
    {
      icon: <DeliveryIcon />,
      title: "Fast Delivery",
      description:
        "Hot, fresh food delivered to your door in 30 minutes or less.",
    },
    {
      icon: <FreshIcon />,
      title: "Fresh Ingredients",
      description:
        "We source the finest, freshest ingredients daily for maximum flavor.",
    },
  ];

  return (
    <section className="why-choose-us landing-section">
      <div className="landing-container">
        <h2 className="section-title">Why Choose Us?</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
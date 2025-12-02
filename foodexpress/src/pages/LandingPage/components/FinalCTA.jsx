import React from "react";
import "./FinalCTA.css";

const LocationSection = () => {
  // Google Maps Embed URL for Agadir, Morocco
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55067.35393633076!2d-9.60124685!3d30.42021355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e9aaaaaaa:0x6fa827a42d493995!2sAgadir%2C%20Morocco!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

  return (
    <section className="location-section landing-section">
      <div className="landing-container">
        <div className="location-content">
          <div className="location-info">
            <h2 className="location-title">Come Visit Us</h2>
            <p className="location-subtitle">
              Experience the best food in the heart of Agadir. Our restaurant
              offers an authentic dining experience with fresh, local
              ingredients.
            </p>

            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <h3>Address</h3>
                <p>123 Avenue Hassan II</p>
                <p>Agadir 80000, Morocco</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕒</span>
              <div>
                <h3>Opening Hours</h3>
                <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
                <p>Happy Hour: 4:00 PM - 6:00 PM</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <h3>Contact</h3>
                <p>+212 5 28 22 22 22</p>
                <p>hello@foodexpress.ma</p>
              </div>
            </div>
          </div>

          <div className="location-map-wrapper">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FoodExpress Location - Agadir, Morocco"
              className="google-map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
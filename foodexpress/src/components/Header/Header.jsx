import React from "react";
import "./Header.css";
import { useCart } from "../../context/CartContext";
import BannerImage from "../../assets/images/banner-offer.png";
// import './Header.css'; // Removed for preview - styles are now inline below
// import BannerImage from '../../assets/images/banner-offer.png'; // Removed for preview

// --- Placeholder for your banner image ---
// In your real project, use the import statement above
//const BannerImage = "https://i.imgur.com/vHq0bHk.png"; // Placeholder for banner-offer.png
const Header = () => {
  const { addToCart } = useCart(); // Get the real addToCart function

  // Define the special offer item
  const offerItem = {
    id: "offer-1",
    nom: "Special Offer Burger",
    category: "Burgers",
    prix: 7.99,
    image: "/src/assets/food/burgers/burger1.webp",
  };

  const handleOrderNow = () => {
    // Add the special offer item to the cart
    addToCart(offerItem);
    console.log("Added to cart:", offerItem);
  };

  return (
    <section id="offers" className="header-container">
      <div
        className="header-banner"
        style={{
          backgroundImage: `url("/src/assets/images/banner-offer.png")`,
        }}
      >
        <button className="header-order-btn" onClick={handleOrderNow}>
          Order Now
        </button>
      </div>
    </section>
  );
};

export default Header;

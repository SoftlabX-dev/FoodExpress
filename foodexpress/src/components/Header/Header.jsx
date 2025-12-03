import React, { useEffect, useState } from "react";
import "./Header.css";
import { useCart } from "../../context/CartContext";
import BannerImage from "../../assets/images/banner-offer.png";
import { ClientApi } from "../../ClientApi/ClientApi";

const Header = () => {
  const { addToCart } = useCart(); 
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const fetchOffer = async () => {
      const response = await ClientApi.GetPlats();
      console.log(response.data)
      setPlats(response.data);
      const gift = response.data.filter(
        (elem) => elem.nom === "Special Offer Burger"
      );

      console.log("Gift found:", gift);
    };

    fetchOffer();
  }, []);

  const handleOrderNow = () => {
    if (!plats.length) return;

    const gift = plats.filter(
      (elem) => elem.nom === "Special Offer Burger"
    );

    if (gift.length === 0) {
      console.log("No special offer found !");
      return;
    }

    addToCart(gift[0]); 
    console.log("Added to cart:", gift[0]);
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
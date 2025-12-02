import React, { useState ,useEffect} from "react";
import "./FanFavorites.css";
import { foodData } from "../../../data/foodData";
import { useCart } from "../../../context/CartContext";
import { ClientApi } from "../../../ClientApi/ClientApi";

const FanFavorites = ({ onViewMenu }) => {
  const { addToCart } = useCart();
const [plats,setplats]= useState([]); //recuperation des plats
useEffect(()=>{
  const fetchPlats = async () => {
      try {
        const response = await ClientApi.GetPlats();  
        console.log(response.data)
        setplats(response.data);  
      } catch (err) {
        console.error("Erreur lors de la récupération des plats:", err);
      } 
    };

    fetchPlats()
  },[])

  // Select top 6 most recommended items (by rating and review count)
  const favorites = [...plats]
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.review_count - a.review_count;
    })
    .slice(0, 6);

  return (
    <section className="fan-favorites landing-section">
      <div className="landing-container">
        <h2 className="section-title">This Week's Fan Favorites</h2>
        <p className="section-subtitle">
          Our most loved dishes, ordered by people just like you.
        </p>

        <div className="favorites-scroll-container">
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item.id} className="favorite-item-card">
                <img
                  src={item.image}
                  alt={item.nom}
                  className="favorite-item-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Food+Item";
                  }}
                />
                <div className="favorite-item-info">
                  <p className="favorite-item-name">{item.nom}</p>

                  {/* Rating Display */}
                  <div className="favorite-item-rating">
                    <span className="rating-star">⭐</span>
                    <span className="rating-value">{item.rating}</span>
                    <span className="rating-count">({item.review_count})</span>
                  </div>

                  <div className="favorite-item-details">
                    <p className="favorite-item-price">
                      ${item.prix}
                    </p>
                    <button
                      className="favorite-item-add-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="favorites-cta">
          <button className="view-full-menu-button" onClick={onViewMenu}>
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default FanFavorites;
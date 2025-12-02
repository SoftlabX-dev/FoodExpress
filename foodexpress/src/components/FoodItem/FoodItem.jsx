import React from "react";
import "./FoodItem.css";
import { useCart } from "../../context/CartContext";
import { ClientApi } from "../../ClientApi/ClientApi";

const FoodItem = ({ item }) => {
  const { addToCart } = useCart();
const handleAdd = async (item) => {
  try {
    await ClientApi.incrementeRreviewCount(item.id); 
  } catch (error) {
    console.error(error);
  }
  addToCart(item); // ajouter le plat au panier
};

  return (
    <div className="food-item">
      <img src={item.image} alt={item.nom} className="food-item-image" />
      <div className="food-item-info">
        <p className="food-item-name">{item.nom}</p>
        
        {/* ✅ NEW: Rating Display */}
        <div className="food-item-rating">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{item.rating}</span>
          <span className="rating-count">({item.review_count})</span>
        </div>
        
        <div className="food-item-details">
          <p className="food-item-price">${item.prix}</p>
          <button className="food-item-add-btn" onClick={() => ( handleAdd(item))}
            >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
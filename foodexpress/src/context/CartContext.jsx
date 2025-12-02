// This is the "brain" for your shopping cart.
// It will provide the cart data and functions to all components.

import React, { createContext, useContext, useState } from 'react';



// 1. Create the context
const CartContext = createContext();

// 2. Create a "hook" to make it easy to use the context
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component that will "wrap" your app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [quantite, setquantite] = useState(null);

 
   // Passer la commande (envoi vers le backend)
  const submitCommande = async (UserId) => {
    try {
      const commandeData = {
        user_id: UserId,
        plats: cartItems.map(item => ({
          plat_id: item.plat_id,
          quantite: item.quantite,
          prix: item.prix,
        }))
      };

      const result = await PostCommande(commandeData);
      setCartItems([]); // Vider le panier après succès
      return result;
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      throw error;
    } 
  };

  const clearCart = ()=>{
    setCartItems([]);
  }

  // Function to add an item to the cart
  const addToCart = (itemToAdd) => {
  setCartItems((prevItems) => {
    // Chercher si le plat existe déjà
    const existingItem = prevItems.find(
      (item) => item.plat_id === itemToAdd.id
    );

    if (existingItem) {
      // S'il existe, on augmente la quantité
      return prevItems.map((item) =>
        item.plat_id === itemToAdd.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      );
    } else {
      // Sinon, on l'ajoute au panier
      return [
        ...prevItems,
        {
          plat_id: itemToAdd.id, // ID du plat
          quantite: 1, // quantité
          plat: itemToAdd, // toutes les infos du plat
        },
      ];
    }
  });
};


  // Function to remove an item (we'll need this for the Cart page)
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.plat_id === itemId);
      
      if (existingItem && existingItem.quantite > 1) {
        // If quantite is > 1, just decrease it
        return prevItems.map(item =>
          item.plat_id === itemId
            ? { ...item, quantite: item.quantite - 1 }
            : item
        );
      } else {
        // If quantite is 1 or item not found, remove it completely
        return prevItems.filter(item => item.plat_id !== itemId);
      }
    });
    console.log("Item removed/decreased:", itemId);
  };
  
  // Calculate the total number of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantite, 0);

  // The "value" is what all child components will have access to
  const value = {
     clearCart ,
    cartItems,
    addToCart,
    removeFromCart,
    cartCount,
    submitCommande,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
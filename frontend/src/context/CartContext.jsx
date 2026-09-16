import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage or backend
  useEffect(() => {
    const savedCart = localStorage.getItem("cloudcart_items");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cloudcart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    // 1. If user is logged in, sync with order-service via API gateway
    if (isAuthenticated) {
      try {
        await api.post("/api/cart/add", {
          userId: user?.userId || 1,
          productId: product.id,
          quantity: quantity,
        });
      } catch (e) {
        console.warn("Could not sync cart to backend, keeping locally:", e.message);
      }
    }

    // 2. Update local state
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
            quantity: quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cloudcart_items");
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

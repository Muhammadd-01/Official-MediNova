// App.jsx (or wherever CartContext is defined)
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const token = localStorage.getItem("token");

  // Fetch cart from backend on mount
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:4000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCartItems(data.items || []))
      .catch(err => console.error("Fetch cart error:", err));
  }, [token]);

  const addToCart = async (item) => {
    setCartItems(prev => [...prev, item]); // local update

    try {
      const res = await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Add to cart failed");
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch(`http://localhost:4000/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Remove failed");
    } catch (err) {
      console.error(err);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext"; // assuming you have AuthContext

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext); // get JWT token
  const [cart, setCart] = useState([]);

  // Fetch cart on load
  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:4000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setCart(res.data.items))
    .catch(err => console.log(err));
  }, [token]);

  // Add item to cart
  const addToCart = async (medicine) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/cart",
        medicine,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items); // update cart state
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

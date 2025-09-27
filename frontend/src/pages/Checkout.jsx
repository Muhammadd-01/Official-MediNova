import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "cod", // default
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: form,
        items: cartItems,
        total: totalPrice,
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("✅ Order placed successfully!");
      clearCart();
    } else {
      alert("❌ Order failed, try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="address" placeholder="Address" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 rounded" />

        <select name="paymentMethod" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="cod">Cash on Delivery</option>
          <option value="card">Credit/Debit Card</option>
          <option value="easypaisa">EasyPaisa</option>
          <option value="jazzcash">JazzCash</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Confirm Order ({totalPrice} PKR)
        </button>
      </form>
    </div>
  );
};

export default Checkout;

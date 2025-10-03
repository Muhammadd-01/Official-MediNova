import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CartContext } from "../App";
import axios from "axios";

const sidebarVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export default function CartSidebar({ isOpen, onClose, openPaymentModal }) {
  const { cartItems, setCartItems, removeFromCart, totalPrice } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when sidebar opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // assuming you store JWT here
        const res = await axios.get("http://localhost:4000/api/cart/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.items) {
          // Map backend items to your cart structure
          const items = res.data.items.map((item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }));
          setCartItems(items); // update CartContext
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isOpen, setCartItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-[#0A2A43] text-black dark:text-white shadow-2xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#0D3B66]/30"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>
              ) : cartItems.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Your cart is empty
                </p>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-100 dark:bg-[#081F5C]"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Qty: {item.quantity} | ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 dark:text-red-400 hover:scale-110 transition-transform"
                    >
                      Remove
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-300 dark:border-gray-700">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <motion.button
                  onClick={() => {
                    onClose();
                    openPaymentModal();
                  }}
                  className="w-full bg-[#0D3B66] hover:bg-[#081F5C] text-white py-2 rounded-xl font-semibold transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

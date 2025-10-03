
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CartContext, NotificationContext } from "../App";
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
  const { cartItems, setCartItems, totalPrice } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when sidebar opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/cart/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.items) {
          const items = res.data.items.map((item) => ({
            id: item._id,
            fdaId: item.fdaId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }));
          setCartItems(items);
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isOpen, setCartItems]);

  // Remove item function
  const handleRemove = async (itemId, itemName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:4000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 204) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        showNotification(`"${itemName}" removed from cart`, "success");
      } else {
        showNotification(`Failed to remove "${itemName}"`, "error");
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      const msg = err.response?.data?.error || `"${itemName}" could not be removed`;
      showNotification(msg, "error");
    }
  };

  // Prepare cart items for modal
  const handleProceedToCheckout = () => {
    const itemTitle = cartItems.map((item) => `${item.name} (Qty: ${item.quantity})`).join(", ");
    openPaymentModal({
      modalType: "cart",
      itemTitle: itemTitle || "Cart Items",
      itemPrice: totalPrice,
      cartItems, // Pass cart items for pre-filling
    });
    onClose();
  };

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
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Qty: {item.quantity} | ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
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
                  onClick={handleProceedToCheckout}
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

"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Home,
  MapPin,
  CreditCard,
  Building,
  CheckCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutModal({
  isOpen,
  onClose,
  itemTitle,
  itemPrice,
  onSubmit,
  darkMode = false,
  cardBg = "bg-white",
  textColor = "text-black",
  formData,
  handleFormChange,
  paymentMethod,
  setPaymentMethod,
  cnicVerified,
  cnicLoading,
  cardDetails,
  cardLoading,
  bankDetails,
  bankLoading,
  locationLoading,
  getLiveLocation,
  pakistaniBanks = [],
  bankQuery,
  setBankQuery,
  verifyCard,
  verifyBank,
}) {
  const modalContentRef = useRef(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalContentRef}
            initial={{ scale: 0.96, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`${cardBg} relative rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8`}
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-[#00C2CB]" />
            </motion.button>

            <h2 id="modal-title" className={`text-2xl font-bold mb-6 text-center ${textColor}`}>
              Book {itemTitle}
            </h2>

            <p
              id="modal-description"
              className={`text-center mb-6 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Fill in your details to book this. Price: PKR {itemPrice}
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="name">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-[20px] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none ${cardBg}`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="phone">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-[20px] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none ${cardBg}`}
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-[20px] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none ${cardBg}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textColor}`} htmlFor="date">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00C2CB]" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-[20px] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 border-none outline-none ${cardBg}`}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Payment Method *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["cod", "card", "bank"].map((method) => (
                    <motion.button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-[20px] ${
                        paymentMethod === method ? "bg-[#00C2CB] text-white" : cardBg
                      } flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-pressed={paymentMethod === method}
                    >
                      {method === "cod" && (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Cash on Delivery
                        </>
                      )}
                      {method === "card" && (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Credit/Debit Card
                        </>
                      )}
                      {method === "bank" && (
                        <>
                          <Building className="w-5 h-5 mr-2" />
                          Bank Transfer
                        </>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center mt-6">
                <motion.button
                  type="submit"
                  className="px-6 py-3 rounded-[20px] bg-[#00C2CB] text-white hover:bg-[#0097A7] focus:ring-2 focus:ring-[#00C2CB] transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={cnicLoading || cardLoading || bankLoading || locationLoading}
                >
                  {cnicLoading || cardLoading || bankLoading || locationLoading
                    ? "Processing..."
                    : "Confirm Booking"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

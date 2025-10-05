import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { DarkModeContext } from "../App";
import {
  CheckCircle,
  X,
  AlertCircle,
  Mail,
  MessageCircle,
  HelpCircle,
  Heart,
} from "lucide-react";

/**
 * Contact.jsx
 * - JazzCash, Easypaisa & Payoneer donation section
 * - QR URLs fetched from GET /api/donation-qr
 * - Click QR image OR Donate button -> show Labs-style notification (mock payment)
 */

function Contact() {
  const { darkMode } = useContext(DarkModeContext);

  // Contact form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  // Notifications
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(null);

  // Donation states
  const [qrUrls, setQrUrls] = useState({
    jazzcash: "/assets/donation-qr-jazzcash.png",
    easypaisa: "/assets/donation-qr-easypaisa.png",
    payoneer: "/assets/donation-qr-payoneer.png",
  });
  const [donationAmount, setDonationAmount] = useState("");
  const [recentDonationDetails, setRecentDonationDetails] = useState(null);

  // Theme styles
  const cardBg = darkMode
    ? "bg-[#0A2A43]/60 backdrop-blur-xl text-[#FDFBFB]"
    : "bg-white/40 backdrop-blur-xl text-[#0A3D62]";
  const inputStyle = darkMode
    ? "bg-[#081F5C]/50 text-white border border-blue-300/40 focus:border-blue-400"
    : "bg-white/50 text-gray-800 border border-gray-300 focus:border-blue-500";
  const buttonStyle =
    "mt-4 px-6 py-3 rounded-2xl bg-[#0A3D62] text-white hover:bg-[#081F5C] hover:shadow-lg transition-all duration-300";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]";
  const notifyCard = darkMode
    ? "bg-[#0A2A43]/20 backdrop-blur-[10px] border border-white/20"
    : "bg-white/20 backdrop-blur-md border border-gray-200";
  const quickButtonStyle = darkMode
    ? "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
    : "bg-white/50 backdrop-blur-md border border-gray-300/50 hover:bg-white/70";

  // Fetch QR URLs (optional backend)
  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await axios.get("/api/donation-qr");
        setQrUrls((prev) => ({
          jazzcash: res.data.jazzcash || prev.jazzcash,
          easypaisa: res.data.easypaisa || prev.easypaisa,
          payoneer: res.data.payoneer || prev.payoneer,
        }));
      } catch {
        // fallback to local assets silently
      }
    };
    fetchQr();
  }, []);

  // Contact handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/contact", {
        name,
        email,
        message,
      });
      setSuccessMessage(res.data.message || "Message sent successfully ✅");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setShowError(
        err.response?.data?.message || "Something went wrong! Try again later."
      );
      setTimeout(() => setShowError(null), 3000);
    }
  };

  // Feedback handler
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    try {
      const res = await axios.post("http://localhost:4000/api/feedback", {
        feedback,
      });
      setSuccessMessage(res.data.message || "Feedback submitted successfully ✅");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFeedback("");
    } catch (err) {
      setShowError(
        err.response?.data?.message || "Something went wrong! Try again later."
      );
      setTimeout(() => setShowError(null), 3000);
    }
  };

  // Donation handler (no redirect now)
  const handleDonate = async ({ method, amount }) => {
    const parsedAmount = amount && amount.toString().trim() ? amount : "N/A";

    const details = {
      method,
      amount: parsedAmount,
      reference: "MN-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    };

    setRecentDonationDetails(details);

    // Backend logging
    try {
      await axios.post("http://localhost:4000/api/donate", {
        name: name || "Anonymous",
        method,
        amount: parsedAmount,
      });
    } catch (err) {
      console.warn("Donation log failed (backend optional).");
    }

    setSuccessMessage(
      "Donation received — thank you for supporting MediNova’s mission to make healthcare smarter and accessible for everyone."
    );
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - MediNova</title>
        <meta
          name="description"
          content="Get in touch with MediNova. We're here to answer your questions and provide support."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h1>

        {/* Contact + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            className={`p-8 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <form onSubmit={handleContactSubmit}>
              <label className="block font-bold mb-2">Name:</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 mb-4 rounded-2xl focus:outline-none ${inputStyle}`}
                required
              />
              <label className="block font-bold mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 mb-4 rounded-2xl focus:outline-none ${inputStyle}`}
                required
              />
              <label className="block font-bold mb-2">Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full px-3 py-2 rounded-2xl focus:outline-none ${inputStyle}`}
                rows="6"
                required
              ></textarea>
              <button type="submit" className={buttonStyle}>
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Location Info */}
          <motion.div
            className={`p-8 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Our Location</h2>
            <p>123 Medical Street</p>
            <p>Health City, HC 12345</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: contact.medinova@gmail.com</p>
            <div className="w-full h-64 md:h-80 mt-4 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!..."
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        </div>

        {/* Feedback */}
        <motion.div
          className={`p-8 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 max-w-3xl mx-auto mb-8`}
        >
          <h2 className="text-2xl font-bold mb-6">Provide Feedback</h2>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={`w-full px-3 py-2 rounded-2xl focus:outline-none ${inputStyle}`}
              rows="6"
              required
            ></textarea>
            <button type="submit" className={buttonStyle}>
              Submit Feedback
            </button>
          </form>
        </motion.div>

        {/* Donations Section (3 methods) */}
        <motion.div
          className={`p-8 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 max-w-3xl mx-auto text-center mb-16`}
        >
          <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-3">Support MediNova</h2>
          <p className="text-gray-300 mb-6">
            Your donations help us keep MediNova free, secure, and accessible to everyone.
          </p>

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <input
              type="number"
              min="1"
              placeholder="Amount PKR (optional)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className={`px-4 py-2 rounded-2xl w-48 text-center ${inputStyle}`}
            />
            {[500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                onClick={() => setDonationAmount(amt)}
                className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                PKR {amt}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { method: "JazzCash", img: qrUrls.jazzcash },
              { method: "Easypaisa", img: qrUrls.easypaisa },
              { method: "Payoneer", img: qrUrls.payoneer },
            ].map((d) => (
              <div key={d.method} className="flex flex-col items-center">
                <motion.img
                  src={d.img}
                  alt={`${d.method} QR`}
                  className="w-40 h-40 rounded-2xl border border-white/30 shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    handleDonate({
                      method: d.method,
                      amount: donationAmount,
                    })
                  }
                />
                <button
                  onClick={() =>
                    handleDonate({
                      method: d.method,
                      amount: donationAmount,
                    })
                  }
                  className="mt-3 px-4 py-2 rounded-2xl bg-[#0A3D62] text-white hover:bg-[#081F5C] transition-all duration-200"
                >
                  Donate with {d.method}
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-6">
            *Donations are used solely for MediNova’s hosting, APIs, and ongoing improvements.*
          </p>
        </motion.div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {showSuccess && recentDonationDetails && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${notifyCard} shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-[#00C2CB] mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>
                  Donation Successful ✅
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {successMessage}
                </p>
                <ul className={`text-sm ${textColor} mt-2`}>
                  <li><strong>Method:</strong> {recentDonationDetails.method}</li>
                  <li><strong>Amount:</strong> {recentDonationDetails.amount}</li>
                  <li><strong>Reference:</strong> {recentDonationDetails.reference}</li>
                </ul>
              </div>
              <motion.button
                onClick={() => setShowSuccess(false)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
              >
                <X className="w-5 h-5 text-[#00C2CB]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showError && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${notifyCard}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>Error ❌</h3>
                <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {showError}
                </p>
              </div>
              <motion.button
                onClick={() => setShowError(null)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30"
              >
                <X className="w-5 h-5 text-[#00C2CB]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Contact;

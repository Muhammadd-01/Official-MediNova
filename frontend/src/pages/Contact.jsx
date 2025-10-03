import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { DarkModeContext } from "../App";
import { CheckCircle, X, AlertCircle } from "lucide-react";

function Contact() {
  const { darkMode } = useContext(DarkModeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  // Notification states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(null);

 // Contact form
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
    console.error(err);
    setShowError(
      err.response?.data?.message || "Something went wrong! Please try again later."
    );
    setTimeout(() => setShowError(null), 3000);
  }
};


  // Feedback form - send to backend
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return; // prevent empty submission

    try {
      const res = await axios.post("http://localhost:4000/api/feedback", {
        feedback,
      });

      setSuccessMessage(res.data.message || "Feedback submitted successfully ✅");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFeedback(""); // clear form
    } catch (err) {
      console.error(err);
      setShowError(
        err.response?.data?.message ||
          "Something went wrong! Please try again later."
      );
      setTimeout(() => setShowError(null), 3000);
    }
  };

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
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            className={`p-8 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl focus:outline-none ${inputStyle}`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl focus:outline-none ${inputStyle}`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block font-bold mb-2">
                  Message:
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl focus:outline-none ${inputStyle}`}
                  rows="6"
                  required
                ></textarea>
              </div>
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
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold mb-6">Our Location</h2>
            <div className="mb-6 space-y-2">
              <p>123 Medical Street</p>
              <p>Health City, HC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: contact.medinova@gmail.com</p>
            </div>
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767645"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        </div>

        {/* Feedback Form */}
        <motion.div
          className={`p-8 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 max-w-3xl mx-auto mb-16`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-bold mb-6">Provide Feedback</h2>
          <form onSubmit={handleFeedbackSubmit}>
            <label htmlFor="feedback" className="block font-bold mb-2">
              Your Feedback:
            </label>
            <textarea
              id="feedback"
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
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${notifyCard} shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-[#00C2CB] mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>Success ✅</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  {successMessage}
                </p>
              </div>
              <motion.button
                onClick={() => setShowSuccess(false)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-[#00C2CB]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {showError && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${notifyCard} shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>Error ❌</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  {showError}
                </p>
              </div>
              <motion.button
                onClick={() => setShowError(null)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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

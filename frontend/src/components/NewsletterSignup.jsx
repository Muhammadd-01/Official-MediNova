import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { darkMode } = useContext(DarkModeContext);

  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";
  const inputBg = darkMode
    ? "bg-[#0A2A43]/60 border-white/10 text-[#FDFBFB]"
    : "bg-white/60 border-[#0A3D62]/10 text-[#0A3D62]";
  const buttonBg = darkMode
    ? "bg-white/70 text-[#0A2A43] hover:bg-white/80"
    : "bg-[#0A3D62]/80 text-white hover:bg-[#0A3D62]/90";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <motion.div
      className={`p-8 sm:p-10 rounded-[40px] ${cardBg} backdrop-blur-2xl transition-all duration-500`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      role="region"
      aria-label="Newsletter Signup Section"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Subscribe to Our Newsletter
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
        aria-label="Newsletter subscription form"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`flex-grow px-5 py-4 rounded-2xl ${inputBg} border focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300`}
          aria-label="Enter your email for newsletter subscription"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`px-8 py-4 rounded-2xl font-semibold ${buttonBg} transition-all duration-500`}
          aria-label="Subscribe to newsletter"
        >
          Subscribe
        </motion.button>
      </form>
    </motion.div>
  );
}

export default NewsletterSignup;

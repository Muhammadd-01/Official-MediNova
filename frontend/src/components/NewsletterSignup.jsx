import React, { useState } from "react";
import { motion } from "framer-motion";

function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <motion.div
      className={`
        p-6 sm:p-8 rounded-[40px] shadow-md
        bg-white text-[#0A3D62]
        dark:bg-[#0A2A43] dark:text-[#FDFBFB]
        transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Newsletter Signup Section"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Subscribe to Our Newsletter
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`
            flex-grow px-4 py-3 rounded-xl border
            border-gray-200 text-[#0A3D62] bg-gray-50
            dark:border-[#FDFBFB]/50 dark:text-[#FDFBFB] dark:bg-[#0A2A43]/80
            focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]
            transition-all duration-300
          `}
          aria-label="Enter your email for newsletter subscription"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className={`
            px-6 py-3 rounded-xl transition-all duration-300
            bg-[#0A3D62] text-[#FDFBFB] hover:bg-[#08253A] hover:shadow-md
            dark:bg-[#FDFBFB] dark:text-[#0A2A43] dark:hover:bg-[#d6d6d6]
            focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]
          `}
          aria-label="Subscribe to newsletter"
        >
          Subscribe
        </button>
      </div>
    </motion.div>
  );
}

export default NewsletterSignup;
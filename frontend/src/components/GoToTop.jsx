"use client";

import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { DarkModeContext } from "../App";
import { motion } from "framer-motion";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { darkMode } = useContext(DarkModeContext);

  // Show button after scrolling 300px
  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Scroll to top automatically on route change
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  // Listen for manual scroll
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Liquid glass styles
  const baseGlass = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";
  const hoverGlass = darkMode
    ? "hover:bg-[#0A2A43]/50"
    : "hover:bg-white/50";

  return (
    <>
      {isVisible && (
        <motion.div
          onClick={scrollToTop}
          className={`fixed bottom-24 right-4 cursor-pointer p-3 rounded-full backdrop-blur-2xl shadow-lg flex items-center justify-center ${baseGlass} ${hoverGlass} transition-all duration-500 z-50`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={24} />
        </motion.div>
      )}
    </>
  );
};

export default GoToTop;

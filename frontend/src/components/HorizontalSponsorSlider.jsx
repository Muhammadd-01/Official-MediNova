"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

// Updated medical company logos (high-quality, transparent PNGs if possible)
const sponsors = [
  {
    name: "Johnson & Johnson",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Johnson_%26_Johnson_logo.svg",
  },
  {
    name: "Pfizer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Pfizer_%282021%29.svg",
  },
  {
    name: "Novartis",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Novartis-Logo.svg",
  },
  {
    name: "Roche",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Hoffmann-La_Roche_logo.svg",
  },
  {
    name: "Merck",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Merck_logo.svg",
  },
  {
    name: "GlaxoSmithKline",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/GlaxoSmithKline_logo.svg",
  },
];

const HorizontalSponsorSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Base and hover glass styles for inner circles
  const baseGlass = darkMode
    ? "bg-[#0A2A43]/30 border border-white/20"
    : "bg-white/30 border border-[#0A3D62]/20";
  const hoverGlass = darkMode
    ? "hover:bg-[#0A2A43]/50"
    : "hover:bg-white/50";

  return (
    <div className="relative w-full overflow-hidden h-32">
      <motion.div
        className="flex"
        animate={{ x: `-${currentIndex * (100 / sponsors.length)}%` }}
        transition={{ duration: 0.5 }}
      >
        {sponsors.concat(sponsors.slice(0, sponsors.length - 1)).map((sponsor, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-1/5 flex items-center justify-center"
          >
            <motion.div
              className={`rounded-full p-4 backdrop-blur-3xl shadow-lg ${baseGlass} ${hoverGlass} transition-all duration-500 flex items-center justify-center`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-16 w-16 object-contain rounded-full"
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HorizontalSponsorSlider;

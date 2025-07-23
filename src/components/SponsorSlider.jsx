"use client";
import { motion } from "framer-motion";
import { useContext } from "react";
import { DarkModeContext } from "../App";

const sponsors = [
  {
    name: "Pfizer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Pfizer_%282021%29.svg",
  },
  {
    name: "Moderna",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Moderna_logo.svg",
  },
  {
    name: "Roche",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Hoffmann-La_Roche_logo.svg",
  },
  {
    name: "AbbVie",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/AbbVie_Logo.svg",
  },
  {
    name: "Johnson & Johnson",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Johnson_%26_Johnson_logo.svg",
  },
];

const SponsorSlider = () => {
  const { darkMode } = useContext(DarkModeContext);

  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-white";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A2A43]";
  const borderStyle = darkMode ? "border border-[#FDFBFB]/20" : "border border-[#E2E8F0]";

  return (
    <div
      className={`w-full overflow-hidden p-4 rounded-lg shadow-md ${bgColor} ${textColor} ${borderStyle}`}
    >
      <h3 className="text-xl font-semibold mb-4">Our Sponsors</h3>
      <motion.div
        className="flex items-center"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {[...sponsors, ...sponsors].map((sponsor, index) => (
          <div key={index} className="flex-shrink-0 w-48 mx-6">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-full h-20 object-contain grayscale hover:grayscale-0 transition duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SponsorSlider;

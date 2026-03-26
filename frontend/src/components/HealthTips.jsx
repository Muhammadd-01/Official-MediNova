import { useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

const healthTips = [
  "Stay hydrated by drinking at least 8 glasses of water a day.",
  "Aim for at least 30 minutes of moderate exercise 5 days a week.",
  "Eat a balanced diet rich in fruits, vegetables, and whole grains.",
  "Get 7-9 hours of sleep each night for optimal health.",
  "Practice stress-reduction techniques like meditation or deep breathing.",
  "Limit processed foods and sugary drinks in your diet.",
  "Don't skip breakfast – it's the most important meal of the day.",
  "Regular health check-ups can help detect issues early.",
];

const HealthTips = () => {
  const { darkMode } = useContext(DarkModeContext);

  const baseGlass = darkMode
    ? "bg-[#0A2A43]/40 border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 border border-[#0A3D62]/10 text-[#0A3D62]";
  const hoverGlass = darkMode
    ? "hover:bg-[#0A2A43]/50"
    : "hover:bg-white/50";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {healthTips.map((tip, index) => (
        <motion.div
          key={index}
          className={`flex items-start p-5 rounded-3xl ${baseGlass} ${hoverGlass} backdrop-blur-2xl transition-all duration-500`}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="mr-4 text-lg font-bold text-teal-400">•</span>
          <span className="text-base sm:text-lg leading-relaxed">{tip}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default HealthTips;

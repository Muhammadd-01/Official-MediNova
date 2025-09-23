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

  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-white";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bulletColor = textColor;

  return (
    <motion.div
      className={`p-6 sm:p-8 rounded-[40px] shadow-md ${bgColor} ${textColor} transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Health Tips Section"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">Health Tips</h2>
      <ul className="space-y-3">
        {healthTips.map((tip, index) => (
          <motion.li
            key={index}
            className="flex items-start p-3 rounded-xl bg-gray-50 dark:bg-[#0A2A43]/50 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#0A2A43]/70"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
          >
            <span className={`mr-3 ${bulletColor} text-lg font-bold`}>•</span>
            <span className="text-sm sm:text-base">{tip}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default HealthTips;
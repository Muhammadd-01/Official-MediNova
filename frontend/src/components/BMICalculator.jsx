import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState(null);
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

  function calculateBMI(e) {
    e.preventDefault();
    if (height && weight) {
      const h = height / 100;
      setBMI((weight / (h * h)).toFixed(1));
    }
  }

  return (
    <motion.div
      className={`p-8 sm:p-10 rounded-[40px] ${cardBg} backdrop-blur-2xl transition-all duration-500`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center tracking-wide">
        BMI Calculator
      </h2>

      <form className="space-y-6" aria-label="BMI Calculator Form">
        <div>
          <label htmlFor="height" className="block mb-2 font-medium">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`w-full p-4 rounded-2xl ${inputBg} border focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300`}
            required
          />
        </div>

        <div>
          <label htmlFor="weight" className="block mb-2 font-medium">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`w-full p-4 rounded-2xl ${inputBg} border focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300`}
            required
          />
        </div>

        <motion.button
          type="button"
          onClick={(e) => calculateBMI(e)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full px-6 py-3 rounded-2xl font-semibold ${buttonBg} transition-all duration-500`}
        >
          Calculate BMI
        </motion.button>
      </form>

      {bmi && (
        <motion.div
          className="mt-8 p-6 rounded-3xl bg-white/30 dark:bg-[#0A2A43]/50 backdrop-blur-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-bold text-2xl">Your BMI: {bmi}</p>
          <p className="text-sm mt-3">
            {bmi < 18.5
              ? "Underweight"
              : bmi < 25
              ? "Normal weight"
              : bmi < 30
              ? "Overweight"
              : "Obese"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BMICalculator;

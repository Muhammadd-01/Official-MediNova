import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const { darkMode } = useContext(DarkModeContext);

  // Color scheme synced with Slider (#0A3D62 light, #0A2A43 dark)
  const primaryText = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-white";
  const inputBg = darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50";
  const inputText = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const borderColor = darkMode ? "border-[#FDFBFB]/50" : "border-gray-200";
  const buttonBg = darkMode ? "bg-[#FDFBFB] text-[#0A2A43]" : "bg-[#0A3D62] text-[#FDFBFB]";
  const buttonHover = darkMode
    ? "hover:bg-[#d6d6d6] hover:text-[#0A2A43]"
    : "hover:bg-[#08253A] hover:text-[#FDFBFB]";

  return (
    <motion.div
      className={`p-6 sm:p-8 rounded-[40px] shadow-md ${bgColor} ${primaryText} transition-all duration-300 hover:shadow-xl border ${borderColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">BMI Calculator</h2>

      <form className="space-y-4 sm:space-y-6" aria-label="BMI Calculator Form">
        <div>
          <label htmlFor="height" className={`block mb-1 font-medium ${primaryText}`}>
            Height (cm):
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`w-full p-3 rounded-xl ${inputBg} ${inputText} ${borderColor} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-colors duration-300`}
            required
            aria-label="Enter height in centimeters"
          />
        </div>

        <div>
          <label htmlFor="weight" className={`block mb-1 font-medium ${primaryText}`}>
            Weight (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`w-full p-3 rounded-xl ${inputBg} ${inputText} ${borderColor} focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB] transition-colors duration-300`}
            required
            aria-label="Enter weight in kilograms"
          />
        </div>

        <button
          type="button"
          onClick={(e) => calculateBMI(e)}
          className={`w-full px-4 py-3 rounded-xl ${buttonBg} ${buttonHover} font-medium transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
          aria-label="Calculate BMI"
        >
          Calculate BMI
        </button>
      </form>

      {bmi && (
        <motion.div
          className={`mt-6 p-4 rounded-xl bg-gray-50 dark:bg-[#0A2A43]/50 ${primaryText}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold text-lg">Your BMI: {bmi}</p>
          <p className="text-sm">
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

  function calculateBMI(e) {
    e.preventDefault();
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBMI(bmiValue);
    }
  }
};

export default BMICalculator;
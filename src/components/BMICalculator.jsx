import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const { darkMode } = useContext(DarkModeContext);

  // Color scheme adjusted to match navbar (dark: #0A2A43, light: #FDFBFB)
  const primaryText = darkMode ? "text-[#FDFBFB]" : "text-[#0A2A43]";
  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-[#FDFBFB]";
  const inputBg = darkMode ? "bg-[#0A2A43]" : "bg-white";
  const inputText = darkMode ? "text-[#FDFBFB]" : "text-[#0A2A43]";
  const borderColor = darkMode ? "border border-[#FDFBFB]" : "border border-[#D9D9D9]";
  const buttonBg = darkMode
    ? "bg-[#FDFBFB] text-[#0A2A43]"
    : "bg-[#0A2A43] text-[#FDFBFB]";
  const buttonHover = darkMode
    ? "hover:bg-[#d6d6d6] hover:text-[#0A2A43]"
    : "hover:bg-[#163954] hover:text-[#FDFBFB]";

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-md ${bgColor} ${primaryText}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">BMI Calculator</h2>

      <form onSubmit={calculateBMI} className="space-y-4">
        <div>
          <label htmlFor="height" className={`block mb-1 ${primaryText}`}>
            Height (cm):
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`w-full p-2 rounded ${inputBg} ${inputText} ${borderColor} focus:outline-none`}
            required
          />
        </div>

        <div>
          <label htmlFor="weight" className={`block mb-1 ${primaryText}`}>
            Weight (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`w-full p-2 rounded ${inputBg} ${inputText} ${borderColor} focus:outline-none`}
            required
          />
        </div>

        <button
          type="submit"
          className={`px-4 py-2 rounded transition duration-300 ${buttonBg} ${buttonHover}`}
        >
          Calculate BMI
        </button>
      </form>

      {bmi && (
        <div className={`mt-4 ${primaryText}`}>
          <p className="font-semibold">Your BMI: {bmi}</p>
          <p>
            {bmi < 18.5
              ? "Underweight"
              : bmi < 25
              ? "Normal weight"
              : bmi < 30
              ? "Overweight"
              : "Obese"}
          </p>
        </div>
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

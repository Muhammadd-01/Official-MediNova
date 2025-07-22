import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const { darkMode } = useContext(DarkModeContext);

  // Unified medical blue theme
  const primaryText = darkMode ? "text-[#FDFBFB]" : "text-[#122C47]";
  const bgColor = darkMode ? "bg-[#7F2323]" : "bg-white";
  const inputBg = darkMode ? "bg-[#5e1a1a]" : "bg-[#FDFBFB]";
  const inputText = darkMode ? "text-white" : "text-[#122C47]";
  const borderColor = "border border-[#E1E1E1]";
  const buttonBg = darkMode
    ? "bg-white text-[#7F2323]"
    : "bg-[#122C47] text-[#FDFBFB]";
  const buttonHover = darkMode
    ? "hover:bg-[#FDFBFB] hover:text-[#7F2323]"
    : "hover:text-gray-300 hover:bg-[#0f1f36]";

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

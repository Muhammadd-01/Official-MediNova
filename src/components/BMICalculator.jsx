import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { DarkModeContext } from "../App"

const BMICalculator = () => {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bmi, setBMI] = useState(null)
  const { darkMode } = useContext(DarkModeContext)

  const calculateBMI = (e) => {
    e.preventDefault()
    if (height && weight) {
      const heightInMeters = height / 100
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      setBMI(bmiValue)
    }
  }

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">BMI Calculator</h2>
      <form onSubmit={calculateBMI} className="space-y-4">
        <div>
          <label htmlFor="height" className="block mb-1">
            Height (cm):
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`w-full p-2 rounded ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-800"}`}
            required
          />
        </div>
        <div>
          <label htmlFor="weight" className="block mb-1">
            Weight (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`w-full p-2 rounded ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-800"}`}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Calculate BMI
        </button>
      </form>
      {bmi && (
        <div className="mt-4">
          <p className="font-semibold">Your BMI: {bmi}</p>
          <p>{bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese"}</p>
        </div>
      )}
    </motion.div>
  )
}

export default BMICalculator


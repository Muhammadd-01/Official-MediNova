import { useContext } from "react"
import { motion } from "framer-motion"
import { DarkModeContext } from "../App"

const healthTips = [
  "Stay hydrated by drinking at least 8 glasses of water a day.",
  "Aim for at least 30 minutes of moderate exercise 5 days a week.",
  "Eat a balanced diet rich in fruits, vegetables, and whole grains.",
  "Get 7-9 hours of sleep each night for optimal health.",
  "Practice stress-reduction techniques like meditation or deep breathing.",
  "Limit processed foods and sugary drinks in your diet.",
  "Don't skip breakfast – it's the most important meal of the day.",
  "Regular health check-ups can help detect issues early.",
]

const HealthTips = () => {
  const { darkMode } = useContext(DarkModeContext)

  const bgColor = darkMode ? "bg-[#7F2323]" : "bg-transparent"
  const textColor = darkMode ? "text-white" : "text-[#7F2323]"
  const bulletColor = darkMode ? "text-[#FDFBFB]" : "text-[#7F2323]"

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-md ${bgColor} ${textColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Health Tips</h2>
      <ul className="space-y-2">
        {healthTips.map((tip, index) => (
          <motion.li
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
          >
            <span className={`mr-2 ${bulletColor}`}>•</span>
            <span>{tip}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default HealthTips

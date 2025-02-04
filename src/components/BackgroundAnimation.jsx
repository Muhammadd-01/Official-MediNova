import { useContext } from "react"
import { motion } from "framer-motion"
import { DarkModeContext } from "../App"

const BackgroundAnimation = () => {
  const { darkMode } = useContext(DarkModeContext)

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: darkMode
            ? [
                "linear-gradient(to bottom right, #1a202c, #2d3748, #4a5568)",
                "linear-gradient(to bottom right, #2d3748, #4a5568, #718096)",
                "linear-gradient(to bottom right, #1a202c, #2d3748, #4a5568)",
              ]
            : [
                "linear-gradient(to bottom right, #e6f2ff, #ffffff, #cce4ff)",
                "linear-gradient(to bottom right, #ffffff, #cce4ff, #99c9ff)",
                "linear-gradient(to bottom right, #e6f2ff, #ffffff, #cce4ff)",
              ],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
      />
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default BackgroundAnimation


import React, { useContext } from "react"
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
                "linear-gradient(to bottom right, #000033, #000066, #000099)",
                "linear-gradient(to bottom right, #000066, #000099, #0000CC)",
                "linear-gradient(to bottom right, #000033, #000066, #000099)",
              ]
            : [
                "linear-gradient(to bottom right, #E6F3FF, #FFFFFF, #CCE6FF)",
                "linear-gradient(to bottom right, #FFFFFF, #CCE6FF, #99CCFF)",
                "linear-gradient(to bottom right, #E6F3FF, #FFFFFF, #CCE6FF)",
              ],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
      />
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${darkMode ? "bg-blue-300" : "bg-blue-600"}`}
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.5, 0.1],
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


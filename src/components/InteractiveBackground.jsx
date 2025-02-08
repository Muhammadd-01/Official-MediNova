"use client"

import { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"
import { DarkModeContext } from "../App"

const InteractiveBackground = () => {
  const [dots, setDots] = useState([])
  const { darkMode } = useContext(DarkModeContext)

  useEffect(() => {
    const handleClick = (e) => {
      const newDot = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      }
      setDots((prevDots) => [...prevDots, newDot])
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className={`absolute rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}
          style={{
            width: 4,
            height: 4,
            left: dot.x,
            top: dot.y,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [1, 2, 2, 1, 1],
            opacity: [1, 1, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        />
      ))}
    </div>
  )
}

export default InteractiveBackground


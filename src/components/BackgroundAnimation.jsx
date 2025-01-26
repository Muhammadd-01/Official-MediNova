import * as React from "react"
import { motion } from "framer-motion"

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white"
        animate={{
          background: [
            "linear-gradient(to bottom right, #E6F3FF, #FFFFFF)",
            "linear-gradient(to bottom right, #F0F8FF, #FFFFFF)",
            "linear-gradient(to bottom right, #E6F3FF, #FFFFFF)",
          ],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
      <svg className="absolute inset-0 w-full h-full">
        <motion.circle
          cx="10%"
          cy="10%"
          r="5"
          fill="#4A90E2"
          animate={{
            cx: ["10%", "90%", "10%"],
            cy: ["10%", "90%", "10%"],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
        <motion.circle
          cx="90%"
          cy="90%"
          r="5"
          fill="#4A90E2"
          animate={{
            cx: ["90%", "10%", "90%"],
            cy: ["90%", "10%", "90%"],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      </svg>
    </div>
  )
}


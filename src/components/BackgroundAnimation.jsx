import React from 'react'
import { motion } from 'framer-motion'

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(to bottom right, #1a2a6c, #b21f1f, #fdbb2d)",
            "linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)",
            "linear-gradient(to bottom right, #1a2a6c, #b21f1f, #fdbb2d)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-300"
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
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default BackgroundAnimation

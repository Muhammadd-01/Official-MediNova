import React from 'react'
import { motion } from 'framer-motion'

const BackgroundAnimation = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: darkMode
            ? [
                "radial-gradient(circle at 20% 20%, rgba(54, 54, 54, 1) 0%, rgba(24, 24, 24, 1) 100%)",
                "radial-gradient(circle at 80% 80%, rgba(54, 54, 54, 1) 0%, rgba(24, 24, 24, 1) 100%)",
                "radial-gradient(circle at 20% 20%, rgba(54, 54, 54, 1) 0%, rgba(24, 24, 24, 1) 100%)",
              ]
            : [
                "radial-gradient(circle at 20% 20%, rgba(173, 216, 230, 1) 0%, rgba(135, 206, 235, 1) 100%)",
                "radial-gradient(circle at 80% 80%, rgba(135, 206, 235, 1) 0%, rgba(70, 130, 180, 1) 100%)",
                "radial-gradient(circle at 20% 20%, rgba(173, 216, 230, 1) 0%, rgba(135, 206, 235, 1) 100%)",
              ],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: darkMode
              ? `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 200}, 0.1)`
              : `rgba(${Math.random() * 50 + 150}, ${Math.random() * 50 + 200}, ${Math.random() * 50 + 230}, 0.1)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
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

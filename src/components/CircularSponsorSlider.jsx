"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sponsors = [
  { name: "Johnson & Johnson", logo: "https://www.example.com/jnj-logo.png" },
  { name: "Pfizer", logo: "https://www.example.com/pfizer-logo.png" },
  { name: "Novartis", logo: "https://www.example.com/novartis-logo.png" },
  { name: "Roche", logo: "https://www.example.com/roche-logo.png" },
  { name: "Merck", logo: "https://www.example.com/merck-logo.png" },
]

const CircularSponsorSlider = () => {
  const [currentSponsor, setCurrentSponsor] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSponsor((prevSponsor) => (prevSponsor + 1) % sponsors.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSponsor}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={sponsors[currentSponsor].logo || "/placeholder.svg"}
            alt={sponsors[currentSponsor].name}
            className="w-48 h-48 object-contain"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 right-0 text-center">{sponsors[currentSponsor].name}</div>
    </div>
  )
}

export default CircularSponsorSlider


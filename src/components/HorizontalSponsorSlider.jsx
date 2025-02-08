"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const sponsors = [
  { name: "Johnson & Johnson", logo: "https://logowik.com/content/uploads/images/johnson-and-johnson-new3874.jpg" },
  { name: "Pfizer", logo: "https://logowik.com/content/uploads/images/pfizer-new-20215837.jpg" },
  { name: "Novartis", logo: "https://logowik.com/content/uploads/images/novartis1561.jpg" },
  { name: "Roche", logo: "https://logowik.com/content/uploads/images/roche6906.jpg" },
  { name: "Merck", logo: "https://logowik.com/content/uploads/images/merck-and-co1726.jpg" },
  { name: "GlaxoSmithKline", logo: "https://logowik.com/content/uploads/images/gsk-glaxosmithkline6016.jpg" },
]

const HorizontalSponsorSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full overflow-hidden h-32">
      <motion.div
        className="flex"
        animate={{
          x: `-${currentIndex * (100 / 5)}%`,
        }}
        transition={{ duration: 0.5 }}
      >
        {sponsors.concat(sponsors.slice(0, 5)).map((sponsor, index) => (
          <div key={index} className="flex-shrink-0 w-1/5 flex items-center justify-center">
            <motion.div
              className="bg-white rounded-full p-2 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={sponsor.logo || "/placeholder.svg"}
                alt={sponsor.name}
                className="h-20 w-20 object-contain rounded-full"
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default HorizontalSponsorSlider


"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useContext } from "react"
import { DarkModeContext } from "../App"
import axios from "axios"

const CircularSponsorSlider = () => {
  const [sponsors, setSponsors] = useState([])
  const [currentSponsor, setCurrentSponsor] = useState(0)
  const { darkMode } = useContext(DarkModeContext)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        // For development purposes, use local data if the API call fails
        const response = await axios.get("http://localhost:5000/api/sponsors").catch(() => ({
          data: [
            { name: "PharmaCorp", logo: "/sponsor-logos/pharmacorp.png" },
            { name: "MediTech", logo: "/sponsor-logos/meditech.png" },
            { name: "HealthPlus", logo: "/sponsor-logos/healthplus.png" },
            { name: "BioLife", logo: "/sponsor-logos/biolife.png" },
            { name: "CureAll", logo: "/sponsor-logos/cureall.png" },
          ],
        }))
        setSponsors(response.data)
      } catch (error) {
        console.error("Error fetching sponsors:", error)
      }
    }

    fetchSponsors()
  }, [])

  useEffect(() => {
    if (sponsors.length === 0) return

    const timer = setInterval(() => {
      setCurrentSponsor((prevSponsor) => (prevSponsor + 1) % sponsors.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [sponsors.length])

  if (sponsors.length === 0) {
    return null
  }

  return (
    <div
      className={`w-64 h-64 relative mx-auto ${darkMode ? "bg-gray-800" : "bg-white"} rounded-full shadow-lg overflow-hidden`}
    >
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
      <div className={`absolute bottom-2 left-0 right-0 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
        {sponsors[currentSponsor].name}
      </div>
    </div>
  )
}

export default CircularSponsorSlider


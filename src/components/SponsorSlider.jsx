"use client"
import { motion } from "framer-motion"
import { useContext } from "react"
import { DarkModeContext } from "../App"

const sponsors = [
  { name: "PharmaCorp", logo: "/sponsor-logos/pharmacorp.png" },
  { name: "MediTech", logo: "/sponsor-logos/meditech.png" },
  { name: "HealthPlus", logo: "/sponsor-logos/healthplus.png" },
  { name: "BioLife", logo: "/sponsor-logos/biolife.png" },
  { name: "CureAll", logo: "/sponsor-logos/cureall.png" },
  //
]

const SponsorSlider = () => {
  const { darkMode } = useContext(DarkModeContext)

  return (
    <div className={`w-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow-md`}>
      <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Our Sponsors</h3>
      <motion.div
        className="flex"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...sponsors, ...sponsors].map((sponsor, index) => (
          <div key={index} className="flex-shrink-0 w-48 mx-4">
            <img src={sponsor.logo || "/placeholder.svg"} alt={sponsor.name} className="w-full h-24 object-contain" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default SponsorSlider


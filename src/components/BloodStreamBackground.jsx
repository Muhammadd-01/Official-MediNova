import { useState } from "react"
import { motion } from "framer-motion"

const particleTypes = [
  { name: "Red Blood Cell", color: "#ff5555", size: 20 },
  { name: "White Blood Cell", color: "#ffffff", size: 25 },
  { name: "Platelet", color: "#ffff00", size: 15 },
  { name: "DNA", color: "#00ff00", size: 30 },
]

const BloodStreamBackground = () => {
  const [hoveredParticle, setHoveredParticle] = useState(null)

  const particles = Array.from({ length: 50 }, (_, i) => {
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)]
    return {
      ...type,
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }
  })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full flex items-center justify-center cursor-pointer pointer-events-auto"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: ["-100%", "100%"],
            y: ["-100%", "100%"],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: Math.random() * 20 + 10,
              ease: "linear",
            },
            y: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: Math.random() * 20 + 10,
              ease: "linear",
            },
          }}
          onHoverStart={() => setHoveredParticle(particle)}
          onHoverEnd={() => setHoveredParticle(null)}
        >
          {particle.name === "DNA" && (
            <div className="w-4 h-8 border-l-2 border-r-2 border-black transform rotate-45"></div>
          )}
        </motion.div>
      ))}
      {hoveredParticle && (
        <div
          className="fixed bg-black text-white px-2 py-1 rounded text-sm pointer-events-none"
          style={{ left: `${hoveredParticle.x}%`, top: `${hoveredParticle.y}%`, transform: "translate(-50%, -100%)" }}
        >
          {hoveredParticle.name}
        </div>
      )}
    </div>
  )
}

export default BloodStreamBackground


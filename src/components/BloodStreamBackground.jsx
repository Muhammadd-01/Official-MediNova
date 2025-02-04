import { useState } from "react"
import { motion } from "framer-motion"

const particleTypes = [
  { name: "Red Blood Cell", color: "#ef4444", size: 6, shape: "circle" },
  { name: "White Blood Cell", color: "#f9fafb", size: 8, shape: "circle" },
  { name: "Platelet", color: "#fbbf24", size: 4, shape: "diamond" },
  { name: "DNA", color: "#10b981", size: 6, shape: "helix" },
  { name: "Plasma", color: "#93c5fd", size: 3, shape: "circle" },
]

const BloodStreamBackground = () => {
  const [hoveredParticle, setHoveredParticle] = useState(null)

  const particles = Array.from({ length: 150 }, (_, i) => {
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)]
    return {
      ...type,
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }
  })

  const renderParticleShape = (shape, size) => {
    switch (shape) {
      case "diamond":
        return (
          <div
            className="absolute transform rotate-45"
            style={{
              width: size,
              height: size,
              backgroundColor: "currentColor",
            }}
          />
        )
      case "helix":
        return (
          <div className="relative" style={{ width: size, height: size * 2 }}>
            <div
              className="absolute left-0 w-1/2 h-full rounded-full"
              style={{ backgroundColor: "currentColor", transform: "skew(0deg, 30deg)" }}
            />
            <div
              className="absolute right-0 w-1/2 h-full rounded-full"
              style={{ backgroundColor: "currentColor", transform: "skew(0deg, -30deg)" }}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.shape === "circle" ? "" : "flex items-center justify-center"}`}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.shape === "circle" ? particle.color : "transparent",
            color: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.7,
          }}
          animate={{
            x: ["-100%", "100%"],
            y: ["-100%", "100%"],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: Math.random() * 60 + 30,
              ease: "linear",
            },
            y: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: Math.random() * 60 + 30,
              ease: "linear",
            },
          }}
          onHoverStart={() => setHoveredParticle(particle)}
          onHoverEnd={() => setHoveredParticle(null)}
        >
          {renderParticleShape(particle.shape, particle.size)}
        </motion.div>
      ))}
      {hoveredParticle && (
        <div
          className="fixed bg-blue-600 text-white px-2 py-1 rounded text-xs pointer-events-none"
          style={{
            left: `${hoveredParticle.x}%`,
            top: `${hoveredParticle.y}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {hoveredParticle.name}
        </div>
      )}
    </div>
  )
}

export default BloodStreamBackground


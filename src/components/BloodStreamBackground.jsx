import { useState } from "react"
import { motion } from "framer-motion"

const particleTypes = [
  { name: "Red Blood Cell", color: "#ef4444", size: 8, shape: "circle" },
  { name: "White Blood Cell", color: "#f9fafb", size: 10, shape: "circle" },
  { name: "Platelet", color: "#fbbf24", size: 6, shape: "diamond" },
  { name: "DNA", color: "#10b981", size: 8, shape: "helix" },
  { name: "Plasma", color: "#93c5fd", size: 4, shape: "circle" },
]

const BloodStreamBackground = () => {
  const [hoveredParticle, setHoveredParticle] = useState(null)

  const particles = Array.from({ length: 150 }, (_, i) => {
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)]
    return {
      ...type,
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
    }
  })

  const renderParticleShape = (shape, size, color) => {
    switch (shape) {
      case "diamond":
        return (
          <div
            className="absolute transform rotate-45"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
            }}
          />
        )
      case "helix":
        return (
          <div className="relative" style={{ width: size, height: size * 2 }}>
            <div
              className="absolute left-0 w-1/2 h-full rounded-full"
              style={{ backgroundColor: color, transform: "skew(0deg, 30deg)" }}
            />
            <div
              className="absolute right-0 w-1/2 h-full rounded-full"
              style={{ backgroundColor: color, transform: "skew(0deg, -30deg)" }}
            />
          </div>
        )
      case "circle":
        if (color === "#ef4444") {
          // Red Blood Cell
          return (
            <div className="relative" style={{ width: size, height: size }}>
              <div className="absolute inset-0 rounded-full" style={{ backgroundColor: color, opacity: 0.7 }} />
              <div className="absolute inset-2 rounded-full" style={{ backgroundColor: "#fecaca", opacity: 0.5 }} />
            </div>
          )
        }
        return null
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.shape === "circle" ? particle.color : "transparent",
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: 0.7,
          }}
          animate={{
            x: ["-100%", "100%"],
            y: ["-100%", "100%"],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: Math.random() * 60 + 30,
              ease: "linear",
            },
            y: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: Math.random() * 60 + 30,
              ease: "linear",
            },
          }}
          onMouseEnter={() => setHoveredParticle(particle)}
          onMouseLeave={() => setHoveredParticle(null)}
        >
          {renderParticleShape(particle.shape, particle.size, particle.color)}
        </motion.div>
      ))}
      {hoveredParticle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed bg-blue-600 text-white px-2 py-1 rounded text-xs pointer-events-none z-50"
          style={{
            left: `${hoveredParticle.initialX}%`,
            top: `${hoveredParticle.initialY}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {hoveredParticle.name}
        </motion.div>
      )}
    </div>
  )
}

export default BloodStreamBackground


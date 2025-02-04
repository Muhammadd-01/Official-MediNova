import { motion } from "framer-motion"

const particleTypes = [
  { name: "Red Blood Cell", color: "#3b82f6", size: 8 },
  { name: "White Blood Cell", color: "#93c5fd", size: 10 },
  { name: "Platelet", color: "#60a5fa", size: 6 },
  { name: "Plasma", color: "#dbeafe", size: 4 },
]

const BloodStreamBackground = () => {
  const particles = Array.from({ length: 100 }, (_, i) => {
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
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
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
        >
          {particle.name === "Red Blood Cell" && (
            <div className="w-full h-full rounded-full border-2 border-blue-400"></div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default BloodStreamBackground


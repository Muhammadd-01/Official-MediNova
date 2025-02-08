import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { DarkModeContext } from "../../context/DarkModeContext"
import { ChevronDown } from "../icons/ChevronDown"

function MedicineCard({ medicine }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { darkMode } = useContext(DarkModeContext)

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-700" : "bg-white"
      } overflow-hidden relative transition-all duration-300 hover:shadow-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-professionalBlue-400 to-professionalBlue-600 transform rotate-45 translate-x-12 -translate-y-12 opacity-50"></div>
      <div className="flex items-center mb-4">
        <motion.img
          src={medicine?.image || "/placeholder.svg"}
          alt={medicine?.name}
          className="w-20 h-20 object-cover rounded-full mr-4 border-4 border-professionalBlue-300"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <h4 className="text-xl font-semibold">{medicine?.name}</h4>
      </div>
      <p className="mb-4">{medicine?.description}</p>
      <p className="mb-4">
        <strong>Dosage:</strong> {medicine?.dosage}
      </p>
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={{
          expanded: { height: "auto", opacity: 1 },
          collapsed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <h5 className="font-semibold mt-4 mb-2">Side Effects:</h5>
        <ul className="list-disc list-inside mb-4">
          {medicine?.sideEffects?.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
        <h5 className="font-semibold mb-2">Brand Names:</h5>
        <p>{medicine?.brandNames?.join(", ") || "N/A"}</p>
      </motion.div>
      <motion.button
        className="mt-4 text-professionalBlue-600 hover:text-professionalBlue-800 transition-colors duration-300 flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? "Show Less" : "Show More"}
        <motion.span initial={false} animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="ml-1" />
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

export default MedicineCard


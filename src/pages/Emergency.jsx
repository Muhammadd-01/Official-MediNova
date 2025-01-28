import React, { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { Phone, Ambulance, Hospital } from "lucide-react"
import { DarkModeContext } from "../App"

function Emergency() {
  const { darkMode } = useContext(DarkModeContext)

  const emergencyServices = [
    { name: "Ambulance", phone: "911", icon: Ambulance },
    { name: "Emergency Room", phone: "(555) 123-4567", icon: Hospital },
    { name: "Poison Control", phone: "(800) 222-1222", icon: Phone },
  ]

  return (
    <>
      <Helmet>
        <title>Emergency Services - MediCare</title>
        <meta
          name="description"
          content="Access emergency medical services and important contact information. Available 24/7 for your safety."
        />
        <link rel="canonical" href="https://www.medicare.com/emergency" />
        <meta property="og:title" content="Emergency Medical Services - MediCare" />
        <meta
          property="og:description"
          content="Quick access to emergency services and contact information for immediate medical assistance."
        />
        <meta property="og:url" content="https://www.medicare.com/emergency" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`max-w-4xl mx-auto ${darkMode ? "text-blue-100" : "text-blue-900"}`}>
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Emergency Services
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          If you are experiencing a medical emergency, please call 911 immediately.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {emergencyServices.map((service, index) => (
            <motion.div
              key={service.name}
              className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-blue-800" : "bg-white"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <service.icon className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold mb-2 text-center">{service.name}</h2>
              <p className="text-center">
                <a href={`tel:${service.phone}`} className="text-blue-500 hover:underline">
                  {service.phone}
                </a>
              </p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-2xl font-semibold mb-4">When to Seek Emergency Care</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Chest pain or difficulty breathing</li>
            <li>Severe bleeding or head trauma</li>
            <li>Loss of consciousness</li>
            <li>Severe burns or poisoning</li>
            <li>Broken bones or dislocated joints</li>
            <li>Severe allergic reactions</li>
          </ul>
        </motion.div>
      </div>
    </>
  )
}

export default Emergency


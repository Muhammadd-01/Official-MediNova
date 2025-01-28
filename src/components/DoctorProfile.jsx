import React, { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { DarkModeContext } from "../App"

function DoctorProfile({ doctor }) {
  const { darkMode } = useContext(DarkModeContext)

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    medicalSpecialty: doctor.specialization,
    availableService: {
      "@type": "MedicalProcedure",
      name: "Online Consultation",
      description: "Virtual medical consultation via video call",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `https://www.medicare.com/consultation/${doctor.id}`,
      servicePhone: doctor.phone,
    },
  }

  return (
    <motion.div
      className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-lg shadow-md`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
      <h2 className="text-2xl font-semibold mb-2 text-center">{doctor.name}</h2>
      <p className="mb-2 text-center">
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p className="mb-2 text-center">
        <strong>Availability:</strong> {doctor.availability}
      </p>
      <p className="mb-4 text-center">
        <strong>Phone:</strong> {doctor.phone}
      </p>
      <button
        className={`w-full ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded transition duration-300`}
      >
        Book Appointment
      </button>
    </motion.div>
  )
}

export default DoctorProfile


import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { DarkModeContext } from "../App";

function DoctorProfile({ doctor, onBookAppointment }) {
  const { darkMode } = useContext(DarkModeContext);

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
      serviceUrl: `https://www.MediNova.com/consultation/${doctor.id}`,
      servicePhone: doctor.phone,
    },
  };

  const bgColor = darkMode
    ? "bg-[#0A2A43]"
    : "bg-white backdrop-blur-sm"; // No opacity in light mode
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#01497C]";
  const buttonBg = darkMode
    ? "bg-[#FDFBFB] text-[#0A2A43] hover:bg-[#d6d6d6]"
    : "bg-[#01497C] text-white hover:bg-[#013760]";

  return (
    <motion.div
      className={`p-6 rounded-lg shadow-md transition-all duration-300 ${bgColor} ${textColor}`}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <motion.img
        src={doctor.image || "/placeholder.svg"}
        alt={doctor.name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.5 }}
      />

      <motion.h2
        className="text-2xl font-semibold mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {doctor.name}
      </motion.h2>

      <motion.p
        className="mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <strong>Specialization:</strong> {doctor.specialization}
      </motion.p>

      <motion.p
        className="mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <strong>Availability:</strong> {doctor.availability}
      </motion.p>

      <motion.p
        className="mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <strong>Phone:</strong> {doctor.phone}
      </motion.p>

      <motion.button
        className={`w-full px-4 py-2 rounded transition duration-300 ${buttonBg}`}
        whileHover={{ scale: 1.05, boxShadow: "0 5px 10px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onBookAppointment}
      >
        Book Appointment
      </motion.button>
    </motion.div>
  );
}

export default DoctorProfile;

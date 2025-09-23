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
    ? "bg-[#0A2A43]/70 backdrop-blur-xl"
    : "bg-white/40 backdrop-blur-xl"; // glassmorphism base
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#01497C]";
  const buttonBg = darkMode
    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:opacity-90"
    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90";

  return (
    <motion.div
      className={`relative p-6 rounded-[40px] shadow-xl overflow-hidden transition-all duration-500 ${bgColor} ${textColor}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Futuristic glowing gradient border */}
      <div className="absolute inset-0 rounded-[40px] pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-blue-500/40 via-purple-500/30 to-pink-500/40 blur-2xl opacity-30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />
      </div>

      {/* Profile Image */}
      <motion.img
        src={doctor.image || "/placeholder.svg"}
        alt={doctor.name}
        className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-blue-400/60 shadow-lg"
        whileHover={{ scale: 1.15, rotate: 10 }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Doctor Info */}
      <motion.h2
        className="text-2xl font-bold text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {doctor.name}
      </motion.h2>

      <motion.p
        className="mb-1 text-center opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <strong>Specialization:</strong> {doctor.specialization}
      </motion.p>

      <motion.p
        className="mb-1 text-center opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <strong>Availability:</strong> {doctor.availability}
      </motion.p>

      <motion.p
        className="mb-4 text-center opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <strong>Phone:</strong> {doctor.phone}
      </motion.p>

      {/* Button with futuristic hover */}
      <motion.button
        className={`relative w-full px-5 py-3 rounded-2xl font-semibold shadow-md overflow-hidden group ${buttonBg}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBookAppointment}
      >
        <span className="relative z-10">Book Appointment</span>
        {/* Liquid-glass ripple animation */}
        <motion.span
          className="absolute inset-0 bg-white/20 blur-xl rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.4, scale: 1.2 }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </motion.div>
  );
}

export default DoctorProfile;

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

  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 backdrop-blur-2xl border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 backdrop-blur-2xl border border-[#0A3D62]/20 text-[#0A3D62]";

  const buttonBg = darkMode
    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:opacity-90"
    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90";

  return (
    <motion.div
      className={`relative p-6 rounded-[40px] shadow-lg ${cardBg} transition-all duration-500 overflow-hidden cursor-pointer`}
      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Glowing gradient overlay for liquid glass feel */}
      <div className="absolute inset-0 rounded-[40px] pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-blue-400/40 via-purple-400/30 to-pink-400/30 blur-2xl opacity-30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />
      </div>

      {/* Doctor Image */}
      <motion.img
        src={doctor.image || "/placeholder.svg"}
        alt={doctor.name}
        className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-blue-400/60 shadow-lg"
        whileHover={{ scale: 1.15, rotate: 10 }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Doctor Info */}
      <h2 className="text-2xl font-bold text-center mb-2">{doctor.name}</h2>
      <p className="text-center opacity-80 mb-1">
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p className="text-center opacity-80 mb-1">
        <strong>Availability:</strong> {doctor.availability}
      </p>
      <p className="text-center opacity-80 mb-4">
        <strong>Phone:</strong> {doctor.phone}
      </p>

      {/* Book Appointment Button */}
      <motion.button
        className={`relative w-full px-5 py-3 rounded-2xl font-semibold shadow-md overflow-hidden group ${buttonBg}`}
        onClick={onBookAppointment}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="relative z-10">Book Appointment</span>
        {/* Liquid glass ripple */}
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

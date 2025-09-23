import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DoctorProfile from "../components/DoctorProfile";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";

const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    availability: "Mon, Wed, Fri",
    phone: "+1 (555) 123-4567",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialization: "Dermatologist",
    availability: "Tue, Thu, Sat",
    phone: "+1 (555) 234-5678",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    specialization: "Pediatrician",
    availability: "Mon, Tue, Wed",
    phone: "+1 (555) 345-6789",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: 4,
    name: "Dr. Sarah Lee",
    specialization: "Neurologist",
    availability: "Wed, Thu, Fri",
    phone: "+1 (555) 456-7890",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: 5,
    name: "Dr. Robert Chen",
    specialization: "Orthopedic Surgeon",
    availability: "Mon, Wed, Fri",
    phone: "+1 (555) 567-8901",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: 6,
    name: "Dr. Emily Davis",
    specialization: "Psychiatrist",
    availability: "Tue, Thu, Sat",
    phone: "+1 (555) 678-9012",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  },
];

function Consultation() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const bgColor = darkMode ? "bg-[#0A2A43]/80" : "bg-gray-50";
  const buttonTextColor = darkMode ? "text-[#FDFBFB]" : "text-white";

  const handleBookAppointment = () => {
    setShowPremiumModal(true);
  };

  return (
    <>
      <Helmet>
        <title>Book a Consultation - MediNova</title>
        <meta
          name="description"
          content="Book a consultation with our expert doctors. View doctor profiles and availability for personalized medical advice."
        />
        <link rel="canonical" href="https://www.MediNova.com/consultation" />
        <meta property="og:title" content="Expert Medical Consultations - MediNova" />
        <meta
          property="og:description"
          content="Book a consultation with our experienced doctors for personalized medical advice."
        />
        <meta property="og:url" content="https://www.MediNova.com/consultation" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <div
        className={`min-h-screen pt-20 p-4 sm:p-6 ${textColor} bg-transparent rounded-[40px] shadow-md transition-all duration-300 hover:shadow-xl max-w-7xl mx-auto border-none outline-none`}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0A3D62] to-blue-500"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Book a Consultation
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, shadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 * (index + 1) }}
              className={`p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-none outline-none`}
            >
              <DoctorProfile doctor={doctor} onBookAppointment={handleBookAppointment} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={`p-4 sm:p-6 rounded-[40px] ${bgColor} shadow-md hover:shadow-xl transition-all duration-300 border-none outline-none`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${textColor}`}>
            Related Services
          </h2>
          <ul className="list-disc list-inside">
            {[
              { to: "/medicine-suggestion", text: "Get personalized medicine suggestions" },
              { to: "/articles", text: "Read our health articles" },
              { to: "/news", text: "Stay updated with the latest medical news" },
            ].map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className={`text-[#0A3D62] hover:text-[#08253A] dark:text-[#FDFBFB] dark:hover:text-[#B8C4F4] hover:underline transition-all duration-300`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`p-6 sm:p-8 rounded-[40px] ${bgColor} shadow-xl max-w-md w-full transition-all duration-300 border-none outline-none`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${textColor}`}>
                Upgrade to Premium
              </h2>
              <p className={`mb-6 ${textColor} opacity-80`}>
                Unlock premium features to book consultations with our expert doctors.
              </p>
              <div className="flex justify-between gap-4">
                <motion.button
                  onClick={() => setShowPremiumModal(false)}
                  className={`bg-[#0A3D62] ${buttonTextColor} px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Cancel premium upgrade"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => setShowPremiumModal(false)}
                  className={`bg-[#0A3D62] ${buttonTextColor} px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] dark:focus:ring-[#FDFBFB]`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Upgrade to premium"
                >
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default Consultation;
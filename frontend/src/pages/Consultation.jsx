"use client";

import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DoctorProfile from "../components/DoctorProfile";
import { DarkModeContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";

const doctors = [
  { id: 1, name: "Dr. John Doe", specialization: "Cardiologist", availability: "Mon, Wed, Fri", phone: "+1 (555) 123-4567", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 2, name: "Dr. Ali Raza", specialization: "Dermatologist", availability: "Tue, Thu, Sat", phone: "+1 (555) 234-5678", image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 3, name: "Dr. Mike Johnson", specialization: "Pediatrician", availability: "Mon, Tue, Wed", phone: "+1 (555) 345-6789", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 4, name: "Dr. Ahmed Khan", specialization: "Neurologist", availability: "Wed, Thu, Fri", phone: "+1 (555) 456-7890", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 5, name: "Dr. Robert Chen", specialization: "Orthopedic Surgeon", availability: "Mon, Wed, Fri", phone: "+1 (555) 567-8901", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
  { id: 6, name: "Dr. Ahmed Ali", specialization: "Psychiatrist", availability: "Tue, Thu, Sat", phone: "+1 (555) 678-9012", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" },
];

const relatedServices = [
  { to: "/medicine-suggestion", text: "Get personalized medicine suggestions", icon: "💊" },
  { to: "/articles", text: "Read our health articles", icon: "📰" },
  { to: "/pharmacy", text: "Explore our pharmacy services", icon: "🏥" }, // replaced news
  // You can add more pages here if needed
];
function Consultation() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { darkMode } = useContext(DarkModeContext);

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0A3D62]";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/40 backdrop-blur-2xl border border-white/10 text-[#FDFBFB]"
    : "bg-white/40 backdrop-blur-2xl border border-[#0A3D62]/10 text-[#0A3D62]";

  const handleBookAppointment = () => setShowPremiumModal(true);

  return (
    <>
      <Helmet>
        <title>Book a Consultation - MediNova</title>
        <meta
          name="description"
          content="Book a consultation with our expert doctors. View doctor profiles and availability for personalized medical advice."
        />
        <link rel="canonical" href="https://www.MediNova.com/consultation" />
      </Helmet>

      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          className={`text-4xl sm:text-5xl font-bold mb-12 text-center ${textColor}`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Book a Consultation
        </motion.h1>

        {/* Doctor Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {doctors.map((doctor) => (
            <DoctorProfile key={doctor.id} doctor={doctor} onBookAppointment={handleBookAppointment} />
          ))}
        </motion.div>

        {/* Related Services as Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {relatedServices.map((service, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-[40px] ${cardBg} shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer flex items-center space-x-4`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-4xl">{service.icon}</span>
              <Link
                to={service.to}
                className={`text-lg sm:text-xl font-semibold transition-all duration-300 hover:underline ${textColor}`}
              >
                {service.text}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Premium Modal */}
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
              className={`p-6 sm:p-8 rounded-[40px] ${cardBg} shadow-xl max-w-md w-full transition-all duration-300`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Upgrade to Premium</h2>
              <p className={`mb-6 ${textColor} opacity-80`}>
                Unlock premium features to book consultations with our expert doctors.
              </p>
              <div className="flex justify-between gap-4">
                <motion.button
                  onClick={() => setShowPremiumModal(false)}
                  className="px-6 py-3 rounded-xl bg-[#0A3D62] text-white font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => setShowPremiumModal(false)}
                  className="px-6 py-3 rounded-xl bg-[#0A3D62] text-white font-medium hover:bg-[#08253A] hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Footer */}
      <Footer />
    </>
  );
}

export default Consultation;

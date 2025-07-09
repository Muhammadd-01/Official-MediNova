import React, { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import DoctorProfile from "../components/DoctorProfile"
import { DarkModeContext } from "../App"

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
]

function Consultation() {
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const { darkMode } = useContext(DarkModeContext)

  const handleBookAppointment = () => {
    setShowPremiumModal(true)
  }

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

      <div className={`${darkMode ? "text-blue-200" : "text-blue-900"}`}>
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Book a Consultation
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <DoctorProfile doctor={doctor} onBookAppointment={handleBookAppointment} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Related Services</h2>
          <ul className="list-disc list-inside">
            <li>
              <Link to="/medicine-suggestion" className="text-blue-600 hover:underline">
                Get personalized medicine suggestions
              </Link>
            </li>
            <li>
              <Link to="/articles" className="text-blue-600 hover:underline">
                Read our health articles
              </Link>
            </li>
            <li>
              <Link to="/news" className="text-blue-600 hover:underline">
                Stay updated with the latest medical news
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${darkMode ? "bg-blue-800 text-blue-200" : "bg-white text-blue-900"} p-8 rounded-lg shadow-xl max-w-md w-full`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
              <p className="mb-6">Unlock premium features to book consultations with our expert doctors.</p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle premium upgrade logic here
                    setShowPremiumModal(false)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Consultation


import React, { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import DoctorProfile from "../components/DoctorProfile"
import { DarkModeContext } from "../App"

const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    availability: "Mon, Wed, Fri",
    phone: "+1 (555) 123-4567",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialization: "Dermatologist",
    availability: "Tue, Thu, Sat",
    phone: "+1 (555) 234-5678",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    specialization: "Pediatrician",
    availability: "Mon, Tue, Wed",
    phone: "+1 (555) 345-6789",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 4,
    name: "Dr. Sarah Lee",
    specialization: "Neurologist",
    availability: "Wed, Thu, Fri",
    phone: "+1 (555) 456-7890",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 5,
    name: "Dr. Robert Chen",
    specialization: "Orthopedic Surgeon",
    availability: "Mon, Wed, Fri",
    phone: "+1 (555) 567-8901",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 6,
    name: "Dr. Emily Davis",
    specialization: "Psychiatrist",
    availability: "Tue, Thu, Sat",
    phone: "+1 (555) 678-9012",
    image: "/placeholder.svg?height=150&width=150",
  },
]

function Consultation() {
  const [isPremium, setIsPremium] = useState(false)
  const { darkMode } = useContext(DarkModeContext)

  return (
    <>
      <Helmet>
        <title>Book a Consultation - MediCare</title>
        <meta
          name="description"
          content="Book a consultation with our expert doctors. View doctor profiles and availability for personalized medical advice."
        />
        <link rel="canonical" href="https://www.medicare.com/consultation" />
        <meta property="og:title" content="Expert Medical Consultations - MediCare" />
        <meta
          property="og:description"
          content="Book a consultation with our experienced doctors for personalized medical advice."
        />
        <meta property="og:url" content="https://www.medicare.com/consultation" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={`${darkMode ? "text-white" : "text-gray-800"}`}>
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Book a Consultation
        </motion.h1>
        {!isPremium ? (
          <motion.div
            className={`${darkMode ? "bg-gray-800" : "bg-yellow-100"} border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="font-bold">Premium Feature</p>
            <p>Upgrade to a premium account to book consultations with our expert doctors.</p>
            <button
              onClick={() => setIsPremium(true)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Upgrade to Premium
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {doctors.map((doctor) => (
              <DoctorProfile key={doctor.id} doctor={doctor} />
            ))}
          </motion.div>
        )}
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
    </>
  )
}

export default Consultation


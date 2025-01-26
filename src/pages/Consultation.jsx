import React, { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import DoctorProfile from "../components/DoctorProfile"

const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    availability: "Mon, Wed, Fri",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialization: "Dermatologist",
    availability: "Tue, Thu, Sat",
    phone: "+1 (555) 234-5678",
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    specialization: "Pediatrician",
    availability: "Mon, Tue, Wed",
    phone: "+1 (555) 345-6789",
  },
]

function Consultation() {
  const [isPremium, setIsPremium] = useState(false)

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

      <div>
        <h1 className="text-3xl font-bold mb-6">Book a Consultation</h1>
        {!isPremium ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">Premium Feature</p>
            <p>Upgrade to a premium account to book consultations with our expert doctors.</p>
            <button
              onClick={() => setIsPremium(true)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upgrade to Premium
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorProfile key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
        <div className="mt-8">
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
        </div>
      </div>
    </>
  )
}

export default Consultation


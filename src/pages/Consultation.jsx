import React, { useState } from "react"
import { Helmet } from "react-helmet-async"

const doctors = [
  { id: 1, name: "Dr. John Doe", specialization: "Cardiologist", availability: "Mon, Wed, Fri" },
  { id: 2, name: "Dr. Jane Smith", specialization: "Dermatologist", availability: "Tue, Thu, Sat" },
  { id: 3, name: "Dr. Mike Johnson", specialization: "Pediatrician", availability: "Mon, Tue, Wed" },
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
              <div key={doctor.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-2">{doctor.name}</h2>
                <p className="mb-2">
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                <p className="mb-4">
                  <strong>Availability:</strong> {doctor.availability}
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Appointment</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Consultation


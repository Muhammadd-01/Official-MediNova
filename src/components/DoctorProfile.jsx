import React from "react"
import { Helmet } from "react-helmet-async"

function DoctorProfile({ doctor }) {
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <h2 className="text-2xl font-semibold mb-2">{doctor.name}</h2>
      <p className="mb-2">
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p className="mb-2">
        <strong>Availability:</strong> {doctor.availability}
      </p>
      <p className="mb-4">
        <strong>Phone:</strong> {doctor.phone}
      </p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Appointment</button>
    </div>
  )
}

export default DoctorProfile

